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
.controller('ActionAddCtrl', function actionAddController($scope, actionsService, typesService, $location, envsService) {

  $scope.common = {};
  $scope.remoter = {};
  $scope.type = 'capistrano';

  envsService.loadEnvs().then(function(data){
     $scope.envs = _.keys(data.environments);
     $scope.env = _.keys(data.environments)[0];
     _.each($scope.envs, function(e) {
        $scope.remoter[e] = {};
    });
  });

  typesService.getAll().then(function(data) {
     $scope.types = _.pluck(data,'type');
     $scope.common['operates-on'] = $location.path().replace('/action/add/','');
  });

  $scope.submit = function(){
     var remoter =  angular.copy($scope.remoter);
     _.each($scope.envs, function(e) {
       if(_.isEmpty(remoter[e])) {
         delete remoter[e];
       }
    });
    var action = angular.copy($scope.common);
    action[$scope.type] = remoter;
    actionsService.saveAction(action); 
  };
  
});
