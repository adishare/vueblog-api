const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const TransactionSchema = new Schema({
	user : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'User'
	},
	items : {
		type : Array,
		default : []
	},
	total : Number,
	status : String
},{
	timestamps : true,
	versionKey : false
});

module.exports = mongoose.model('Transaction', TransactionSchema);
