// import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StarField from '../components/StarField';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout min-h-screen flex flex-col relative">
      {/* Background StarField - Fixed & Persistent - z-0 */}
      <StarField />

      {/* Main Content Container - z-10 */}
      <main className="content flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 mobile-safe-bottom">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
