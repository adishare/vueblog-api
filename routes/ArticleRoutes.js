const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/ArticleController.js');
const Auth = require('../middlewares/auth.js')

// /articles
router.post('/', Auth.isLogin, ArticleController.create);
router.get('/', ArticleController.list);
router.get('/:id', ArticleController.show);
router.put('/:id', Auth.isLogin, Auth.isArticleAuthor, ArticleController.update);
router.delete('/:id', Auth.isLogin, Auth.isArticleAuthor, ArticleController.remove);
router.post('/likes/:id', Auth.isLogin, Auth.isNotArticleAuthor, ArticleController.like);
router.get('/updateViewer/:id', ArticleController.updateViewer);
router.post('/search', ArticleController.search);


module.exports = router;