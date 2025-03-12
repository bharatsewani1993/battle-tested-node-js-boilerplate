const express = require('express');
const router = express.Router();
const systemController = require('../../controllers/systemController');

//root router / landing page
router.get('', systemController.getProjectRoot);

module.exports = router;