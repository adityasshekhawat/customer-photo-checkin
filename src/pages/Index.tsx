import React, { useState } from 'react';
import { AuthScreen } from '../components/auth-screen';
import { VerificationApp } from '../components/verification-app';

const IndexPage: React.FC = () => {
  const [customerMobile, setCustomerMobile] = useState('');
  
  const handleAuthenticated = (mobile: string) => {
    setCustomerMobile(mobile);
  };
  
  const handleLogout = () => {
    // Clear user state on logout
    setCustomerMobile('');
  };
  
  return (
    <div className="min-h-screen bg-gradient-background">
      {!customerMobile ? (
        <AuthScreen onAuthenticated={handleAuthenticated} />
      ) : (
        <VerificationApp userCode={customerMobile} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default IndexPage;
