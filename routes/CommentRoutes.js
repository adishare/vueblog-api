const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController.js');
const Auth = require('../middlewares/auth.js')

router.get('/:articleId', CommentController.list)
router.post('/:articleId', Auth.isLogin, CommentController.create);
router.delete('/:id', Auth.isLogin, Auth.isCommentOwner, CommentController.remove);

module.exports = router;
