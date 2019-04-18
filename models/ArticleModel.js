const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true        
    },
	title: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50
    },
	content: {
        type: String,
        required: true,
        minlength: 20,
    },
    likes: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
    }],
    comments: [{
		type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    viewCount: {
        type: Number,
        default : 0
    },
    img: {
        type: 'String',
        default: ''
    },
},{
    versionKey: false,
    timestamps : true
});

module.exports = mongoose.model('Article', ArticleSchema);