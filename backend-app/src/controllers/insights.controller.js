const insightsService = require('../services/insights.service');

const createInsight = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ message: 'Input is required.' });
    }
    const result = await insightsService.createInsight(req.user.userId, input);
    res.status(200).json(result);
  } catch (error) {
    console.error('Insight error:', error.message);
    res.status(error.status || 500).json({ message: error.message || 'Internal server error while generating insight.' });
  }
};

module.exports = {
  createInsight,
};
