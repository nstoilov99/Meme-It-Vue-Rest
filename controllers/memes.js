const models = require('../models');

module.exports = {
  get: (req, res, next) => {
    const limit = +req.query.limit;
    const { id } = req.params;

    if (limit) {
      models.Memes.find().populate('author').sort({ _id: -1 }).limit(limit)
        .then((memes) => res.send(memes))
        .catch(next);
      return;
    }
    models.Memes.find(id ? { _id: id } : {}).populate('author')
      .then((memes) => res.send(memes))
      .catch(next);
  },

  post: (req, res, next) => {
    const { memeTitle, likes, imageUrl } = req.body;
    const { _id } = req.user;

    models.Memes.create({ author: _id, memeTitle, likes, imageUrl })
      .then((createdMeme) => {
        return Promise.all([
          models.User.updateOne({ _id }, { $push: { memes: createdMeme } }),
          models.Memes.findOne({ _id: createdMeme._id })
        ]);
      })
      .then(([modifiedObj, memeObj]) => {
        res.send(memeObj);
      })
      .catch(next);
  },

  put: (req, res, next) => {
    const id = req.params.id;

    const { comment } = req.body;
    console.log(comment);
    
    models.Memes.updateOne({ _id: id }, { $push: { comments: comment } })
      .then((comment) => {
        res.send(comment);
      })
      .catch(next)
  },

  delete: (req, res, next) => {
    const id = req.params.id;
    models.Memes.deleteOne({ _id: id })
      .then((removedMeme) => res.send(removedMeme))
      .catch(next)
  }
};