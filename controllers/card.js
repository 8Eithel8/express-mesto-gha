const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const InternalSeverError = require('../errors/internal-server-error');
const ForbiddenError = require('../errors/forbidden-error');

const cardInvalidData = 'Переданы некорректные данные при создании карточки.';
const cardNonexistentId = 'Передан несуществующий _id карточки.';
const serverError = 'На сервере произошла ошибка.';
const cardInvalidLikeData = 'Переданы некорректные данные для постановки лайка';
const forbidden = 'Действие запрещено';
// получаем все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => next(new InternalSeverError(serverError)));
};

// создаем карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id; // достанем  ID

  Card.create({ name, owner, link })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(cardInvalidData));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      const me = req.user._id;
      if (me === card.owner.toString()) {
        return res.status(200).send(card);
      }
      throw new ForbiddenError(forbidden);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(cardNonexistentId));
      } else
      if (err.name === 'CastError') {
        next(new BadRequestError(cardNonexistentId));
      } else {
        next(err);
      }
    });
};

// ставим лайки
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // добавляем _id в массив, если его там нет
    { $addToSet: { likes: { _id: req.user._id } } },
    { new: true },
  )
    .orFail()
    .then((like) => res.send({ like }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(cardNonexistentId));
      } else
      if (err.name === 'CastError') {
        next(new BadRequestError(cardInvalidLikeData));
      } else {
        next(err);
      }
    });
};

// удалаяем лайк
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // убираем _id из массива
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((dislike) => res.send({ dislike }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(cardNonexistentId));
      } else
      if (err.name === 'CastError') {
        next(new BadRequestError(cardInvalidLikeData));
      } else {
        next(err);
      }
    });
};
