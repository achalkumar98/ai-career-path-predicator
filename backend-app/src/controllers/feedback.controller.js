const { sendFeedback } = require('../services/feedback.service');

const submitFeedback = async (req, res) => {
  try {
    const result = await sendFeedback(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Failed to submit feedback' });
  }
};

module.exports = { submitFeedback };
