const mongoose = require('mongoose');


mongoose.Promise = global.Promise;

var userAcctSchema = new mongoose.Schema(
	{

		userID	: {type:String, unique: true},
		bal		: Number,
		updatedAt: Date,
		createdAt: {type: Date, default: Date.now()}

	}
);

module.exports = mongoose.model('useracct', userAcctSchema);