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
       var byStart = _.sortBy(data.erroneous.concat(data.succesful), function(s) {return s.end;});
       $scope.statuses = _.map(byStart, function(s) {
         s.start = moment(s.start).format('MMMM Do YYYY, h:mm:ss a');
         s.end = moment(s.end).format('MMMM Do YYYY, h:mm:ss a');
         return s;
       });
       $timeout(tick, 5000);
    });
  })();
});
