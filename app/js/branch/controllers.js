'use strict';

angular.module('branchApp.controllers', []).
  controller('editCtrl', ['$scope','$route','$location','DealerService', function($scope,$route,$location, DealerService) {
        $scope.items = ['lirun','jingying', 'sunyi', 'zhangkuan', 'kucun', 'renyuan', 'shui'];
        $scope.itemNames = ['收入与毛利润','经营费用', '非经营性损益', '应收账款', '库存', '人员管理', '所得税'];
        $scope.deptmts = ['','新车销售部','二手车部','租赁事业部','维修部','配件部','钣喷部','其他部门'];

        $scope.itemIndex = 0;
        $scope.subpage = 'partials/branch/' + $scope.items[0] + '.html';
        $scope.depatIndex = 0;
        $scope.itemName = $scope.itemNames[0];
        $scope.depat =  $scope.deptmts[1];

        $scope.goto = function(itemId, deptmtId)
        {
            $scope.subpage = 'partials/branch/loading.html';
            $scope.$apply(function(){
            });

            $scope.itemIndex = itemId;
            $scope.itemName = $scope.itemNames[itemId];
            $scope.depatIndex = deptmtId;
            $scope.depat =  $scope.deptmts[deptmtId];
            DealerService.setSelectedItem(itemId);
            DealerService.setSelectedDept(deptmtId);

            $scope.subpage = 'partials/branch/' + $scope.items[itemId] + '.html';
        }

        $scope.bindEvent = function()
        {
            $('ul.nav.nav-pills li a').click(function() {
                $(this).parent().addClass('active').siblings().removeClass('active');
            });
        }

        $scope.$on('$includeContentLoaded', function () {
        });
  }])

  .controller('viewCtrl', ['$scope',function($scope) {

  }])

   .controller('lirunCtrl', ['$scope',function($scope) {

   }]);
