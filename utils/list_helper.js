const dummy = (blogs) => {
  console.log(blogs);
  return 1;
};

const totalLikes = (posts) => {
  return posts.reduce((sum, post) => sum + post.likes, 0);
};

const favoriteBlog = (blogs) => {
  let maxIndex = 0;
  blogs.forEach((blog, i) => {
    // console.log(blog.likes, blogs[maxIndex].likes);
    if (blog.likes > blogs[maxIndex].likes)
      maxIndex = i;
  });
  // console.log(maxIndex);
  return blogs[maxIndex];
};

const mostBlogs = (blogs) => {
  console.log(blogs);
};

const mostLikes = (blogs) => {
  console.log(blogs);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
