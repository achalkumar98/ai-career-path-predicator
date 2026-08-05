const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Redirect to the swagger UI mounted at /api-docs
  res.redirect('/api-docs');
});

module.exports = router;
