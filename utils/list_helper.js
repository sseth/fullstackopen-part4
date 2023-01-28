const _ = require('lodash');

const dummy = () => {
  return 1;
};

const totalLikes = (posts) => {
  return posts.reduce((sum, post) => sum + post.likes, 0);
};

const favoriteBlog = (blogs) => {
  let maxIndex = 0;
  blogs.forEach((blog, i) => {
    // console.log(blog.likes, blogs[maxIndex].likes);
    if (blog.likes > blogs[maxIndex].likes) maxIndex = i;
  });
  // console.log(maxIndex);
  return blogs[maxIndex];
};

const mostBlogs = (blogs) => {
  const counts = _.countBy(blogs, 'author');
  let author;
  let max = 0;
  for (let a in counts) {
    if (counts[a] > max) {
      author = a;
      max = counts[a];
    }
  }

  return { author, blogs: max };
};

const mostLikes = (blogs) => {
  const authors = _.uniqBy(blogs, 'author').map((b) => b.author);
  let author;
  let max = 0;
  authors.forEach((a) => {
    const likes = _.sumBy(blogs, (b) => {
      if (b.author === a) return b.likes;
    });
    if (likes > max) {
      author = a;
      max = likes;
    }
  });

  return { author, likes: max };
};

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
];

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

module.exports = {
  blogs,
  dummy,
  mostBlogs,
  mostLikes,
  totalLikes,
  favoriteBlog,
  listWithOneBlog,
};
