const app = require('../app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

const api = require('supertest')(app);

let token;
beforeEach(async () => {
  await User.deleteMany();
  await Blog.deleteMany();

  const username = 'lb4321';
  const u = new User({ username, password: 'abcd1234' });
  const user = await u.save();

  token = jwt.sign({ username, id: user._id }, process.env.JWT_SECRET);

  const blogs = helper.initialBlogs.map((b) => ({
    ...b,
    user: mongoose.Types.ObjectId(user._id),
  }));
  await Blog.insertMany(blogs);
});

describe('on fetching blogs:', () => {
  test('correct number of posts returned as json', async () => {
    const { body: posts } = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(posts).toHaveLength(helper.initialBlogs.length);
  });

  test('all posts have an "id" + other fields', async () => {
    const { body: posts } = await api.get('/api/blogs');
    posts.forEach((post) => {
      expect(post.id).toBeDefined();
      expect(post.url).toBeDefined();
      expect(post.title).toBeDefined();
      expect(post.author).toBeDefined();
      expect(post.user).toBeDefined();
      expect(post.user.id).toBeDefined();
      expect(post.user.name).toBeDefined();
      expect(post.user.username).toBeDefined();
    });
  });
});

describe('creating a new post:', () => {
  test('fails with status 401 if token not provided', async () => {
    const testPost = {
      title: 'this is a blog post',
      author: 'john doe',
      url: 'https://medium.com/abcd',
      likes: 420,
    };

    await api.post('/api/blogs').send(testPost).expect(401);

    const blogsAfterPosting = await helper.getBlogs();
    expect(blogsAfterPosting).toHaveLength(helper.initialBlogs.length);
  });

  test('fails with status 401 if token is invalid', async () => {
    const testPost = {
      title: 'this is a blog post',
      author: 'john doe',
      url: 'https://medium.com/abcd',
      likes: 420,
    };

    const fakeId = await helper.getIdString();
    const badToken = jwt.sign(
      { username: 'abcd', id: fakeId },
      process.env.JWT_SECRET
    );

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${badToken}`)
      .send(testPost)
      .expect(401);

    const blogsAfterPosting = await helper.getBlogs();
    expect(blogsAfterPosting).toHaveLength(helper.initialBlogs.length);
  });

  test('post gets saved to db', async () => {
    const testPost = {
      title: 'this is a blog post',
      author: 'john doe',
      url: 'https://medium.com/abcd',
      likes: 69,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(testPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAfterPosting = await helper.getBlogs();
    expect(blogsAfterPosting).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAfterPosting.map((b) => b.title);
    expect(titles).toContain('this is a blog post');
  });

  test('"likes" defaults to 0 if not provided', async () => {
    const testPost = {
      title: 'this is a blog post',
      author: 'john doe',
      url: 'https://medium.com/abcd',
    };

    const { body: createdPost } = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(testPost);

    expect(createdPost.likes).toBe(0);
  });

  test('400 if title or url missing from request', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'this is a blog post',
      })
      .expect(400);

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        url: 'https://medium.com/abcd',
      })
      .expect(400);

    const posts = await helper.getBlogs();
    expect(posts).toHaveLength(helper.initialBlogs.length);
  });
});

describe('updating a post:', () => {
  test('fails with status 401 if token not provided', async () => {
    const posts = await helper.getBlogs();
    const index = Math.floor(Math.random() * posts.length);
    const randomPost = posts[index];

    await api
      .put(`/api/blogs/${randomPost.id}`)
      .send({ likes: 734 })
      .expect(401);

    const postsAfterUpdate = await helper.getBlogs();
    expect(postsAfterUpdate[index]).toEqual(randomPost);
  });

  test('changes the like count', async () => {
    const posts = await helper.getBlogs();
    const randomPost = posts[Math.floor(Math.random() * posts.length)];

    const { body: updatedPost } = await api
      .put(`/api/blogs/${randomPost.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ likes: 495 })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(updatedPost).toEqual({ ...randomPost, likes: 495 });
  });

  test('fails with status 400 if likes missing from request body', async () => {
    const posts = await helper.getBlogs();
    const randomPost = posts[Math.floor(Math.random() * posts.length)];

    const { body: updatedPost } = await api
      .put(`/api/blogs/${randomPost.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ likes: 495 })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(updatedPost).toEqual({ ...randomPost, likes: 495 });
  });
});

describe('deleting a post:', () => {
  test('fails with status 401 if token not provided', async () => {
    const posts = await helper.getBlogs();
    const randomPost = posts[Math.floor(Math.random() * posts.length)];

    await api.delete(`/api/blogs/${randomPost.id}`).expect(401);

    const postsAfterDelete = await helper.getBlogs();
    expect(postsAfterDelete).toHaveLength(helper.initialBlogs.length);
    expect(postsAfterDelete.map((p) => p.title)).toContain(randomPost.title);
  });

  test('succeeds with status code 200 for valid id', async () => {
    const posts = await helper.getBlogs();
    const randomPost = posts[Math.floor(Math.random() * posts.length)];

    await api
      .delete(`/api/blogs/${randomPost.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const postsAfterDelete = await helper.getBlogs();
    expect(postsAfterDelete).toHaveLength(helper.initialBlogs.length - 1);
    expect(postsAfterDelete.map((p) => p.title)).not.toContain(
      randomPost.title
    );
  });

  test('responds with status code 204 for a valid id not in db', async () => {
    const randomId = await helper.getIdString();

    await api
      .delete(`/api/blogs/${randomId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const postsAfterDelete = await helper.getBlogs();
    expect(postsAfterDelete).toHaveLength(helper.initialBlogs.length);
  });

  test('fails with status 401 if created by different user', async () => {
    const username = 'newUser2';
    const password = 'abxy5678';
    await api
      .post('/api/users')
      .send({
        name: 'Lallan',
        username,
        password,
      })
      .expect(201);

    const { body: user } = await api
      .post('/api/login')
      .send({
        username,
        password,
      })
      .expect(200);

    const posts = await helper.getBlogs();
    const randomPost = posts[Math.floor(Math.random() * posts.length)];

    await api
      .delete(`/api/blogs/${randomPost.id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(401);

    const postsAfterDelete = await helper.getBlogs();
    expect(postsAfterDelete).toHaveLength(helper.initialBlogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
