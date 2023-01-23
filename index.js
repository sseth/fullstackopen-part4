const app = require('./app');
// const http = require('http');
// const mongoose = require('mongoose');
const logger = require('./utils/logger');
const { PORT } = require('./utils/config');
// const { PORT, MONGO_URI } = require('./utils/config');

app.listen(PORT, () => {
  // logger.info('Connecting to database...');
  // mongoose
  //   .connect(MONGO_URI)
  //   .then(() => {
  //     logger.info('...connected');
  //     logger.info(`Server running on port ${PORT}`);
  //   })
  //   .catch((e) => logger.error('Could not connect:', e.message));
  logger.info(`Server running on port ${PORT}`);
});
