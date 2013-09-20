angular.module('kucun.controller', [])
    .controller('kucunCtrl', ['$scope', 'Dealer', 'DealerService', '$filter',  function ($scope, Dealer, DealerService, $filter) {
        $scope.isDone =  ($scope.$parent.$parent.doneMenus.indexOf(parseInt(DealerService.getSelectedMenu())) !== -1);

        $scope.accountReceivables= [];
        var salesSet = [];
        var accountItems = Dealer.getInventory({}, function () {
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

            var accountReceivables = Dealer.getInventoryDuration({dealerID: DealerService.getDealerId(), validDate: DealerService.getValidDate(), departmentID: DealerService.getSelectedDept()},
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

        $scope.autoSaveAccountReceivables = function()
        {
            if (this.form.$invalid)
            {
                 return;
            }
            var postData = {};
            postData.dealerID = DealerService.getDealerId();
            postData.departmentID = DealerService.getSelectedDept();
            postData.validDate =  DealerService.getValidDate();
            postData.updateBy =  DealerService.getUserName();
            postData.detail = [];
            postData.detail.push({
                itemID: this.accountInRange.id,
                amount:  this.accountInRange.amount,
                durationID: this.accountInRange.durationID
            });

            var success = function(){
                this.accountInRange.sign = "icon-check-sign green";
                var currentDate = new Date();
                $scope.autoSaveTime =  "上次自动保存于"+currentDate.getHours()+"点"+currentDate.getMinutes()+"分"+currentDate.getSeconds()+"秒";
                $scope.autoSaveClass = "text-success";
            };

            var failed = function()
            {
                this.accountInRange.sign = "icon-remove-sign red";
                $scope.autoSaveTime =  "自动保存失败";
                $scope.autoSaveClass = "text-error";
            }

            Dealer.saveInventoryDuration({},postData, $.proxy(success, this), $.proxy(failed, this));
        }

        $scope.toggleMark = function () {
            var postData = {};
            postData.dealerID = DealerService.getDealerId();
            postData.itemID =  DealerService.getSelectedMenu();
            postData.validDate =  DealerService.getValidDate();
            postData.updateBy =  DealerService.getUserName();

            Dealer.saveStatus({}, postData,function(){
                var navLink = $("#" + DealerService.getSelectedMenu());
                navLink.children().remove();
                if (!$scope.isDone)
                {
                    $scope.$parent.$parent.doneMenus.push(parseInt(DealerService.getSelectedMenu()));
                    navLink.append($('<i class="icon-check-sign" style="color:green;display:inline"></i>'));
                }
                else
                {
                    $scope.$parent.$parent.doneMenus = jQuery.grep($scope.$parent.$parent.doneMenus, function(value) {
                        return value != parseInt(DealerService.getSelectedMenu());
                    });
                }
                $scope.isDone = !$scope.isDone;
            });
        }
    }]);