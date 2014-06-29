angular.module( 'sailng.users', [
])

.config(function config( $stateProvider ) {
	$stateProvider.state( 'users', {
		url: '/users',
		views: {
			"main": {
				controller: 'UserCtrl',
				templateUrl: 'users/index.tpl.html'
			}
		}
	});
})


/**
 * User Controller
 * 
 */
.controller( 'UserCtrl', function MessagesController( $scope, $sails, $modal, $log, lodash, config, titleService, UserModel ) {
	titleService.setTitle('Users');
	$scope.newUser = {};
	$scope.users = [];
	$scope.currentUser = config.currentUser;

	UserModel.getAll($scope).then(function(models) {
		$scope.users = models;
	});


	// Update User Array when message is received
	$sails.on('user', function (envelope) {
		switch(envelope.verb) {
			case 'created':
				$scope.users.unshift(envelope.data);
				break;
			case 'destroyed':
				lodash.remove($scope.users, {id: envelope.id});
				break;
		}
	});


  // Delete a user 
	$scope.destroyUser = function(user) {
		// check here if the current user can do that
		if (currentUser.admin) {
			UserModel.delete(user).then(function(model) {
				// user has been deleted, and removed from $scope.users
				// ????
			});
		}
	};

	$scope.createUser = function(newUser) {
		UserModel.create(newUser).then(function(model) {
			$scope.newUser = {};
		});
	};

  $scope.editUser = function (editUser) {
    var modalInstance = $modal.open({
      templateUrl: 'users/modal.tpl.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        userToEdit: function () {
          return editUser;
        }
      }
    });
  
    modalInstance.result.then(
      function (retUser) {
        //$scope.editUser = retUser;
        $log.info(retUser);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      }
    );
  };
	
})

.controller('ModalInstanceCtrl', function ($scope, $modalInstance, userToEdit) {

  $scope.eUser = userToEdit;



  $scope.ok = function () {
    $modalInstance.close($scope.eUser);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
