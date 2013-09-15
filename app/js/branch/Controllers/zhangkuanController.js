angular.module('zhangkuan.controller', [])
    .controller('zhangkuanCtrl', ['$scope', 'Dealer', 'DealerService', function ($scope, Dealer, DealerService) {

        $scope.accountReceivables= [];
        var salesSet = [];
        var accountItems = Dealer.getAccountItems({}, function () {
            $.each(accountItems.items, function (index, accountItem) {
                accountItem.data = [];
                accountItem.data[1] = {};
                accountItem.data[1].active = false;
                accountItem.data[1].id = accountItem.id;
                accountItem.data[1].durationDesc = "0-30 天";
                accountItem.data[1].durationID = 1;
                accountItem.data[2] = {};
                accountItem.data[2].active = false;
                accountItem.data[2].durationDesc = "31-60 天";
                accountItem.data[2].durationID = 2;
                accountItem.data[2].id = accountItem.id;
                accountItem.data[3] = {};
                accountItem.data[3].active = false;
                accountItem.data[3].durationDesc = "61-90 天";
                accountItem.data[3].durationID = 3;
                accountItem.data[3].id = accountItem.id;
                accountItem.data[4] = {};
                accountItem.data[4].active = false;
                accountItem.data[4].durationDesc = "超过90 天";
                accountItem.data[4].durationID = 4;
                accountItem.data[4].id = accountItem.id;
                salesSet[accountItem.id] = accountItem;
            });

            var accountReceivables = Dealer.getAccountDuration({dealerID: DealerService.getDealerId(), validDate: DealerService.getValidDate(), departmentID: DealerService.getSelectedDept()},
                function () {
                    $.each(accountReceivables.detail, function (index, accountReceivable) {
                        var oneSale = salesSet[accountReceivable.itemID];
                        oneSale.data[accountReceivable.durationID].durationID = accountReceivable.durationID;
                        oneSale.data[accountReceivable.durationID].amount = accountReceivable.amount;
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

        $scope.autoSaveAccountReceivables = function()
        {
            if (isNaN(this.accountInRange.amount) )
            {
                return;
            }
            var postData = {};
            postData.dealerID = DealerService.getDealerId();
            postData.validDate =  DealerService.getValidDate();
            postData.updateBy =  DealerService.getUserName();
            postData.detail = [];
            postData.detail.push({
                itemID: this.accountInRange.id,
                amount:  this.accountInRange.amount,
                durationID: this.accountInRange.durationID
            });
            this.accountInRange.active = true;
            Dealer.saveAccountDuration({},postData, function(){
                var currentDate = new Date();
                $scope.autoSaveTime =  "上次自动保存于"+currentDate.getHours()+"点"+currentDate.getMinutes()+"分"+currentDate.getSeconds()+"秒";
                $scope.autoSaveClass = "alt alt-success";
            }, function(){
                $scope.autoSaveTime =  "自动保存失败";
                $scope.autoSaveClass = "alt alt-error";
            });
        }
    }]);