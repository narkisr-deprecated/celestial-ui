angular.module('celestial.actions', [
  'ngResource', 'celestial.actionAdd', 'celestial.actionEdit', 'celestial.actionRun'
])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'actions', {
    url: '/actions/:type',
    views: {
      "main": {
        controller: 'ActionsCtrl',
        templateUrl: 'actions/actions.tpl.html'
      }
    },
    data:{ pageTitle: 'Actions' }
  });
})
.factory('actionsService', function($resource, $http, growl, $location, loggingService) {
  var actionsService = {};

  var Actions =  $resource('/actions/', {}, {
   byType: {method : "GET", params:{type:'@type'},url:'/actions/type/:type'},
   get: {method : "GET", params:{id:'@id'},url:'/actions/:id'},
   remove: {method : "DELETE", params:{id:'@id'},url:'/actions/:id'},
   update: {method : "PUT", params:{id:'@id'},url:'/actions/:id'}
  });

  var remoterType = function(action) {
   withType = _.clone(action);
   withType.type = _.filter(['ruby','capistrano'], function(a){
    return withType[a]!=null;
   })[0];
   return withType;
  };

  actionsService.actionsKeys = function(type) {
	return Actions.byType({type:type}).$promise.then(function(actions) {
         var result = _.filter(actions, function(action){
           return action.name!=null;
         });
         return !_.isEmpty(result) ? result:null;
	});
  };
 
  actionsService.grabActions = function(type) {
	return Actions.byType({type:type}).$promise.then(function(actions) {
        var result = _.chain(actions).map(function(action, id) {
         if(action.name!=null) {
           action.id = id; 
           return remoterType(action);
         } else {
           return null;
         }
        }).filter(function(action) {
          return action != null;
        }).value();
       return !_.isEmpty(result) ? result : null;
      });
  };


  actionsService.launchAction = function(id, action){
    $http.post('/jobs/'+action.name+'/'+id, action.userArgs)
      .success(function(data) {
        growl.addInfoMessage(data.msg);
      }).error(loggingService.error);
  };

  var joinArgs = function(action) {
    var newAction = _.clone(action);
    newAction[newAction.type] = {args:newAction.args.split(' ')};
    delete newAction['args'];
    delete newAction['type'];
    return newAction;
  };

  actionsService.saveAction = function(action){
     var newAction = joinArgs(action);
     Actions.save(newAction, function(resp) {
         $location.path('/actions/'+action['operates-on']);
         growl.addInfoMessage(resp.msg);
	},loggingService.error);
  };

  actionsService.update = function(id, action){
     var updatedAction = joinArgs(action);
     Actions.update({id:id},updatedAction, function(resp) {
        $location.path('/actions/'+action['operates-on']);
         growl.addInfoMessage(resp.msg);
	},loggingService.error);
  };

  actionsService.remove = function(id, action){
     Actions.remove({id:id}, function(resp) {
         $location.path('/actions/'+action['operates-on']);
         growl.addInfoMessage(resp.msg);
	},function(errors){
        growl.addInfoMessage(errors.data.msg);
        console.log(errors);
     });
  };

  actionsService.getAction = function(id){
    return Actions.get({id:id}).$promise.then(function(action) {
      action = remoterType(action);
	action.args =  action[action.type].args.join(' ');
      return action;
    });
  };

  return actionsService;
})
.controller('ActionsCtrl', function ActionsCtrl($scope, actionsService, typesService, $location) {

  $scope.currentType = $location.path().replace('/actions/','');

  typesService.getAll().then(function(data) {
     $scope.types = _.pluck(data,'type');
     if($scope.currentType === '') {
      $scope.currentType = $scope.types[0];
     }
  });


  $scope.reloadActions = function () {
    $scope.actions = actionsService.grabActions($scope.currentType).then(function(actions){
      $scope.actions = actions;
    });
  };
  
  $scope.setPath = function () {
    $location.path("/actions/"+$scope.currentType);
  };
  
  $scope.$watch('currentType', $scope.reloadActions);
  $scope.$watch('currentType', $scope.setPath);
});

