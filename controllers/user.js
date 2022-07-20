const User = require('../models/user');

module.exports.getUsers = (req, res) => {
    User.find({})
        .then(users => res.send({  users }))
        .catch(err => res.status(500).send({ message: err.message }));
};


module.exports.getUserId = (req, res) => {
    User.findById(req.params._id)
        .then(user => res.send({ data: user }))
        .catch(err => res.status(500).send({ message: err.message }));
};

//создаем пользователя
module.exports.createUser = (req, res) => {
    const { name, about, avatar } = req.body;

    User.create({ name, about, avatar })
        .then(user => res.send({ data: user }))
        .catch(err => res.status(500).send({ message: err.message }));
};
//обновляем инфо о пользователе
module.exports.updateUserInfo = (req, res) => {
    const { name, about } = req.body;

    User.findByIdAndUpdate(req.params._id, { name, about })
        .then(user => res.send({ data: user }))
        .catch(err => res.status(500).send({ message: err.message }));
};

//обновляем аватар пользователя
module.exports.updateUserAvatar = (req, res) => {
    const { avatar } = req.body;

    User.findByIdAndUpdate(req.params._id, { avatar })
        .then(user => res.send({ data: user }))
        .catch(err => res.status(500).send({ message: err.message }));
};


