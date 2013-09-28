angular.module( 'celestial', [
  'templates-app', 'templates-common', 'celestial.systems', 'celestial.types',
  'ui.state', 'ui.route', 'angular-growl' , 'ngAnimate'
])

.config(function myAppConfig ( $stateProvider, $urlRouterProvider,growlProvider ) {
  $urlRouterProvider.otherwise( '/systems' );
  growlProvider.globalTimeToLive(2000);
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | celestial' ;
    }
  });
});


