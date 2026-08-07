const authService = require('../services/auth.service');

const registerUser = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await authService.sendPasswordReset(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const result = await authService.getProfile(req.user.userId);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const result = await authService.updateProfile(req.user.userId, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
};
