import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import { queryDB } from '../db/schema.js';

const router = express.Router();

const parsePositiveInt = (value, fallback, max = Number.MAX_SAFE_INTEGER) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.min(parsed, max);
};

const publicProfile = (user) => ({
  id: user.id,
  name: user.name,
  role: user.role,
  bio: user.bio,
  location: user.location,
  hourly_rate: user.hourly_rate,
  avatar_url: user.avatar_url,
  skills: user.skills,
  rating: user.rating,
  total_reviews: user.total_reviews,
  verified: user.verified,
  created_at: user.created_at,
});

// Get user profile (public fields only)
router.get('/:userId', asyncHandler(async (req, res) => {
  const userId = parsePositiveInt(req.params.userId, null);

  if (!userId) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  const result = await queryDB(
    `SELECT id, name, role, bio, location, hourly_rate, avatar_url, skills,
            rating, total_reviews, verified, created_at
     FROM users WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ user: publicProfile(result.rows[0]) });
}));

// Search freelancers
router.get('/', asyncHandler(async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 100) : '';
  const skills = typeof req.query.skills === 'string' ? req.query.skills.trim() : '';
  const limit = parsePositiveInt(req.query.limit, 10, 50);
  const offset = parsePositiveInt(req.query.offset, 0);

  let query = `SELECT id, name, role, bio, location, hourly_rate, avatar_url,
                      skills, rating, total_reviews, verified
               FROM users WHERE role = 'freelancer'`;
  let countQuery = `SELECT COUNT(*) FROM users WHERE role = 'freelancer'`;
  const params = [];
  const countParams = [];
  let paramCount = 1;

  if (q) {
    query += ` AND (name ILIKE $${paramCount} OR bio ILIKE $${paramCount})`;
    countQuery += ` AND (name ILIKE $${countParams.length + 1} OR bio ILIKE $${countParams.length + 1})`;
    params.push(`%${q}%`);
    countParams.push(`%${q}%`);
    paramCount++;
  }

  if (skills) {
    const skillsArray = skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean)
      .slice(0, 20);

    if (skillsArray.length > 0) {
      query += ` AND skills && $${paramCount}::text[]`;
      countQuery += ` AND skills && $${countParams.length + 1}::text[]`;
      params.push(skillsArray);
      countParams.push(skillsArray);
      paramCount++;
    }
  }

  query += ` ORDER BY rating DESC NULLS LAST, created_at DESC
             LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  params.push(limit, offset);

  const [result, countResult] = await Promise.all([
    queryDB(query, params),
    queryDB(countQuery, countParams),
  ]);

  res.json({
    freelancers: result.rows,
    total: Number.parseInt(countResult.rows[0].count, 10),
    limit,
    offset,
  });
}));

// Update profile
router.put('/:userId', authenticate, asyncHandler(async (req, res) => {
  const userId = parsePositiveInt(req.params.userId, null);
  const { name, bio, location, hourly_rate, skills } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  if (req.user.userId !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const updates = [];
  const params = [];
  let paramCount = 1;

  if (name !== undefined) {
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      return res.status(400).json({ message: 'Name must be between 2 and 80 characters' });
    }
    updates.push(`name = $${paramCount++}`);
    params.push(trimmedName);
  }

  if (bio !== undefined) {
    if (typeof bio !== 'string' || bio.length > 2000) {
      return res.status(400).json({ message: 'Bio must be at most 2000 characters' });
    }
    updates.push(`bio = $${paramCount++}`);
    params.push(bio.trim());
  }

  if (location !== undefined) {
    if (typeof location !== 'string' || location.length > 120) {
      return res.status(400).json({ message: 'Location must be at most 120 characters' });
    }
    updates.push(`location = $${paramCount++}`);
    params.push(location.trim());
  }

  if (hourly_rate !== undefined) {
    const rate = Number(hourly_rate);
    if (!Number.isFinite(rate) || rate < 0 || rate > 100000) {
      return res.status(400).json({ message: 'Invalid hourly rate' });
    }
    updates.push(`hourly_rate = $${paramCount++}`);
    params.push(rate);
  }

  if (skills !== undefined) {
    if (!Array.isArray(skills) || skills.length > 50 || skills.some((skill) => typeof skill !== 'string')) {
      return res.status(400).json({ message: 'Skills must be an array of strings' });
    }
    const normalizedSkills = skills.map((skill) => skill.trim()).filter(Boolean).slice(0, 50);
    updates.push(`skills = $${paramCount++}`);
    params.push(normalizedSkills);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(userId);

  const query = `UPDATE users SET ${updates.join(', ')}
                 WHERE id = $${paramCount}
                 RETURNING id, name, role, bio, location, hourly_rate, avatar_url,
                           skills, rating, total_reviews, verified, created_at`;
  const result = await queryDB(query, params);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ user: publicProfile(result.rows[0]), message: 'Profile updated successfully' });
}));

// Get user reviews
router.get('/:userId/reviews', asyncHandler(async (req, res) => {
  const userId = parsePositiveInt(req.params.userId, null);
  const limit = parsePositiveInt(req.query.limit, 50, 100);
  const offset = parsePositiveInt(req.query.offset, 0);

  if (!userId) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  const result = await queryDB(
    `SELECT id, reviewer_id, rating, comment, created_at FROM reviews
     WHERE freelancer_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  res.json({ reviews: result.rows, limit, offset });
}));

// Add review
router.post('/:userId/reviews', authenticate, asyncHandler(async (req, res) => {
  const freelancerId = parsePositiveInt(req.params.userId, null);
  const { rating, comment, projectId } = req.body;

  if (!freelancerId) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  if (freelancerId === req.user.userId) {
    return res.status(400).json({ message: 'You cannot review yourself' });
  }

  const numericRating = Number(rating);
  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  if (comment !== undefined && (typeof comment !== 'string' || comment.length > 2000)) {
    return res.status(400).json({ message: 'Comment must be at most 2000 characters' });
  }

  const parsedProjectId = parsePositiveInt(projectId, null);
  if (!parsedProjectId) {
    return res.status(400).json({ message: 'A valid project is required' });
  }

  const projectResult = await queryDB(
    'SELECT client_id FROM projects WHERE id = $1',
    [parsedProjectId]
  );

  if (projectResult.rows.length === 0) {
    return res.status(404).json({ message: 'Project not found' });
  }

  if (projectResult.rows[0].client_id !== req.user.userId) {
    return res.status(403).json({ message: 'Only the project client can leave a review' });
  }

  const existingReview = await queryDB(
    'SELECT id FROM reviews WHERE freelancer_id = $1 AND reviewer_id = $2 AND project_id = $3',
    [freelancerId, req.user.userId, parsedProjectId]
  );

  if (existingReview.rows.length > 0) {
    return res.status(409).json({ message: 'You have already reviewed this project' });
  }

  const result = await queryDB(
    `INSERT INTO reviews (freelancer_id, reviewer_id, project_id, rating, comment)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [freelancerId, req.user.userId, parsedProjectId, numericRating, comment?.trim() || null]
  );

  const ratingsResult = await queryDB(
    `SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE freelancer_id = $1`,
    [freelancerId]
  );

  const { avg_rating, total } = ratingsResult.rows[0];
  await queryDB(
    'UPDATE users SET rating = $1, total_reviews = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
    [avg_rating, total, freelancerId]
  );

  res.status(201).json({ review: result.rows[0], message: 'Review added successfully' });
}));

export default router;
