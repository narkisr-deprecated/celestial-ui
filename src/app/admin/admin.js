angular.module( 'celestial.admin', [
   'celestial.users'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'admin', {
    url: '/admin',
    views: {
	"main": {
        controller: 'AdminCtrl',
        templateUrl: 'admin/admin.tpl.html'
	}
    },
    data:{ pageTitle: 'Admin' }
  });
})
.controller( 'AdminCtrl', function AdminController($scope, $resource, $http) { });

