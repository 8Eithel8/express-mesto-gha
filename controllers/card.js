const Card = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('./errors');

// получаем все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: err.message }));
};

// создаем карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id; // достанем  ID

  Card.create({ name, owner, link })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(NOT_FOUND).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError' || err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// ставим лайки
module.exports.likeCard = (req, res) => {
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
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// удалаяем лайк
module.exports.dislikeCard = (req, res) => {
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
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};
