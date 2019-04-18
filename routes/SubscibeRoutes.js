const express = require('express');
const router = express.Router();
const SubscribeController = require('../controllers/SubscribeController.js')

router.post('/', SubscribeController.create)
router.get('/', SubscribeController.list)
router.post('/notify', SubscribeController.sendEmailtoSubscribers)

module.exports = router;
