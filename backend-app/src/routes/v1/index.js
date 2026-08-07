const express = require('express');

const authRoute = require('./auth.route');
const assessmentRoute = require('./assessment.route');
const jobMatchingRoute = require('./jobMatching.route');
const resourcesRoute = require('./resources.route');
const chatRoute = require('./chat.route');
const resumeRoute = require('./resume.route');
const insightsRoute = require('./insights.route');
const contactRoute = require('./contact.route');
const feedbackRoute = require('./feedback.route');
const dashboardRoute = require('./dashboard.route');

const router = express.Router();

const defaultRoutes = [
  { path: '/auth', route: authRoute },
  { path: '/assessment', route: assessmentRoute },
  { path: '/job-matching', route: jobMatchingRoute },
  { path: '/resources', route: resourcesRoute },
  { path: '/chat', route: chatRoute },
  { path: '/resume', route: resumeRoute },
  { path: '/insights', route: insightsRoute },
  { path: '/contact', route: contactRoute },
  { path: '/feedback', route: feedbackRoute },
  { path: '/dashboard', route: dashboardRoute },
];

defaultRoutes.forEach((r) => router.use(r.path, r.route));


module.exports = router;
