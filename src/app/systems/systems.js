angular.module( 'celestial.systems', [
  'ui.state', 'ui.bootstrap', 'ngResource',
  'celestial.system', 'celestial.systemAdd', 'celestial.actions', 'celestial.confirm',
  'angular-growl', 'ngAnimate' 
])
.config(function config($stateProvider) {
  $stateProvider.state( 'systems', {
    url: '/systems',
    views: {
      "main": {
        controller: 'SystemsCtrl',
        templateUrl: 'systems/systems.tpl.html'
      }
    },
    data:{ pageTitle: 'Systems' }
  });
})
.controller( 'SystemsCtrl', 
  function SystemsController($scope, $resource, actionsService, growl, $modal, $cookieStore, runService, loggingService) {

  var Systems = $resource('/systems/', {page:'@page',offset:'@offset'});

  var Jobs = $resource('/jobs/', {},{
   create:{method : "POST", params:{id:'@id'},url:'/jobs/create/:id'},
   provision:{method : "POST", params:{id:'@id'},url:'/jobs/provision/:id'},
   stage:{method : "POST", params:{id:'@id'},url:'/jobs/stage/:id'},
   start:{method : "POST", params:{id:'@id'},url:'/jobs/start/:id'},
   stop:{method : "POST", params:{id:'@id'},url:'/jobs/stop/:id'},
   destroy:{method : "POST", params:{id:'@id'},url:'/jobs/destroy/:id'},
   clear:{method : "POST", params:{id:'@id'},url:'/jobs/clear/:id'},
   reload:{method : "POST", params:{id:'@id'},url:'/jobs/reload/:id'}
  });


  $scope.perPage = 10;
  $scope.currentPage = 1;

  $scope.loadCount = function(){
     Systems.get({page:1,offset:$scope.perPage},function(data,resp){
        if(data.meta!=null){
          $scope.count = data.meta.total;
        }
     });
  };

  $scope.setPage = function () {
    var page = {page:$scope.currentPage,offset: $scope.perPage};
    Systems.get(page,function (data){
	$scope.systems = [];
      angular.forEach(data.systems,function(system){
        system[1]['id'] = system[0];
        system[1]['hypervisor'] = _.filter(['aws','proxmox','vcenter','physical'],function(a){
           return system[1][a]!=null;
        })[0];
        system[1]['actions'] = actionsService.grabActions(system[1].type);
        $scope.systems.push(system[1]);
	});
    });
  };
  
  var safeLaunch = function(id,job,launchFn) {
    var target = _.find($scope.systems,function(s){return s.id==id;});

    var modalInstance = $modal.open({
      templateUrl: 'systems/confirm/confirm.tpl.html',
      controller: 'ConfirmCtrl',
	resolve: {job: function(){return job;}, target: function(){return target;}}
    });
   
    modalInstance.result.then(function () {
       launchFn();
    }, function () {
       growl.addErrorMessage('Not launching ' +job);
    });

  };

  $scope.launchJob = function(id,job) {
     runJob = function() {
       Jobs[job]({id:id}, loggingService.info, loggingService.error);
     };

    if($cookieStore.get('skipSystemConfirm')){
      runJob();  
    } else {
      safeLaunch(id,job,runJob); 
    }
  };

  $scope.launchAction = function(id, action) {
    if(action.provided === null || action.provided  === undefined) {
      actionsService.launchAction(id,action);
    } else {
      runService.run([id], action);            
    }
  };

  $scope.loadCount();
  $scope.$watch( 'currentPage', $scope.setPage );
   
});

