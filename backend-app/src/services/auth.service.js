const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error('User already exists');
    error.status = 400;
    throw error;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });
  await user.save();

  return {
    token: createToken(user),
    user: { id: user._id, name: user.name, email: user.email },
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.status = 400;
    throw error;
  }

  return {
    token: createToken(user),
    user: { id: user._id, name: user.name, email: user.email },
  };
};

const sendPasswordReset = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('No account found with that email');
    error.status = 404;
    throw error;
  }

  const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  return { msg: 'Password reset instructions sent to your email', resetToken };
};

const resetPassword = async ({ token, password }) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const hashed = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(decoded.userId, { password: hashed });
  return { msg: 'Password reset successfully' };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  return user;
};

const updateProfile = async (userId, update) => {
  const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  return {
    msg: 'Profile updated',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      phone: user.phone,
      location: user.location,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
  sendPasswordReset,
  resetPassword,
  getProfile,
  updateProfile,
};
