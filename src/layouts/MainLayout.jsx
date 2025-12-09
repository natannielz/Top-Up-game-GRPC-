import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="content" style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
