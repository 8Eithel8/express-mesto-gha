module.exports = class InternalSeverError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
};
