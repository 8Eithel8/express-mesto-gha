const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('./errors');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => new NotFoundError('Запрашиваемый пользователь не найден.'))
    .then(({
      name, about, avatar, _id,
    }) => res.send({
      name, about, avatar, _id,
    }))
    .catch(next);
};

// создаем пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким логином уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

// проверяем почту и пароль пользователя
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7,
      });
      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

// обновляем инфо о пользователе
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
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
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

// обновляем аватар пользователя
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
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
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};
