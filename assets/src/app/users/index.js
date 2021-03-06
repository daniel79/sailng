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
	$scope.users = [];
	$scope.alerts = [];
	$scope.currentUser = config.currentUser;
  

	// Get all Users from Server
	UserModel.getAll($scope).then(function(models) {
		$scope.users = models;
	});

  // Helper function to close the alerts
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };


  // Update User Array when message is received
  $sails.on('user', function (envelope) {
    $log.info('received user message:' + envelope);
    switch(envelope.verb) {
      case 'created':
        $log.info('User created message received.')
        $scope.users.unshift(envelope.data);
        break;
      case 'destroyed':
        ($scope.users, {id: envelope.id});
        $log.info('User destroyed message received.')
        break;
    }
  });

  /** 
   * CRUD for Users
   * 
   */

  // Create User
  $scope.addUser = function () {
    this.editUser({});
  };

  // Edit User
  $scope.editUser = function (user) {
    var modalInstance = $modal.open({
      templateUrl: 'users/modal.tpl.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        modalUser: function () {
            return user;
        }
      }
    });
  
    modalInstance.result.then(
      function (editedUser) {
        $scope.alerts.push({type: 'info', msg:'User added or updated.'});

      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      }
    );
  };

  // Delete a user 
	$scope.deleteUser = function(user) {
		// check here if the current user can do that
		UserModel.delete(user)
		.catch(function(error) {
      // something went wrong
      $log.warning("Error deleting user " + user);
		});
	};


	
})



.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $log, UserModel, modalUser) {
  $scope.eUser=modalUser;
  $scope.alerts = [];
  
  $scope.ok = function () {
    $log.info($scope.eUser);
    // clear Errors
    $scope.alerts = [];
    // First do Client side validation
    
    
    // Try to save
    if ($scope.eUser.id == null) {
      // Create User
      $log.info("Create user:" + $scope.eUser);
      UserModel.create($scope.eUser)
      .then(function () {
        $log.info("Created user:" + $scope.eUser);
        $scope.alerts.push({type: 'info', msg: "Created user:" + $scope.eUser });
        $modalInstance.close($scope.eUser);
      })
      .catch(function() {
        // something went wrong
        $log.waring("Error creating user " + $scope.eUser);
        $scope.alerts.push({type: 'danger', msg: "Error creating user " + $scope.eUser });
      });
    } else {
      // Update User
      $log.info("Update user: " + $scope.eUser);
      UserModel.update($scope.eUser)
      .then(function () {
        $log.info("Updated user:" + $scope.eUser);
        $scope.alerts.push({type: 'info', msg: "Updated user:" + $scope.eUser });
        $modalInstance.close($scope.eUser);
      })
      .catch(function() {
        // something went wrong
        $log.waring("Error updating user " + $scope.eUser);
        $scope.alerts.push({type: 'danger', msg: "Error updating user " + $scope.eUser });
        
      });
    }

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
