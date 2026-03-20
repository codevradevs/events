import React, { useState } from 'react';
import axios from 'axios';

export default function SubscriptionUpgrade() {
  const [tier, setTier] = useState('pro');

  const handleUpgrade = async () => {
    await axios.post('http://localhost:5000/api/subscriptions/upgrade', { tier });
    alert('STK Push sent to your phone!');
  };

  return (
    <div className="subscription-upgrade">
      <h1>Upgrade Your Account</h1>
      
      <div className="tier-cards">
        <div className={tier === 'pro' ? 'selected' : ''} onClick={() => setTier('pro')}>
          <h3>Pro - KES 500/month</h3>
          <ul>
            <li>No ads</li>
            <li>Priority support</li>
            <li>Advanced analytics</li>
          </ul>
        </div>
        
        <div className={tier === 'vip' ? 'selected' : ''} onClick={() => setTier('vip')}>
          <h3>VIP - KES 1000/month</h3>
          <ul>
            <li>Everything in Pro</li>
            <li>Early bird access</li>
            <li>Free event boosts</li>
            <li>Exclusive events</li>
          </ul>
        </div>
      </div>
      
      <button onClick={handleUpgrade}>Upgrade Now</button>
    </div>
  );
}
