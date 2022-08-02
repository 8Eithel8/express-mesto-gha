const router = require('express').Router();
const { validateUserId } = require('../middlewares/validators');

const {
  getUsers, getUserId, updateUserInfo, updateUserAvatar,
} = require('../controllers/user');

router.get('/', getUsers);
router.get('/:userId', validateUserId, getUserId);
router.get('/me', validateUserId, getUserId);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
