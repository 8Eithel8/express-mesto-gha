const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('./errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: err.message }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then(({
      name, about, avatar, _id,
    }) => res.send({
      name, about, avatar, _id,
    }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError' || err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// создаем пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(NOT_FOUND).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};
// обновляем инфо о пользователе
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true })
    .orFail()
    .then(({ avatar, _id }) => res.send({
      name, about, avatar, _id,
    }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError' || err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// обновляем аватар пользователя
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true })
    .orFail()
    .then(({ name, about, _id }) => res.send({
      name, about, avatar, _id,
    }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError' || err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};
