const UserModel = require('../models/UserModel.js')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const ArticleModel = require('../models/ArticleModel.js')
const ThreadModel = require('../models/ThreadModel.js')
const CommentModel = require('../models/CommentModel.js')
const AnswerModel = require('../models/AnswerModel.js')

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(GOOGLE_CLIENT_ID)

module.exports = {

    isLogin(req, res, next) {
        let token = req.headers.token

        if (token) {
            jwt.verify(token, process.env.JWTSECRET, function (err, decoded) {
                if (!err) {
                    UserModel.findOne({
                            _id: decoded._id
                        })
                        .then((user) => {
                            req.user = user
                            next()
                        })
                        .catch((err) => {
                            res.status(500).json({
                                message: `Invalid User Creditial`,
                                error : err
                            })
                        })
                } else {
                    res.status(500).json({
                        message: `Invalid User Creditial`,
                        error : err
                    })
                }
            })
        } else {
            res.status(500).json({
                message: `User Creditial Required g1`
            })
        }

    },

    isArticleAuthor(req, res, next) {
        const articleId = req.params.id

        ArticleModel.findById(articleId)
        .then((article) => {
            if(!article) {
                res.status(404).json({
                    message: `no such article`
                })
            } else if (article.author.toString() != req.user._id) {
                res.status(403).json({
                    message: `You are not athorized for doing this action`
                })
            } else {
                req.article = article
                next()
            }

        }).catch((err) => {
            res.status(500).json({
                error : err,
                message: `Error when getting article`
            })
        });

    },

    isNotArticleAuthor(req, res, next) {
        const articleId = req.params.id

        ArticleModel.findById(articleId)
            .then((article) => {

                if(!article) {
                    res.status(404).json({
                        message: `no such article`
                    })
                } else if (article.author._id.toString() == req.user._id.toString()) {
                    res.status(403).json({
                        message: `You can't do this action`
                    })
                } else {
                    req.article = article
                    next()
                }

            }).catch((err) => {
                res.status(500).json({
                    error : err,
                    message: `Error when getting article`
                })
            });

    },

    isNotThreadAuthor(req, res, next) {
        
        const threadId = req.params.id
        ThreadModel.findById(threadId)
            .then((thread) => {
                if(!thread) {
                    res.status(404).json({
                        message: `no such thread`
                    })
                } else if (thread.author._id.toString() == req.user._id.toString()) {
                    res.status(403).json({
                        message: `You can't do this action`
                    })
                } else {
                    req.thread = thread
                    next()
                }

            }).catch((err) => {
                res.status(500).json({
                    error : err,
                    message: `Error when getting thread`
                })
            });

    },


    isThreadAuthor(req, res, next) {
        const threadId = req.params.id

        ThreadModel.findById(threadId)
        .then((thread) => {
            if(!thread) {
                res.status(404).json({
                    message: `no such thread`
                })
            } else if (thread.author.toString() != req.user._id.toString()) {
                res.status(403).json({
                    message: `You are not athorized for doing this action`
                })
            } else {
                req.thread = thread
                next()
            }

        }).catch((err) => {
            res.status(500).json({
                error : err,
                message: `Error when getting thread`
            })
        });

    },

    isCommentOwner(req, res, next) {
        CommentModel.findById(req.params.id).populate('user')
        .then((result) => {
            if(!result) {
                return res.status(404).json({
                    message: `no such comment`
                })
            } else if (result.user._id.toString() != req.user._id.toString() ) {
                return res.status(403).json({
                    message: `you're not auhtorized for doing this actions`
                })
            } 

            next()

        }).catch((err) => {
            console.log(err);
        });
    },

    isAnswerOwner(req, res, next) {

        AnswerModel.findById(req.params.id)
            .populate('user')
            .then((result) => {
                if(!result) {
                    return res.status(404).json({
                        message: `no such answer`
                    })
                } else if (result.user._id.toString() != req.user._id.toString() ) {
                    return res.status(403).json({
                        message: `you're not auhtorized for doing this actions`
                    })
                } 

                next()

            }).catch((err) => {
                console.log(err);
            });        

    },

    isNotAnswerOwner(req, res, next) {

        AnswerModel.findById(req.params.id)
            .populate('user')
            .then((result) => {
                if(!result) {
                    return res.status(404).json({
                        message: `no such answer`
                    })
                } else if (result.user._id.toString() == req.user._id.toString() ) {
                    return res.status(403).json({
                        message: `you can't do this actions`
                    })
                } 

                next()

            }).catch((err) => {
                console.log(err);
            }); 

    },


    isOwnerOfId(req, res, next) {
        if (req.user.role === 'admin' || req.user._id == req.params.id) {
            next()
        } else {
            res.status(403).json({
              message: `you're not auhtorized for doing this actions`
            })
        }
    },

    isAdmin(req, res, next) {
        
        if (req.user.role === 'admin') {
            next()
        } else {
            res.status(403).json({
              message: `you're not auhtorized for doing this actions`
            })
        }
    },

    isCustomer(req, res, next) {

        if (req.user.role === 'user') {
            next()
        } else {
            res.status(403).json({
              message: `you're not auhtorized for doing this actions`
            })
        }

    },

    googleAuth(req, res, next) {
        let googleToken = req.body.googleToken

        let ticket = new Promise(function (resolve, reject) {
                client.verifyIdToken({
                    idToken: googleToken,
                    audience: GOOGLE_CLIENT_ID
                }, function (err, data) {
                    if (!err) {
                        let payload = data.getPayload()
                        let userid = payload['sub']
                        resolve(userid)
                    } else {
                        reject(err)
                    }
                })
            })
            .then(userid => {
                axios({
                        method: 'GET',
                        url: `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${googleToken}`
                    })
                    .then(result => {
                        req.body.name = result.data.name
                        req.body.email = result.data.email
                        next()
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: `access denied`
                        })
                    })
            })
    }
}