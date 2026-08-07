const { join } = require('path');

// Keep the downloaded browser inside the deployed application. Render's home
// directory cache is not guaranteed to survive from build to runtime.
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
