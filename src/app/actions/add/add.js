angular.module( 'celestial.actionAdd', [
  'ui.state',  'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'actionAdd', {
    url: '/action/add/',
    views: {
	"main": {
        controller: 'ActionAddCtrl',
        templateUrl: 'actions/add/add.tpl.html'
      }
    },
    data:{ pageTitle: 'New action' }
  });
})
.controller('ActionAddCtrl', function actionAddController($scope, actionsService, typesService) {

  $scope.action = {type:'capistrano'};

  typesService.getAll().then(function(data) {
     $scope.types = _.pluck(data,'type');
     $scope.action['operates-on'] = $scope.types[0];
  });

  $scope.submit = function(){
    actionsService.saveAction($scope.action); 
  };
  
});
