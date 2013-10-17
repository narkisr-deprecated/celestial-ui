angular.module('celestial.confirm', ['ui.bootstrap.modal','ui.state'])


.controller('ConfirmCtrl', function ConfirmController($scope,$modalInstance) {

  $scope.ok = function () {
    $modalInstance.close(true);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss(false);
  };
});
