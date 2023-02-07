const cors = require('cors');
const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const { MONGO_URI } = require('./utils/config');

const middleware = require('./utils/middleware');
const {
  blogsRouter,
  usersRouter,
  loginRouter,
} = require('./controllers');

const app = express();

logger.info('Connecting to database...');
mongoose
  .connect(MONGO_URI)
  .then(() => logger.info('...connected'))
  .catch((e) => logger.error('Could not connect:', e.message));

app.use(cors());
app.use(middleware.requestLogger);
app.use(express.json());
app.use(express.static('build'));

app.use('/api/login', loginRouter);
app.use(middleware.tokenExtractor);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

if (process.env.NODE_ENV === 'test') {
  logger.info('here');
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
