const router = require('express').Router()
const ItemController = require('../controllers/ItemController.js')
const { isAdmin,isLogin } = require('../middlewares/auth.js')

router.get('/', ItemController.list)
router.post('/', isLogin, isAdmin, ItemController.create)
router.get('/:id', ItemController.show)
router.put('/:id', isLogin, isAdmin, ItemController.update)
router.delete('/:id', isLogin, isAdmin, ItemController.remove)
router.post('/search', ItemController.search)

module.exports = router