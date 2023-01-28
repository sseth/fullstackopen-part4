const helper = require('../utils/list_helper');

const { blogs, listWithOneBlog } = helper;

test('dummy returns one', () => {
  expect(helper.dummy([])).toBe(1);
});

describe('total likes of', () => {
  test('empty list: 0', () => {
    expect(helper.totalLikes([])).toBe(0);
  });

  test('one blog: blog.likes', () => {
    expect(helper.totalLikes(listWithOneBlog)).toBe(5);
  });

  test('longer list: sum of likes', () => {
    expect(helper.totalLikes(blogs)).toBe(36);
  });
});

describe('most liked of', () => {
  test('empty list: undefined', () => {
    expect(helper.favoriteBlog([])).toEqual(undefined);
  });

  test('list with one blog: blogs[0].likes', () => {
    expect(helper.favoriteBlog(listWithOneBlog)).toEqual(listWithOneBlog[0]);
  });

  test('longer list: max(blogs[0...n].likes)', () => {
    expect(helper.favoriteBlog(blogs)).toEqual(blogs[2]);
  });
});

describe('author with the most blogs', () => {
  test('for an empty list: undefined', () => {
    expect(helper.mostBlogs([]).author).toEqual(undefined);
    expect(helper.mostBlogs([]).blogs).toEqual(0);
  });

  test('for a list with one blog: blogs[0].author', () => {
    expect(helper.mostBlogs(listWithOneBlog).author).toEqual(
      listWithOneBlog[0].author
    );
    expect(helper.mostBlogs(listWithOneBlog).blogs).toEqual(1);
  });

  test('for a list with many blogs', () => {
    expect(helper.mostBlogs(blogs).author).toEqual('Robert C. Martin');
    expect(helper.mostBlogs(blogs).blogs).toEqual(3);
  });
});

describe('author with the most likes', () => {
  test('for an empty list: undefined', () => {
    expect(helper.mostLikes([]).author).toEqual(undefined);
    expect(helper.mostLikes([]).likes).toEqual(0);
  });

  test('for a list with one blog: blogs[0].author', () => {
    expect(helper.mostLikes(listWithOneBlog).author).toEqual(
      listWithOneBlog[0].author
    );
    expect(helper.mostLikes(listWithOneBlog).likes).toEqual(listWithOneBlog[0].likes);
  });

  test('for a list with many blogs', () => {
    expect(helper.mostLikes(blogs).author).toEqual('Edsger W. Dijkstra');
    expect(helper.mostLikes(blogs).likes).toEqual(17);
  });
});
