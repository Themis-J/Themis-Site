'use strict';

angular.module('myApp.controllers', []).
  controller('editCtrl', ['$scope',function($scope) {
        $scope.items = ['lirun','jingying', 'sunyi', 'zhangkuan', 'kucun', 'renyuan', 'shui'];
        $scope.deptmts = ['新车销售部','二手车部','租赁事业部','维修部','配件部','钣喷部','水平事业部'];

        $scope.subpage = 'partials/branch/' + $scope.items[0] + '.html';
        $scope.depat =  $scope.deptmts[0];

        $scope.goto = function(itemId, deptmtId)
        {
            $scope.subpage = 'partials/branch/' + $scope.items[itemId] + '.html';
            $scope.depat =  $scope.deptmts[deptmtId];
        }

        $scope.bindEvent = function()
        {
            $('ul.nav.nav-pills li a').click(function() {
                $(this).parent().addClass('active').siblings().removeClass('active');
            });
        }

  }])

  .controller('viewCtrl', ['$scope',function($scope) {

  }]);
