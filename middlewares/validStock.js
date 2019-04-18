const ItemModel = require('../models/ItemModel.js.js')

module.exports = {

    isValidStock(req, res, next) {

        let itemsToCheckout = req.body.items
        let validError = [];
        
        let checks = [];
        itemsToCheckout.forEach(function (itemToCheckout) {
            let updatePromise = ItemModel.findById(itemToCheckout._id, (err , itemInDatabase) => {
                if(itemInDatabase.stock < itemToCheckout.quantity){
                    validError.push(itemInDatabase.name)
                }
            })
            checks.push(updatePromise);
        });

        Promise.all(checks)
        .then( results => {
            if(validError.length > 0) {
                return res.status(400).json({
                    message : `your checkout for items : ${ validError.join(', ') } , doesn't support for request quantity , please check availability`
                })
            }

            return next()
        });


    }

}