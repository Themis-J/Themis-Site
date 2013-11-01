'use strict';

angular.module('admin.controllers', [])
    .controller('adminCtrl', ['$scope', '$location', 'Auth', 'UserService', function ($scope, $location, Auth, UserService) {
        $scope.innerPage = 'partials/admin/addUser.html';

        $scope.jumpTo = function (page) {
            $scope.innerPage = 'partials/admin/' + page + '.html';
        }
    }])
    .controller('addUserCtrl', ['$scope', '$location', 'Auth', 'UserService', 'Dealer', 'User', function ($scope, $location, Auth, UserService, Dealer, User) {
        $scope.userAlias = '';
        $scope.password1 = "";
        $scope.password2 = "";

        $scope.msg = "";
        $scope.msgClass = "";

        $scope.roles = [
            {name: '分销商', id: 2},
            {name: '总部', id: 3},
            {name: '管理员', id: 3},
            {name: '超级管理员', id: 0}
        ];

        $scope.role = $scope.roles[0];

        var dealers = Dealer.list({}, function(){
            $scope.dealers = dealers.items;

            $scope.dealer =  $scope.dealers[0];
        });

        $scope.addUser = function(){
            var user = {};
            user.username = $scope.userAlias;
            user.password = $scope.password1;
            user.userRole = $scope.role.id;
            if ($scope.dealer)
            {
                user.dealerID = $scope.dealer.id;
            }
            User.addUser({}, user, function(){
                $scope.msg = "新用户创建成功！";
                $scope.msgClass = "text-success";
            }, function(data){
                $scope.msg = "新用户创建失败，请确认用户名是否唯一";
                $scope.msgClass = "text-error";
            });
        }

    }])
    .controller('adminHeadCtrl', ['$scope', '$location', 'Auth', 'UserService', function ($scope, $location, Auth, UserService) {
        $scope.signout = function() {
            Auth.logout({}, function () {
                UserService.setupUser(null);
                $location.path('/guest/login');
            })
        }
    }])
    .controller('changePassCtrl', ['$scope', '$location', 'Auth', 'UserService', 'Dealer', 'User', function ($scope, $location, Auth, UserService, Dealer, User) {
        $scope.userAlias = '';
        $scope.curPassword = "";
        $scope.password1 = "";
        $scope.password2 = "";

        $scope.msg = "";
        $scope.msgClass = "";

        $scope.resetPass = function(){
            var user = {};
            user.username = $scope.userAlias;
            user.oldPassword = $scope.curPassword;
            user.newPassword = $scope.password1;
            User.resetPass({}, user, function(){
                $scope.msg = "密码修改成功！";
                $scope.msgClass = "text-success";
            }, function(data){
                $scope.msg = "密码修改失败，请稍后再试或联系管理员。";
                $scope.msgClass = "text-error";
            });
        }

    }])
;