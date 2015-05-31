angular.module( 'celestial.actionEdit', [
  'ui.router',  'ngResource'
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
.controller( 'actionEditCtrl', function actionEditController($scope, $location, actionsService, typesService) {

  $scope.actionId = $location.path().replace("/action/edit/","");

  typesService.getAll().then(function(data) {
     $scope.types = _.pluck(data,'type');
  });


  $scope.loadAction = function(){
    actionsService.getAction($scope.actionId).then(function(action) {
	action.timeout = action.timeout / 1000;
	$scope.action = action;
    });
  };

  $scope.loadAction();

  $scope.submit = function(){
    action = angular.copy($scope.action);
    action.timeout = action.timeout * 1000;
    actionsService.update($scope.actionId,action);
  };

  $scope.remove = function() {
    actionsService.remove($scope.actionId, $scope.action);
  };
  
});
