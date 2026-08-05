module.exports = function requestLogger(req, res, next) {
  try {
    const now = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const ip = req.ip || req.connection?.remoteAddress || 'unknown-ip';

    let msg = `${now} ${ip} ${method} ${url}`;

    // Special-case login POST — log the email but never log passwords
    if (method === 'POST' && /auth\/login$/.test(url)) {
      const email = (req.body && req.body.email) ? req.body.email : 'unknown';
      msg += ` LOGIN email=${email}`;
    }

    console.log(msg);
  } catch (err) {
    // Don't crash the app if logging fails
    console.error('requestLogger error:', err);
  }

  next();
};
