const CartModel = require('../models/CartModel.js.js');

module.exports = {

    list(req, res) {

        CartModel.find()
        .then((result) => {
            res.json(result)
        }).catch((err) => {
            res.status(500).json({
                message: 'Error when getting Carts.',
                error: err
            });
        });

    },

    getCartByUserId(req, res) {

        CartModel.findOne({
            customer : req.params.userId,
            status : 'active'
        })
        .then((cart) => {
            if (!cart) {
                return res.status(404).json({
                    message: 'No such Cart'
                });
            } else {
                res.json(cart);
            }
        }).catch((err) => {
            res.status(500).json({
                message: 'Error when getting Cart.',
                error: err
            });
        });

    },

    show(req, res) {
        
        const id = req.params.id;        
        CartModel.findById(id)
        .then((Cart) => {
            if (!cart) {
                return res.status(404).json({
                    message: 'No such cart'
                });
            } else {
                res.json(cart);
            }
        }).catch((err) => {
            res.status(500).json({
                message: 'Error when getting Cart.',
                error: err
            });
        });

    },

    create(req, res) {

        CartModel.create({
            customer : req.body.customer,
			cartItems : req.body.cartItems,
			total : req.body.total,
			status : req.body.status
        })
        .then((cart) => {
            res.status(201).json(cart);
        }).catch((err) => {
            res.status(500).json({
                message: 'Error when creating Cart',
                error: err
            });
        });

    },

    update(req, res) {

        CartModel.findById(req.params.id)
        .then((cart) => {
            if (!cart) {
                return res.status(404).json({
                    message: 'No such cart'
                });
            }
            
            cart.cartItems = req.body.cartItems || cart.cartItems 
            cart.total = req.body.total !== null ? req.body.total : cart.total  
            cart.status = req.body.status || cart.status

            return cart.save()

        })
        .then((cart) => {
            res.json(cart)
        }).catch((err) => {
            res.status(500).json({
                message: 'Error when updating Cart',
                error: err
            });
        });

    }

    
};
