class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequest';
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Unauthorized';
  }
}

module.exports = { BadRequestError, UnauthorizedError };
