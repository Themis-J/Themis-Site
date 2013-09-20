'use strict';

angular.module('branchApp.controllers', []).
  controller('editCtrl', ['$scope','$route','$location','DealerService','Dealer', function($scope,$route,$location, DealerService, Dealer) {
        $scope.items = ['lirun','jingying', 'sunyi', 'zhangkuan', 'kucun', 'renyuan', 'shui','welcome'];
        $scope.itemNames = ['收入与毛利润','经营费用', '非经营性损益', '应收账款', '库存', '人员管理', '所得税', "欢迎使用"];
        $scope.deptmts = ['','新车销售部','二手车部','租赁事业部','维修部','配件部','钣喷部','其他部门',"新车","二手车","备件与精品", "工时", "经销商人员"];
        $scope.doneMenus = [];

        var datepicker = $("#datepicker").datepicker({
            changeMonth: true,
            changeYear: true,
            showButtonPanel: false,
            dateFormat: 'yy年 mm月',
            currentText: '本月',
            closeText: '关闭',
            prevText: '<上月',
            nextText: '下月>',
            monthNames: ['一月','二月','三月','四月','五月','六月',
                '七月','八月','九月','十月','十一月','十二月'],
            monthNamesShort:['一月','二月','三月','四月','五月','六月',
                '七月','八月','九月','十月','十一月','十二月'],
            onClose: function(dateText, inst)
            {
                var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                DealerService.setSelectedMonth(month);
                var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                DealerService.setSelectedYear(year);

                $(this).datepicker('setDate', new Date(year, month, 1));

                intEditPage();
            }
        });
        $("#datepicker").datepicker('setDate', new Date(DealerService.getSelectedYear(), DealerService.getSelectedMonth(), 1));

        $scope.goto = function(itemId, deptmtId, menuId)
        {
            $scope.subpage = 'partials/branch/loading.html';
            $scope.$apply(function(){
            });

            $scope.itemName = $scope.itemNames[itemId];
            $scope.depat =  $scope.deptmts[deptmtId];
            $scope.validateDate = DealerService.getValidDate();

            DealerService.setSelectedItem(itemId);
            DealerService.setSelectedDept(deptmtId);
            DealerService.setSelectedMenu(menuId);

            $scope.subpage = 'partials/branch/' + $scope.items[itemId] + '.html';
            $scope.$apply(function(){
            });
        }

        $scope.bindEvent = function()
        {
            $('ul.nav.nav-pills li a').click(function() {
                $(this).parent().addClass('active').siblings().removeClass('active');
            });
        }

        intEditPage();

        function intEditPage()
        {
            $('ul li a').children().remove();
            $scope.doneMenus = [];

            var results = Dealer.getStatus({dealerID: DealerService.getDealerId(), validDate: DealerService.getValidDate()}, function(){
                $.each(results.detail, function(index, result){
                    $scope.doneMenus.push(result.id);
                    var navLink = jQuery("#" + result.id);
                    navLink.children().remove();
                    var checkSign = '<i class="icon-check-sign" style="color:green;"></i>';
                    navLink.append(checkSign);
                });

                if (DealerService.getSelectedMenu() != -1)
                {
                    $('#'+DealerService.getSelectedMenu()).parent().addClass('active');
                    $('#'+DealerService.getSelectedMenu()).parent().parent().parent().parent().parent().addClass('in');
                }

                $scope.goto(DealerService.getSelectedItem(), DealerService.getSelectedDept(), DealerService.getSelectedMenu());
            });
        }

        $scope.$on('$includeContentLoaded', function () {
        });
  }]);