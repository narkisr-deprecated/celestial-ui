describe( 'Systems section', function() {
  beforeEach(module( 'celestial'));

 
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

  var SystemsCtrl, $scope, $location, $httpBackend, loggingService, $cookieStore;

  beforeEach(function() {
   module(function ($provide) {
     loggingService = {
       info : function(message) {}
     };
     $cookieStore = {
        get: function(key){return false;}
     }; 
     spyOn(loggingService,'info').andCallThrough();
     spyOn(confirmModal, 'open').andCallThrough();
     $provide.value('$modal', confirmModal);
     $provide.value('loggingService', loggingService);
     $provide.value('$cookieStore', $cookieStore);
   });
  });

  beforeEach(inject(function($injector, $controller, _$location_, $rootScope ,systemsService) {
     $location = _$location_;
     $location.path('/systems/'+encodeURIComponent(btoa("*"))+'/1');
     $scope = $rootScope.$new();
     $scope.systems = [{id:'13', machine:{hostname:'foo'}}];
     $httpBackend = $injector.get('$httpBackend');
     $httpBackend.when('GET', '/systems?offset=10&page=1').respond({ });
     $httpBackend.when('GET', '/sessions').respond({username:'admin' });
     $httpBackend.when('GET', '/users/admin').respond({username:'admin' });
     SystemsCtrl = $controller( 'SystemsCtrl', {$location: $location, $scope: $scope,  systemsService : systemsService });
  }));


  it('safe guards actions using a confirmation dialog', inject( function() {
     $scope.launchJob("13","create");
     expect(confirmModal.open).toHaveBeenCalled();
     $httpBackend.expectPOST('/jobs/create/13', {id:"13"}).respond(200, {
        message:"submitted system creation", id:"13", job:"07fe5900-81ab-4473-aec3-24474991ab03" 
     });
    $httpBackend.flush();
    expect(loggingService.info).toHaveBeenCalled();
  }));

  it('has skip for confirm dialog', inject( function() {
     spyOn($cookieStore,'get').andReturn(true);
     $scope.launchJob("13","create");
     expect($cookieStore.get).toHaveBeenCalledWith("skipSystemConfirm");
     expect(confirmModal.open).not.toHaveBeenCalled();
     $httpBackend.expectPOST('/jobs/create/13', {id:"13"}).respond(200, {
        message:"submitted system creation", id:"13", job:"07fe5900-81ab-4473-aec3-24474991ab03" 
     });
    $httpBackend.flush();
    expect(loggingService.info).toHaveBeenCalled();
  }));

  
   
});

