angular.module('celestial.actions', ['ngResource'])
.factory('actionsService', function($resource,$http,growl) {
  var actionsService = {};

  var Actions =  $resource('/actions/', {},{
   byType: {method : "GET", params:{type:'@type'},url:'/actions/type/:type'}
  });

  actionsService.loadActions = function(type) {
	return Actions.byType({type:type}).$promise.then(function(actions) {
         result = _.chain(actions).values().pluck('actions').first().value();
         if(!_.isEmpty(result)){
           return  _.keys(result); 
         } else {
           return null;
         }
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
