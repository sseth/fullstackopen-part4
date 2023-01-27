const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const user = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  name: {
    type: String,
    default: 'User'
  },
  password: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    }
  ]
});

user.plugin(uniqueValidator);

user.set('toJSON', {
  transform: (doc, u) => {
    delete u.password;
    delete u.__v;
    u.id = u._id.toString();
    delete u._id;
  }
});

module.exports = mongoose.model('User', user);
