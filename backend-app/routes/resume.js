const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // store in memory

router.post('/upload', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const data = await pdfParse(req.file.buffer);
    const text = data.text;

    // 🔍 Mocked NLP Skill/Experience Extraction (replace with real NLP later)
    const skills = text.match(/(JavaScript|React|Node\.js|Python|MongoDB|AWS|Docker)/gi) || [];
    const experience = text.match(/\b\d{4}\b/g) || [];

    res.json({
      rawText: text.slice(0, 1000) + '...', // return first 1k chars only
      extractedSkills: [...new Set(skills.map((s) => s.toLowerCase()))],
      experienceYears: experience,
    });

  } catch (err) {
    console.error('Resume parse error →', err);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

module.exports = router;
