angular.module( 'celestial.quotas', [
  'celestial.quotaAdd', 'celestial.quotaEdit'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'quotas', {
    url: '/admin/quotas',
    views: {
	"main": {
        controller: 'QuotasCtrl',
        templateUrl: 'admin/quotas/quotas.tpl.html'
	}
    },
    data:{ pageTitle: 'Quotas' }
  });
})
.controller( 'QuotasCtrl', function QuotasController($scope, $resource) {
  $scope.perPage = 10;
  $scope.data = {};
   
  var Quotas = $resource('/quotas/',{},{
    getAll: {method : "GET",url:'/quotas/',isArray:true}
  });

  $scope.load = function(){
    Quotas.getAll({}).$promise.then(function(quotas){
     $scope.data.quotas = _.map(quotas, function(quota) {
       quota.quotaList = _.keys(quota.quotas).join(' ');
       return quota;
     });
     $scope.currentPage = 1;
     $scope.count = $scope.data.quotas.length;
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
  $scope.$watch( 'data.quotas', $scope.setPage );

});

