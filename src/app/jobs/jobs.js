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
    done:{method : "GET",url:'/jobs/done', isArray:false},
    running:{method : "GET", params:{page:'@page', offset:'@offset'}, url:'/jobs/running', isArray:false}
  });

  $scope.currentPage = 1;
  $scope.perPage = 10;
  $scope.jobs = [];

  $scope.doneJobs = function() {
    Jobs.done({page:$scope.currentPage, offset:$scope.perPage},function(data,resp){
       $scope.count=data.total;
       $scope.statuses = _.map(data.jobs, function(source) {
         source.start = moment(source.start).format('MMMM Do YYYY, h:mm:ss a');
         source.end = moment(source.end).format('MMMM Do YYYY, h:mm:ss a');
         return source;
       });
    });
  };

  (function tick() {
    Jobs.running({},function(data,resp){
        $scope.jobs = data.jobs;
        $timeout(tick, 5000);
    });
    $scope.doneJobs();
  })();

  $scope.$watch( 'currentPage', $scope.doneJobs);
 
});
