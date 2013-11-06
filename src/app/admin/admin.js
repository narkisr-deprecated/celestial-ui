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
.factory('usersService', function($cookieStore ,$cookies, $location, $resource, $window, $q) {
   var usersService = {};
   var Users = $resource('/users/',{},{
    getAll: {method : "GET",url:'/users/',isArray:true}
   });
   
   usersService.grabUsers = function() {
      return Users.getAll({}).$promise;
   }; 

   return usersService;
})
.controller( 'AdminCtrl', function AdminController($scope, $resource, $http){});

