const CommentModel = require('../models/CommentModel.js');
const ArticleModel = require('../models/ArticleModel.js');

module.exports = {

    list(req, res) {

        CommentModel.find({
                article : req.params.articleId
            })
            .populate('user', 'avatar name _id email')
            .then((result) => {
                return res.json(result);
            }).catch((err) => {
                return res.status(500).json({
                    message: 'Error when getting Comment.',
                    error: err
                });
            });

    },

    create(req, res) {

        let newComment = {
			user : req.user._id,
			article : req.params.articleId,
			comment : req.body.comment
        }

        CommentModel.create(newComment)
        
            .then((result) => {
                return ArticleModel.findByIdAndUpdate(result.article, { 
                    $push: { 
                        comments : result._id 
                    }
                },{ 
                    new: true 
                })
                .populate({ 
                    path: 'comments',
                    model: 'Comment',
                    populate: {
                        path: 'user',
                        model: 'User'
                    }
                })
            })
            .then((result) => {
                res.json(result)
            }).catch((err) => {
                res.status(500).json({
                    message: 'Error when Creating Comment.',
                    error: err
                });       
            });

        
    },

    remove(req, res) {

        let id = req.params.id;
        CommentModel.findByIdAndRemove(id)
        .then((deletedComment) => {
            deletedCommentId = deletedComment._id
            return ArticleModel.findById(deletedComment.article.toString())
                .populate('author')
                .populate({ 
                    path: 'comments',
                    model: 'Comment',
                    populate: {
                        path: 'user',
                        model: 'User'
                    }
                })
        })
        .then((article) => {
            res.json({
                article,
                message : `commentId ${deletedCommentId} deleted`
            })
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Error when deleting the Comment.',
                error: err
            });
        });
       
    }


};
