module.exports = {
	index: function(req, res) {
		var navItems = [
			{url: '/messages', cssClass: 'fa fa-comments', title: 'Messages'},
			{url: '/about', cssClass: 'fa fa-infoc-circle', title: 'About'},
			{url: '/users', cssClass: 'fa fa-users', title:'Users'}
		];

		if (req.isAuthenticated()) {
			navItems.push({url: '/logout', cssClass: 'fa fa-comments', title: 'Logout'});
		}
		else {
			navItems.push({url: '/register', cssClass: 'fa fa-briefcase', title: 'Register'});
			navItems.push({url: '/login', cssClass: 'fa fa-comments', title: 'Login'});
		}

		res.view({
			title: 'Home',
			navItems: navItems,
			currentUser: req.user
		});
		console.log("Homepage delivered");
	}
};