import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import { hashPassword, comparePasswords, validateEmail, validatePassword } from '../utils/helpers.js';
import { generateTokens } from '../utils/jwt.js';
import { queryDB } from '../db/schema.js';

const router = express.Router();

// Register
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ 
      message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
    });
  }

  if (!['client', 'freelancer'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  // Check if email exists
  const emailCheck = await queryDB('SELECT id FROM users WHERE email = $1', [email]);
  if (emailCheck.rows.length > 0) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const result = await queryDB(
    'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
    [email, hashedPassword, name, role]
  );

  const user = result.rows[0];
  const { token, refreshToken } = generateTokens(user.id, user.role);

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
    refreshToken,
  });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Find user
  const result = await queryDB(
    'SELECT id, email, name, role, password FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const user = result.rows[0];

  // Compare passwords
  const isValidPassword = await comparePasswords(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const { token, refreshToken } = generateTokens(user.id, user.role);

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
    refreshToken,
  });
}));

// Get current user
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const result = await queryDB(
    'SELECT id, email, name, role, bio, location, hourly_rate, avatar_url, skills, rating FROM users WHERE id = $1',
    [req.user.userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ user: result.rows[0] });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required' });
  }

  try {
    const { verifyRefreshToken } = await import('../utils/jwt.js');
    const decoded = verifyRefreshToken(refreshToken);
    
    const { token: newToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId, decoded.role);
    
    res.json({
      message: 'Token refreshed',
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
}));

// Logout
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  // In a real app, you might invalidate the token in a blacklist
  res.json({ message: 'Logged out successfully' });
}));

export default router;
