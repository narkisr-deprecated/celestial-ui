angular.module( 'celestial.actionEdit', [
  'ui.state',  'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'actionEdit', {
    url: '/action/edit/:type',
    views: {
	"main": {
        controller: 'actionEditCtrl',
        templateUrl: 'actions/edit/edit.tpl.html'
      }
    },
    data:{ pageTitle: 'Edit action' }
  });
})
.controller( 'actionEditCtrl', function actionEditController($scope, $location, actionsService) {

  $scope.actionId = $location.path().replace("/action/edit/","");

  $scope.loadAction = function(){
    actionsService.get($scope.actionId).$promise.then(function(action) {
	$scope.action = action;
	$scope.action.classes = JSON.stringify(action.classes);
	// $scope.currentRemoter= actionsService.provisionerOf($scope.action);
    });
  };

  $scope.loadAction();

  $scope.submit = function(){
    actionsService.update($scope.actionId,$scope.action);
  };

  $scope.remove = function() {
    actionsService.remove($scope.actionId);
  };
  
});
