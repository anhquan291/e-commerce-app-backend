const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send('Access Denied');
  }
  try {
    jwt.verify(token, process.env.SECRET_TOKEN);
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

module.exports = auth;
