describe( 'Systems section', function() {
  beforeEach( module( 'celestial' ) );

  var confirmModal = {
    command: null,
    open: function(args) {
       return confirmModal;
    },
    result: {
     then: function(callback) {
       callback();
      }
    }
  };

  var SystemsCtrl, $scope, $location, $httpBackend, growl, $cookieStore;

  beforeEach(inject(function($injector, $controller, _$location_, $rootScope) {
     $location = _$location_;
     $location.path("/systems");
     $scope = $rootScope.$new();
     $httpBackend = $injector.get('$httpBackend');
     $httpBackend.when('GET', '/systems?offset=10&page=1').respond({ });
     growl = {
       addInfoMessage : function(msg) {}
     };
     $cookieStore = {
        get: function(key){return false;}
     }; 
     spyOn(growl,'addInfoMessage').andCallThrough();
     spyOn(confirmModal, 'open').andCallThrough();
     SystemsCtrl = $controller( 'SystemsCtrl', {
         $location: $location, $scope: $scope, growl: growl, $modal : confirmModal, $cookieStore: $cookieStore
     });
  }));


  it('safe guards actions using a confirmation dialog', inject( function() {
     $scope.launchJob("13","create");
     expect(confirmModal.open).toHaveBeenCalled();
     $httpBackend.expectPOST('/jobs/create/13', {id:"13"}).respond(200, {
        msg:"submitted system creation", id:"13", job:"07fe5900-81ab-4473-aec3-24474991ab03" 
     });
    $httpBackend.flush();
    expect(growl.addInfoMessage).toHaveBeenCalled();
  }));

  it('has skip for confirm dialog', inject( function() {
     spyOn($cookieStore,'get').andReturn(true);
     $scope.launchJob("13","create");
     expect($cookieStore.get).toHaveBeenCalledWith("skipSystemConfirm");
     expect(confirmModal.open).not.toHaveBeenCalled();
     $httpBackend.expectPOST('/jobs/create/13', {id:"13"}).respond(200, {
        msg:"submitted system creation", id:"13", job:"07fe5900-81ab-4473-aec3-24474991ab03" 
     });
    $httpBackend.flush();
    expect(growl.addInfoMessage).toHaveBeenCalled();
  }));

  
   
});

