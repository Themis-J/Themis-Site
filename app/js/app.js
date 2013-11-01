'use strict';

angular.module('themis', ['ngRoute', 'themis.directives', 'themis.controllers', 'themis.services', 'themis.config', 'guest.controllers', 'ngSanitize',
        'branch.services', 'branch.controllers', 'lirun.controller', 'jingying.controller','fenhong.controller', 'sunyi.controller', 'kucun.controller', 'zhangkuan.controller', 'renyuan.controller', 'tax.controller',
        'admin.controllers']).
    config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        $routeProvider.when('/branch', {templateUrl: 'partials/branch/edit.html', controller: 'editCtrl'})
            .when('/branch/edit', {templateUrl: 'partials/branch/edit.html', controller: 'editCtrl'})
            .when('/branch/help', {templateUrl: 'partials/branch/help.html', controller: 'helpCtrl'})
            .when('/guest/login', {templateUrl: 'partials/guest/login.html', controller: 'loginCtrl'})
            .when('/admin', {templateUrl: 'partials/admin/admin.html', controller: 'adminCtrl'})
            .when('/admin/addUser', {templateUrl: 'partials/admin/admin.html', controller: 'adminCtrl'})
            .when('/admin/changePass', {templateUrl: 'partials/admin/changePass.html', controller: 'adminCtrl'})
            .when('/forbidden', {templateUrl: 'forbidden.html'})
            .when('/notfound', {templateUrl: 'notfound.html'})
            .when('/error', {templateUrl: 'error.html'})
            .otherwise({redirectTo: 'guest/login'});

        var actionsOnExceptions = ['$q', '$location', function ($q, $location) {
            var success = function (response) {
                return response;
            };

            var error = function (response) {
                switch (response.status) {
                    case 401:
                        $location.path('/guest/login');
                        return $q.reject(response);
                    case 403:
                        $location.path('/forbidden');
                        return $q.reject(response);
                    case 404:
                        $location.path('/notfound');
                        return $q.reject(response);
                    default:
                        return $q.reject(response);
                }
            };

            return function (promise) {
                return promise.then(success, error);
            };
        }];

        $httpProvider.responseInterceptors.push(actionsOnExceptions);
    }])
    .run(function ($rootScope, config, $location, Auth, UserService, DealerService) {
        $rootScope.config = config;

        var routesThatDontRequireAuth = ['/guest'];
        var routesThatForDealer = ['/branch'];
        var routesThatForHead = ['/head'];
        var routesThatForAdmins = ['/admin'];
        var routesNoCheck = ['/forbidden', '/notfound', '/error'];

        // check if current location matches route
        var routeGuest = function (route) {
            var isGuestRoute = false;
            $.each(routesThatDontRequireAuth, function (index, noAuthRoute) {
                if (route.indexOf(noAuthRoute) == 0) {
                    isGuestRoute = true;
                }
            });

            return isGuestRoute;
        };

        // check if current location matches route
        var routeDealer = function (route) {
            var isDealerRoute = false;
            $.each(routesThatForDealer, function (index, dealerRoute) {
                if (route.indexOf(dealerRoute) == 0) {
                    isDealerRoute = true;
                }
            });

            return isDealerRoute;
        };

        // check if current location matches route
        var routeHead = function (route) {
            var isHeadRoute = false;
            $.each(routesThatForHead, function (index, headRoute) {
                if (route.indexOf(headRoute) == 0) {
                    isHeadRoute = true;
                }
            });

            return isHeadRoute;
        };

        // check if current location matches route
        var routeAdmin = function (route) {
            var isAminRoute = false;
            $.each(routesThatForAdmins, function (index, adminRoute) {
                if (route.indexOf(adminRoute) == 0) {
                    isAminRoute = true;
                }
            });

            return isAminRoute;
        };

        var isNoCheckRoutes = function(route) {
            var noCheck = false;
            $.each(routesNoCheck, function (index, freeRoutes) {
                if (route.indexOf(freeRoutes) == 0) {
                    noCheck = true;
                }
            });

            return noCheck;
        }

        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if (routeGuest($location.url()) && UserService.validateRoleGuest()) {
                return;
            }

            if (isNoCheckRoutes($location.url()))
            {
              return;
            }

            var curUser = Auth.isAlive({}, function () {
                    UserService.setupUser({
                        userAlias: curUser.username,
                        role: curUser.role
                    });

                    if (curUser.dealer) {
                        DealerService.setDealerId(curUser.dealer.id);
                        DealerService.setDealerFullName(curUser.dealer.fullName);
                    }

                    if (routeGuest($location.url()) && !UserService.validateRoleGuest()) {
                        //If a user(dealer or head) hits a hit
                        if (UserService.validateRoleDealer()) {
                            $location.path('/branch');
                        }
                        //If a admin
                        if (UserService.validateRoleAdmin()) {
                            $location.path('/admin');
                        }
                    }
                    else {
                        if (routeDealer($location.url()) && !UserService.validateRoleDealer()) {
                            $location.path('/forbidden');
                        }
                        else if (routeHead($location.url()) && !UserService.validateRoleHead()) {
                            $location.path('/forbidden');
                        }
                        else if (routeAdmin($location.url()) && !UserService.validateRoleAdmin()) {
                            $location.path('/forbidden');
                        }
                    }
                },
                function () {
                    $location.path('/guest/login');
                });
        });
    });



