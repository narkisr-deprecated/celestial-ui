angular.module('celestial.actions', [
  'ngResource', 'celestial.actionAdd'

])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'actions', {
    url: '/actions',
    views: {
      "main": {
        controller: 'ActionsCtrl',
        templateUrl: 'actions/actions.tpl.html'
      }
    },
    data:{ pageTitle: 'Actions' }
  });
})
.factory('actionsService', function($resource, $http, growl, $location) {
  var actionsService = {};

  var Actions =  $resource('/actions/', {},{
   byType: {method : "GET", params:{type:'@type'},url:'/actions/type/:type'}
  });

  actionsService.actionsKeys = function(type) {
	return Actions.byType({type:type}).$promise.then(function(actions) {
         result = _.chain(actions).values().pluck('name').value();
         if(!_.isEmpty(result)){
           return  _.keys(result); 
         } else {
           return null;
         }
	});
  };
 
  actionsService.grabActions = function(type) {
	return Actions.byType({type:type}).$promise.then(function(actions) {
        return _.chain(actions)
        .filter(function(action,id) {
          return action.name != null;
        })
        .map(function(action, id) {
          action.id = id; 
          action.type = _.filter(['ruby','capistrano'],function(a){
           return action[a]!=null;
          })[0];
          return action;
        }).value();
      });
  };

  actionsService.launchAction = function(id,action){
    $http.post('/jobs/'+action+'/'+id)
      .success(function(data) {
        growl.addInfoMessage(data.msg);
      }).error(function(data){
        growl.addErrorMessage(data.msg);
    });
  };

  actionsService.saveAction = function(action){
     Actions.save(action, function(resp) {
         $location.path('/actions');
         growl.addInfoMessage(resp.msg);
	},function(errors){
        growl.addInfoMessage(resp.errors);
        console.log(errors);
     });
  };


  return actionsService;
})
.controller('ActionsCtrl', function ActionsCtrl( $scope, $resource, actionsService, typesService) {

  typesService.getAll().then(function(data) {
     $scope.types = _.pluck(data,'type');
     $scope.currentType = $scope.types[0];
  });

  $scope.reloadActions = function () {
    $scope.actions = actionsService.grabActions($scope.currentType).then(function(actions){
      $scope.actions = actions;
    });
  };
  
  $scope.$watch('currentType', $scope.reloadActions);
});

