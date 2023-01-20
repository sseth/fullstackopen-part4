const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const blog = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blog.set('toJSON', {
  transform: (doc, ob) => {
    delete ob.__v;
    ob.id = ob._id.toString();
    delete ob._id;
  },
});

module.exports = mongoose.model('Blog', blog);
