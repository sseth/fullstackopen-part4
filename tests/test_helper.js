const { Blog, User } = require('../models');

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
];

const initialUsers = [
  {
    name: 'User One',
    username: 'user1',
    password: '12345'
  },
  {
    name: 'User Two',
    username: 'user2',
    password: '12345'
  },
  {
    name: 'User Three',
    username: 'user3',
    password: '12345'
  },
];

const getBlogs = async () => {
  const blogs = await Blog.find();
  return blogs.map((b) => ({ ...b.toJSON(), user: b.user.toString() }));
};

const getUsers = async () => {
  const users = await User.find();
  return users.map((u) => u.toJSON());
};

const getIdString = async () => {
  const b = new Blog({
    title: 'abcd',
    url: 'https://test.com',
  });

  const newPost = await b.save();
  const id = newPost._id.toString();
  await Blog.findByIdAndDelete(id);

  return id;
};

module.exports = {
  initialBlogs,
  initialUsers,
  getBlogs,
  getUsers,
  getIdString,
};
