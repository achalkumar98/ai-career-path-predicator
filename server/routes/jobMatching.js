const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { skills, interests } = req.body;

  // Simulated logic — in real app, you'd call LinkedIn API or scrape Indeed
  const mockJobs = [
    {
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'Remote',
      matchReason: `Matched due to skills in ${skills}`,
    },
    {
      title: 'AI Research Assistant',
      company: 'OpenAI Labs',
      location: 'San Francisco, CA',
      matchReason: `Interest in ${interests}`,
    },
  ];

  res.json({ jobs: mockJobs });
});

module.exports = router;
