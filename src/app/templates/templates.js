angular.module('celestial.templates', [])
.factory('templatesService', function($resource) {
   var Templates = $resource('/templates/');

   var templatesService = {};

   templatesService.loadNames = function($scope) {
    Templates.get({},function(res){
     $scope.templates = _.map(res.templates,function(t){return t.name;}); 
     $scope.template  = $scope.templates[0];
    });
   };
   return templatesService;
});
