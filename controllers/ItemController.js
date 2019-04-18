const ItemModel = require('../models/ItemModel.js')

module.exports = ItemController = {

    list(req, res) {

        ItemModel.find()
        .select('_id name description price img stock categories updatedAt')
        .sort('-updatedAt')
        .then((items) => {
            res.json(items)
        }).catch((err) => {
            res.status(500).json({
                message: 'Error when getting Items.',
                error: err
            });
        });

    },

    create(req, res) {

        ItemModel.create({
            name : req.body.name,
            img : req.body.img,
            description : req.body.description,
            price : req.body.price,
            stock : req.body.stock,
            categories : req.body.categories
        })
        .then((item) => {
            res.status(201).json({
                message : 'add Item success',
                data : item
            })
        }).catch((err) => {
            res.status(500).json({
                message: 'Error when creating Item',
                error: err
            });
        });

    },

    search(req, res) {
        let optionKey = req.body.optionKey
        let optionValue = req.body.optionValue
        let option = {}
        
        if(optionKey == 'categories'){
            option[optionKey] = {"$in" : [optionValue] }
        } else if(optionKey == 'price') {
            option[optionKey] =  { '$lt' : optionValue + 1 }
        }else if(optionKey && optionValue) {
            option[optionKey] =  new RegExp(optionValue, 'i')
        }

        let sortBy = '-updatedAt'

        if(req.body.sortBy && !req.body.desc){
            sortBy = req.body.sortBy
        } else if (req.body.sortBy && req.body.desc) {
            sortBy = `-${req.body.sortBy}`
        }

        ItemModel.find(option)
        .sort(sortBy)
        .then((items) => {
            res.json(items)
        }).catch((err) => {
            res.status(500).json({
                message: 'Error when getting Items.',
                error: err
            });
        });

    },

    show(req, res) {

        let itemId = req.params.id
        ItemModel.findById(itemId)
        .then((item) => {
            res.json(item)
        }).catch((err) => {
            res.status(500).json({
                message: 'Error when getting Item.',
                error: err
            });
        });

    },

    update(req, res) {
        let itemId = req.params.id
        
        ItemModel.findById(itemId)
        .then((item) => {
            
            return ItemModel.findOneAndUpdate({
                _id : item._id
            },{
                name : req.body.name ? req.body.name : item.name,
                img : req.body.img ? req.body.img : item.img,
                description : req.body.description ? req.body.description : item.description,
                price : req.body.price ? req.body.price : item.price,
                stock : req.body.stock ? req.body.stock : item.stock,
                categories : req.body.categories ? req.body.categories : item.categories,
            }, {
                new : true
            })

        })
        .then((result) => {
            res.json({
                message : 'update item succes',
                data : result
            })
        }).catch((err) => {
            res.status(500).json({
                message: 'Error when updating Item.',
                error: err
            })
        });

    },

    remove(req, res) {

        ItemModel.findByIdAndDelete(req.params.id.toString())
        .then((result) => {
            res.json({
                message : 'delete item succes',
                data : result
            })
        }).catch((err) => {
            res.status(500).json({
                message: 'Error when deleting Item.',
                error: err
            })
        });

    }



}