const router = require("express").Router();
const UserController = require('../controllers/UserController.js');
const { googleAuth, isLogin } = require('../middlewares/auth');
const { googleSignUp } = require('../controllers/UserController.js');
const media = require('../helpers/media');
const gdrive = require('../helpers/gdrive')

router.post('/register',UserController.register);
router.post('/login',UserController.login);
router.post('/gsignin',googleAuth, googleSignUp);
router.get('/verify', UserController.verify);

router.post('/upload', isLogin, media.multer.single('picturefile'), media.sendUploadToGCS, media.callback );
router.post('/gdrive', isLogin, media.multer.single('picturefile'), gdrive.uploadGDrive );

router.use('/users',isLogin, require('./UserRoutes.js'));
router.use('/articles',require('./ArticleRoutes.js'));
router.use('/comments',require('./CommentRoutes.js'));
router.use('/subscribes',require('./SubscibeRoutes.js'));
router.use('/threads', require('./ThreadRoutes.js'));
router.use('/answers', require('./AnswerRoutes.js'));
router.use('/items', require('./ItemRoutes.js'))
router.use('/carts', require('./CartRoutes.js'))
router.use('/transactions',isLogin, require('./TransactionRoutes.js'))

module.exports = router;
