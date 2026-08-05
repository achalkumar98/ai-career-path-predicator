const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use((req, res, next) => {
  next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/job-matching', require('./routes/jobMatching'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/insights', require('./routes/insightRoutes'));
app.use('/api/contact', require('./routes/contact'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

app.get('/', (req, res) => res.send('API is working'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
