/**
 * Server Side
 * User-Controller
 * 
 */

module.exports = {
	getAll: function(req, res) {
		User.getAll()
		.spread(function(models) {    //.then should also be possible ??? Or not ???
			res.json(models);
		})
		.fail(function(err) {
			
			// An error occured
		});
	},

	getOne: function(req, res) {
		User.getOne(req.param('id'))
		.spread(function(model) {
			res.json(model);
		})
		.fail(function(err) {
			// res.send(404);
		});
	},

	create: function (req, res) {
		var model = {
			username: req.param('username'),
			email: req.param('email'),
			first_name: req.param('first_name'),
			handle: req.param('handle')
		};

		User.create(model)
		.exec(function(err, model) {
			if (err) {
				return res.serverError(err);
			}
			else {
				User.publishCreate(model.toJSON());
				res.json(model);
			}
		});
	}, 
	
	delete: function (req, res) {
		var id = req.param('id');
		if (!id) {
			return res.badRequest('No id provided.');
		}
		// Otherwise, find and destroy the model in question
		User.findOne(id).exec(function(err, model) {
			if (err) {
				return res.serverError(err);
			}
			if (!model) {
				return res.notFound();
			}
			User.delete(id, function(err) {
				if (err) {
					return res.serverError(err);
				}

				User.publishDestroy(model.id);
				return res.json(model);
			});
		});
	},

	update: function (req, res) {
		var id = req.param('id');
		if (!id) {
			return res.badRequest('No id provided.');
		}
		// Otherwise, find and update the model in question
		User.findOne(id).exec(function(err, model) {
			if (err) {
				return res.serverError(err);
			}
			if (!model) {
				return res.notFound();
			}
			User.destroy(id, function(err) {
				if (err) {
					return res.serverError(err);
				}

				User.publishDestroy(model.id);
				return res.json(model);
			});
		});
	}


};