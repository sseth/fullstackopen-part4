const app = require('../app');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = require('supertest')(app);

beforeEach(async () => {
  await Blog.deleteMany();
  await Blog.insertMany(helper.initialBlogs);
});

describe('on fetching blogs:', () => {
  test('correct number of posts returned as json', async () => {
    const { body: posts } = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(posts).toHaveLength(helper.initialBlogs.length);
  });

  test('all posts have an "id"', async () => {
    const { body: posts } = await api.get('/api/blogs');
    posts.forEach((post) => {
      expect(post.id).toBeDefined();
    });
  });
});

describe('creating a new post:', () => {
  test('post gets saved to db', async () => {
    const testPost = {
      title: 'this is a blog post',
      author: 'john doe',
      url: 'https://medium.com/abcd',
      likes: 69,
    };

    await api
      .post('/api/blogs')
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

    const { body: createdPost } = await api.post('/api/blogs').send(testPost);

    expect(createdPost.likes).toBe(0);
  });

  test('400 if title or url missing from request', async () => {
    await api
      .post('/api/blogs')
      .send({
        title: 'this is a blog post',
      })
      .expect(400);

    await api
      .post('/api/blogs')
      .send({
        url: 'https://medium.com/abcd',
      })
      .expect(400);

    const posts = await helper.getBlogs();
    expect(posts).toHaveLength(helper.initialBlogs.length);
  });
});

describe('updating a post:', () => {
  test('changes the like count', async () => {
    const posts = await helper.getBlogs();
    const randomPost = posts[Math.floor(Math.random() * posts.length)];

    const { body: updatedPost } = await api
      .put(`/api/blogs/${randomPost.id}`)
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
      .send({ likes: 495 })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(updatedPost).toEqual({ ...randomPost, likes: 495 });
  });
});

describe('deleting a post:', () => {
  test('succeeds with status code 200 for valid id', async () => {
    const posts = await helper.getBlogs();
    const randomPost = posts[Math.floor(Math.random() * posts.length)];

    await api.delete(`/api/blogs/${randomPost.id}`).expect(200);

    const postsAfterDelete = await helper.getBlogs();
    expect(postsAfterDelete).toHaveLength(helper.initialBlogs.length - 1);
    expect(postsAfterDelete.map((p) => p.title)).not.toContain(
      randomPost.title
    );
  });

  test('responds with status code 204 for a valid id not in db', async () => {
    const randomId = await helper.getIdString();

    await api.delete(`/api/blogs/${randomId}`).expect(204);

    const postsAfterDelete = await helper.getBlogs();
    expect(postsAfterDelete).toHaveLength(helper.initialBlogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

// const { MONGO_URI } = require('../utils/config');

// const connect = async () => {
//   try {
//     console.log('connecting to db...');
//     await mongoose.connect(MONGO_URI);
//     console.log('...connected');
//   } catch (e) {
//     console.log('could not connect:', e.message);
//   }
// };

// connect();
