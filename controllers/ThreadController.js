const ThreadModel = require('../models/ThreadModel.js');
const UserModel = require('../models/UserModel.js')

const ThreadController = {

    list(req, res) {

        ThreadModel.find({})
            .populate('author', '_id email name')
            .populate({ 
                path: 'answers',
                model: 'Answer',
                populate: {
                    path: 'user',
                    model: 'User',
                    select : '_id name email'
                }
            })
            .sort('-createdAt')
            .exec()
            .then((result) => {
                res.json(result);
            }).catch((err) => {
                res.status(500).json({
                    message: 'Error when getting Thread.',
                    error: err
                });
            });

    },

    show(req, res) {

        let id = req.params.id;
        ThreadModel.findById(id)
            .populate('author',' _id email name')
            .populate({ 
                path: 'answers',
                model: 'Answer',
                populate: {
                    path: 'user',
                    model: 'User',
                    select : '_id name email'
                }
            })
            .exec()
            .then((result) => {
                if (!result) {
                    return res.status(404).json({
                        message: 'No such Thread'
                    });
                }
                res.json(result)
            }).catch((err) => {
                res.status(500).json(err);
            });


    },

    create(req, res) {
     
        ThreadModel.create({
            title : req.body.title,
			author : req.user._id.toString(),
			content : req.body.content,
			categories : req.body.categories || 'general'
        })
        .then((result) => {
            res.status(200).json({
                thread : result,
                message : `Success creating new Thread : ${result.title}`
            })
        }).catch((err) => {
            res.status(500).json(err)
        });

    },

    search(req, res) {

        ThreadModel.find({
                $or: [{
                    title: new RegExp(req.body.searchinput, 'i')
                },{
                    categories: new RegExp(req.body.searchinput, 'i')
                }]
            })
            .populate('author answers')
            .sort('-createdAt')
            .exec()
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json(err)
            })

    },

    update(req, res) {

        ThreadModel.findOne({_id: req.params.id}, (err, thread) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting thread',
                    error: err
                });
            }
            if (!thread) {
                return res.status(404).json({
                    message: 'No such thread'
                });
            }

            thread.title = req.body.title ? req.body.title : thread.title;
			thread.content = req.body.content ? req.body.content : thread.content;
			thread.categories = req.body.categories ? req.body.categories : thread.categories;
			
            thread.save((err, thread) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating thread.',
                        error: err
                    });
                }
                return res.json(thread);
            });
        }).populate('author answers').exec()
        
    },

    remove(req, res) {

        ThreadModel.findByIdAndDelete(req.params.id, (err, Thread) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Thread.',
                    error: err
                });
            }
            return res.status(204).json();
        });

    },

    upvote(req, res) {

        let message = ''
        ThreadModel.findById(req.params.id)
            .then((thread) => {
                let index = thread.upVotes.indexOf(req.user._id.toString())
                let inDownVotesIndex = thread.downVotes.indexOf(req.user._id.toString())
                
                if(index == -1){
                    if(inDownVotesIndex != -1) {
                        thread.downVotes.splice(inDownVotesIndex,1)
                    }
                    thread.upVotes.push(req.user._id.toString())
                    message = 'upvoted'
                } else {
                    thread.upVotes.splice(index,1)
                    message = 'upvote canceled'
                }

                return thread.save()

            })
            .then((result) => {
                res.json({
                    result,message
                })
            }).catch((err) => {
                res.status(500).json(err)
            });

    },

    downvote(req, res) {

        let message = ''
        ThreadModel.findById(req.params.id)
            .then((thread) => {
                let index = thread.downVotes.indexOf(req.user._id.toString())
                let inUpVotesIndex = thread.upVotes.indexOf(req.user._id.toString())

                if(index == -1){
                    if(inUpVotesIndex != -1) {
                        thread.upVotes.splice(inUpVotesIndex,1)
                    }
                    thread.downVotes.push(req.user._id.toString())
                    message = 'downvoted'
                } else {
                    thread.downVotes.splice(index,1)
                    message = 'downvote canceled'
                }

                return thread.save()

            })
            .then((result) => {
                res.json({
                    result,message
                })
            }).catch((err) => {
                res.status(500).json(err)
            });

    },

    updateViewer(req, res) {

        ThreadModel.findByIdAndUpdate(req.params.id, {
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

module.exports = ThreadController