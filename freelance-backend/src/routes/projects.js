import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import { queryDB } from '../db/schema.js';

const router = express.Router();

const PROJECT_STATUSES = ['open', 'in_progress', 'completed', 'cancelled'];
const EXPERIENCE_LEVELS = ['entry', 'intermediate', 'expert'];

const parsePositiveInt = (value, fallback, max = Number.MAX_SAFE_INTEGER) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.min(parsed, max);
};

const parseLimit = (value, fallback = 20) => {
  const parsed = parsePositiveInt(value, fallback, 50);
  return parsed > 0 ? parsed : fallback;
};

const isNonEmptyString = (value, min = 1, max = 10000) =>
  typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;

// Get projects
router.get('/', asyncHandler(async (req, res) => {
  const status = req.query.status === undefined ? 'open' : req.query.status;
  const skills = typeof req.query.skills === 'string' ? req.query.skills.trim() : '';
  const limit = parseLimit(req.query.limit);
  const offset = parsePositiveInt(req.query.offset, 0);

  if (!PROJECT_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid project status' });
  }

  let filters = 'WHERE status = $1';
  const params = [status];
  const countParams = [status];
  let paramCount = 2;

  if (skills) {
    const skillsArray = skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean)
      .slice(0, 20);

    if (skillsArray.length > 0) {
      filters += ` AND skills && $${paramCount}::text[]`;
      params.push(skillsArray);
      countParams.push(skillsArray);
      paramCount++;
    }
  }

  const query = `SELECT * FROM projects ${filters}
                 ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  params.push(limit, offset);

  const [result, countResult] = await Promise.all([
    queryDB(query, params),
    queryDB(`SELECT COUNT(*) FROM projects ${filters}`, countParams),
  ]);

  res.json({
    projects: result.rows,
    total: Number.parseInt(countResult.rows[0].count, 10),
    limit,
    offset,
  });
}));

// Get project by ID
router.get('/:projectId', asyncHandler(async (req, res) => {
  const projectId = parsePositiveInt(req.params.projectId, null);

  if (!projectId) {
    return res.status(400).json({ message: 'Invalid project ID' });
  }

  const result = await queryDB('SELECT * FROM projects WHERE id = $1', [projectId]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json({ project: result.rows[0] });
}));

// Create project
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { title, description, budgetMin, budgetMax, duration, skills, experienceLevel } = req.body;

  if (!isNonEmptyString(title, 8, 150)) {
    return res.status(400).json({ message: 'Title must be between 8 and 150 characters' });
  }

  if (!isNonEmptyString(description, 30, 5000)) {
    return res.status(400).json({ message: 'Description must be between 30 and 5000 characters' });
  }

  const minBudget = Number(budgetMin);
  const maxBudget = Number(budgetMax);

  if (!Number.isFinite(minBudget) || !Number.isFinite(maxBudget) || minBudget <= 0 || maxBudget <= 0) {
    return res.status(400).json({ message: 'Budgets must be positive numbers' });
  }

  if (minBudget > maxBudget) {
    return res.status(400).json({ message: 'Minimum budget cannot exceed maximum budget' });
  }

  if (duration !== undefined && (typeof duration !== 'string' || duration.length > 50)) {
    return res.status(400).json({ message: 'Duration must be at most 50 characters' });
  }

  if (experienceLevel !== undefined && !EXPERIENCE_LEVELS.includes(experienceLevel)) {
    return res.status(400).json({ message: 'Invalid experience level' });
  }

  if (skills !== undefined && (!Array.isArray(skills) || skills.some((skill) => typeof skill !== 'string'))) {
    return res.status(400).json({ message: 'Skills must be an array of strings' });
  }

  const normalizedSkills = Array.isArray(skills)
    ? skills.map((skill) => skill.trim()).filter(Boolean).slice(0, 30)
    : [];

  const result = await queryDB(
    `INSERT INTO projects
       (client_id, title, description, budget_min, budget_max, duration, skills, experience_level)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      req.user.userId,
      title.trim(),
      description.trim(),
      minBudget,
      maxBudget,
      duration?.trim() || null,
      normalizedSkills,
      experienceLevel || null,
    ]
  );

  res.status(201).json({ project: result.rows[0], message: 'Project created successfully' });
}));

// Update project
router.put('/:projectId', authenticate, asyncHandler(async (req, res) => {
  const projectId = parsePositiveInt(req.params.projectId, null);
  const { title, description, status, budgetMin, budgetMax } = req.body;

  if (!projectId) {
    return res.status(400).json({ message: 'Invalid project ID' });
  }

  const projectResult = await queryDB(
    'SELECT client_id, budget_min, budget_max FROM projects WHERE id = $1',
    [projectId]
  );

  if (projectResult.rows.length === 0) {
    return res.status(404).json({ message: 'Project not found' });
  }

  if (projectResult.rows[0].client_id !== req.user.userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const updates = [];
  const params = [];
  let paramCount = 1;

  if (title !== undefined) {
    if (!isNonEmptyString(title, 8, 150)) {
      return res.status(400).json({ message: 'Title must be between 8 and 150 characters' });
    }
    updates.push(`title = $${paramCount++}`);
    params.push(title.trim());
  }

  if (description !== undefined) {
    if (!isNonEmptyString(description, 30, 5000)) {
      return res.status(400).json({ message: 'Description must be between 30 and 5000 characters' });
    }
    updates.push(`description = $${paramCount++}`);
    params.push(description.trim());
  }

  if (status !== undefined) {
    if (!PROJECT_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid project status' });
    }
    updates.push(`status = $${paramCount++}`);
    params.push(status);
  }

  if (budgetMin !== undefined || budgetMax !== undefined) {
    const nextMin = budgetMin === undefined ? Number(projectResult.rows[0].budget_min) : Number(budgetMin);
    const nextMax = budgetMax === undefined ? Number(projectResult.rows[0].budget_max) : Number(budgetMax);

    if (!Number.isFinite(nextMin) || !Number.isFinite(nextMax) || nextMin <= 0 || nextMax <= 0) {
      return res.status(400).json({ message: 'Budgets must be positive numbers' });
    }

    if (nextMin > nextMax) {
      return res.status(400).json({ message: 'Minimum budget cannot exceed maximum budget' });
    }

    if (budgetMin !== undefined) {
      updates.push(`budget_min = $${paramCount++}`);
      params.push(nextMin);
    }
    if (budgetMax !== undefined) {
      updates.push(`budget_max = $${paramCount++}`);
      params.push(nextMax);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(projectId);

  const query = `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
  const result = await queryDB(query, params);

  res.json({ project: result.rows[0], message: 'Project updated successfully' });
}));

// Complete project
router.put('/:projectId/complete', authenticate, asyncHandler(async (req, res) => {
  const projectId = parsePositiveInt(req.params.projectId, null);

  if (!projectId) {
    return res.status(400).json({ message: 'Invalid project ID' });
  }

  const projectResult = await queryDB(
    'SELECT client_id, status FROM projects WHERE id = $1',
    [projectId]
  );

  if (projectResult.rows.length === 0) {
    return res.status(404).json({ message: 'Project not found' });
  }

  if (projectResult.rows[0].client_id !== req.user.userId) {
    return res.status(403).json({ message: 'Only the project client can complete it' });
  }

  if (!['open', 'in_progress'].includes(projectResult.rows[0].status)) {
    return res.status(409).json({ message: 'Project cannot be completed from its current status' });
  }

  const result = await queryDB(
    `UPDATE projects SET status = 'completed', updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 RETURNING *`,
    [projectId]
  );

  res.json({ project: result.rows[0], message: 'Project completed' });
}));

// Delete project
router.delete('/:projectId', authenticate, asyncHandler(async (req, res) => {
  const projectId = parsePositiveInt(req.params.projectId, null);

  if (!projectId) {
    return res.status(400).json({ message: 'Invalid project ID' });
  }

  const projectResult = await queryDB('SELECT client_id FROM projects WHERE id = $1', [projectId]);

  if (projectResult.rows.length === 0) {
    return res.status(404).json({ message: 'Project not found' });
  }

  if (projectResult.rows[0].client_id !== req.user.userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  await queryDB('DELETE FROM projects WHERE id = $1', [projectId]);
  res.json({ message: 'Project deleted successfully' });
}));

// Get project bids
router.get('/:projectId/bids', authenticate, asyncHandler(async (req, res) => {
  const projectId = parsePositiveInt(req.params.projectId, null);

  if (!projectId) {
    return res.status(400).json({ message: 'Invalid project ID' });
  }

  const projectResult = await queryDB('SELECT client_id FROM projects WHERE id = $1', [projectId]);

  if (projectResult.rows.length === 0) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const isOwner = projectResult.rows[0].client_id === req.user.userId;
  const params = [projectId];
  let filter = '';

  if (!isOwner) {
    filter = ' AND b.freelancer_id = $2';
    params.push(req.user.userId);
  }

  const result = await queryDB(
    `SELECT b.*, u.name, u.avatar_url, u.rating
     FROM bids b
     JOIN users u ON b.freelancer_id = u.id
     WHERE b.project_id = $1${filter}
     ORDER BY b.created_at DESC`,
    params
  );

  res.json({ bids: result.rows });
}));

// Place bid
router.post('/:projectId/bids', authenticate, asyncHandler(async (req, res) => {
  const projectId = parsePositiveInt(req.params.projectId, null);
  const { amount, deliveryDays, message, portfolioUrl } = req.body;

  if (!projectId) {
    return res.status(400).json({ message: 'Invalid project ID' });
  }

  const projectResult = await queryDB(
    'SELECT client_id, status FROM projects WHERE id = $1',
    [projectId]
  );

  if (projectResult.rows.length === 0) {
    return res.status(404).json({ message: 'Project not found' });
  }

  if (projectResult.rows[0].status !== 'open') {
    return res.status(409).json({ message: 'This project is not accepting proposals' });
  }

  if (projectResult.rows[0].client_id === req.user.userId) {
    return res.status(400).json({ message: 'You cannot bid on your own project' });
  }

  if (req.user.role !== 'freelancer') {
    return res.status(403).json({ message: 'Only freelancers can place bids' });
  }

  const numericAmount = Number(amount);
  const numericDeliveryDays = Number(deliveryDays);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number' });
  }

  if (!Number.isInteger(numericDeliveryDays) || numericDeliveryDays < 1 || numericDeliveryDays > 365) {
    return res.status(400).json({ message: 'Delivery days must be between 1 and 365' });
  }

  if (!isNonEmptyString(message, 10, 3000)) {
    return res.status(400).json({ message: 'Message must be between 10 and 3000 characters' });
  }

  if (portfolioUrl !== undefined && portfolioUrl !== null) {
    if (typeof portfolioUrl !== 'string' || portfolioUrl.length > 500) {
      return res.status(400).json({ message: 'Invalid portfolio URL' });
    }
    if (portfolioUrl.trim()) {
      try {
        const parsedUrl = new URL(portfolioUrl.trim());
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('invalid');
      } catch {
        return res.status(400).json({ message: 'Portfolio URL must be a valid HTTP(S) URL' });
      }
    }
  }

  const existingBid = await queryDB(
    'SELECT id FROM bids WHERE project_id = $1 AND freelancer_id = $2',
    [projectId, req.user.userId]
  );

  if (existingBid.rows.length > 0) {
    return res.status(409).json({ message: 'You have already submitted a proposal for this project' });
  }

  const result = await queryDB(
    `INSERT INTO bids (project_id, freelancer_id, amount, delivery_days, message, portfolio_url)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      projectId,
      req.user.userId,
      numericAmount,
      numericDeliveryDays,
      message.trim(),
      portfolioUrl?.trim() || null,
    ]
  );

  await queryDB('UPDATE projects SET bids = bids + 1 WHERE id = $1', [projectId]);

  res.status(201).json({ bid: result.rows[0], message: 'Bid placed successfully' });
}));

// Accept a bid
router.put('/:projectId/bids/:bidId/accept', authenticate, asyncHandler(async (req, res) => {
  const projectId = parsePositiveInt(req.params.projectId, null);
  const bidId = parsePositiveInt(req.params.bidId, null);

  if (!projectId || !bidId) {
    return res.status(400).json({ message: 'Invalid project or bid ID' });
  }

  const projectResult = await queryDB(
    'SELECT client_id, status FROM projects WHERE id = $1',
    [projectId]
  );

  if (projectResult.rows.length === 0) {
    return res.status(404).json({ message: 'Project not found' });
  }

  if (projectResult.rows[0].client_id !== req.user.userId) {
    return res.status(403).json({ message: 'Only the project client can accept a proposal' });
  }

  if (projectResult.rows[0].status !== 'open') {
    return res.status(409).json({ message: 'This project is no longer open' });
  }

  const bidResult = await queryDB(
    'SELECT id FROM bids WHERE id = $1 AND project_id = $2',
    [bidId, projectId]
  );

  if (bidResult.rows.length === 0) {
    return res.status(404).json({ message: 'Proposal not found' });
  }

  await queryDB(
    `UPDATE bids SET status = CASE WHEN id = $1 THEN 'accepted' ELSE 'rejected' END,
            updated_at = CURRENT_TIMESTAMP
     WHERE project_id = $2 AND status = 'pending'`,
    [bidId, projectId]
  );
  await queryDB(
    `UPDATE projects SET status = 'in_progress', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
    [projectId]
  );

  res.json({ message: 'Proposal accepted', bidId, projectId });
}));

export default router;
