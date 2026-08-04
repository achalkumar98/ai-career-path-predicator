const generateInsight = async (prompt) => {
  // Simulate dynamic insight based on input
  if (prompt.includes("Data Science") || prompt.includes("ML")) {
    return "With your background in Data Science and ML, careers like ML Engineer, AI Researcher, or Data Strategist would be a great fit. Keep an eye on trends in LLMs and Responsible AI.";
  }
  if (prompt.includes("Web Development")) {
    return "Your interest in Web Development suggests paths like Front-End Developer, Full Stack Engineer, or even Product Engineer. Trends to follow: serverless, edge functions, and modern frameworks.";
  }
  return "Based on your skills and interests, you might thrive in areas like UX Research, AI Ethics, or Digital Strategy. Explore how emerging tech is transforming your fields.";
};

module.exports = generateInsight;
