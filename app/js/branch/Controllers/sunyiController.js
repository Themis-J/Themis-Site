angular.module('sunyi.controller', [])
    .controller('sunyiCtrl', ['$scope', 'Dealer', 'DealerService', function ($scope, Dealer, DealerService) {

        $scope.even = function (cate) {
            return (cate.id%2==1);
        }

        $scope.odd = function (cate) {
            return (cate.id%2==0);
        }

        var generalCates = [6,7];
        var generalCateNames = ['非经营性损益进项', '非经营性损益削项'];

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