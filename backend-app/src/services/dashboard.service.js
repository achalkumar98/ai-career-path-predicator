const Assessment = require('../models/Assessment');
const Insights = require('../models/Insights');

const normalise = (value) => value.trim().replace(/\s+/g, ' ');

const countValues = (values, limit) => {
  const counts = new Map();
  values.filter(Boolean).forEach((value) => {
    const label = normalise(value);
    const key = label.toLocaleLowerCase();
    const entry = counts.get(key) || { name: label, value: 0 };
    entry.value += 1;
    counts.set(key, entry);
  });
  return [...counts.values()].sort((a, b) => b.value - a.value).slice(0, limit);
};

const getDashboardAnalytics = async (userId) => {
  const [assessments, insights] = await Promise.all([
    Assessment.find({ userId }).select('skills interests recommendedCareers createdAt').lean(),
    Insights.find({ userId }).select('createdAt').lean(),
  ]);

  const dates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return date;
  });

  const activity = dates.map((date) => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const createdOnDate = ({ createdAt }) => {
      const created = new Date(createdAt);
      return created >= date && created < nextDay;
    };
    const assessmentCount = assessments.filter(createdOnDate).length;
    const insightCount = insights.filter(createdOnDate).length;

    return {
      label: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
      date: date.toISOString().slice(0, 10),
      value: assessmentCount + insightCount,
      assessments: assessmentCount,
      insights: insightCount,
    };
  });

  const skills = countValues(assessments.flatMap(({ skills = [] }) => skills), 6);
  const interests = countValues(assessments.flatMap(({ interests = [] }) => interests), 5);
  const careers = countValues(assessments.flatMap(({ recommendedCareers = [] }) => recommendedCareers), 5);
  const assessmentCoverage = [...assessments]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-6)
    .map(({ createdAt, skills = [] }) => ({
      label: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(createdAt)),
      date: new Date(createdAt).toISOString().slice(0, 10),
      value: skills.length,
    }));

  return {
    activity,
    skills,
    interests,
    careers,
    assessmentCoverage,
    summary: {
      assessments: assessments.length,
      insights: insights.length,
      skillsTracked: skills.length,
      interestsTracked: interests.length,
      careerPaths: careers.length,
    },
    updatedAt: new Date().toISOString(),
  };
};

module.exports = { getDashboardAnalytics };
