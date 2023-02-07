const testingRouter = require('express').Router();
const { Blog, User } = require('../models');

testingRouter.get('/reset', async (req, res) => {
  await Blog.deleteMany();
  await User.deleteMany();

  res.status(204).end();
});

module.exports = testingRouter;
