const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, memberController.addMember);
router.delete('/:id', authenticate, memberController.removeMember);

module.exports = router;
