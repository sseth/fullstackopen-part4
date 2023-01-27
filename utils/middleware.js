const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { UnauthorizedError } = require('../utils/custom_errors');

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError')
    return res.status(400).send({ error: 'invalid id' });

  if (
    error.name === 'MongoServerError' ||
    error.name === 'BadRequest' ||
    error.name === 'JsonWebTokenError'
  )
    return res.status(400).json({ error: error.message });

  if (error.name === 'ValidationError') {
    let msg;
    if (error.message.startsWith('Blog'))
      msg = error.message.slice('Blog validation failed: '.length);
    else if (error.message.startsWith('User'))
      msg = error.message.slice('User validation failed: '.length);
    else msg = error.message.slice('Validation failed: '.length);

    return res.status(400).json({ error: { type: 'validation', msg } });
  }

  if (error.name === 'Unauthorized')
    return res.status(401).json({ error: error.message });

  next(error);
};

const requestLogger = morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
    ((req) => {
      if (Object.keys(req.body).length) return JSON.stringify(req.body);
    })(req, res),
  ].join(' ');
});

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: `unknown endpoint: ${req.path}` });
  next();
};

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization');
  if (auth && auth.startsWith('Bearer '))
    req.token = auth.replace('Bearer ', '');
  next();
};

const userExtractor = async (req, res, next) => {
  if (!req.token) next(new UnauthorizedError('Credentials missing'));

  const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET);
  if (!decodedToken.id) next(new UnauthorizedError('Invalid credentials'));

  const user = await User.findById(decodedToken.id);
  if (!user) next(new UnauthorizedError('Invalid credentials'));

  req.user = decodedToken;
  next();
};

module.exports = {
  errorHandler,
  requestLogger,
  userExtractor,
  tokenExtractor,
  unknownEndpoint,
};
