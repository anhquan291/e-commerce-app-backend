const User = require('../models/user');
const {
  registerValidation,
  loginValidation,
} = require('../middlewares/validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  transporter,
  getPasswordResetURL,
  resetPasswordTemplate,
} = require('../middlewares/emailTemplate');
const usePasswordHashToMakeToken = require('../middlewares/createUserToken');

const user_register = (req, res) => {
  //validation
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //check email if exist
  User.findOne({ email: req.body.email }).then((result) => {
    if (result) {
      return res.status(400).send('The email already exists');
    }
  });

  //hash password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  user
    .save()
    .then((result) => {
      res.send(result._id);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
};

const user_login = (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //admin login
  if (
    req.body.email === process.env.DEFAULT_ADMINNAME &&
    req.body.password === process.env.DEFAULT_PASSWORD
  ) {
    jwt.sign(
      { name: 'admin' },
      process.env.SECRET_TOKEN,
      { expiresIn: '3600s' },
      (err, token) => {
        if (err) {
          return res.status(400).err;
        }
        res.header('auth-token', token).send({
          name: 'admin',
          token: token,
          expiresIn: 3600,
        });
      }
    );
  } else {
    //user account
    User.findOne({ email: req.body.email }).then((result) => {
      if (!result) {
        return res.status(400).send('Email or password is wrong');
      }
      bcrypt
        .compare(req.body.password, result.password)
        .then((passMatching) => {
          if (!passMatching) {
            return res.status(400).send('Password is wrong');
          }
          jwt.sign(
            { userId: result._id },
            process.env.SECRET_TOKEN,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) {
                return res.status(400).err;
              }
              res.header('auth-token', token).send({
                userid: result._id,
                name: result.name,
                token: token,
                expiresIn: 3600,
              });
            }
          );
        });
    });
  }
};

const user_resetpw = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send('Email is wrong');
  }
  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    res.status(404).json('No user with that email');
  }
  const token = usePasswordHashToMakeToken(user);
  const url = getPasswordResetURL(user, token);
  const emailTemplate = resetPasswordTemplate(user, url);
  const sendEmail = () => {
    transporter.sendMail(emailTemplate, (err, info) => {
      if (err) {
        res.status(500).json('Error sending email');
      }

      console.log(`** Email sent **`, info);
    });
  };

  sendEmail();
  res.send('Reset Email is sent');
};
const user_receivepw = (req, res) => {
  const { userId, token } = req.params;
  const { password } = req.body;

  // highlight-start
  User.findOne({ _id: userId })
    .then((user) => {
      const secret = user.password + '-' + user.createdAt;
      const payload = jwt.decode(token, secret);
      console.log(payload);
      if (payload._id === userId) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        User.findOneAndUpdate({ _id: userId }, { password: hashedPassword })
          .then(() => res.status(202).json('Password changed accepted'))
          .catch((err) => res.status(500).json(err));
      }
    })
    // highlight-end
    .catch(() => {
      res.status(404).json('Invalid user');
    });
};

module.exports = { user_register, user_login, user_resetpw, user_receivepw };
