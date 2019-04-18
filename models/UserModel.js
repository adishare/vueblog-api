const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')

const UserSchema = new Schema({
	name: {
		type: String,
		required: [true, "Name Required"],
		trim: true,
		minlength : 5
	},
	email: {
		type: String,
		unique: true,
		trim: true,
		required: [true, "Email Required"],
	},
	password: {
		type: String,
		required: [true, "Password Required"]
	},
	avatar: {
		type: String,
		default : ''
	},
	subscribers : [{
        type: Schema.Types.ObjectId,
        ref: 'User',
	}],
	role: {
		type: String,
		default: 'user'
	},
}, {
	timestamps: true,
	versionKey: false
});

UserSchema.path('email').validate(function (email) {
	let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return emailRegex.test(email); // Assuming email has a text attribute
}, 'Please input valid Email')

UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' })

module.exports = mongoose.model('User', UserSchema);