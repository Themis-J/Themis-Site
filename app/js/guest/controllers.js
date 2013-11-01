'use strict';

angular.module('guest.controllers', [])
    .controller('loginCtrl', ['$scope', '$location', 'Auth', 'UserService', function ($scope, $location, Auth, UserService) {
        $scope.userId = "";
        $scope.password = "";
        $scope.loginMsg = "";
        $scope.loginMsgClass = "";

        $scope.toLogin = function () {
            var user = {username: $scope.username, password: $scope.password};
            var curUser = Auth.login({}, user, function () {
                UserService.setupUser({
                    userAlias: curUser.username,
                    role: curUser.role
                });

                if (UserService.validateRoleAdmin()) {
                    $location.path('/admin');
                }
                else if (UserService.validateRoleDealer()) {
                    $location.path('/branch/edit');
                }
                else if (UserService.validateRoleHead()) {
                    $location.path('/head');
                }
            }, function () {
                $scope.loginMsgClass = "text-warning";
                $scope.loginMsg = '登陆失败，用户名或密码错误';
            });
        }
    }]);