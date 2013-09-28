angular.module( 'celestial.jobs', [
  'ui.state', 'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'jobs', {
    url: '/jobs',
    views: {
	"main": {
        controller: 'JobsCtrl',
        templateUrl: 'jobs/jobs.tpl.html'
	}
    },
    data:{ pageTitle: 'Jobs' }
  });
})

.controller( 'JobsCtrl', function JobsCtrl( $scope, $resource,$timeout) {
  var Jobs = $resource('/jobs/',{},{
    fetch:{method : "GET", isArray:false}
  });

  $scope.jobs = [];

  (function tick() {
    Jobs.fetch({},function(data,resp){
       $scope.jobs = data.jobs;
       $timeout(tick, 5000);
    });
  })();
});
