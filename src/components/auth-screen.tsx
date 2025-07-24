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
  const [customerMobile, setCustomerMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerMobile) {
      toast({
        title: "Mobile Number Required",
        description: "Please enter the customer mobile number to continue.",
        variant: "destructive",
      });
      return;
    }

    // Validate as 10-digit number
    const mobileRegex = /^\d{10}$/;
    setIsLoading(true);
    setTimeout(() => {
      if (mobileRegex.test(customerMobile)) {
        onAuthenticated(customerMobile);
        toast({
          title: "Access Granted",
          description: "Welcome to customer photo system.",
          variant: "default",
        });
      } else {
        toast({
          title: "Invalid Mobile Number",
          description: "Please enter a valid 10-digit mobile number and try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
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
            <label htmlFor="customer-mobile" className="text-foreground">
              Customer Mobile Number
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="customer-mobile"
                type="tel"
                placeholder="Enter customer mobile number"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                className="pl-10"
                disabled={isLoading}
                autoComplete="off"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
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