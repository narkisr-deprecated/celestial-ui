angular.module( 'celestial', [
  'templates-app', 'templates-common', 'celestial.systems', 'celestial.types','celestial.jobs',
  'ui.state', 'ui.route', 'angular-growl' , 'ngAnimate'
])

.config(function myAppConfig ( $stateProvider, $urlRouterProvider,growlProvider ) {
  $urlRouterProvider.otherwise( '/systems' );
  growlProvider.globalTimeToLive(2000);
})
.directive('eatClick', function() {
    return function(scope, element, attrs) {
        $(element).click(function(event) {
            event.preventDefault();
        });
    };
})
.controller( 'AppCtrl', function AppCtrl ( $scope, loginService) {

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if (angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | celestial' ;
    }
  });

  $scope.$on('$locationChangeStart', function(next, current) { 
    loginService.checkLoginStatus();
  });
   
   $scope.logout = function(){
     loginService.logout();
   };

   $scope.$watch(function () { return loginService.username;},
     function (value) {
       $scope.username = value;
     }
  );

});


