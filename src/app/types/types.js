angular.module( 'celestial.types', [
  'ui.state',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'types', {
    url: '/types',
    views: {
      "main": {
        controller: 'TypesCtrl',
        templateUrl: 'types/types.tpl.html'
      }
    },
    data:{ pageTitle: 'types' }
  });
})

.controller( 'typesCtrl', function TypesCtrl( $scope ) {
  // This is simple a demo for UI Boostrap.
  $scope.dropdownDemoItems = [
    "The first choice!",
    "And another choice for you.",
    "but wait! A third!"
  ];
})

;
