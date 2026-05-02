import express from 'express';
import Stripe from 'stripe';
import { authenticate } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

/**
 * @route POST /api/payments/create-intent
 * @desc Create a Stripe Payment Intent
 * @access Private
 */
router.post('/create-intent', authenticate, async (req, res) => {
  try {
    const { amount, currency = 'usd', projectId, description } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: req.user.id,
        projectId,
        description
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route POST /api/payments/confirm
 * @desc Confirm payment and record transaction
 * @access Private
 */
router.post('/confirm', authenticate, async (req, res) => {
  try {
    const { paymentIntentId, projectId, amount } = req.body;

    // In a real app, you would verify the payment intent status with Stripe
    // and then record the transaction in your PostgreSQL database.
    
    // For now, we simulate success
    res.json({ 
      success: true, 
      message: 'Payment recorded successfully',
      transaction: {
        id: `tr_${Date.now()}`,
        amount,
        projectId,
        status: 'completed',
        date: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/payments/history
 * @desc Get user transaction history
 * @access Private
 */
router.get('/history', authenticate, async (req, res) => {
  try {
    // Mock history
    const history = [
      { id: 'tr_1', amount: 500, status: 'completed', date: '2026-04-10', project: 'Dashboard SaaS' },
      { id: 'tr_2', amount: 1200, status: 'completed', date: '2026-04-12', project: 'E-commerce App' }
    ];
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
