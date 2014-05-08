angular.module( 'celestial.systems', [
  'ui.state', 'ui.bootstrap', 'ngResource',
  'celestial.system', 'celestial.systemAdd',
  'celestial.actions', 'celestial.confirm',
  'celestial.systemClone', 'celestial.systems.query',
   'angular-growl', 'ngAnimate'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'systems', {
    url: '/systems/:query/:page',
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
     Jobs[job](args, loggingService.info, loggingService.error);
  };

  systemsService.launchJob = function(id, target, job) {
    if($cookieStore.get('skipSystemConfirm')){
      systemsService.runJob(job, id);  
    } else {
	systemsService.safeLaunch(target.machine.hostname ,job ,function(){systemsService.runJob(job, id);}); 
    }
  };

  systemsService.launchJobs = function(systems, job) {
    var ids = _.map(systems, function(s){return s.id;});
    if(_.isEmpty(ids)){
       growl.addErrorMessage('Select systems first');
       return;
    }
    if($cookieStore.get('skipSystemConfirm')){
      _.each(ids, function(id) {
        systemsService.runJob(job, id);
      });
    } else {
	var names = _.map(systems, function(s){return s.machine.hostname;}).join(',');
      systemsService.safeLaunch(names, job, function(){
        _.each(ids, function(id) {
          systemsService.runJob(job, id);
        });
      }); 
    }
  };

  systemsService.hypervisor = function(system) {
    hs = ['aws','proxmox','vcenter','physical','docker'];
    return _.filter(hs, function(a){return system[a]!=null; })[0];
  };

  return systemsService;
}).controller( 'SystemsCtrl', 
  function SystemsController($scope, $resource, actionsService, runService, $location, systemsService, systemsQueryService, usersService) {

  var Systems = $resource('/systems/', {page:'@page',offset:'@offset'},{
     query:{method : "GET", url:'/systems/query'}
  });

  $scope.Operations = {
    create:{icon:'fa-check-square-o', tooltip:'Create a running machine' ,destructive:false}, 
    provision:{icon:'fa-gears', tooltip:'Run provisioining'}, 
    stage:{icon:'fa-refresh', tooltip:'Create and Provision'},
    stop:{icon:'fa-stop', tooltip:'Stop the backing machine'},
    clone:{icon:'fa-copy', tooltip:'Clone an existing machine'},
    start:{icon:'fa-play', tooltip:'Starting the backing machine'},
    destroy:{icon:'fa-trash-o', tooltip:'Destroy machine'}, 
    reload:{icon:'fa-warning', tooltip:'Destroy and re-create machine'},
    clear:{icon:'fa-eraser', tooltip:'Clear system model'}
  };
  
  $scope.perPage = 10;
  $scope.currentPage= $location.path().replace('/systems/','').split('\/')[1];
  $scope.query = atob(decodeURIComponent($location.path().replace('/systems/','').split('\/')[0]));

  usersService.loadOperations($scope);

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
        $scope.systems.push(system[1]);
        if(data.meta!=null){
          $scope.count = data.meta.total;
        } else {
          $scope.count = 0;
        }
	});
  };

  $scope.setPage = function () {
    var page = {page:$scope.currentPage,offset: $scope.perPage};
    $location.path('/systems/'+ encodeURIComponent(btoa($scope.query)) + '/' + $scope.currentPage);
    if($scope.query === '*'){
      Systems.get(page,displaySystems);
    } else {
      var parsedQuery = systemsQueryService.parseQuery($scope.query);
	page['query']  = btoa(angular.toJson(parsedQuery));
      Systems.query(page,displaySystems);
    }
  };

  $scope.launchJob = function(id,job) { 
    var target = _.find($scope.systems,function(s){return s.id==id;});
    systemsService.launchJob(id, target, job);
  };

  $scope.launchJobs = function(job) { 
    systemsService.launchJobs(_.values($scope.selected), job);
  };

  $scope.launchHelp= function(id,job) { 
    systemsQueryService.queryHelp();
  };

  $scope.search = function() { 
     var parsedQuery = systemsQueryService.parseQuery($scope.query);
     $location.path('/systems/' + encodeURIComponent(btoa($scope.query)) + '/1');
  };

  $scope.launchAction = function(action) {
    if(action.provided === null || action.provided  === undefined) {
	_.each(_.keys($scope.selected), function(id){
         actionsService.launchAction(id, action);
      });
    } else {
	runService.run(_.keys($scope.selected), action);            
    }
  };

  $scope.$watch( 'currentPage', $scope.setPage );
  $scope.$watch( 'perPage', $scope.setPage );
  
  $scope.selected = {};
  $scope.actions = [];

  $scope.setSelected = function() {
    if($scope.selected[this.system.id]) {
      delete $scope.selected[this.system.id];
    } else {
      $scope.selected[this.system.id] = this.system;
    }
   var types = _.groupBy(_.values($scope.selected), 'type');
   if(_.keys(types).length == 1){
     actionsService.grabActions(_.first(_.values($scope.selected)).type).then(function(actions){
	$scope.actions = actions;
    });
   } else {
     $scope.actions = [];
   }
  };

  // 1 is not a legal color this will cause the original color to appear
  $scope.isSelected = function() {
     return $scope.selected[this.system.id] ? 'lightsteelblue':1;
  };
    
  $scope.selectAll = function() {
    _.each($scope.systems, function(s) {
       $scope.selected[s.id] = s;
    });   
  };

  $scope.selectNone= function() {
    _.each($scope.selected, function(s) {
	delete $scope.selected[s.id];
    });   
  }; 
 
});

