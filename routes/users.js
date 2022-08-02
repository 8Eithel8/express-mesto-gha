const router = require('express').Router();
const { validateUserId } = require('../middlewares/validators');

const {
  getUsers, getUserMe, getUserId, updateUserInfo, updateUserAvatar,
} = require('../controllers/user');

router.get('/', getUsers);
router.get('/me', validateUserId, getUserMe);
router.get('/:userId', validateUserId, getUserId);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
