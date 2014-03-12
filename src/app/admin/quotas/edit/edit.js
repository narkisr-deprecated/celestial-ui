angular.module( 'celestial.quotaEdit', [ ])
.config(function config($stateProvider) {
  $stateProvider.state( 'quotaEdit', {
    url: '/admin/quota/edit/:name',
    views: {
	"main": {
        controller: 'QuotaEditCtrl',
        templateUrl: 'admin/quotas/edit/edit.tpl.html'
      }
    },
    data:{ pageTitle: 'New Quota' }
  });
})
.controller( 'QuotaEditCtrl', function QuotaEditController($scope, $resource, $location, envsService, 
                                    growl ,usersService, loggingService) {

  $scope.username = $location.path().replace("/admin/quota/edit/","");

  Quotas = $resource('/quotas/:name', {name:'@name'},{
     update: {method : "PUT",url:'/quotas/'} 
  });
  
  Quotas.get({name:$scope.username}, function(data){
    $scope.quota = data;
    $scope.envs = _.keys($scope.quota.quotas);
    $scope.env = $scope.envs[0];
    $scope.hypervisors = _.keys($scope.quota.quotas[$scope.env]); 
  });

  $scope.setHypervisors = function() {
    if($scope.envs!== undefined){
      $scope.hypervisors = _.keys($scope.quota.quotas[$scope.env]); 
      $scope.currentHypervisor = $scope.hypervisors[0];
    }
  };

  $scope.setCount = function() {
    if($scope.env !== undefined && $scope.currentHypervisor!==undefined) {
	$scope.count = $scope.quota.quotas[$scope.env][$scope.currentHypervisor]['limits']['count'];
    }
  };

  var intoPersisted = function(quota){
    quota['quotas'][$scope.env][$scope.currentHypervisor] = {
      "used": $scope.quota.quotas[$scope.env][$scope.currentHypervisor]['used'],
      "limits": {"count": $scope.count}
    };
   return quota;
  };


  $scope.submit = function(){
   Quotas.update(intoPersisted($scope.quota),
     function(resp) {
        $location.path( '/admin/quotas');
   },loggingService.error);
  };

  $scope.remove = function(){
    delete $scope.quota.quotas[$scope.env][$scope.currentHypervisor];
    if (_.isEmpty($scope.quota.quotas[$scope.env])){
      delete $scope.quota.quotas[$scope.env];
    }
    if (_.isEmpty($scope.quota['quotas'])){
      Quotas.remove({name:$scope.quota.username},
       function(resp) {
         growl.addInfoMessage('Quota deleted');
         $location.path( '/admin/quotas');
       },loggingService.error);
    } else {
      Quotas.update($scope.quota,
       function(resp) {
         growl.addInfoMessage('Quota deleted');
         $location.path( '/admin/quotas');
      }, loggingService.error);

    }
  }; 
 
  $scope.$watch('env', $scope.setHypervisors);
  $scope.$watch('currentHypervisor', $scope.setCount);
});
