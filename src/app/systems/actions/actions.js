angular.module('celestial.actions', ['ngResource'])
.factory('actionsService', function($resource,$http,growl) {
  var actionsService = {};

  var Actions =  $resource('/actions/', {},{
   byType: {method : "GET", params:{type:'@type'},url:'/actions/type/:type'}
  });

  actionsService.loadActions = function(type) {
	return Actions.byType({type:type}).$promise.then(function(actions) {
         return  _.chain(actions).values().pluck('actions').first().keys().value(); 
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

  return actionsService;
});
