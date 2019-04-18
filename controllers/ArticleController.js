const ArticleModel = require('../models/ArticleModel.js');

const ArticleController = {


    list(req, res) {

        ArticleModel.find()
            .populate('author')
            .populate({ 
                path: 'comments',
                model: 'Comment',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
            .sort('-updatedAt')
            .exec()
            .then((articles) => {
                res.json(articles);
            }).catch((err) => {
                res.status(500).json({
                    message: 'Error when getting Articles.',
                    error: err
                });
            });
            
    },

    show(req, res) {
        
        const id = req.params.id;
        ArticleModel.findById(id)
            .populate('author')
            .populate({ 
                path: 'comments',
                model: 'Comment',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
            .exec()
            .then((article) => {
                if (!article) {
                    return res.status(404).json({
                        message: 'No such article'
                    });
                }
                return res.json(article);
            }).catch((err) => {
                res.status(500).json({
                    message: 'Error when getting article.',
                    error: err
                });
            });
            
    },

    create(req, res) {

        const article = new ArticleModel({
            title: req.body.title,
            content: req.body.content,
            author: req.user._id, 
            comments: []

        });

        article.save((err, article) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating article',
                    error: err
                });
            }
            return res.status(201).json(article);
        });

    },

    search(req, res) {

        ArticleModel.find({
                $or: [{
                    title: new RegExp(req.body.searchinput, 'i')
                }, ]
            })
            .populate('author').sort('-createdAt').exec()
            .then(data => {
                res.status(200).json(data)
            })
            .catch(err => {
                res.status(500).json({
                    error: err.message
                })
            })

    },

    update(req, res) {

        ArticleModel.findByIdAndUpdate(req.params.id, {
                title: req.body.title ? req.body.title : undefined ,
                content: req.body.content ? req.body.content : undefined ,
            }, {
                new : true
            })
            .then((result) => {
                res.status(200).json({
                    message : `Article id ${result._id} Updated`
                })
            }).catch((err) => {
                res.status(500).json({
                    message: 'Update Failed',
                    error: err
                })
            });

    },

    remove(req, res) {

        const id = req.params.id;
        ArticleModel.findByIdAndRemove(id)
        .then(() => {
            res.status(204).json({
                message : 'Delete Article Success'
            })
        }).catch((err) => {
            res.status(500).json({
                message: 'Error when deleting the Article.',
                error: err
            });
        });

    },

    like(req,res) {

        let user = req.user
        let article = req.article
        
        let index = article.likes.indexOf(user._id.toString())
        let message = ''
        
        if(index == -1){
            article.likes.push(user._id.toString())
            message = 'liked'
        } else {
            article.likes.splice(index,1)
            message = 'unliked'
        }

        article.save()
        .then((result) => {
            res.json({
                result,
                message
            })
        }).catch((err) => {
            res.json(err)
        });

    },

    updateViewer(req, res) {

        ArticleModel.findByIdAndUpdate(req.params.id, {
            $inc : {
                viewCount : 1
            }
        })
        .exec()
        .then(() => {
            res.status(200).json({})
        }).catch((err) => {
            console.log(err);
        });

    }


};

module.exports = ArticleController