const SubscribeModel = require('../models/SubscribeMode.js')
nodeMailer = require('../helpers/nodeMailer.js')

module.exports = {

    create(req, res) {

        SubscribeModel.create({
            user : req.body.user,
            email : req.body.email
        })
        .then((result) => {
            res.status(201).json({
                message : 'Subsribe H8ike blog success',
                data: result
            })
        }).catch((err) => {
            res.status(500).json({
                message : 'Subsciption failed',
                err
            })
        });

    },

    list(req, res) {

        SubscribeModel.find({}).populate('user')
        .then((result) => {
            res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json({err})
        });
    },

    sendEmailtoSubscribers(req, res) {

        let article = req.body.article
        let content = req.body.content

        SubscribeModel.find({}).populate('user')
        .then((subscribers) => {
            let emails = []

            subscribers.forEach(subscriber => {
                if(emails.indexOf(subscriber.email) == -1) {
                    emails.push(subscriber.email)
                }
            })

            emails.join(',')

            return nodeMailer.sendEmail(emails,`New Article Posted`,content)

        })
        .then((result) => {
            res.status(200).json({
                data : result
            })
        }).catch((err) => {
            res.status(500).json({err})
        });

    }

}