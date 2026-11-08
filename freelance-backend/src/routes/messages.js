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

const findParticipantConversation = async (conversationId, userId) => {
  const id = parsePositiveInt(conversationId, null);

  if (!id) return null;

  const result = await queryDB(
    `SELECT id FROM conversations
     WHERE id = $1 AND (participant1_id = $2 OR participant2_id = $2)`,
    [id, userId]
  );

  return result.rows[0] || null;
};

// Get conversations for user
router.get('/conversations', authenticate, asyncHandler(async (req, res) => {
  const limit = parsePositiveInt(req.query.limit, 20, 50);
  const offset = parsePositiveInt(req.query.offset, 0);
  const userId = req.user.userId;

  const result = await queryDB(
    `SELECT c.id, c.participant1_id, c.participant2_id, c.last_message_text,
            c.last_message_at, c.created_at,
            u.id AS other_participant_id, u.name AS other_participant_name,
            u.avatar_url AS other_participant_avatar
     FROM conversations c
     LEFT JOIN users u
       ON u.id = CASE WHEN c.participant1_id = $1 THEN c.participant2_id ELSE c.participant1_id END
     WHERE c.participant1_id = $1 OR c.participant2_id = $1
     ORDER BY c.last_message_at DESC NULLS LAST, c.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  res.json({ conversations: result.rows, limit, offset });
}));

// Get or create conversation
router.post('/conversations', authenticate, asyncHandler(async (req, res) => {
  const recipientId = parsePositiveInt(req.body.recipientId, null);
  const userId = req.user.userId;

  if (!recipientId || recipientId === userId) {
    return res.status(400).json({ message: 'Invalid recipient' });
  }

  const recipientResult = await queryDB('SELECT id FROM users WHERE id = $1', [recipientId]);
  if (recipientResult.rows.length === 0) {
    return res.status(404).json({ message: 'Recipient not found' });
  }

  const existingResult = await queryDB(
    `SELECT id FROM conversations
     WHERE (participant1_id = $1 AND participant2_id = $2)
        OR (participant1_id = $2 AND participant2_id = $1)`,
    [userId, recipientId]
  );

  if (existingResult.rows.length > 0) {
    return res.json({ conversation: { id: existingResult.rows[0].id } });
  }

  const result = await queryDB(
    `INSERT INTO conversations (participant1_id, participant2_id)
     VALUES ($1, $2) RETURNING id`,
    [userId, recipientId]
  );

  res.status(201).json({ conversation: result.rows[0], message: 'Conversation created' });
}));

// Get messages in conversation
router.get('/:conversationId/messages', authenticate, asyncHandler(async (req, res) => {
  const conversation = await findParticipantConversation(req.params.conversationId, req.user.userId);

  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  const limit = parsePositiveInt(req.query.limit, 50, 100);
  const offset = parsePositiveInt(req.query.offset, 0);

  const result = await queryDB(
    `SELECT m.id, m.conversation_id, m.sender_id, m.text, m.read, m.created_at,
            u.name, u.avatar_url
     FROM messages m
     JOIN users u ON m.sender_id = u.id
     WHERE m.conversation_id = $1
     ORDER BY m.created_at DESC LIMIT $2 OFFSET $3`,
    [conversation.id, limit, offset]
  );

  res.json({ messages: result.rows.reverse(), limit, offset });
}));

// Send message
router.post('/:conversationId/messages', authenticate, asyncHandler(async (req, res) => {
  const conversation = await findParticipantConversation(req.params.conversationId, req.user.userId);

  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';

  if (!text) {
    return res.status(400).json({ message: 'Message cannot be empty' });
  }

  if (text.length > 5000) {
    return res.status(400).json({ message: 'Message must be at most 5000 characters' });
  }

  const result = await queryDB(
    `INSERT INTO messages (conversation_id, sender_id, text)
     VALUES ($1, $2, $3) RETURNING id, conversation_id, sender_id, text, read, created_at`,
    [conversation.id, req.user.userId, text]
  );

  await queryDB(
    `UPDATE conversations SET last_message_text = $1, last_message_at = CURRENT_TIMESTAMP
     WHERE id = $2`,
    [text, conversation.id]
  );

  res.status(201).json({ message: result.rows[0] });
}));

// Mark messages as read
router.put('/:conversationId/read', authenticate, asyncHandler(async (req, res) => {
  const conversation = await findParticipantConversation(req.params.conversationId, req.user.userId);

  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  await queryDB(
    `UPDATE messages SET read = TRUE
     WHERE conversation_id = $1 AND sender_id != $2`,
    [conversation.id, req.user.userId]
  );

  res.json({ message: 'Messages marked as read' });
}));

export default router;
