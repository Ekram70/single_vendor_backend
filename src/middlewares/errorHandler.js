const logEvents = require("./logEvents");

// eslint-disable-next-line no-unused-vars
const errorHandler = async (err, req, res, next) => {
  await logEvents(`${err.name}: ${err.message}`, "error.txt");
  console.error(err.stack);
  res.status(500).send(err.message);
};

module.exports = errorHandler;
