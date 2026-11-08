import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import { hashPassword, comparePasswords, validateEmail, validatePassword } from '../utils/helpers.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';
import { queryDB } from '../db/schema.js';

const router = express.Router();

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  bio: user.bio || '',
  location: user.location || '',
});

// Register
router.post('/register', asyncHandler(async (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const { password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (name.length < 2 || name.length > 80) {
    return res.status(400).json({ message: 'Name must be between 2 and 80 characters' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (typeof password !== 'string' || !validatePassword(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters with uppercase, lowercase, and number',
    });
  }

  if (!['client', 'freelancer'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const emailCheck = await queryDB('SELECT id FROM users WHERE LOWER(email) = $1', [email]);
  if (emailCheck.rows.length > 0) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const hashedPassword = await hashPassword(password);

  const result = await queryDB(
    `INSERT INTO users (email, password, name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, name, role, bio, location`,
    [email, hashedPassword, name, role]
  );

  const user = result.rows[0];
  const { token, refreshToken } = generateTokens(user.id, user.role);

  res.status(201).json({
    message: 'User registered successfully',
    user: publicUser(user),
    token,
    refreshToken,
  });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const { password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const result = await queryDB(
    `SELECT id, email, name, role, bio, location, password
     FROM users WHERE LOWER(email) = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const user = result.rows[0];
  const isValidPassword = await comparePasswords(String(password), user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const { token, refreshToken } = generateTokens(user.id, user.role);

  res.json({
    message: 'Login successful',
    user: publicUser(user),
    token,
    refreshToken,
  });
}));

// Get current user
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const result = await queryDB(
    `SELECT id, email, name, role, bio, location, hourly_rate, avatar_url,
            skills, rating, total_reviews, verified, created_at
     FROM users WHERE id = $1`,
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

  if (!refreshToken || typeof refreshToken !== 'string') {
    return res.status(400).json({ message: 'Refresh token required' });
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const result = await queryDB('SELECT id, role FROM users WHERE id = $1', [decoded.userId]);
  if (result.rows.length === 0) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const user = result.rows[0];
  const { token: newToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.role);

  res.json({
    message: 'Token refreshed',
    token: newToken,
    refreshToken: newRefreshToken,
  });
}));

// Change password
router.put('/password', authenticate, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new passwords are required' });
  }

  if (!validatePassword(newPassword)) {
    return res.status(400).json({
      message: 'New password must be at least 8 characters with uppercase, lowercase, and number',
    });
  }

  const result = await queryDB('SELECT password FROM users WHERE id = $1', [req.user.userId]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isValidPassword = await comparePasswords(String(currentPassword), result.rows[0].password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  const hashedPassword = await hashPassword(newPassword);
  await queryDB(
    'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [hashedPassword, req.user.userId]
  );

  res.json({ message: 'Password updated successfully' });
}));

// Logout
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  // Stateless JWT: the client discards its tokens. A server-side denylist can be
  // added later if immediate revocation is required.
  res.json({ message: 'Logged out successfully' });
}));

export default router;
