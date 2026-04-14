import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { queryDB } from '../db/schema.js';

const router = express.Router();

// Get user profile
router.get('/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  const result = await queryDB(
    `SELECT id, email, name, role, bio, location, hourly_rate, avatar_url, skills, 
            rating, total_reviews, verified, created_at FROM users WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ user: result.rows[0] });
}));

// Search freelancers
router.get('/', asyncHandler(async (req, res) => {
  const { q = '', skills = '', limit = 10, offset = 0 } = req.query;

  let query = `SELECT id, name, role, bio, location, hourly_rate, avatar_url, 
                      skills, rating FROM users WHERE role = 'freelancer'`;
  const params = [];
  let paramCount = 1;

  if (q) {
    query += ` AND (name ILIKE $${paramCount} OR bio ILIKE $${paramCount})`;
    params.push(`%${q}%`);
    paramCount++;
  }

  if (skills) {
    const skillsArray = skills.split(',').map(s => s.trim());
    query += ` AND skills && $${paramCount}::text[]`;
    params.push(skillsArray);
    paramCount++;
  }

  query += ` ORDER BY rating DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  params.push(limit, offset);

  const result = await queryDB(query, params);

  res.json({
    freelancers: result.rows,
    total: result.rows.length,
    limit,
    offset,
  });
}));

// Update profile
router.put('/:userId', authenticate, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, bio, location, hourly_rate, skills } = req.body;

  if (req.user.userId !== parseInt(userId)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const updates = [];
  const params = [];
  let paramCount = 1;

  if (name !== undefined) {
    updates.push(`name = $${paramCount++}`);
    params.push(name);
  }
  if (bio !== undefined) {
    updates.push(`bio = $${paramCount++}`);
    params.push(bio);
  }
  if (location !== undefined) {
    updates.push(`location = $${paramCount++}`);
    params.push(location);
  }
  if (hourly_rate !== undefined) {
    updates.push(`hourly_rate = $${paramCount++}`);
    params.push(hourly_rate);
  }
  if (skills !== undefined) {
    updates.push(`skills = $${paramCount++}`);
    params.push(skills);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  params.push(userId);

  const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
  const result = await queryDB(query, params);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ user: result.rows[0], message: 'Profile updated successfully' });
}));

// Get user reviews
router.get('/:userId/reviews', asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const result = await queryDB(
    `SELECT id, reviewer_id, rating, comment, created_at FROM reviews 
     WHERE freelancer_id = $1 ORDER BY created_at DESC`,
    [userId]
  );

  res.json({ reviews: result.rows });
}));

// Add review
router.post('/:userId/reviews', authenticate, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { rating, comment, projectId } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const result = await queryDB(
    `INSERT INTO reviews (freelancer_id, reviewer_id, project_id, rating, comment)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, req.user.userId, projectId, rating, comment]
  );

  // Update freelancer rating
  const ratingsResult = await queryDB(
    `SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE freelancer_id = $1`,
    [userId]
  );

  const { avg_rating, total } = ratingsResult.rows[0];
  await queryDB(
    'UPDATE users SET rating = $1, total_reviews = $2 WHERE id = $3',
    [avg_rating, total, userId]
  );

  res.status(201).json({ review: result.rows[0], message: 'Review added successfully' });
}));

export default router;
