const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController.js');
const Auth = require('../middlewares/auth.js')

// baseUrl/users , isLogin -------------- //

router.get('/:id', Auth.isOwnerOfId, UserController.findOneById)
router.put('/:id', UserController.update);
router.delete('/:id', Auth.isOwnerOfId, UserController.remove);

module.exports = router;
