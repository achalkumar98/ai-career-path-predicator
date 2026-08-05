const express = require('express');
const router = express.Router();
const resourcesController = require('../../controllers/resources.controller');

// POST /api/resources
router.post('/', resourcesController.getResources);

module.exports = router;
