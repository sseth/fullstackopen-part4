const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = require('supertest')(app);

beforeEach(async () => {
  await User.deleteMany();
  await Blog.deleteMany();
});

describe('creating a user:', () => {
  const name = 'Test User';
  const username = 'testuser';
  const password = 'testpass1234';

  test('fails if username not provided', async () => {
    await api.post('/api/users').send({ name, password }).expect(400);
  });

  test('fails if password not provided', async () => {
    await api.post('/api/users').send({ username, name }).expect(400);
  });

  test('succeeds with valid data', async () => {
    const { body: user } = await api
      .post('/api/users')
      .send({ name, username, password })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const users = await helper.getUsers();
    expect(users).toHaveLength(1);
    expect(users).toContainEqual(user);
  });

  test('fails if username < 3 chars', async () => {
    await api
      .post('/api/users')
      .send({ name, username: 'tj', password })
      .expect(400);
  });

  test('fails if password < 3 chars', async () => {
    await api
      .post('/api/users')
      .send({ name, username, password: 'ad' })
      .expect(400);
  });

  test('fails if username not unique', async () => {
    await api.post('/api/users').send({ name, username, password }).expect(201);
    await api.post('/api/users').send({ name, username, password }).expect(400);
  });
});

describe('on fetching users:', () => {
  beforeEach(async () => {
    const users = await User.insertMany(helper.initialUsers);
    for (let u of users) {
      const inserted = await Blog.insertMany(helper.initialBlogs);
      for (let b of inserted) {
        u.blogs.push(b._id);
        await u.save();
      }
    }
  });

  test('correct number of users returned as json', async () => {
    const { body: users } = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(users).toHaveLength(helper.initialUsers.length);
  });

  test('all users have an "id" + other fields', async () => {
    const { body: users } = await api.get('/api/users').expect(200);

    users.forEach((user) => {
      expect(user.id).toBeDefined();
      expect(user.name).toBeDefined();
      expect(user.username).toBeDefined();
      expect(user.blogs).toBeDefined();
      expect(user.blogs.length).toBeGreaterThan(0);
      user.blogs.forEach((blog) => {
        console.log(blog);
        expect(blog.id).toBeDefined();
        expect(blog.url).toBeDefined();
        expect(blog.title).toBeDefined();
        expect(blog.author).toBeDefined();
      });
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
