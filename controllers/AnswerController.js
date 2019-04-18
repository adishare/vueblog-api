const AnswerModel = require('../models/AnswerModel.js.js');
const ThreadModel = require('../models/ThreadModel.js.js');

module.exports = {

    list(req, res) {

        AnswerModel.find({
                thread : req.params.threadId
            })
            .populate('user', 'avatar name _id email')
            .then((result) => {
                return res.json(result);
            }).catch((err) => {
                return res.status(500).json({
                    message: 'Error when getting Answer.',
                    error: err
                });
            });

    },

    create(req, res) {

        let newAnswer = {
			thread : req.params.threadId,
			user : req.user._id,
			answer : req.body.answer
        }

        AnswerModel.create(newAnswer)
        
            .then((result) => {
                return ThreadModel.findByIdAndUpdate(result.thread, { 
                    $push: { 
                        answers : result._id 
                    }
                },{ 
                    new: true 
                })
                .populate({ 
                    path: 'answers',
                    model: 'Answer',
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
                    message: 'Error when Creating Answer.',
                    error: err
                });       
            });

        
    },

    update(req, res) {

        AnswerModel.findByIdAndUpdate(req.params.id, {
            answer : req.body.answer
        },{
            new : true
        })
        .populate('user', 'name _id email avatar')
        .exec()
        .then((result) => {
            res.json({
                result,
                message : `Answer id ${result._id} Updated`
            })
        }).catch((err) => {
            res.status(500).json({
                message : 'Error when updating answer',
                error : err
            })
        });

    },

    upvote(req, res) {

        let message = ''
        AnswerModel.findById(req.params.id)
            .then((answer) => {
                let index = answer.upVotes.indexOf(req.user._id.toString())
                let inDownVotesIndex = answer.downVotes.indexOf(req.user._id.toString())
                if(index == -1){
                    if(inDownVotesIndex != -1) {
                        answer.downVotes.splice(inDownVotesIndex,1)
                    }
                    answer.upVotes.push(req.user._id.toString())
                    message = 'upvoted'
                } else {
                    answer.upVotes.splice(index,1)
                    message = 'upvote canceled'
                }

                return answer.save()

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
        AnswerModel.findById(req.params.id)
            .then((answer) => {
                let index = answer.downVotes.indexOf(req.user._id.toString())
                let inUpVotesIndex = answer.upVotes.indexOf(req.user._id.toString())

                if(index == -1){
                    if(inUpVotesIndex != -1) {
                        answer.upVotes.splice(inUpVotesIndex,1)
                    }
                    answer.downVotes.push(req.user._id.toString())
                    message = 'downvoted'
                } else {
                    answer.downVotes.splice(index,1)
                    message = 'downvote canceled'
                }

                return answer.save()

            })
            .then((result) => {
                res.json({
                    result,message
                })
            }).catch((err) => {
                res.status(500).json(err)
            });

    },

};
