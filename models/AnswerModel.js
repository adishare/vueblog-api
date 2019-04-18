const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

let AnswerSchema = new Schema({
    thread : {
        type: Schema.Types.ObjectId,
        ref: 'Thread'
    },
	user : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'User'
    },
    answer : String, 
	upVotes: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	downVotes: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
}, {
	timestamps : true,
	versionKey : false
});

module.exports = mongoose.model('Answer', AnswerSchema);
