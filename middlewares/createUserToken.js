const jwt = require("jsonwebtoken");
const usePasswordHashToMakeToken = (user) => {
  // highlight-start
  const { password, _id, createdAt } = user;
  const secret = password + "-" + createdAt;
  const token = jwt.sign({ _id }, secret, {
    expiresIn: 15 * 60 * 1000, // 15 mins
  });
  // highlight-end
  return token;
};

module.exports = usePasswordHashToMakeToken;
