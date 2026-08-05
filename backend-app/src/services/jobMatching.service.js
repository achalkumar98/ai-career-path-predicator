const findJobMatches = async (skills, interests) => {
  const matched = [
    {
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'Remote',
      matchReason: `Matched due to skills in ${skills.join(', ')}`,
    },
    {
      title: 'AI Research Assistant',
      company: 'OpenAI Labs',
      location: 'San Francisco, CA',
      matchReason: `Interest in ${interests.join(', ')}`,
    },
  ];

  return { jobs: matched };
};

module.exports = {
  findJobMatches,
};
