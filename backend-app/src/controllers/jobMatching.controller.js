// controllers/jobMatching.controller.js
const jobMatchingService = require('../services/jobMatching.service');

const fetchJobs = async (req, res) => {
  try {
    const {
      keyword  = '',
      location = '',
      recency  = 'all',
      dateFrom = null,
      dateTo   = null,
    } = req.body;

    const result = await jobMatchingService.fetchJobs(
      keyword,
      location,
      { recency, dateFrom, dateTo },
    );

    res.status(200).json({
      success: true,
      data: {
        jobs:          result.jobs,
        totalJobs:     result.totalJobs,
        searchCriteria: result.searchCriteria,
      },
      message: 'Jobs fetched successfully',
    });

  } catch (error) {
    console.error('Fetch jobs error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error:   error.message,
    });
  }
};

module.exports = { fetchJobs };
