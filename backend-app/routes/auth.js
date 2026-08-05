const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const User = require('../models/User');
const auth = require('../middleware/auth');

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Valid email is required'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const profileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
});

function validateSchema(schema, data, res) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const errors = parsed.error.errors.map((err) => ({ path: err.path.join('.'), message: err.message }));
    res.status(400).json({ errors });
    return null;
  }
  return parsed.data;
}

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user profile routes
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registered successfully
 */
router.post('/register', async (req, res) => {
  const parsed = validateSchema(registerSchema, req.body, res);
  if (!parsed) return;

  const { name, email, password } = parsed;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    const token = jwt.sign({ userId: user._id ,name: user.name,}, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user and return token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', async (req, res) => {
  const parsed = validateSchema(loginSchema, req.body, res);
  if (!parsed) return;

  const { email, password } = parsed;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Send password reset instructions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset instructions sent
 */
router.post('/forgot-password', async (req, res) => {
  const parsed = validateSchema(forgotPasswordSchema, req.body, res);
  if (!parsed) return;

  const { email } = parsed;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'No account found with that email' });

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    console.log(`[Forgot Password] Reset token for ${email}: ${resetToken}`);
    res.json({ msg: 'Password reset instructions sent to your email', resetToken });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset a user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post('/reset-password', async (req, res) => {
  const parsed = validateSchema(resetPasswordSchema, req.body, res);
  if (!parsed) return;

  const { token, password } = parsed;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.userId, { password: hashed });
    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Invalid or expired reset token' });
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get authenticated user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned
 */
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Update authenticated user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               bio:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/profile', auth, async (req, res) => {
  const parsed = validateSchema(profileUpdateSchema, req.body, res);
  if (!parsed) return;

  const { name, email, bio, phone, location } = parsed;
  try {
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (bio !== undefined) update.bio = bio;
    if (phone !== undefined) update.phone = phone;
    if (location !== undefined) update.location = location;

    const user = await User.findByIdAndUpdate(req.user.userId, update, { new: true }).select('-password');
    res.json({ msg: 'Profile updated', user: { id: user._id, name: user.name, email: user.email, bio: user.bio, phone: user.phone, location: user.location } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
