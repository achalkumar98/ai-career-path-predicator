const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userInput: {
      type: String,
      required: true,
    },
    aiInsight: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model('Insight', insightSchema);
 
