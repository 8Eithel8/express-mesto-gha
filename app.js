const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
    'mongodb://localhost:27017/mestodb',
    { useNewUrlParser: true }
);


// app.use('/directors', require('./routes/directors'));

//милдвер для авторизации (временно)
app.use((req, res, next) => {
    req.user = {
        _id: '62d705d4448454182ff028c1'
    };

    next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})
