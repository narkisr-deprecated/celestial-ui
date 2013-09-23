angular.module( 'celestial.systemAdd', [
  'ui.state', 'ui.bootstrap', 'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'systemAdd', {
    url: '/system/add/',
    views: {
	"main": {
        controller: 'SystemAddCtrl',
        templateUrl: 'systems/add/add.tpl.html'
       }
    },
    data:{ pageTitle: 'New System' }
  });
})
.controller( 'SystemAddCtrl', function SystemAddController($scope,$resource) {
  $scope.steps = ['one', 'two', 'three'];
  $scope.step = 0;
  $scope.wizard = { tacos: 2 };

  $scope.isFirstStep = function() {
    return $scope.step === 0;
  };

  $scope.isLastStep = function() {
    return $scope.step === ($scope.steps.length - 1);
  };
  
  $scope.isCurrentStep = function(step) {
    return $scope.step === step;
  };

  $scope.setCurrentStep = function(step) {
    $scope.step = step;
  };

  $scope.getCurrentStep = function() {
    return $scope.steps[$scope.step];
  };

  $scope.getNextLabel = function() {
    return ($scope.isLastStep()) ? 'Submit' : 'Next'; 
  };

  $scope.handlePrevious = function() {
    $scope.step -= ($scope.isFirstStep()) ? 0 : 1;
  };

  $scope.handleNext = function(dismiss) {
    if($scope.isLastStep()) {
      dismiss();
    } else {
      $scope.step += 1;
    }
  };
});
