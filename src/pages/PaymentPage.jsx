import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import paymentService from '../services/paymentService';
import CheckoutForm from '../components/features/CheckoutForm';
import SEOMeta from '../components/common/SEOMeta';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Shield, CheckCircle, CreditCard, ArrowLeft } from 'lucide-react';
import { confettiAnimation } from '../utils/animations';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_mock');

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount = 500, projectId = 'mock-project', projectName = 'Project Milestone' } = location.state || {};
  
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const getSecret = async () => {
      try {
        const data = await paymentService.createPaymentIntent({ 
          amount, 
          projectId,
          description: `Payment for ${projectName}`
        });
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Failed to create payment intent:', err);
      } finally {
        setLoading(false);
      }
    };

    getSecret();
  }, [amount, projectId, projectName]);

  const handleSuccess = (paymentIntent) => {
    setSuccess(true);
    confettiAnimation();
    // In a real app, you might want to call a "confirm" endpoint here
    // but the Stripe webhook usually handles the database update
    setTimeout(() => {
      navigate('/dashboard');
    }, 5000);
  };

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#2563eb',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner lg /></div>;

  return (
    <div className="min-h-screen bg-bg-soft pt-32 pb-20">
      <SEOMeta title="Secure Checkout" description="Complete your payment securely on ZORD." />
      
      <div className="container max-w-4xl">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-text-soft hover:text-blue-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to project
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="bg-bg-main p-8 rounded-3xl border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="text-blue-600" size={24} />
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-text-main">{projectName}</p>
                    <p className="text-xs text-text-soft">Milestone #1 - Professional Services</p>
                  </div>
                  <p className="font-bold">${amount}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-text-soft">Platform Fee (5%)</p>
                  <p className="text-text-soft">${(amount * 0.05).toFixed(2)}</p>
                </div>
                <div className="border-t border-dashed border-border pt-4 mt-4 flex justify-between items-center">
                  <p className="font-bold text-lg">Total Due</p>
                  <p className="font-bold text-2xl text-blue-600">${(amount * 1.05).toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl space-y-2 border border-blue-100 dark:border-blue-800/30">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                  <Shield size={16} />
                  Buyer Protection Enabled
                </div>
                <p className="text-xs text-text-soft leading-relaxed">
                  Funds are held securely in escrow and only released to the freelancer when you approve the work.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Payment Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-3"
          >
            <div className="bg-bg-main p-8 md:p-10 rounded-3xl border border-border shadow-xl relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.div
                    key="payment-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>
                    <p className="text-text-soft mb-8">Complete your payment using your preferred method.</p>
                    
                    {clientSecret ? (
                      <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm 
                          amount={(amount * 1.05).toFixed(2)} 
                          onSucess={handleSuccess}
                          onCancel={() => navigate(-1)}
                        />
                      </Elements>
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <LoadingSpinner />
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle size={48} />
                    </div>
                    <h2 className="text-4xl font-bold mb-4">Payment Successful!</h2>
                    <p className="text-lg text-text-soft mb-8">
                      Your payment has been processed and is held in escrow. 
                      You will be redirected to your dashboard in a few seconds.
                    </p>
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="btn btn-primary px-10 py-3"
                    >
                      Go to Dashboard Now
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
