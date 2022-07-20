const Card = require('../models/card');

//получаем все карточки
module.exports.getCards = (req, res) => {
    user.find({})
        .populate('user')

    Card.find({})
        .then(cards => res.send({ data: cards }))
        .catch(err => res.status(500).send({ message: err.message }));
};

//создаем карточку
module.exports.createCard = (req, res) => {
    const { name, link } = req.body; //достанем  ID
    const owner = req.user._id;

    Card.create({ name, owner, link })
        .then(card => res.send({ data: card }))
        .catch(err => res.status(500).send({ message: err.message }));
};

//ставим лайки
module.exports.likeCard = (req, res) => {
    Card.findByIdAndUpdate(
        req.params.cardId,
        // добавляем _id в массив, если его там нет
        {$addToSet: {likes: req.user._id}},
        {new: true},
    )
        .then(like => res.send({like}))
        .catch(err => res.status(500).send({message: err.message}));
}

//удалаяем лайк
module.exports.dislikeCard = (req, res) => {
    Card.findByIdAndUpdate(
        req.params.cardId,
        // убираем _id из массива
        {$pull: {likes: req.user._id}},
        {new: true},
    )
        .then(dislike => res.send({dislike}))
        .catch(err => res.status(500).send({message: err.message}));
}