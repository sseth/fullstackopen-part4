const cors = require('cors');
const express = require('express');

const blogsRouter = require('./controllers/blogs');
const {
  errorHandler,
  requestLogger,
  unknownEndpoint,
} = require('./utils/middleware');

const app = express();

app.use(cors());
app.use(requestLogger);
app.use(express.json());
app.use(express.static('build'));

app.use('/api/blogs', blogsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
