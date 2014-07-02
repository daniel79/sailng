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
  

	UserModel.getAll($scope).then(function(models) {
		$scope.users = models;
	});


  $scope.addAlert = function() {
    $scope.alerts.push({msg: 'Another alert!'});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };


// Update User Array when message is received
  $sails.on('user', function (envelope) {
    switch(envelope.verb) {
      case 'created':
        $scope.users.unshift(envelope.data);
        break;
      case 'destroyed':
        ($scope.users, {id: envelope.id});
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
      resove: {
        modalUser: user
      }
    });
  
    modalInstance.result.then(
      function (editedUser) {


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
		});
	};


	
})



.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $log) {
  $scope.eUser={};
  $scope.alerts = [];
  
  $scope.ok = function () {
    $log.info(eUser);
    // clear Errors
    alerts = [];
    // First do Client side validation
    
    
    // Try to save
    if (eUser.id == null) {
      // Create User
      UserModel.create(eUser)
      .then(function () {
        $log.info("Create user:" + eUser);
        $scope.alerts.push({type: 'info', msg: "Create user:" + eUser })
      })
      .catch(function() {
        // something went wrong
        $log.waring("Error creating user " + eUser);
        $scope.alerts.push({type: 'danger', msg: "Error creating user " + eUser })
        
      });
    } else {
      // Update User
      $log.info("Update user: " + eUser);
      UserModel.update(eUser)
      .then(function () {
        $log.info("Updated user:" + eUser);
        $scope.alerts.push({type: 'info', msg: "Updated user:" + eUser })
      })
      .catch(function() {
        // something went wrong
        $log.waring("Error updating user " + eUser);
        $scope.alerts.push({type: 'danger', msg: "Error updating user " + eUser })
        
      });
    }

    $modalInstance.close($scope.eUser);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
