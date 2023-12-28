const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Route to create a new role
router.post('/', roleController.createRole);

// Route to get all roles
router.get('/', roleController.getAllRoles);


module.exports = router;
