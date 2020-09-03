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
  registerUserTemplate,
} = require('../middlewares/emailTemplate');
const usePasswordHashToMakeToken = require('../middlewares/createUserToken');
const pushNotification = require('../middlewares/pushNotification');

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
    //hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const user = new User({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      pushTokens: req.body.pushTokens,
      phone: '',
      address: '',
      profilePicture: '',
    });
    user
      .save()
      .then((result) => {
        const sendEmail = () => {
          transporter.sendMail(registerUserTemplate(result), (err, info) => {
            if (err) {
              res.status(500).send({ err: 'Error sending email' });
            }
            console.log(`** Email sent **`, info);
          });
        };
        sendEmail();
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send(err.message);
      });
  });
};

const user_login = (req, res) => {
  const { error } = loginValidation(req.body);
  const email = req.body.email.toLowerCase();
  const { password } = req.body;
  const pushTokens = req.body.pushTokens;

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //admin login
  if (
    email === process.env.DEFAULT_ADMINNAME &&
    password === process.env.DEFAULT_PASSWORD
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
          loginAt: Date.now(),
          expireTime: Date.now() + 60 * 60 * 1000,
        });
      }
    );
  } else {
    //user account
    User.findOne({ email }).then((result) => {
      if (!result) {
        return res.status(400).send({ err: 'Email or password is wrong' });
      }
      bcrypt.compare(password, result.password).then((passMatching) => {
        if (!passMatching) {
          return res.status(400).send({ err: 'Email or password is wrong' });
        }
        let checkPushToken;
        if (pushTokens.length > 0) {
          const check = result.pushTokens.some((userPushToken) => {
            return userPushToken === pushTokens[0];
          });
          checkPushToken = check;
        }

        if (!checkPushToken) {
          result.pushTokens.push(pushTokens[0]);
          result
            .save()
            .then(() => {
              console.log('updated user push token');
            })
            .catch((err) => {
              res.status(400).send(err.message);
            });
        }

        jwt.sign(
          { userId: result._id },
          process.env.SECRET_TOKEN,
          { expiresIn: '3600s' },
          (err, token) => {
            if (err) {
              return res.status(400).err;
            }
            return res.status(200).send({
              userid: result._id,
              name: result.name,
              email: result.email,
              phone: result.phone,
              address: result.address,
              profilePicture: result.profilePicture,
              token: token,
              loginAt: Date.now(),
              expireTime: Date.now() + 60 * 60 * 1000,
            });
          }
        );
      });
    });
  }
};

const user_edit = (req, res) => {
  const { id } = req.params;

  User.findOneAndUpdate({ _id: id }, req.body)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const user_photoUpload = (req, res) => {
  const host = process.env.HOST_NAME;
  const { id } = req.params;

  if (!req.body && !req.file) {
    return res.status(200).send({
      status: 'ERR_REQUEST',
      message: 'Please check your request!',
      content: null,
    });
  } else {
    const imageUrl =
      host + '/public/api/static/images/userprofile/' + req.file.filename;
    console.log(id, req.file);
    User.findOneAndUpdate({ _id: id }, { profilePicture: imageUrl })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
};

const user_resetpw = async (req, res) => {
  const email = req.body.email.toLowerCase();
  if (!email) {
    return res.status(400).send({ err: 'Email is wrong' });
  }
  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    res.status(404).send({ err: 'Email is not exist' });
  }
  const token = usePasswordHashToMakeToken(user);
  const url = getPasswordResetURL(user, token);
  const emailTemplate = resetPasswordTemplate(user, url);
  const sendEmail = () => {
    transporter.sendMail(emailTemplate, (err, info) => {
      if (err) {
        res.status(500).send({ err: 'Error sending email' });
      } else {
        console.log(`** Email sent **`, info);
        res.send({ res: 'Sent reset Email' });
      }
    });
  };

  sendEmail();
};
const user_receivepw = (req, res) => {
  const { userId, token } = req.params;
  const { password } = req.body;
  let content = {
    title: 'Bảo mật',
    body: `Mật khẩu của bạn thay đổi thành công.`,
  };
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
          .then(
            (result) => pushNotification(result.pushTokens, content, ''),

            res.status(202).send('Password is changed')
          )
          .catch((err) => res.status(500).send(err));
      }
    })
    // highlight-end
    .catch(() => {
      res.status(404).send({ err: 'Invalid user' });
    });
};

module.exports = {
  user_register,
  user_login,
  user_resetpw,
  user_receivepw,
  user_edit,
  user_photoUpload,
};
