const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CartSchema = new Schema({

	customer: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	cartItems: {
		type: Array,
		default : []
	},
	total: {
		type : Number,
		default : 0
	},
	status: {
		type : String,
		default : 'active'
	}

}, {
	versionKey: false,
	timestamps: true
});

module.exports = mongoose.model('Cart', CartSchema);