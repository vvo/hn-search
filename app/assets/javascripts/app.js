var app = angular.module('HNSearch', [
  'ngRoute',
  'templates'
]).config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
  // setup CSRF token
  $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = $('meta[name="csrf-token"]').attr('content');

  // use JSON by default
  $httpProvider.defaults.headers.common.Accept = 'application/json';

  // routes
  $routeProvider
    .when('/', { templateUrl: 'home.html', controller: 'HomeCtrl' })
    ;
}]);

app.controller('HomeCtrl', ['$scope', function($scope) {
  $scope.world = 'World';
}]);