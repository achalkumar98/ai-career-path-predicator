const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const assessmentRoutes = require('./routes/assessment');
app.use('/api/assessment', assessmentRoutes);

const jobMatchingRoutes = require('./routes/jobMatching');
app.use('/api/job-matching', jobMatchingRoutes);

const resourceRoutes = require('./routes/resourceRoutes');
app.use('/api/resources', resourceRoutes);

const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

const resumeRoutes = require('./routes/resume');
app.use('/api/resume', resumeRoutes);

const insightRoutes = require('./routes/insightRoutes');
app.use('/api/insights', insightRoutes);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

// Test Route
app.get('/', (req, res) => {
  res.send('API is working');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
