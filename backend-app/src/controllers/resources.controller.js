const resourcesService = require('../services/resources.service');

const getResources = async (req, res) => {
  try {
    const { skills = [], interests = [] } = req.body;
    const result = await resourcesService.getResources(skills, interests);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resources' });
  }
};

module.exports = {
  getResources,
};
