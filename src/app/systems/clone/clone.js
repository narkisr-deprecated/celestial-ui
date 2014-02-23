angular.module( 'celestial.systemClone', [
  'ui.state',  'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'clone', {
    url: '/systems/clone/:id',
    views: {
     "main": {
        controller: 'cloneCtrl',
        templateUrl: 'systems/clone/clone.tpl.html'
	}
    },
    data:{ pageTitle: 'Clone system' }
  });
})
.controller( 'cloneCtrl', function actionRunController($scope, $location, systemsService, usersService, $resource) {

  $scope.systemId = $location.path().replace('/systems/clone/','');
  $scope.spec= {machine:{}};
  $scope.superUser = true;

  usersService.loadUsers($scope);  

  var Systems = $resource('/systems/',{} , {
    get: {method : "GET", params:{id:'@id'},url:'/systems/:id'}
  });

  Systems.get({id:$scope.systemId}, function (system){
    $scope.hypervisor = systemsService.hypervisor(system);
    $scope.hypervisorTemplate = 'systems/clone/'+$scope.hypervisor+'.tpl.html';
  });
 
  $scope.submit = function(){
    $scope.spec['hostname'] = $scope.hostname;
    $scope.spec['owner'] = $scope.owner;
    systemsService.runJob('clone', $scope.systemId,  $scope.spec);
    $location.path('/systems');
  };
  
});
