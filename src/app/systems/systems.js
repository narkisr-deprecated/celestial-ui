angular.module( 'celestial.systems', [
  'ui.state', 'ui.bootstrap', 'ngResource',
  'celestial.system', 'celestial.systemAdd',
  'celestial.actions', 'celestial.confirm',
  'celestial.systemClone', 'celestial.systems.query',
   'angular-growl', 'ngAnimate'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'systems', {
    url: '/systems/:page',
    views: {
      "main": {
        controller: 'SystemsCtrl',
        templateUrl: 'systems/systems.tpl.html'
      }
    },
    data:{ pageTitle: 'Systems' }
  });
})
.factory('systemsService', function($resource, $http, growl, $location, $modal, $cookieStore, loggingService) {
  var systemsService = {};

  var Jobs = $resource('/jobs/', {},{
    create:{method : "POST", params:{id:'@id'},url:'/jobs/create/:id'},
    clone:{method : "POST", params:{id:'@id','clone-spec':'@clone-spec'},url:'/jobs/clone/:id'},
    provision:{method : "POST", params:{id:'@id'},url:'/jobs/provision/:id'},
    stage:{method : "POST", params:{id:'@id'},url:'/jobs/stage/:id'},
    start:{method : "POST", params:{id:'@id'},url:'/jobs/start/:id'},
    stop:{method : "POST", params:{id:'@id'},url:'/jobs/stop/:id'},
    destroy:{method : "POST", params:{id:'@id'},url:'/jobs/destroy/:id'},
    clear:{method : "POST", params:{id:'@id'},url:'/jobs/clear/:id'},
    reload:{method : "POST", params:{id:'@id'},url:'/jobs/reload/:id'}
   });

  systemsService.safeLaunch = function(target, job, launchFn) {

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

  systemsService.runJob = function(job, id, args) {
     if (args === undefined){args = {};}
     args['id'] = id;
     console.log(args);
     Jobs[job](args, loggingService.info, loggingService.error);
  };

  systemsService.launchJob = function(id, target, job) {

    if($cookieStore.get('skipSystemConfirm')){
      systemsService.runJob(job, id);  
    } else {
	systemsService.safeLaunch(target,job,function(){systemsService.runJob(job, id);}); 
    }
  };

  systemsService.hypervisor = function(system) {
    hs = ['aws','proxmox','vcenter','physical','docker'];
    return _.filter(hs, function(a){return system[a]!=null; })[0];
  };

  return systemsService;
}).controller( 'SystemsCtrl', 
  function SystemsController($scope, $resource, actionsService, runService, $location, systemsService, systemsQueryService) {

  var Systems = $resource('/systems/', {page:'@page',offset:'@offset'},{
     query:{method : "GET", url:'/systems/query'}
  });
  
  $scope.perPage = 10;
  $scope.currentPage = 1;
  $scope.currentPage= $location.path().replace('/systems/','');

  $scope.loadCount = function(){
     Systems.get({page:1,offset:$scope.perPage},function(data,resp){
        if(data.meta!=null){
          $scope.count = data.meta.total;
        }
     });
  };

  var displaySystems = function(data){
	$scope.systems = [];
      angular.forEach(data.systems,function(system){
        system[1]['id'] = system[0];
        system[1]['hypervisor'] = _.filter(['aws','proxmox','vcenter','physical','docker'],function(a){
           return system[1][a]!=null;
        })[0];
        system[1]['actions'] = actionsService.grabActions(system[1].type);
        $scope.systems.push(system[1]);
	});
  };

  $scope.setPage = function () {
    var page = {page:$scope.currentPage,offset: $scope.perPage};
    $location.path('/systems/'+$scope.currentPage);
    if($scope.parsedQuery === undefined){
      Systems.get(page,displaySystems);
    } else {
	page['query']  = btoa(angular.toJson($scope.parsedQuery));
      Systems.query(page,displaySystems);
    }
  };

  $scope.launchJob = function(id,job) { 
    var target = _.find($scope.systems,function(s){return s.id==id;});
    systemsService.launchJob(id, target, job);
  };


  $scope.search = function() { 
    $scope.parsedQuery = systemsQueryService.parseQuery($scope.query);
    $scope.currentPage = 1;
    $scope.offset = $scope.perPage;
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

