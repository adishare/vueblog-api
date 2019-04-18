const express = require('express');
const router = express.Router();
const AnswerController = require('../controllers/AnswerController.js');
const Auth = require('../middlewares/auth.js')

router.get('/:threadId', AnswerController.list);
router.post('/:threadId', Auth.isLogin, AnswerController.create);
router.put('/:id', Auth.isLogin, Auth.isAnswerOwner, AnswerController.update);
router.post('/upvotes/:id', Auth.isLogin, Auth.isNotAnswerOwner, AnswerController.upvote)
router.post('/downvotes/:id', Auth.isLogin, Auth.isNotAnswerOwner, AnswerController.downvote)

module.exports = router;
