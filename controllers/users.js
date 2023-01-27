const bcrypt = require('bcrypt');
const User = require('../models/user');
const { BadRequestError } = require('../utils/custom_errors');
const usersRouter = require('express').Router();

const createUser = async (req, res) => {
  const { username, name, password } = req.body;
  if (!(username && password))
    throw new BadRequestError('username or password missing');

  if (password.length < 3)
    throw new BadRequestError('password must be at least 3 characters long');

  const hash = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    username,
    password: hash,
  });

  const saved = await user.save();
  res.status(201).json(saved);
};

const getAllUsers = async (req, res) => {
  const users = await User.find().populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  });
  res.json(users);
};

usersRouter.route('/').get(getAllUsers).post(createUser);

module.exports = usersRouter;
