import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { Lock, CreditCard, AlertCircle } from 'lucide-react';

const CheckoutForm = ({ amount, onSucess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
      redirect: 'if_required'
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSucess(paymentIntent);
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-bg-soft/50 p-4 rounded-xl border border-border mb-6">
        <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-3 border border-red-200 dark:border-red-800/30"
        >
          <AlertCircle size={18} />
          {message}
        </motion.div>
      )}

      <div className="flex flex-col gap-4">
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className="w-full btn btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Lock size={18} />
              Pay ${amount} Securely
            </>
          )}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="w-full btn btn-secondary py-3 text-sm font-medium"
        >
          Cancel and Return
        </button>
      </div>

      <p className="text-center text-xs text-text-soft flex items-center justify-center gap-1 mt-4">
        <Lock size={12} />
        Payments are encrypted and processed by Stripe.
      </p>
    </form>
  );
};

export default CheckoutForm;
