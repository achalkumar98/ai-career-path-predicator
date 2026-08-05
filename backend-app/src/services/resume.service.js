const pdfParse = require('pdf-parse');

const analyzeResume = async (file) => {
  if (!file) {
    const error = new Error('No file uploaded');
    error.status = 400;
    throw error;
  }

  const data = await pdfParse(file.buffer);
  const text = data.text;
  const skills = text.match(/(JavaScript|React|Node\.js|Python|MongoDB|AWS|Docker)/gi) || [];
  const experience = text.match(/\b\d{4}\b/g) || [];

  return {
    rawText: text.slice(0, 1000) + '...',
    extractedSkills: [...new Set(skills.map((s) => s.toLowerCase()))],
    experienceYears: experience,
  };
};

module.exports = {
  analyzeResume,
};
