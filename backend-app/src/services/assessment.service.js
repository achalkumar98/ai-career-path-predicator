const Assessment = require('../models/Assessment');
const Insights = require('../models/Insights');
const { getCareerInsight } = require('./groq.service');

const createAssessment = async (user, skills, interests) => {
  if (!Array.isArray(skills) || !Array.isArray(interests)) {
    throw new Error('Invalid skills or interests format');
  }

  const insightText = await getCareerInsight(skills, interests);
  const recommendedCareers = insightText.split(',').map((c) => c.trim()).filter(Boolean);

  const newAssessment = new Assessment({
    userId: user,
    skills,
    interests,
    recommendedCareers,
  });
  await newAssessment.save();

  return { insight: insightText };
};

const getAssessmentHistory = async (user) => {
  const assessments = await Assessment.find({ userId: user }).sort({ createdAt: -1 });
  const insight = await Insights.find({ userId: user }).sort({ createdAt: -1 });
  return { assessments, insight };
};

module.exports = {
  createAssessment,
  getAssessmentHistory,
};
