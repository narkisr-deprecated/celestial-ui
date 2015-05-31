angular.module('celestial.confirm', ['ui.bootstrap.modal','ui.router'])

.controller('ConfirmCtrl', function ConfirmController($scope,$modalInstance, $cookieStore, job, target) {

  $scope.target = target;
  $scope.job = job;
  $scope.state= {}; 

  $scope.ok = function () {
    if($scope.state.skip) {
      $cookieStore.put('skipSystemConfirm', true);
    }
    $modalInstance.close();
  };

  $scope.cancel = function () {
    if($scope.state.skip) {
      $cookieStore.put('skipSystemConfirm', true);
    }
    $modalInstance.dismiss();
  };
});
