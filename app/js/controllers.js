'use strict';

angular.module('themis.controllers', []).
    controller('editCtrl', ['$scope', '$route', '$location', 'DealerService', 'Dealer', function ($scope, $route, $location, DealerService, Dealer) {
        $scope.items = ['lirun', 'jingying', 'sunyi', 'zhangkuan', 'kucun', 'renyuan', 'shui', 'welcome'];
        $scope.itemNames = ['收入与毛利润', '经营费用', '非经营性损益', '应收账款', '库存', '人员管理', '所得税', "欢迎使用"];
        $scope.doneMenus = [];

        var datepicker = $("#datepicker").datepicker({
            changeMonth: true,
            changeYear: true,
            showButtonPanel: false,
            dateFormat: 'yy年 mm月',
            defaultDate: new Date(DealerService.getSelectedYear(), DealerService.getSelectedMonth(), 1),
            currentText: '本月',
            closeText: '关闭',
            prevText: '<上月',
            nextText: '下月>',
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'],
            onClose: function (dateText, inst) {
                var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                DealerService.setSelectedMonth(month);
                var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                DealerService.setSelectedYear(year);

                $(this).datepicker("option", "defaultDate", new Date(year, month, 1));
                $(this).datepicker('setDate', new Date(year, month, 1));

                intEditPage();
            }
        });
        $("#datepicker").datepicker('setDate', new Date(DealerService.getSelectedYear(), DealerService.getSelectedMonth(), 1));

        $scope.goto = function (itemId, deptmtId, dept, menuId) {
            $('li').removeClass('active');

            if (menuId != -1) {
                $('#' + menuId).parent().addClass('active');
                if ($('#' + menuId).hasClass('accordion-toggle')) {
                    $(".accordion-body.in").collapse('toggle');
                }
                else {
                    $('#' + menuId).parents(".accordion-group").find("i.icon-chevron-right").addClass('icon-chevron-down');
                    $('#' + menuId).parents('.accordion-body').addClass('in');
                }
            }
            else {
                $(".accordion-body.in").collapse('toggle');
            }

            $scope.subpage = 'partials/branch/loading.html';
            $scope.$apply(function () {
            });

            $scope.itemName = $scope.itemNames[itemId];
            $scope.depat = dept;
            $scope.validateDate = DealerService.getValidDate();

            DealerService.setSelectedItem(itemId);
            DealerService.setSelectedDept(deptmtId);
            DealerService.setSelectedMenu(menuId);

            $scope.subpage = 'partials/branch/' + $scope.items[itemId] + '_' + deptmtId + '.html';
            $scope.$apply(function () {
            });
        }

        $scope.bindEvent = function () {
            $('ul.nav.nav-pills li a').click(function () {
                $(this).parent().addClass('active').siblings().removeClass('active');
            });
        }

        intEditPage();

        function intEditPage() {
            $('a i.icon-check-sign').remove();
            $scope.doneMenus = [];

            var results = Dealer.getStatus({dealerID: DealerService.getDealerId(), validDate: DealerService.getValidDate()}, function () {
                $.each(results.detail, function (index, result) {
                    $scope.doneMenus.push(result.id);
                    var navLink = jQuery("#" + result.id);
                    navLink.children().remove();
                    var checkSign = '<i class="icon-check-sign" style="color:green;"></i>';
                    navLink.append(checkSign);
                });

                if ($('#collapseOne').find('i.icon-check-sign').size() == 7) {
                    $('#one').append($('<i class="icon-check-sign" style="color:green;display:inline"></i>'));
                }

                if ($('#collapseTwo').find('i.icon-check-sign').size() == 8) {
                    $('#two').append($('<i class="icon-check-sign" style="color:green;display:inline"></i>'));
                }

                if ($('#collapsFive').find('i.icon-check-sign').size() == 3) {
                    $('#five').append($('<i class="icon-check-sign" style="color:green;display:inline"></i>'));
                }
                if ($('#collapsSix').find('i.icon-check-sign').size() == 2) {
                    $('#six').append($('<i class="icon-check-sign" style="color:green;display:inline"></i>'));
                }

                $scope.goto(DealerService.getSelectedItem(), DealerService.getSelectedDept(), DealerService.getSelectedDeptString(), DealerService.getSelectedMenu());
            });
        }

        $scope.$on('$includeContentLoaded', function () {
        });
    }]);