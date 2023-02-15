const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  max: 300,
  windowMs: 15 * 60 * 1000,
  message: "too many requests sent by this ip",
});

module.exports = limiter;
