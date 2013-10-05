angular.module( 'celestial.users', [
])
.config(function config($stateProvider) {
  $stateProvider.state( 'users', {
    url: '/admin/users',
    views: {
	"main": {
        controller: 'UsersCtrl',
        templateUrl: 'admin/users/users.tpl.html'
	}
    },
    data:{ pageTitle: 'Users' }
  });
})
.controller( 'UsersCtrl', function UsersController($scope, $resource, $http) {
  $scope.perPage = 10;
  $scope.data = {};
   
  var Users = $resource('/users/',{},{
    getAll: {method : "GET",url:'/users/',isArray:true}
  });

  $scope.load = function(){
    Users.getAll({}).$promise.then(function(users){
     $scope.data.users= users;
     $scope.currentPage = 1;
     $scope.count = $scope.data.users.length;
    });
  };

  $scope.load();

  $scope.setPage = function () {
    var from = ($scope.currentPage -  1) * $scope.perPage;
    var to = $scope.currentPage  * $scope.perPage;
    if($scope.data.types != null){
        $scope.types = $scope.data.users.slice(from,to);
    }
  };
  
  $scope.$watch( 'currentPage', $scope.setPage );
  $scope.$watch( 'data.users', $scope.setPage );


});

