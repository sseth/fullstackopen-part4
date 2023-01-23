const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const blog = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: 'Anonymous',
  },
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

blog.set('toJSON', {
  transform: (doc, ob) => {
    delete ob.__v;
    ob.id = ob._id.toString();
    delete ob._id;
  },
});

module.exports = mongoose.model('Blog', blog);
