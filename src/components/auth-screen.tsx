import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Shield, KeyRound } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AuthScreenProps {
  onAuthenticated: (code: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [customerName, setCustomerName] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter the customer name to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    
    // Simulate validation delay
    setTimeout(() => {
      // Accept any non-empty customer name (at least 2 characters)
      if (customerName.trim().length >= 2) {
        onAuthenticated(customerName);
        toast({
          title: "Access Granted",
          description: "Welcome to customer photo system.",
          variant: "default"
        });
      } else {
        toast({
          title: "Invalid Name",
          description: "Please enter a valid customer name and try again.",
          variant: "destructive"
        });
      }
      setIsValidating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-strong">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-medium">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Customer Photo System
          </h1>
          <p className="text-muted-foreground">
            Capture customer photos with location data
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="customer-name" className="text-sm font-medium text-foreground">
              Customer Name
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="customer-name"
                type="text"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="pl-10"
                disabled={isValidating}
                autoComplete="off"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full"
            disabled={isValidating}
          >
            {isValidating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                Validating...
              </>
            ) : (
              'Access System'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Authorized personnel only • Data retained for 24h only
          </p>
        </div>
      </Card>
    </div>
  );
};