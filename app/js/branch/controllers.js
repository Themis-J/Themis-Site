'use strict';

angular.module('branchApp.controllers', []).
  controller('editCtrl', ['$scope','$route','$location','DealerService', function($scope,$route,$location, DealerService) {
        $scope.items = ['lirun','jingying', 'sunyi', 'zhangkuan', 'kucun', 'renyuan', 'shui'];
        $scope.deptmts = ['其他部门','新车销售部','二手车部','租赁事业部','维修部','配件部','钣喷部','水平事业部'];

        $scope.itemIndex = 0;
        $scope.subpage = 'partials/branch/' + $scope.items[0] + '.html';
        $scope.depatIndex = 0;
        $scope.depat =  $scope.deptmts[0];
        $scope.autoSaveTime = getDateString();

        $scope.goto = function(itemId, deptmtId)
        {
            $scope.subpage = 'partials/branch/loading.html';
            $scope.$apply();

            $scope.itemIndex = itemId;
            $scope.depatIndex = deptmtId;
            $scope.depat =  $scope.deptmts[deptmtId];
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
            $.each($(':input[type=text]'), function(index, input){
                if($(input).val() && !isNaN($(input).val()))
                {
                    $(input).siblings().remove();
                    $(input).parent().append($('<i class="icon-check-sign" style="color:green;display:inline"></i>'));
                }
                else
                {
                    $(input).siblings().remove();
                }
            });

            $(':input[type=text]').blur(function(){
                if($(this).val() && !isNaN($(this).val()))
                {
                    $scope.$apply(function(){
                        $scope.autoSaveTime = getDateString();
                    }) ;

                    $(this).siblings().remove();
                    var icon =  $('<i class="icon-check-sign" style="color:green;display:inline"></i>');
                    $(this).parent().append(icon);
                }
                else
                {
                    $(this).siblings().remove();
                }
            });
        });

        function getDateString()
        {
            var currentDate = new Date();
            return  currentDate.getHours()+"点"+currentDate.getMinutes()+"分"+currentDate.getSeconds()+"秒";
        }
  }])

  .controller('viewCtrl', ['$scope',function($scope) {

  }])

   .controller('lirunCtrl', ['$scope',function($scope) {

   }]);
