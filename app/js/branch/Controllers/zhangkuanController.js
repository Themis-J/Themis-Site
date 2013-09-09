angular.module('sunyi.controller', [])
    .controller('sunyiCtrl', ['$scope', 'Dealer', 'DealerService', function ($scope, Dealer, DealerService) {

        $scope.even = function (cate) {
            return (cate.id % 2 == 1);
        }

        $scope.odd = function (cate) {
            return (cate.id % 2 == 0);
        }

        $scope.accountReceivables= [];
        var salesSet = [];
        var accountItems = Dealer.getAccountItems({}, function () {
            $.each(accountItems.items, function (index, accountItem) {
                accountItem[1] = {};
                accountItem[2] = {};
                accountItem[3] = {};
                accountItem[4] = {};
                salesSet[saleItem.id] = saleItem;
            });

            var accountReceivables = Dealer.getAccountDuration({dealerID: DealerService.getDealerId(), validDate: DealerService.getValidDate(), departmentID: DealerService.getSelectedDept()},
                function () {
                    $.each(accountReceivables.detail, function (index, accountReceivable) {
                        var oneSale = salesSet[accountReceivable.itemID];
                        oneSale[accountReceivable.durationID].amount = accountReceivable.amount;
                        oneSale[accountReceivable.durationID].durationDesc = accountReceivable.durationDesc;
                    });

                    $.each(salesSet, function (index, sale) {
                        if (sale && sale.id) {
                            $scope.accountReceivables.push(sale);
                        }
                    });
                })
        });


        $scope.toggleMark = function () {
            var navLink = $("#" + $scope.itemIndex + "_" + $scope.depatIndex);
            navLink.children().remove();
            navLink.append($('<i class="icon-check-sign" style="color:green;display:inline"></i>'));
        }
    }]);