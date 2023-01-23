const blogsRouter = require('express').Router();

const Blog = require('../models/blog');
const BadRequestError = require('../utils/custom_error');

const getAll = async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
};

const createPost = async (req, res) => {
  const b = req.body;

  const blog = new Blog({
    url: b.url,
    title: b.title,
    likes: b.likes,
    author: b.author,
  });

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
};

const removePost = async (req, res) => {
  const { id } = req.params;
  const post = await Blog.findByIdAndDelete(id);

  if (post) res.end();
  else res.status(204).end();
};

const editPost = async (req, res) => {
  const { id } = req.params;
  if (!req.body || !req.body.likes)
    throw new BadRequestError('Update data required');

  const updatedPost = await Blog.findByIdAndUpdate(
    id,
    { likes: req.body.likes },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  );

  res.json(updatedPost);
};

blogsRouter.route('/').get(getAll).post(createPost);
blogsRouter.route('/:id').delete(removePost).put(editPost);

module.exports = blogsRouter;
