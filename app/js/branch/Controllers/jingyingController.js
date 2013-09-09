angular.module('jingying.controller', [])
    .controller('jingyingCtrl', ['$scope', 'Dealer', 'DealerService', function ($scope, Dealer, DealerService) {

        $scope.even = function (cate) {
            if (cate.id < 4 || cate.id == 9) {
                return true;
            }
            return false;
        }

        $scope.odd = function (cate) {
            if (cate.id > 3) {
                return true;
            }
            return false;
        }

        if (DealerService.getSelectedDept() != 0) {
            var generalCates = [1, 2, 3, 4, 5];
            var generalCateNames = ['变动费用', '销售费用', '人工费用', '半固定费用', '固定费用'];
        }
        else {
            var generalCates = [9];
            var generalCateNames = ['其它削项'];
        }

        $scope.generalSales = [];
        for (var i = 0; i < generalCates.length; i++) {
            $scope.generalSales[generalCates[i]] = [];
            $scope.generalSales[generalCates[i]].id = generalCates[i];
            $scope.generalSales[generalCates[i]].cateName = generalCateNames[i];
            $scope.generalSales[generalCates[i]].display = 'hide';
        }

        if (DealerService.getSelectedDept() == 0) {
            for (var i = 0; i < generalCates.length; i++) {
                var salesSet = [];
                var saleItems = Dealer.getGeneral({categoryID: generalCates[i]}, function () {
                    $.each(saleItems.items, function (index, saleItem) {
                        saleItem.amount = 0;
                        salesSet[saleItem.id] = saleItem;
                    });

                    var saleRevenues = Dealer.getGeneralJournal({dealerID: DealerService.getDealerId(), validDate: DealerService.getValidDate(), departmentID: DealerService.getSelectedDept(), categoryID: generalCates[i]},
                        function () {
                            $.each(saleRevenues.detail, function (index, saleRevenue) {
                                var oneSale = salesSet[saleRevenue.itemID];
                                oneSale.amount = saleRevenue.amount;
                            });

                            $.each(salesSet, function (index, sale) {
                                if (sale && sale.id) {
                                    $scope.generalSales[generalCates[i]].push(sale);
                                }
                            });
                        })
                });

                $scope.generalSales[generalCates[i]].display = '';
            }
        }

        $scope.toggleMark = function () {
            var navLink = $("#" + $scope.itemIndex + "_" + $scope.depatIndex);
            navLink.children().remove();
            navLink.append($('<i class="icon-check-sign" style="color:green;display:inline"></i>'));
        }
    }]);