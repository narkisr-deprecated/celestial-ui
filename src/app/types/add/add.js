angular.module( 'celestial.typeAdd', [
  'ui.state',  'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'typeAdd', {
    url: '/type/add/',
    views: {
	"main": {
        controller: 'TypeAddCtrl',
        templateUrl: 'types/add/add.tpl.html'
       }
    },
    data:{ pageTitle: 'New type' }
  });
})
.controller( 'TypeAddCtrl', function typeAddController($scope, $http, $resource, $location) {

  var Types = $resource('/types/');
  $scope.type = '';
  $scope.currentProvisioner = 'puppet-std';
  $scope.provisioner= {'puppet-std':{module:{}, args:[]}};

  $scope.typeSelect = function() {
    $scope.provisionerTemplate = 'types/add/'+$scope.currentProvisioner+'.tpl.html';
  };

  $scope.$watch( 'currentProvisioner', $scope.typeSelect );

  $scope.submit = function(){
    type = $scope.provisioner;
    type['type'] = $scope.type;
    type['puppet-std']['args'] =_.words($scope.provisioner['puppet-std']['args']);
    type['classes'] = JSON.parse($scope.provisioner.classes);
    Types.save(type,
	function(resp) {
        $location.path( '/type/'+$scope.type);
	},function(errors){
        console.log(errors);
	}
     );
  };
  
});
