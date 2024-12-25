'use client'
import React, { useState } from 'react';
import '@styles/ai/pricing/Pricing.css';

const Pricing = () => {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState('personal');

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
                <div className='pricing-page-personal-container-heading'>
                    Free
                </div>
                <div className='pricing-page-personal-free-pricing'>
                    <p>$0</p>
                    <button>Your current plan</button>
                </div>
            </div>
            <div className='pricing-page-personal-starter'>
                <div className='pricing-page-personal-container-heading'>
                    Starter
                </div>
                <div className='pricing-page-personal-starter-pricing'>
                    <p>$20</p>
                    <button>Get Started</button>
                </div>
            </div>
            <div className='pricing-page-personal-pro'>
                <div className='pricing-page-personal-container-heading'>
                    Pro
                </div>
                <div className='pricing-page-personal-pro-pricing'>
                    <p>$45</p>
                    <button>Get Started</button>
                </div>
            </div>
            <div className='pricing-page-personal-enterprise'>
                <div className='pricing-page-personal-container-heading'>
                    Enterprise
                </div>
                <div className='pricing-page-personal-enterprise-pricing'>
                    <p>$45</p>
                    <button>Get Started</button>
                </div>
            </div>

          </div>
        )}
        {activeTab === 'enterprise' && (
          <div className='pricing-page-tab-enterprise'>
            <div className='pricing-page-enterprise-team'>
                <div className='pricing-page-personal-container-heading'>
                    Enterprise
                </div>
                <div className='pricing-page-personal-enterprise-pricing'>
                    <p>$45</p>
                    <button>Get Started</button>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
