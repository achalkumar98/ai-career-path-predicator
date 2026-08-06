const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skills: [String],
    interests: [String],
    recommendedCareers: [String],
  },
  { timestamps: true }
); // auto-manage createdAt and updatedAt

module.exports = mongoose.model('Assessment', assessmentSchema);
