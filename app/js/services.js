'use strict';

/* Services */

// In this case it is a simple value service.
angular.module('themis.services', ['ngResource', 'ngCookies'])
    .factory('Auth', ['$resource', 'config', function ($resource, config) {
        return $resource(config.service.url + '/auth/:uri', {}, {
            login: {method: 'POST', params: {uri: "login"}, isArray: false},
            isAlive: {method: 'GET', params: {uri: "isAlive"}, isArray: false},
            logout: {method:'POST', params: {uri: "logout"}, isArray:false}
        });
    }])
    .factory('UserService', ['$cookies', function ($cookies) {
        var currentUser = {userAlias: '', role: 'Guest'};
        var adminRoles = ["Admin", "Super"];
        var dealerRoles = ["Dealer"];
        var headRoles = ["HeadQuater"];
        var guestRoles = ["Guest"];

        return {
            setupUser: function (user) {
                if (user)
                {
                    currentUser.userAlias = user.userAlias;
                    $cookies.userAlias =  user.userAlias;
                    currentUser.role = user.role;
                }
                else
                {
                    currentUser.userAlias =  '';
                    $cookies.userAlias =   '';
                    currentUser.role = 'guest';
                }
            },
            validateRoleAdmin: function () {
                return adminRoles.indexOf(currentUser.role) != -1;
            },
            validateRoleDealer: function () {
                return dealerRoles.indexOf(currentUser.role) != -1;
            },
            validateRoleHead: function () {
                return headRoles.indexOf(currentUser.role) != -1;
            },
            validateRoleGuest: function () {
                return guestRoles.indexOf(currentUser.role) != -1;
            },
            getCurUserAlias: function () {
                if ($cookies.userAlias != '')
                {
                    return $cookies.userAlias;
                }
                else
                {
                    return currentUser.userAlias;
                }
            }
        };
    }])
;
