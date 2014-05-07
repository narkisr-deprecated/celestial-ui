angular.module('celestial.environments', [])
.factory('envsService', function($resource) {
   var Environments = $resource('/environments/',{},{
     keys: {method: "GET", url:'/environments/keys'}
   });

   var envsService = {};

   envsService.loadEnvs = function() {
    return Environments.get({}).$promise;
   };

   envsService.loadEnvKeys = function() {
    return Environments.keys({}).$promise;
   };
   return envsService;
});
