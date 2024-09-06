const express = require('express');
const { registerUser , authUser,allUsers, UpdateUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware')
const router = express.Router();

router.route('/').post(registerUser).get(protect,allUsers);
router.post('/login',authUser);
router.route('/update').post(protect,UpdateUser);
// router.route('/updatePic').post(protect,updatePic);


module.exports = router;