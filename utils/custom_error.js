class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequest';
  }
}

module.exports = BadRequestError;
