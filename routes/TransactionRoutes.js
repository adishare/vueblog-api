const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController.js');
const isValidStock = require('../middlewares/validStock.js').isValidStock
const { isAdmin, isCustomer } = require('../middlewares/auth.js')

router.post('/', isCustomer, isValidStock, TransactionController.create);
router.get('/', TransactionController.show);
router.post('/report', isAdmin, TransactionController.report)


module.exports = router;
