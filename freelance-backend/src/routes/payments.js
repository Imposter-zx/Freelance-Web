import express from 'express';
import Stripe from 'stripe';
import { authenticate } from '../middleware/auth.js';
import { queryDB } from '../db/schema.js';

const router = express.Router();

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const requireStripe = (req, res, next) => {
  if (!stripe) {
    return res.status(503).json({
      error: 'Payments are not configured on this server.',
    });
  }
  return next();
};

const parsePositiveInt = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

/**
 * @route POST /api/payments/create-intent
 * @desc Create a Stripe Payment Intent
 * @access Private (project client)
 */
router.post('/create-intent', authenticate, requireStripe, async (req, res) => {
  try {
    const { amount, currency = 'eur', projectId, description } = req.body;
    const parsedProjectId = parsePositiveInt(projectId);
    const numericAmount = Number(amount);
    const normalizedCurrency = String(currency).toLowerCase();

    if (!parsedProjectId) {
      return res.status(400).json({ error: 'A valid projectId is required' });
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > 1000000) {
      return res.status(400).json({ error: 'Invalid payment amount' });
    }

    if (!/^[a-z]{3}$/.test(normalizedCurrency)) {
      return res.status(400).json({ error: 'Invalid currency code' });
    }

    const projectResult = await queryDB(
      'SELECT client_id FROM projects WHERE id = $1',
      [parsedProjectId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (projectResult.rows[0].client_id !== req.user.userId) {
      return res.status(403).json({ error: 'Only the project client can pay for this project' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(numericAmount * 100),
      currency: normalizedCurrency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: String(req.user.userId),
        projectId: String(parsedProjectId),
        description:
          typeof description === 'string' ? description.slice(0, 200) : 'Project payment',
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error.message);
    res.status(502).json({ error: 'Unable to create payment intent' });
  }
});

/**
 * @route POST /api/payments/confirm
 * @desc Verify a Stripe payment and record the transaction
 * @access Private (project client)
 */
router.post('/confirm', authenticate, requireStripe, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (typeof paymentIntentId !== 'string' || !paymentIntentId.startsWith('pi_')) {
      return res.status(400).json({ error: 'A valid paymentIntentId is required' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(409).json({ error: 'Payment has not succeeded' });
    }

    const projectId = parsePositiveInt(paymentIntent.metadata?.projectId);

    if (!projectId || paymentIntent.metadata?.userId !== String(req.user.userId)) {
      return res.status(403).json({ error: 'Payment does not belong to this account' });
    }

    const projectResult = await queryDB(
      'SELECT client_id FROM projects WHERE id = $1',
      [projectId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (projectResult.rows[0].client_id !== req.user.userId) {
      return res.status(403).json({ error: 'Only the project client can confirm this payment' });
    }

    const acceptedBid = await queryDB(
      `SELECT freelancer_id FROM bids
       WHERE project_id = $1 AND status = 'accepted'
       ORDER BY updated_at DESC LIMIT 1`,
      [projectId]
    );

    if (acceptedBid.rows.length === 0) {
      return res.status(409).json({ error: 'No accepted proposal exists for this project' });
    }

    const result = await queryDB(
      `INSERT INTO transactions
         (project_id, freelancer_id, client_id, amount, status, stripe_payment_id)
       VALUES ($1, $2, $3, $4, 'completed', $5)
       ON CONFLICT (stripe_payment_id) DO NOTHING
       RETURNING id, project_id, freelancer_id, client_id, amount, status, created_at`,
      [
        projectId,
        acceptedBid.rows[0].freelancer_id,
        req.user.userId,
        paymentIntent.amount / 100,
        paymentIntent.id,
      ]
    );

    if (result.rows.length === 0) {
      const existing = await queryDB(
        'SELECT id, project_id, freelancer_id, client_id, amount, status, created_at FROM transactions WHERE stripe_payment_id = $1',
        [paymentIntent.id]
      );
      return res.json({ success: true, transaction: existing.rows[0] });
    }

    res.json({ success: true, transaction: result.rows[0] });
  } catch (error) {
    console.error('Error confirming payment:', error.message);
    res.status(502).json({ error: 'Unable to confirm payment' });
  }
});

/**
 * @route GET /api/payments/history
 * @desc Get the authenticated user's transaction history
 * @access Private
 */
router.get('/history', authenticate, async (req, res) => {
  const result = await queryDB(
    `SELECT id, project_id, freelancer_id, client_id, amount, status, created_at
     FROM transactions
     WHERE client_id = $1 OR freelancer_id = $1
     ORDER BY created_at DESC LIMIT 100`,
    [req.user.userId]
  );

  res.json({ transactions: result.rows });
});

export default router;
