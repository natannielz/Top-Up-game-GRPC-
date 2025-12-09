import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Shield, Wallet, CreditCard } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { games } from '../data/games';
import './TopUpPage.css';

const denominations = [
  { id: 1, amount: '50', price: 0.99, bonus: '0' },
  { id: 2, amount: '100', price: 1.99, bonus: '10' },
  { id: 3, amount: '250', price: 4.99, bonus: '25' },
  { id: 4, amount: '500', price: 9.99, bonus: '50', popular: true },
  { id: 5, amount: '1000', price: 19.99, bonus: '120' },
  { id: 6, amount: '2500', price: 49.99, bonus: '300' },
];

const paymentMethods = [
  { id: 'wallet', name: 'E-Wallet', icon: Wallet },
  { id: 'card', name: 'Credit Card', icon: CreditCard },
];

const TopUpPage = () => {
  const { gameId } = useParams();
  const game = games.find(g => g.id === gameId) || games[0];

  const [userId, setUserId] = useState('');
  const [selectedDenom, setSelectedDenom] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handlePay = () => {
    setError('');
    if (!userId.trim()) {
      setError('Please enter your User ID');
      return;
    }
    if (userId.length < 3) {
      setError('User ID must be at least 3 characters');
      return;
    }
    if (!selectedDenom) {
      setError('Please select a top-up amount');
      return;
    }
    if (!selectedPayment) {
      setError('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <MainLayout>
        <div className="success-screen">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="success-content"
          >
            <div className="success-icon"><Check size={64} /></div>
            <h2>Payment Successful!</h2>
            <p>Your {selectedDenom.amount} diamonds have been added.</p>
            <button className="primary-btn" onClick={() => setShowSuccess(false)}>Buy More</button>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="topup-container">

        {/* Header Section */}
        <div className="game-header">
          <img src={game.image} alt={game.title} className="header-bg" />
          <div className="header-overlay"></div>
          <div className="header-content">
            <img src={game.image} alt={game.title} className="game-icon" />
            <div className="header-text">
              <h1>{game.title}</h1>
              <p>{game.publisher}</p>
            </div>
          </div>
        </div>

        <div className="form-sections">

          {/* Section 1: User ID */}
          <section className="form-section">
            <div className="section-header">
              <span className="step-number">1</span>
              <h3>Enter Account Details</h3>
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <input type="text" placeholder="Server ID (Optional)" />
            </div>
            {error && <div style={{ color: '#ef4444', marginBottom: '10px', fontSize: '0.9rem' }}>{error}</div>}
            <div className="validation-msg">
              <Shield size={14} /> Secure & Encrypted
            </div>
          </section>

          {/* Section 2: Denomination */}
          <section className="form-section">
            <div className="section-header">
              <span className="step-number">2</span>
              <h3>Select Amount</h3>
            </div>
            <div className="denomination-grid">
              {denominations.map((denom) => (
                <div
                  key={denom.id}
                  className={`denom-card ${selectedDenom?.id === denom.id ? 'active' : ''}`}
                  onClick={() => setSelectedDenom(denom)}
                >
                  {denom.popular && <span className="badge">Best Value</span>}
                  <div className="amount">{denom.amount}</div>
                  <div className="currency-label">Diamonds</div>
                  <div className="price">${denom.price}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Payment */}
          <section className="form-section">
            <div className="section-header">
              <span className="step-number">3</span>
              <h3>Payment Method</h3>
            </div>
            <div className="payment-grid">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`payment-card ${selectedPayment?.id === method.id ? 'active' : ''}`}
                  onClick={() => setSelectedPayment(method)}
                >
                  <method.icon size={24} />
                  <span>{method.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Checkout Bar */}
          <div className="checkout-bar">
            <div className="total-label">
              <span>Total:</span>
              <span className="total-price">
                ${selectedDenom ? selectedDenom.price : '0.00'}
              </span>
            </div>
            <button
              className="pay-btn"
              disabled={!userId || !selectedDenom || !selectedPayment || isProcessing}
              onClick={handlePay}
            >
              {isProcessing ? 'Processing...' : 'PAY NOW'}
            </button>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default TopUpPage;
