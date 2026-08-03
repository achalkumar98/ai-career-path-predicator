const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const generateInsight = require("../utils/generateInsight"); // Make sure this function exists
const Assessment = require("../models/Assessment");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Insights = require("../models/Insights");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// // POST /api/assessment
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { skills = [], interests = [] } = req.body;

//     if (!Array.isArray(skills) || !Array.isArray(interests)) {
//       return res.status(400).json({ message: "Invalid skills or interests format" });
//     }

//     const prompt = `Based on the following skills: ${skills.join(", ")} and interests: ${interests.join(
//       ", "
//     )}, what are some promising career paths and relevant industry trends? Respond like a career counselor.`;

//     const insight = await generateInsight(prompt); // Should return a string

//     // Simulated DB save (replace with real DB save if needed)
//     const newAssessment = {
//       id: Date.now(),
//       date: new Date().toISOString(),
//       skills,
//       interests,
//       recommendedCareers:insight,
//     };

//     // TEMP: Save to memory or simulate console DB
//     console.log("✅ Assessment Saved:", newAssessment);

//     res.json(newAssessment);
//   } catch (error) {
//     console.error("💥 LLaMA Error →", error);
//     res.status(500).json({ message: "Something went wrong." });
//   }
// });

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { skills = [], interests = [] } = req.body;

    if (!Array.isArray(skills) || !Array.isArray(interests)) {
      return res.status(400).json({ message: "Invalid skills or interests format" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    A user has the following skills: ${skills.join(", ")}.
    And they are interested in: ${interests.join(", ")}.

    Based on this, suggest 2-3 career paths that would suit them best.
    Keep the answer friendly and 1 paragraph long, and explain briefly why these paths match their profile.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const recommendedCareers = text
    .split(",")
    .map((career) => career.trim())
    .filter(Boolean);

  // Save assessment to DB
  const newAssessment = new Assessment({
    userId: req.user, // assuming auth middleware sets req.user
    skills,
    interests,
    recommendedCareers,
  });

  await newAssessment.save();

  res.status(200).json({ insight: recommendedCareers.join(", ") });

    
  } catch (error) {
    console.error("💥 LLaMA Error →", error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

// GET /api/assessment/history
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const userId = req.user;

    const assessments = await Assessment.find({ userId }).sort({ createdAt: -1 });
    const insight = await Insights.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ assessments, insight });
  } catch (err) {
    console.error("Failed to fetch assessment history:", err);
    res.status(500).json({ error: "Server error while fetching assessment history." });
  }
});

module.exports = router;
