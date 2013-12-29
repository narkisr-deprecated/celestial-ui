angular.module( 'celestial.actionAdd', [
  'ui.state',  'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'actionAdd', {
    url: '/action/add/:type',
    views: {
	"main": {
        controller: 'ActionAddCtrl',
        templateUrl: 'actions/add/add.tpl.html'
      }
    },
    data:{ pageTitle: 'New action' }
  });
})
.controller('ActionAddCtrl', function actionAddController($scope, actionsService, typesService, $location) {

  $scope.action = {type:'capistrano', timeout:360};

  typesService.getAll().then(function(data) {
     $scope.types = _.pluck(data,'type');
     $scope.action['operates-on'] = $location.path().replace('/action/add/','');
  });

  $scope.submit = function(){
    action = angular.copy($scope.action);
    action.timeout = action.timeout * 1000;
    actionsService.saveAction(action); 
  };
  
});
