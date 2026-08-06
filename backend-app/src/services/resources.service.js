const getResources = async (skills, interests) => {
  const mockResources = [
    {
      title: 'Machine Learning Specialization',
      platform: 'Coursera',
      url: 'https://www.coursera.org/specializations/machine-learning-introduction',
    },
    {
      title: 'Frontend Web Developer Nanodegree',
      platform: 'Udacity',
      url: 'https://www.udacity.com/course/front-end-web-developer-nanodegree--nd0011',
    },
    {
      title: 'Deep Learning with PyTorch',
      platform: 'edX',
      url: 'https://www.edx.org/learn/deep-learning/pytorch',
    },
  ];

  return { resources: mockResources };
};

module.exports = {
  getResources,
};
