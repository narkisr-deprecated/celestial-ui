angular.module( 'celestial.systemProvision', [
  'ui.state',  'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'systemProvision', {
    url: '/system/provision/',
    views: {
	"main": {
        controller: 'SystemProvisionCtrl',
        templateUrl: 'systems/provision/provision.tpl.html'
       }
    },
    data:{ pageTitle: 'Provision System' }
  });
})
.factory('provisionService', function($location) {
  var provisionService = {};

  provisionService.run = function(ids, action) {
    provisionService.targets = ids;
    $location.path('/system/provision/');
  }; 

  return provisionService;
})

.controller('SystemProvisionCtrl', 
   function SystemProvisionController($scope, $http, $resource, $location, growl,
         loginService, loggingService, systemsService,provisionService) {

  var Jobs = $resource('/jobs/',{},{
    provision:{method : "POST", params:{id:'@id'},url:'/jobs/provision/:id'}
  });

  $scope.noop = false;

  $scope.submit = function(){
    var args = [];
    if($scope.noop === true){
      args = ['--noop']; 
    }
    _.each(provisionService.targets, function(id){
	$http.post('/jobs/provision/'+id, {'run-opts':{classes:$scope.classes, 'args':args}})
        .success(function(data) {
          growl.addInfoMessage(data.message);
        }).error(loggingService.error);
    });
    $location.path('/jobs');
  };

});
