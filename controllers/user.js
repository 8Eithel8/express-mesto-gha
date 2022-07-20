const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then(({
      name, about, avatar, _id,
    }) => res.send({
      name, about, avatar, _id,
    }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// создаем пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};
// обновляем инфо о пользователе
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then(({ avatar, _id }) => res.send({
      name, about, avatar, _id,
    }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// обновляем аватар пользователя
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then(({ name, about, _id }) => res.send({
      name, about, avatar, _id,
    }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
