import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const NotFoundPage = () => {
  return (
    <MainLayout>
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
        padding: '20px'
      }}>
        <h1 style={{ fontSize: '6rem', margin: 0, color: 'var(--primary)', fontFamily: 'Orbitron, sans-serif' }}>404</h1>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Page Not Found</h2>
        <p style={{ color: '#aaa', maxWidth: '400px', marginBottom: '30px' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="primary-btn">Back to Home</Link>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;
