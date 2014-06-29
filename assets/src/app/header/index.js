angular.module( 'sailng.header', [
])

.controller( 'HeaderCtrl', function HeaderController( $scope, $state, config ) {
    $scope.currentUser = config.currentUser;

    var navItems = [
        {title: 'Messages', translationKey: 'navigation:messages', url: '/messages', cssClass: 'fa fa-comments'},
        {title: 'Users', translationKey: 'navigation:users', url:'/users',cssClass: 'fa fa-users'}
    ];

    if (!$scope.currentUser) {
        navItems.push({title: 'Register', translationKey: 'navigation:register', url: '/register', cssClass: 'fa fa-briefcase'});
    }

    navItems.push({title: 'About', translationKey: 'navigation:about', url:'/about',cssClass: 'fa fa-info-circle'});


    $scope.navItems = navItems;
});