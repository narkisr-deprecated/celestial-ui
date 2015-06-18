angular.module( 'celestial.actionEdit', [
  'ui.state',  'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'actionEdit', {
    url: '/action/edit/:id',
    views: {
	"main": {
        controller: 'actionEditCtrl',
        templateUrl: 'actions/edit/edit.tpl.html'
      }
    },
    data:{ pageTitle: 'Edit action' }
  });
})
.controller( 'actionEditCtrl', function actionEditController($scope, $location, actionsService, typesService, envsService) {

  $scope.actionId = $location.path().replace("/action/edit/","");

  envsService.loadEnvs().then(function(data){
     $scope.envs = _.keys(data.environments);
  });


  $scope.loadAction = function(){
    actionsService.getAction($scope.actionId).then(function(action) {
      $scope.type = action.type;
      $scope.action = action;
	action.timeout = action.timeout / 1000;
	$scope.env = _.keys(action[action.type])[0];
    });
  };

  $scope.envChanged = function() {
   if($scope.action !== undefined){
     if($scope.action[$scope.type][$scope.env] === undefined){
      $scope.action[$scope.type][$scope.env] = {};
     }
   }
  };

  $scope.loadAction();

  $scope.$watch('env', $scope.envChanged);

  $scope.submit = function(){
    action = angular.copy($scope.action);
    actionsService.update($scope.actionId,action);
  };

  $scope.remove = function() {
    actionsService.remove($scope.actionId, $scope.action);
  };
  
});
