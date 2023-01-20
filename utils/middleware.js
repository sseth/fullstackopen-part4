const morgan = require('morgan');

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError')
    return res.status(400).send({ error: 'invalid id' });

  if (error.name === 'MongoServerError')
    return res.status(400).json({ error: error.message });

  if (error.name === 'ValidationError') {
    const msg = error.message.slice(
      error.message.startsWith('Person')
        ? 'Person validation failed: '.length
        : 'Validation failed: '.length
    );
    return res.status(400).json({ error: { type: 'validation', msg } });
  }

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

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: `unknown endpoint: ${req.path}` });
};

module.exports = { errorHandler, requestLogger, unknownEndpoint };
