'use client';
import React, { useState, useEffect } from 'react';
import '@styles/ai/pricing/Pricing.css';
import { getDatabase, ref, set } from 'firebase/database'; 
import { getAuth } from 'firebase/auth';

const Pricing = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [razorpayScriptLoaded, setRazorpayScriptLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve, reject) => {
        if (window.Razorpay) {
          resolve(true);
        } else {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            setRazorpayScriptLoaded(true);
            resolve(true);
          };
          script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
          document.body.appendChild(script);
        }
      });
    };

    loadRazorpayScript().catch((error) => console.error('Error loading Razorpay script:', error));
  }, []);

  // Handle Subscription Payment
  const handleSubscription = async (planType, amountUSD) => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        alert('Please log in to subscribe');
        return;
      }

      // Create subscription
      const subscriptionResponse = await fetch('https://prfecai-backend-592134571427.us-central1.run.app/api/createSubscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType,
          customerEmail: user.email,
          customerId: user.uid
        }),
      });

      const subscriptionData = await subscriptionResponse.json();

      if (!subscriptionData.success) {
        throw new Error(subscriptionData.message || 'Failed to create subscription');
      }

      // Initialize Razorpay checkout
      if (razorpayScriptLoaded) {
        const options = {
          key: subscriptionData.key_id,
          subscription_id: subscriptionData.subscription.id,
          name: 'PrfeciAI',
          description: `${planType} Plan Subscription`,
          handler: async function(response) {
            try {
              console.log('Payment Response:', response);

              // Verify the payment
              const verificationResponse = await fetch('https://prfecai-backend-592134571427.us-central1.run.app/api/verifySubscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_subscription_id: response.razorpay_subscription_id,
                  razorpay_signature: response.razorpay_signature
                }),
              });

              if (!verificationResponse.ok) {
                throw new Error(`Verification failed with status: ${verificationResponse.status}`);
              }

              const verificationData = await verificationResponse.json();

              if (verificationData.success) {
                // Store subscription data in Firebase
                await storeSubscriptionDataInFirebase({
                  subscriptionId: response.razorpay_subscription_id,
                  paymentId: response.razorpay_payment_id,
                  planType,
                  userId: user.uid,
                  email: user.email,
                  status: 'active',
                  startDate: new Date().toISOString(),
                  amount: amountUSD.toFixed(2)
                });

                // Store payment data in Firebase
                await storePaymentDataInFirebase({
                  amount: amountUSD.toFixed(2),
                  description: `${planType} plan subscription`,
                  email: user.email,
                  paymentStatus: 'success',
                  phone: user.phoneNumber || '',
                  planType,
                  subscriptionId: response.razorpay_subscription_id
                });

                alert('Subscription activated successfully!');
                window.location.href = '/';
              } else {
                throw new Error(verificationData.message || 'Payment verification failed');
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              alert(`Payment verification failed: ${error.message}`);
            }
          },
          prefill: {
            email: user.email,
            contact: user.phoneNumber || ''
          },
          theme: {
            color: '#2300a3'
          },method: {
            card: true,
            netbanking: true,
            wallet: true,
            upi: false // Disable UPI
          },
          modal: {
            ondismiss: function() {
              console.log('Checkout form closed');
            }
          }
        };

        const razorpayInstance = new window.Razorpay(options);

        razorpayInstance.on('payment.failed', function(response) {
          console.error('Payment failed:', response.error);
          alert(`Payment failed: ${response.error.description}`);
        });

        razorpayInstance.open();
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert(`Failed to create subscription: ${error.message}`);
    }
  };
  const fetchUsdToInrRate = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      return data.rates.INR || 83; // Default to 83 if API fails
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      return 83; // Fallback to 83 INR per USD
    }
  };
  
  // Function to convert USD to INR dynamically
  const convertUsdToInr = async (usdAmount) => {
    const conversionRate = await fetchUsdToInrRate();
    return `₹${(usdAmount * conversionRate).toFixed(2)}`;
  };
  
  // Store Payment Data in Firebase
  const storePaymentDataInFirebase = async (paymentData) => {
    try {
      const db = getDatabase();
      const paymentRef = ref(db, 'payments/' + Date.now());
      const convertedAmount = await convertUsdToInr(paymentData.amount);
      await set(paymentRef, {
        ...paymentData,
        amount: convertedAmount // Convert to INR before storing
      });
      console.log('Payment data stored successfully!');
    } catch (error) {
      console.error('Error storing payment data:', error);
    }
  };
  
  // Store Subscription Data in Firebase
  const storeSubscriptionDataInFirebase = async (subscriptionData) => {
    try {
      const db = getDatabase();
      const subscriptionRef = ref(db, 'subscriptions/' + subscriptionData.subscriptionId);
      const convertedAmount = await convertUsdToInr(subscriptionData.amount);

      await set(subscriptionRef, { ...subscriptionData, amount: convertedAmount });
      console.log('Subscription data stored successfully!');
    } catch (error) {
      console.error('Error storing subscription data:', error);
    }
  };

  // Handle Subscription Cancellation
// const handleCancelSubscription = async () => {
//   try {
//     const user = getAuth().currentUser;
//     if (!user) {
//       alert('Please log in to cancel your subscription');
//       return;
//     }

//     // Fetch the user's active subscription from Firebase
//     const db = getDatabase();
//     const subscriptionRef = ref(db, `subscriptions/${user.uid}`);
//     const snapshot = await get(subscriptionRef);

//     if (!snapshot.exists()) {
//       alert('No active subscription found');
//       return;
//     }

//     const subscriptionData = snapshot.val();
//     const subscriptionId = subscriptionData.subscriptionId;

//     // Call backend to cancel subscription in Razorpay
//     const cancelResponse = await fetch('http://localhost:5000/api/cancelSubscription', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ subscriptionId }),
//     });

//     const cancelData = await cancelResponse.json();

//     if (!cancelData.success) {
//       throw new Error(cancelData.message || 'Failed to cancel subscription');
//     }

//     // Update subscription status in Firebase
//     await set(subscriptionRef, {
//       ...subscriptionData,
//       status: 'canceled',
//       cancellationDate: new Date().toISOString(),
//     });

//     alert('Subscription canceled successfully!');
//   } catch (error) {
//     console.error('Error canceling subscription:', error);
//     alert(`Cancellation failed: ${error.message}`);
//   }
// };

  

  return (
    <div className='pricing-page'>
      <div className='pricing-page-container'>
        <div className='pricing-page-heading'>
          <h1>Upgrade your plan</h1>
        </div>

        <div className='pricing-page-tab'>
          <p className={`pricing-tab ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>
            Personal
          </p>
          <p className={`pricing-tab ${activeTab === 'enterprise' ? 'active' : ''}`} onClick={() => setActiveTab('enterprise')}>
            Enterprise
          </p>
        </div>

        {activeTab === 'personal' && (
          <div className='pricing-page-tab-personal'>
            <div className='pricing-page-personal-free'>
              <div className='pricing-page-personal-container-heading'>Free</div>
              <div className='pricing-page-personal-free-pricing'>
                <p>$0</p>
                <button>Your current plan</button>
              </div>
            </div>
            <div className='pricing-page-personal-starter'>
              <div className='pricing-page-personal-container-heading'>Starter</div>
              <div className='pricing-page-personal-starter-pricing'>
                <p>$20</p>
                <button onClick={() => handleSubscription('starter', 20)}>Get Started</button>
              </div>
            </div>
            <div className='pricing-page-personal-pro'>
              <div className='pricing-page-personal-container-heading'>Pro</div>
              <div className='pricing-page-personal-pro-pricing'>
                <p>$45</p>
                <button onClick={() => handleSubscription('pro', 45)}>Get Started</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'enterprise' && (
          <div className='pricing-page-tab-enterprise'>
            <p>Enterprise plans are customizable. Please contact our sales team for more details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;