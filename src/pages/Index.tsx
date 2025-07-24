import React, { useState } from 'react';
import { AuthScreen } from '@/components/auth-screen';
import { VerificationApp } from '@/components/verification-app';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customerName, setCustomerName] = useState('');

  const handleAuthenticated = (name: string) => {
    setCustomerName(name);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCustomerName('');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

  return <VerificationApp userCode={customerName} onLogout={handleLogout} />;
};

export default Index;
