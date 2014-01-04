angular.module( 'celestial.audits', [
  'ui.state', 'ui.bootstrap' ,'celestial.auditAdd', 
  'celestial.auditEdit', 'celestial.auditLaunch'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'audits', {
    url: '/audits',
    views: {
      "main": {
        controller: 'AuditsCtrl',
        templateUrl: 'audits/audits.tpl.html'
      }
    },
    data:{ pageTitle: 'audits' }
  });
})
.factory('auditsService', function($location, $http, $resource, growl, loggingService) {
  var auditsService = {};

  var audits = $resource('/audits/',{},{
    getAudit: {method : "GET", params:{name:'@name'},url:'/audits/:name'},
    remove: {method : "DELETE", params:{name:'@name'},url:'/audits/:name'},
    linkFor: {method : "GET", params:{args:'@args', name:'@name'},url:'/audits/link/'},
    update: {method : "PUT",url:'/audits/'}
  });

  auditsService.linkFor= function(name, userArgs) {
    return audits.linkFor({name:name, userArgs:userArgs});
  };


  auditsService.get = function(name) {
    return audits.getAudit({name:name});
  };

  auditsService.save = function(audit) {
    audits.save(audit, function(resp) {
        $location.path('/audits');
         growl.addInfoMessage(resp.message);
	},loggingService.error);
  };

  auditsService.update = function(audit) {
    audits.update(audit, function(resp) {
        growl.addInfoMessage(resp.message);
        $location.path('/audits');
      },loggingService.error);
  };
  
  auditsService.getAll = function() {
    return audits.get({}).$promise.then(function(data){
        return _.map(data.audits,function(audit){
           return audit; 
        });
    });
  };

  auditsService.remove =  function(name){
    audits.remove({name:name},
      function(resp) {
        growl.addInfoMessage(resp.message);
        $location.path( '/audits');
      },loggingService.error);
  }; 

  return auditsService;
})

.controller( 'AuditsCtrl', function auditsCtrl($scope, $resource, auditsService, $location) {
  $scope.perPage = 10;
  $scope.data = {};

  $scope.load = function(){
    auditsService.getAll().then(function(audits){
     $scope.data.audits= audits;
     $scope.currentPage = 1;
     $scope.count = $scope.data.audits.length;
    });
  };

  $scope.load();

  $scope.setPage = function () {
    var from = ($scope.currentPage -  1) * $scope.perPage;
    var to = $scope.currentPage  * $scope.perPage;
    if($scope.data.audits != null){
        $scope.audits = $scope.data.audits.slice(from,to);
    }
  };
  
  $scope.$watch( 'currentPage', $scope.setPage );
  $scope.$watch( 'data.audits', $scope.setPage );
 
  $scope.launchAudit = function(name) {
    console.log(name);
    $location.path("/audits/launch/"+name);
  };
});
