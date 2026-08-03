const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { skills, interests } = req.body;

  const mockResources = [
    {
      title: "Machine Learning Specialization",
      platform: "Coursera",
      url: "https://www.coursera.org/specializations/machine-learning-introduction",
    },
    {
      title: "Frontend Web Developer Nanodegree",
      platform: "Udacity",
      url: "https://www.udacity.com/course/front-end-web-developer-nanodegree--nd0011",
    },
    {
      title: "Deep Learning with PyTorch",
      platform: "edX",
      url: "https://www.edx.org/learn/deep-learning/pytorch",
    },
  ];

  res.json({ resources: mockResources });
});

module.exports = router;
