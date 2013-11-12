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
.controller( 'actionEditCtrl', function actionEditController($scope, $location, actionsService, typesService) {

  $scope.actionId = $location.path().replace("/action/edit/","");

  typesService.getAll().then(function(data) {
     $scope.types = _.pluck(data,'type');
  });


  $scope.loadAction = function(){
    actionsService.getAction($scope.actionId).then(function(action) {
	$scope.action = action;
    });
  };

  $scope.loadAction();

  $scope.submit = function(){
    actionsService.update($scope.actionId,$scope.action);
  };

  $scope.remove = function() {
    actionsService.remove($scope.actionId, $scope.action);
  };
  
});
