const models = require('../models');
const config = require('../config/config');
const utils = require('../utils');
const Bcrypt = require("bcryptjs");

module.exports = {
  get: (req, res, next) => {
    const { id } = req.params;

    models.User.find(id ? { _id: id } : {}).populate('memes')
      .then((memes) => res.send(memes))
      .catch(next);
  },

  post: {
    register: (req, res, next) => {
      const { email, password } = req.body;
      console.log(req.body);
      models.User.create({ email, password })
        .then((createdUser) => res.send(createdUser))
        .catch(next)
    },

    login: (req, res, next) => {
      const { email, password } = req.body;

      models.User.findOne({ email })
        .then((user) => !!user ? Promise.all([user, user.matchPassword(password)]) : [null, false])
        .then(([user, match]) => {
          if (!match) {
            res.status(401).send('Invalid username or password');
            return;
          }

          const token = utils.jwt.createToken({ id: user._id });
          
          res.cookie(config.authCookieName, token).send(user);
          
        })
        .catch(next);
    },

    logout: (req, res, next) => {
      const token = req.cookies[config.authCookieName];
      console.log('-'.repeat(100));
      console.log(token);
      console.log('-'.repeat(100));
      models.TokenBlacklist.create({ token })
        .then(() => {
          res.clearCookie(config.authCookieName).send({ logoutSuccess: true });
        })
        .catch(next);
    }
  },

  put: (req, res, next) => {
    const id = req.params.id;
    const { email} = req.body;
    let password = req.body.password;
    password = Bcrypt.hashSync(password, 10);

    models.User.update({ _id: id }, { email, password })
      .then((updatedUser) => res.send(updatedUser))
      .catch(next)
  },

  delete: (req, res, next) => {
    const id = req.params.id;
    models.User.deleteOne({ _id: id })
      .then((removedUser) => res.send(removedUser))
      .catch(next)
  }
};
