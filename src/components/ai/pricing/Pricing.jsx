'use client';
import React, { useState, useEffect } from 'react';
import '@styles/ai/pricing/Pricing.css';

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

  // Handle Payment
  const handlePayment = async (plan, amountUSD) => {
    try {
        // Convert USD to INR (static conversion rate or API call)
        const conversionResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const conversionData = await conversionResponse.json();
        const conversionRate = conversionData.rates.INR;
        
        const amountINR = (amountUSD * conversionRate).toFixed(2);

        console.log(`Converted Amount: $${amountUSD} -> ₹${amountINR}`);


        const response = await fetch('http://localhost:5000/api/createOrder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: Math.round(amountINR * 100), // INR in paise (₹1709.33 -> 170933)
                name: plan,
                description: `${plan} plan subscription`,
                currency: 'INR', // Pass currency as INR
            }),
        });

        const data = await response.json();

        if (data.success && razorpayScriptLoaded) {
            const options = {
                key: data.key_id,
                amount: data.amount,
                currency: 'INR', // Currency set to INR
                name: 'PrfeciAI',
                description: data.description,
                order_id: data.order_id,
                handler: async function (response) {
                    alert('Payment Successful');
                    window.location.href='https://app.prfec.ai';
                },
                prefill: {
                  email:'',
                  contact:''
                },
                theme: { color: '#2300a3' },
            };

            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.on('payment.failed', function (response) {
                alert('Payment Failed');
            });

            razorpayInstance.open();
        } else {
            throw new Error('Failed to create Razorpay order');
        }
    } catch (error) {
        console.error('Payment Error:', error);
    }
};


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
                <button onClick={() => handlePayment('Starter', 20)}>Get Started</button>
              </div>
            </div>
            <div className='pricing-page-personal-pro'>
              <div className='pricing-page-personal-container-heading'>Pro</div>
              <div className='pricing-page-personal-pro-pricing'>
                <p>$45</p>
                <button onClick={() => handlePayment('Pro', 45)}>Get Started</button>
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
