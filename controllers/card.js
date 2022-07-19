const Card = require('../models/card');

module.exports.getCards = (req, res) => {
    user.find({})
        .populate('user')

    Card.find({})
        .then(cards => res.send({ data: cards }))
        .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
    const { name, link } = req.body; //достанем  ID
    const owner = req.user._id;

    Card.create({ name, owner, link })
        .then(card => res.send({ data: card }))
        .catch(err => res.status(500).send({ message: err.message }));
};