const resumeService = require('../services/resume.service');

const uploadResume = async (req, res) => {
  try {
    const result = await resumeService.analyzeResume(req.file);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Failed to analyze resume' });
  }
};

module.exports = {
  uploadResume,
};
