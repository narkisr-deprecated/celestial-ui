angular.module('celestial.environments', [])
.factory('envsService', function($resource) {
   var Environments = $resource('/environments/');
   var envsService = {};

   envsService.loadEnvs = function() {
    return Environments.get({}).$promise;
   };

   return envsService;
});
