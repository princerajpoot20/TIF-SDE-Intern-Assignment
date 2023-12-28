const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, communityController.createCommunity);
router.get('/', communityController.getAllCommunities);
router.get('/me/owner', authenticate, communityController.getMyOwnedCommunities);
router.get('/:slug/members', communityController.getAllMembers);
router.get('/me/member', authenticate, communityController.getMyJoinedCommunities);


module.exports = router;
