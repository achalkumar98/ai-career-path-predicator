const jobMatchingService = require('../services/jobMatching.service');

const findMatches = async (req, res) => {
  try {
    const { skills = [], interests = [] } = req.body;
    const result = await jobMatchingService.findJobMatches(skills, interests);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job matches' });
  }
};

module.exports = {
  findMatches,
};
