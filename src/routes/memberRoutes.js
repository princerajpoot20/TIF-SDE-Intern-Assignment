const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, memberController.addMember);

module.exports = router;
