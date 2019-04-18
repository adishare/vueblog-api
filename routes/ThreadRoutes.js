const express = require('express');
const router = express.Router();
const ThreadController = require('../controllers/ThreadController.js');
const auth = require('../middlewares/auth.js')

router.post('/', auth.isLogin, ThreadController.create);
router.get('/', ThreadController.list);
router.get('/:id', ThreadController.show);
router.put('/:id', auth.isLogin, auth.isThreadAuthor, ThreadController.update);
router.delete('/:id', auth.isLogin, auth.isThreadAuthor, ThreadController.remove);
router.post('/search', ThreadController.search);
router.post('/upvotes/:id', auth.isLogin, auth.isNotThreadAuthor, ThreadController.upvote);
router.post('/downvotes/:id', auth.isLogin, auth.isNotThreadAuthor, ThreadController.downvote);
router.get('/updateViewer/:id', ThreadController.updateViewer);

module.exports = router;
