const express = require('express');
const router = express.Router();
const { register, login,adminLogin , updateAdminCredentials } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.patch('/admin/update-credentials', updateAdminCredentials);
module.exports = router;
