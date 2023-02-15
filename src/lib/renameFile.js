const renameFile = (originalname) => {
  const name = originalname
    .substring(0, originalname.lastIndexOf("."))
    .toLowerCase()
    .split(" ")
    .join("-");

  const timestamp = Date.now();

  const ref = `${name}-${timestamp}`;

  return ref;
};

module.exports = renameFile;
