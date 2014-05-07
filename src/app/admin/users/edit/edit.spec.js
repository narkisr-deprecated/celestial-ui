describe( 'UserEditCtrl', function() {
  describe( 'user editing', function() {
    var UserEditCtrl, $scope, $location, $httpBackend;

    beforeEach( module( 'celestial' ) );

    beforeEach( inject(function($injector, $controller, _$location_, $rootScope) {
      $location = _$location_;
      $location.path("/admin/user/edit/foo");
      $scope = $rootScope.$new();
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', '/users/foo').respond({
          roles:["celestial.roles/user"], password:"1234", username:"yair", envs:["dev","prod"]
      },{});

      $httpBackend.when('GET', '/users/roles').respond({
         "roles":{"user":"celestial.roles/user","anonymous":"celestial.roles/anonymous","admin":"celestial.roles/admin"}
      });

      $httpBackend.when('GET', '/users/operations').respond({
         "operations":[]
      });
      
      rolesService = {
         loadRoles:function(call){call({user: "celestial.roles/user", admin:"celestial.roles/admin"});}
      };

      UserEditCtrl = $controller( 'UserEditCtrl', { $location: $location, $scope: $scope,growl:null,rolesService:rolesService});
    }));

  });
});
