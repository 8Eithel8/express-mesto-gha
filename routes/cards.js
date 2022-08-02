const router = require('express').Router();
const { validateCard, validateCardId } = require('../middlewares/validators');

const {
  getCards, createCard, likeCard, dislikeCard, deleteCard,
} = require('../controllers/card');

router.get('/', getCards);
router.post('/', validateCard, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
