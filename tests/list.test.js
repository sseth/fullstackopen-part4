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

// TODO: 4.6, 4.7
