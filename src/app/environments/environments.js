angular.module('celestial.environments', [])
.factory('envsService', function($resource) {
   var Environments = $resource('/environments/');
   var envsService = {};

   envsService.loadEnvs = function($scope) {
    Environments.get({},function(data){
	$scope.rawEnvs = data.environments;
      $scope.envs = [];
      angular.forEach(data.environments,function(v,k){
        $scope.envs.push(k);
      });
     $scope.env = $scope.envs[0];
    },function(error){
       console.log('failed to fetch environments');
    });
  };


   return envsService;
});
