const cors = require('cors');
const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const { MONGO_URI } = require('./utils/config');

const blogsRouter = require('./controllers/blogs');
const {
  errorHandler,
  requestLogger,
  unknownEndpoint,
} = require('./utils/middleware');

const app = express();

logger.info('Connecting to database...');
mongoose
  .connect(MONGO_URI)
  .then(() => logger.info('...connected'))
  .catch((e) => logger.error('Could not connect:', e.message));

app.use(cors());
app.use(requestLogger);
app.use(express.json());
app.use(express.static('build'));

app.use('/api/blogs', blogsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
