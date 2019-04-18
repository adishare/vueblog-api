const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const ThreadSchema = new Schema({
	title: {
		type: String,
		required: true,
		unique: true,
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	content: {
		type: String,
		required: true
	},
	answers: [{
		type: Schema.Types.ObjectId,
		ref: 'Answer'
	}],
	upVotes: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	downVotes: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	status: {
		type: String,
		required: true,
		default: 'open'
	},
	viewCount: {
        type: Number,
        default : 0
    },
	categories: {
        type: Array,
        default : []
    }
}, {
	versionKey: false,
	timestamps: true
});

ThreadSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Thread', ThreadSchema);