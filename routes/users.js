const router = require('express').Router();
const { validateUserId, validateUserInfo, validateUserAvatar } = require('../middlewares/validators');

const {
  getUsers, getUserMe, getUserId, updateUserInfo, updateUserAvatar,
} = require('../controllers/user');

router.get('/', getUsers);
router.get('/me', validateUserId, getUserMe);
router.get('/:userId', validateUserId, getUserId);
router.patch('/me', validateUserInfo, updateUserInfo);
router.patch('/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = router;
