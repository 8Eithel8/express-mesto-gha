const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

const message = 'Необходима авторизация';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(message);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  // попытаемся верифицировать токен
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new UnauthorizedError(message);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
