import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import { queryDB } from '../db/schema.js';

const router = express.Router();

// Get conversations for user
router.get('/conversations', authenticate, asyncHandler(async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;
  const userId = req.user.userId;

  const result = await queryDB(
    `SELECT * FROM conversations 
     WHERE participant1_id = $1 OR participant2_id = $1
     ORDER BY last_message_at DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  res.json({ conversations: result.rows });
}));

// Get or create conversation
router.post('/conversations', authenticate, asyncHandler(async (req, res) => {
  const { recipientId } = req.body;
  const userId = req.user.userId;

  if (!recipientId || recipientId === userId) {
    return res.status(400).json({ message: 'Invalid recipient' });
  }

  // Check if conversation exists
  const existingResult = await queryDB(
    `SELECT id FROM conversations 
     WHERE (participant1_id = $1 AND participant2_id = $2) 
     OR (participant1_id = $2 AND participant2_id = $1)`,
    [userId, recipientId]
  );

  if (existingResult.rows.length > 0) {
    return res.json({ conversation: { id: existingResult.rows[0].id } });
  }

  // Create new conversation
  const result = await queryDB(
    `INSERT INTO conversations (participant1_id, participant2_id)
     VALUES ($1, $2) RETURNING id`,
    [userId, recipientId]
  );

  res.status(201).json({ conversation: result.rows[0], message: 'Conversation created' });
}));

// Get messages in conversation
router.get('/:conversationId/messages', asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { limit = 50, offset = 0 } = req.query;

  const result = await queryDB(
    `SELECT m.*, u.name, u.avatar_url FROM messages m
     JOIN users u ON m.sender_id = u.id
     WHERE m.conversation_id = $1
     ORDER BY m.created_at DESC LIMIT $2 OFFSET $3`,
    [conversationId, limit, offset]
  );

  res.json({ messages: result.rows.reverse() });
}));

// Send message
router.post('/:conversationId/messages', authenticate, asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'Message cannot be empty' });
  }

  // Insert message
  const result = await queryDB(
    `INSERT INTO messages (conversation_id, sender_id, text)
     VALUES ($1, $2, $3) RETURNING *`,
    [conversationId, req.user.userId, text]
  );

  // Update conversation last message
  await queryDB(
    `UPDATE conversations SET last_message_text = $1, last_message_at = CURRENT_TIMESTAMP
     WHERE id = $2`,
    [text, conversationId]
  );

  res.status(201).json({ message: result.rows[0] });
}));

// Mark messages as read
router.put('/:conversationId/read', authenticate, asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  await queryDB(
    `UPDATE messages SET read = true 
     WHERE conversation_id = $1 AND sender_id != $2`,
    [conversationId, req.user.userId]
  );

  res.json({ message: 'Messages marked as read' });
}));

export default router;
