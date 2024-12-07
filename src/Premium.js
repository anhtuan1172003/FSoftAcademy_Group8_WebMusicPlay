import React, { useState ,useEffect } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useParams, Link } from "react-router-dom";

import './PremiumSubscription.css';

function PremiumSubscription() {
  const [plan, setPlan] = useState('monthly');
  const {uID} = useParams();
  const[user, setUser] = useState();
  const plans = {
    monthly: { price: 9.99, name: "Monthly Plan" },
    yearly: { price: 99.99, name: "Yearly Plan" }
  };
  const updateUserPremiumStatus = async (userId) => {
    try {
      const response = await fetch(`https://yl28wx-8090.csb.app/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Premium: "Yes" }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user premium status');
      }
      
      const updatedUser = await response.json();
      sessionStorage.setItem('user', JSON.stringify(updatedUser));

      console.log("User premium status updated", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user premium status", error);
      throw error;
    }
  };

 const handleSubscribe = async (details) => {
  try {
    // Create transaction object (as you have it)
    const transaction = {
      userId: uID,
      transactionType: "subscription",
      amount: plans[plan].price,
      description: `Premium ${plans[plan].name} Subscription`,
      transactionDate: new Date().toISOString()
    };

    // Save transaction
    const transactionResponse = await fetch('https://yl28wx-8090.csb.app/transaction_history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!transactionResponse.ok) {
      throw new Error('Failed to save transaction');
    }

    const savedTransaction = await transactionResponse.json();
    console.log("Transaction saved", savedTransaction);

    // Update user's premium status
    const updatedUser = await updateUserPremiumStatus(uID);
    console.log("User updated with premium status", updatedUser);

    // Update local user state if needed
    setUser(updatedUser);

    // Show success message to user
    alert("Subscription completed successfully! You now have premium access.");
    window.location.href= "/Home";
  } catch (error) {
    console.error("Error in subscription process", error);
    alert("There was an error processing your subscription. Please try again.");
  }
};

  return (
    <div className="premium-subscription">
      <h1>Subscribe to Premium</h1>
      <div className="plan-selection">
        <button onClick={() => setPlan('monthly')} className={plan === 'monthly' ? 'active' : ''}>
          Monthly - $9.99/month
        </button>
        <button onClick={() => setPlan('yearly')} className={plan === 'yearly' ? 'active' : ''}>
          Yearly - $99.99/year
        </button>
      </div>
      <div className="subscription-benefits">
        <h2>Đặc quyền đặc biệt:</h2>
        <ul>
          <li>Nghe nhạc không quảng cáo</li>
          <li>Kho nhạc Premium</li>
          <li>Nghe và tải nhạc Lossless</li>
          <li>Tính năng nghe nhạc nâng cao
          </li>
        </ul>
      </div>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: plans[plan].price.toString(),
                  currency_code: "USD"
                },
                description: `${plans[plan].name} Subscription`
              }
            ]
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(handleSubscribe);
        }}
      />
    </div>
  );
}

export default PremiumSubscription;