const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const SubscribeSchema = new Schema({
    user : {
        type: Schema.Types.ObjectId,
	 	ref: 'User'
    },
    email: {
		type: String,
		unique: true,
		trim: true,
		required: [true, "Email Required"]
	},
});

module.exports = mongoose.model('Subscribe', SubscribeSchema);
