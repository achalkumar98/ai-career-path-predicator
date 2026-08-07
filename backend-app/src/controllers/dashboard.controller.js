const dashboardService = require('../services/dashboard.service');

const getAnalytics = async (req, res) => {
  try {
    const analytics = await dashboardService.getDashboardAnalytics(req.user.userId);
    res.status(200).json(analytics);
  } catch (error) {
    console.error('Dashboard analytics error:', error.message);
    res.status(500).json({ message: 'Unable to load dashboard analytics.' });
  }
};

module.exports = { getAnalytics };
