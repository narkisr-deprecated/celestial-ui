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

  $scope.jobs = [];

  (function tick() {
    Jobs.running({},function(data,resp){
        $scope.jobs = data.jobs;
        $timeout(tick, 5000);
    });

    Jobs.done({page:1, offset:10},function(data,resp){
       var byStart = _.sortBy(data.jobs, function(s) {return s.end;}).reverse();
        $scope.statuses = _.map(byStart, function(s) {
        console.log(s);
        var source = s['_source'];
        source.start = moment(source.start).format('MMMM Do YYYY, h:mm:ss a');
        source.end = moment(source.end).format('MMMM Do YYYY, h:mm:ss a');
        return source;
       });
    });
  })();
});
