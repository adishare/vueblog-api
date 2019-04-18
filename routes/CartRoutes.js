const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController.js');
const isAdmin = require('../middlewares/auth.js').isAdmin

router.get('/', isAdmin, CartController.list)
router.get('/:userId', CartController.getCartByUserId)
router.get('/:id', CartController.show);
router.put('/:id', CartController.update);
router.post('/', CartController.create);

module.exports = router;
