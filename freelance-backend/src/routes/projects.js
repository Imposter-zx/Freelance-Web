import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { queryDB } from '../db/schema.js';

const router = express.Router();

// Get projects
router.get('/', asyncHandler(async (req, res) => {
  const { status = 'open', skills = '', limit = 20, offset = 0 } = req.query;

  let query = 'SELECT * FROM projects WHERE status = $1';
  const params = [status];
  let paramCount = 2;

  if (skills) {
    const skillsArray = skills.split(',').map(s => s.trim());
    query += ` AND skills && $${paramCount}::text[]`;
    params.push(skillsArray);
    paramCount++;
  }

  query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  params.push(limit, offset);

  const result = await queryDB(query, params);
  const countResult = await queryDB(
    'SELECT COUNT(*) FROM projects WHERE status = $1',
    [status]
  );

  res.json({
    projects: result.rows,
    total: parseInt(countResult.rows[0].count),
    limit,
    offset,
  });
}));

// Get project by ID
router.get('/:projectId', asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const result = await queryDB(
    'SELECT * FROM projects WHERE id = $1',
    [projectId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json({ project: result.rows[0] });
}));

// Create project
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { title, description, budgetMin, budgetMax, duration, skills, experienceLevel } = req.body;

  if (!title || !description || !budgetMin || !budgetMax) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const result = await queryDB(
    `INSERT INTO projects (client_id, title, description, budget_min, budget_max, duration, skills, experience_level)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [req.user.userId, title, description, budgetMin, budgetMax, duration, skills || [], experienceLevel]
  );

  res.status(201).json({ project: result.rows[0], message: 'Project created successfully' });
}));

// Update project
router.put('/:projectId', authenticate, asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, status, budgetMin, budgetMax } = req.body;

  // Check ownership
  const projectResult = await queryDB('SELECT client_id FROM projects WHERE id = $1', [projectId]);
  if (projectResult.rows.length === 0) {
    return res.status(404).json({ message: 'Project not found' });
  }

  if (projectResult.rows[0].client_id !== req.user.userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const updates = [];
  const params = [];
  let paramCount = 1;

  if (title) { updates.push(`title = $${paramCount++}`); params.push(title); }
  if (description) { updates.push(`description = $${paramCount++}`); params.push(description); }
  if (status) { updates.push(`status = $${paramCount++}`); params.push(status); }
  if (budgetMin) { updates.push(`budget_min = $${paramCount++}`); params.push(budgetMin); }
  if (budgetMax) { updates.push(`budget_max = $${paramCount++}`); params.push(budgetMax); }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(projectId);

  const query = `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
  const result = await queryDB(query, params);

  res.json({ project: result.rows[0], message: 'Project updated successfully' });
}));

// Delete project
router.delete('/:projectId', authenticate, asyncHandler(async (req, res) => {
  const { projectId } = req.params;

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
router.get('/:projectId/bids', asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const result = await queryDB(
    `SELECT b.*, u.name, u.avatar_url, u.rating FROM bids b
     JOIN users u ON b.freelancer_id = u.id WHERE b.project_id = $1
     ORDER BY b.created_at DESC`,
    [projectId]
  );

  res.json({ bids: result.rows });
}));

// Place bid
router.post('/:projectId/bids', authenticate, asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { amount, deliveryDays, message, portfolioUrl } = req.body;

  if (!amount || !deliveryDays || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const result = await queryDB(
    `INSERT INTO bids (project_id, freelancer_id, amount, delivery_days, message, portfolio_url)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [projectId, req.user.userId, amount, deliveryDays, message, portfolioUrl]
  );

  // Increment bid count
  await queryDB('UPDATE projects SET bids = bids + 1 WHERE id = $1', [projectId]);

  res.status(201).json({ bid: result.rows[0], message: 'Bid placed successfully' });
}));

export default router;
