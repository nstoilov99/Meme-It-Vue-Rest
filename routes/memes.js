const controllers = require('../controllers/');
const router = require('express').Router();
const { auth } = require('../utils');

router.get('/', controllers.memes.get);

router.get('/:id', controllers.memes.get);

router.post('/', auth(), controllers.memes.post);

router.put('/detail/:id', auth(), controllers.memes.put);

router.delete('/:id', auth(), controllers.memes.delete);

module.exports = router;