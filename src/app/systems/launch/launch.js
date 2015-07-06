angular.module( 'celestial.systemLaunch', [
  'ui.state',  'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'systemLaunch', {
    url: '/system/launch/',
    views: {
	"main": {
        controller: 'SystemLaunchCtrl',
        templateUrl: 'systems/launch/launch.tpl.html'
       }
    },
    data:{ pageTitle: 'Launch System' }
  });
})
.controller('SystemLaunchCtrl', 
   function SystemLaunchController($scope, $http, $resource, $location, growl,
         loginService, usersService, loggingService, systemsService, envsService, templatesService) {

  var Systems = $resource('/systems/',{},{
    launch: {method : "POST", params:{name:'@name'},url:'/systems/template/:name'}
  });

  $scope.provided = {machine:{}};
  $scope.description = '';

  $scope.submit = function(){
    var template = angular.copy($scope.provided);
    template['owner'] = $scope.owner;
    Systems.launch({name:$scope.template},template, 
      function(resp) {
        growl.addInfoMessage(resp.message);
        systemsService.runJob('stage', resp.id);
        $location.path('/system/'+resp.id);
	},loggingService.error);
  };
 
  usersService.loadUsers($scope);
  templatesService.loadNames($scope);

  envsService.loadEnvs().then(function(data){
     $scope.envs = _.keys(data.environments);
     $scope.provided.env = _.keys(data.environments)[0];
  });
});
