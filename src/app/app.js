angular.module( 'celestial', [
  'templates-app', 'templates-common', 'celestial.systems', 'celestial.actions',
  'celestial.types','celestial.jobs','celestial.login','celestial.admin',
  'ui.state', 'ui.route', 'angular-growl' , 'ngAnimate'
])

.config(function myAppConfig ( $stateProvider, $urlRouterProvider,growlProvider ) {
  _.mixin(_.string.exports());
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

   
   $scope.logout = function(){
     loginService.logout();
   };

   $scope.admin = function(){
    return loginService.isAdmin();
   };

   // looks like there is a race condition between ng-show and promise return 
   // this somehow bypasses that
   $scope.isAdmin = true;

   loginService.grabSession().then(function(data){
     $scope.username = data.username;
     $scope.isAdmin = loginService.isAdmin(data);
   });


});


