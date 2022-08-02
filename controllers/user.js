const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const userNotFound = 'Запрашиваемый пользователь не найден.';
const userInvalidData = 'Переданы некорректные данные при создании пользователя.';
const userInvalidProfileData = 'Переданы некорректные данные при обновлении профиля.';
const userInvalidAvatarData = 'Переданы некорректные данные при обновлении аватара.';
const userExists = 'Пользователь с таким логином уже зарегистрирован.';
const userInvalidLoginOrPass = 'Неверный логин или пароль.';

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

const getUserById = (id, res, next) => User.findById(id)
  .orFail(() => new NotFoundError(userNotFound))
  .then(({
    name, about, avatar, _id, email,
  }) => res.status(200).send({
    name, about, avatar, _id, email,
  }))
  .catch(next);

module.exports.getUserMe = (req, res, next) => {
  getUserById(req.user._id, res, next);
};

module.exports.getUserId = (req, res, next) => {
  getUserById(req.params.userId, res, next);
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
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(userInvalidData));
      } if (err.code === 11000) {
        next(new ConflictError(userExists));
      } else {
        next(err);
      }
    });
};

// проверяем почту и пароль пользователя
module.exports.login = (req, res, next) => {
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
    .catch(() => {
      next(new UnauthorizedError(userInvalidLoginOrPass));
    });
};

// обновляем инфо о пользователе
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError(userNotFound))
    .then(({ avatar, _id }) => res.send({
      name, about, avatar, _id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(userInvalidProfileData));
      } else next(err);
    });
};

// обновляем аватар пользователя
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError(userNotFound))
    .then(({ name, about, _id }) => res.send({
      name, about, avatar, _id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(userInvalidAvatarData));
      } else next(err);
    });
};
