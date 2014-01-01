angular.module( 'celestial.audits', [
  'ui.state', 'ui.bootstrap' ,'celestial.auditAdd'
  //,'celestial.auditEdit'
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
    getAudit: {method : "GET", params:{audit:'@name'},url:'/audits/:name'},
    remove: {method : "DELETE", params:{audit:'@name'},url:'/audits/:name'},
    update: {method : "PUT",url:'/audits/'}
  });

  auditsService.get = function(name) {
    return audits.getaudit({audit:name});
  };

  var intoPersisted = function(audit) {
    return audit;
  };

  auditsService.save = function(auditName,audit, loggingService) {
    newaudit = audit;
    newaudit['audit'] = auditName;
    newaudit = intoPersisted(newaudit);
    audits.save(newaudit, function(resp) {
        $location.path('/audits');
         growl.addInfoMessage(resp.message);
	},loggingService.error);
  };

  auditsService.update = function(auditId,audit) {
    updatedaudit = audit;
    updatedaudit = intoPersisted(updatedaudit);
    audits.update(updatedaudit, function(resp) {
        growl.addInfoMessage(resp.message);
        $location.path('/audits');
      },function(resp){
        growl.addInfoMessage(resp.errors);
        console.log(resp);
      });
  };
  
  auditsService.getAll = function() {
    return audits.get({}).$promise.then(function(data){
        return _.map(data.audits,function(audit){
           // audit.provisioner = auditsService.provisionerOf(audit);
           return audit; 
        });
    });
  };

  auditsService.remove =  function(auditId){
    audits.remove({audit:auditId},
      function(resp) {
        growl.addInfoMessage(resp.message);
        $location.path( '/audits');
      },loggingService.error);
  }; 

  return auditsService;
})

.controller( 'AuditsCtrl', function auditsCtrl($scope, $resource, auditsService) {
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
});
