angular.module( 'celestial.actionRun', [
  'ui.state',  'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'actionRun', {
    url: '/actions/run/:id',
    views: {
     "main": {
        controller: 'actionRunCtrl',
        templateUrl: 'actions/run/run.tpl.html'
      }
    },
    data:{ pageTitle: 'Run action' }
  });
})
.factory('runService', function($location) {
  var runService = {};

  runService.run = function(ids, action) {
    runService.targets = ids;
    $location.path('/actions/run/'+action.id);
  }; 

  return runService;
})
.controller( 'actionRunCtrl', function actionRunController($scope, $location, actionsService, runService,$resource) {

  $scope.actionId = $location.path().replace('/actions/run/','');
  $scope.systems = [];
  $scope.userArgs= {};
    
  var Systems = $resource('/systems/',{} , {
    get: {method : "GET", params:{id:'@id'},url:'/systems/:id'}
  });

  _.each(runService.targets,function(id){
     Systems.get({id:id}, function (system){
       system.id = id;
       $scope.systems.push(system);
     });
  });
 
   
   $scope.loadAction = function(){
     actionsService.getAction($scope.actionId).then(function(action) {
       $scope.action = action;
       _.each($scope.action.provided, function(a) {
          $scope.userArgs[a] = ''; 
       });
     });
   };
 
   $scope.loadAction();
 
   $scope.submit = function(){
    _.each(runService.targets,function(id){
      $scope.action.userArgs = $scope.userArgs;
      actionsService.launchAction(id, $scope.action);
	$location.path('/systems');
    });
   };
  
});
