// var redis = require("redis"),
//     client = redis.createClient();

 
// client.on("error", function (err) {
//     console.log("Error " + err);
// });
 
// client.set("string key", "string val", redis.print);
// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.hkeys("hash key", function (err, replies) {
//     console.log(replies.length + " replies:");
//     replies.forEach(function (reply, i) {
//         console.log("    " + i + ": " + reply);
//     });
//     client.quit();
// });

// var kue = require('kue')
// let queue = kue.createQueue();

// var job = queue.create('email', {
//     title: 'welcome email for tj',
//     to: 'tj@learnboost.com',
//     template: 'welcome-email'
// }).save(function (err) {
//     if (!err) console.log(job.id);
// });


// queue.process('email', function (job, done) {
//     console.log(job.data);
//     done()
// });

// kue.app.listen(3000)