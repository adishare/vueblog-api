// const CronJob = require('cron').CronJob;
// const ThreadModel = require('../models/ThreadModel.js')
// const kue = require('kue')
// const queue = kue.createQueue()
// const clientBaseUrl = 'https://h8overfly.firebaseapp.com'
// const sendEmail = require('./nodeMailer.js').sendEmail

// queue.process('reportMonthly', function(job, done){
//     sendEmail(job.data.to, job.data.subject, job.data.content)
//     .then((result) => {
//         console.log(result);
//         done()
//     }).catch((err) => {
//         console.log(err);
//     });
// });


// module.exports = {

//     monthlyReport() {

//         new CronJob('0 7 1 * *', function() {
//             ThreadModel.find({
//                 status : 'open'
//             })
//             .populate('author', '_id name email')
//             .exec()
//             .then((result) => {
                
//                 result.forEach(thread => {
//                     let newKue = queue.create('reportMonthly', {
//                         to : thread.author.email,
//                         subject : 'H8ike Community Thread Monthly Report' ,
//                         content : `
//                         <p>Your Thread "${thread.title}" have ${thread.answers.length} answers, let Check and Close Thread if Solved. <br>
//                             visit ${clientBaseUrl}/threads/${thread._id}
//                         </p>`,
//                     })
//                     .priority('low').save( function(err){
//                         if( !err ) console.log( newKue.id )
//                         else console.log(err)
//                     });

//                 })

//             }).catch((err) => {
//                 console.log(err);
//             });

//         }, null, true, 'Asia/Jakarta');
//     }

// }
