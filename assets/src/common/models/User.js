angular.module('models.user', ['lodash', 'services', 'ngSails',])

.service('UserModel', function($q, lodash, utils, $sails) {
	var baseModelURL = 'user';
	
	this.getAll = function() {
		var deferred = $q.defer();
		var url = utils.prepareUrl(baseModelURL);

		$sails.get(url, function(models) {
			return deferred.resolve(models);
		});

		return deferred.promise;
	};

	this.getOne = function(id) {
		var deferred = $q.defer();
		var url = utils.prepareUrl(baseModelURL+ '/' + id);

		$sails.get(url, function(model) {
			return deferred.resolve(model);
		});

		return deferred.promise;
	};

	this.create = function(newModel) {
		var deferred = $q.defer();
		var url = utils.prepareUrl(baseModelURL);

		$sails.post(url, newModel, function(model) {
			return deferred.resolve(model);
		});

		return deferred.promise;
	};
	
	this.delete = function(model) {
		var deferred = $q.defer();
		var url = utils.prepareUrl(baseModelURL + '/' + model.id);

		$sails.delete(url, function(model) {
			return deferred.resolve(model);
		});

		return deferred.promise;
	};

	this.update =  function(changedModel) {
		var deferred = $q.defer();
		var url = utils.prepareUrl(baseModelURL + '/' + changedModel.id);

		$sails.put(url, changedModel,  function(model) {
			return deferred.resolve(model);
		});

		return deferred.promise;
	};
	
  this.checkHandle = function(handle) {
    var deferred = $q.defer();
    var url = utils.prepareUrl(baseModelURL + '/checkHandle');
    $sails.post(url, {handle: handle}, function(exists) {
      return deferred.resolve(exists);
    });
    return deferred.promise;
  
	}
	
	
});