'use strict';

angular.module('branchApp', ['branch.config', 'branchApp.filters', 'branchApp.services', 'branchApp.directives', 'branchApp.controllers', 'lirun.controller','jingying.controller','sunyi.controller']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/edit', {templateUrl: 'partials/branch/edit.html', controller: 'editCtrl'});
    $routeProvider.when('/view', {templateUrl: 'partials/branch/view.html', controller: 'viewCtrl'});
    $routeProvider.otherwise({redirectTo: '/edit'});
  }]);



