const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequestError } = require('../utils/custom_errors');

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    throw new BadRequestError('Username and password required');

  const user = await User.findOne({ username });
  if (!user) throw new BadRequestError(`user '${username}' not found`);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'incorrect password' });

  const token = jwt.sign(
    { username, id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );

  res.json({ token, id: user._id, username, name: user.name });
});

module.exports = loginRouter;
