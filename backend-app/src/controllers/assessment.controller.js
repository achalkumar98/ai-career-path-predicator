const assessmentService = require('../services/assessment.service');

const createAssessment = async (req, res) => {
  try {
    const { skills = [], interests = [] } = req.body;
    const result = await assessmentService.createAssessment(req.user, skills, interests);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Invalid skills or interests format') {
      return res.status(400).json({ message: 'Invalid skills or interests format' });
    }
    console.error('Assessment error:', error.message);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

const getHistory = async (req, res) => {
  try {
    const result = await assessmentService.getAssessmentHistory(req.user);
    res.status(200).json(result);
  } catch (error) {
    console.error('History fetch error:', error.message);
    res.status(500).json({ error: 'Server error while fetching assessment history.' });
  }
};

module.exports = {
  createAssessment,
  getHistory,
};
