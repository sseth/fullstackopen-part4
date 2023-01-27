const blogsRouter = require('express').Router();
const { userExtractor } = require('../utils/middleware');

const { Blog, User } = require('../models');
const {
  BadRequestError,
  UnauthorizedError,
} = require('../utils/custom_errors');

const getAll = async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 });
  res.json(blogs);
};

const createPost = async (req, res) => {
  const b = req.body;

  const user = await User.findById(req.user.id);
  const blog = new Blog({
    url: b.url,
    title: b.title,
    likes: b.likes,
    author: b.author || user.name,
    user: req.user.id,
  });

  const savedBlog = await blog.save();
  user.blogs.push(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
};

const removePost = async (req, res) => {
  const { id } = req.params;
  const post = await Blog.findById(id);
  if (!post) return res.status(204).end();

  if (!(post.user && post.user.toString() === req.user.id))
    throw new UnauthorizedError('no.');

  await post.remove();
  res.end();
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

blogsRouter.get('/', getAll);
blogsRouter.use(userExtractor);
blogsRouter.post('/', createPost);
blogsRouter.route('/:id').delete(removePost).put(editPost);

module.exports = blogsRouter;
