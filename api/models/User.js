var bcrypt = require('bcrypt');

module.exports = {
	attributes: {
		username: {
			type: 'string',
			required: true,
			unique: true
		},
		email: {
			type: 'email',
			required: true,
			unique: true
		},
		handle: {
			type: 'string',
			required: true
		},
		message_count: {
			type: 'number'
		},
		// A User can have many messages
		messages: {
			collection: 'message',
			via: 'user'
		},
		passports : { collection: 'Passport', via: 'user' }
	},

	getAll: function() {
		// Return all Users as a Promise in an array
		return User.find()
		.then(function (models) {
			return [models];
		});
	},

	getOne: function(id) {
		// Return one User as a Promise in an array
		return User.findOne(id)
		.then(function (model) {
			return [model];
		});
	}
};