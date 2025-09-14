import express from 'express';
import jwt from 'jsonwebtoken';
import Transaction from '../models/Transaction.js';

const router = express.Router();

function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });

    const JWT_SECRET = process.env.JWT_SECRET || 'taxpal_default_secret_key';
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

router.get('/', auth, async (req, res) => {
  try {
    const items = await Transaction.find({ user: req.userId }).sort({ date: -1, createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch transactions', error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { type, description, category, amount, date, notes } = req.body;
    if (!type || !description || !category || amount == null || !date) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const tx = new Transaction({
      user: req.userId,
      type,
      description,
      category,
      amount,
      date,
      notes
    });
    await tx.save();
    res.status(201).json({ success: true, item: tx });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create transaction', error: err.message });
  }
});

export default router;
