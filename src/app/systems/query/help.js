angular.module('celestial.query.help', [])

.controller('QueryHelpCtrl', function QueryHelpController($scope, $modalInstance) {

  $scope.state= {}; 

  $scope.ok = function () {
    $modalInstance.close();
  };

});
