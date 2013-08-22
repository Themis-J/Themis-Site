'use strict';

angular.module('masterApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/report', {templateUrl: 'partials/master/report.html', controller: 'editCtrl'});
        $routeProvider.otherwise({redirectTo: '/report'});
    }]);

