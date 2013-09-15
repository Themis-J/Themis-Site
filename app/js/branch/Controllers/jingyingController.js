angular.module('jingying.controller', [])
    .controller('jingyingCtrl', ['$scope', 'Dealer', 'DealerService', function ($scope, Dealer, DealerService) {
        $scope.isBiandongActive = false;
        $scope.isXiaoshouActive = false;
        $scope.isRengongActive = false;
        $scope.isBangudingActive = false;
        $scope.isGudingActive = false;
        $scope.isQitaActive = false;

        if (DealerService.getSelectedDept() != 7) {
            $scope.isBiandongActive = true;
            $scope.isXiaoshouActive = true;
            $scope.isRengongActive = true;
            $scope.isBangudingActive = true;
            $scope.isGudingActive = true;
        }
        else {
            $scope.isQitaActive = true;
        }

        $scope.generalSales = [];

        var salesSet = [];
        var saleItems = Dealer.getGeneral({}, function () {
            $.each(saleItems.items, function (index, saleItem) {
                saleItem.active = false;
                salesSet[saleItem.id] = saleItem;
            });

            var saleRevenues = Dealer.getGeneralJournal({dealerID: DealerService.getDealerId(), validDate: DealerService.getValidDate(), departmentID: DealerService.getSelectedDept()},
                function () {
                    $.each(saleRevenues.detail, function (index, saleRevenue) {
                        var oneSale = salesSet[saleRevenue.itemID];
                        oneSale.amount = saleRevenue.amount;
                    });

                    $.each(salesSet, function (index, sale) {
                        if (sale && sale.id) {
                            $scope.generalSales.push(sale);
                        }
                    });
                })
        });


        $scope.toggleMark = function () {
            var navLink = $("#" + $scope.itemIndex + "_" + $scope.depatIndex);
            navLink.children().remove();
            navLink.append($('<i class="icon-check-sign" style="color:green;display:inline"></i>'));
        }

        $scope.autoSaveGeneralRevenue = function()
        {
            if (isNaN(this.generalSale.amount))
            {
                return;
            }
            if(this.generalSale.amount)
            {
                var postData = {};
                postData.dealerID = DealerService.getDealerId();
                postData.departmentID = DealerService.getSelectedDept();
                postData.validDate =  DealerService.getValidDate();
                postData.updateBy =  DealerService.getUserName();
                postData.detail = [];
                postData.detail.push({
                    itemID: this.generalSale.id,
                    amount:  this.generalSale.amount
                });
               var result = Dealer.saveGeneralJournal({},postData,function(){
                   console.log(result);
                    this.generalSale.active = true;
                    var currentDate = new Date();
                    $scope.autoSaveTime =  "上次自动保存于"+currentDate.getHours()+"点"+currentDate.getMinutes()+"分"+currentDate.getSeconds()+"秒";
                    $scope.autoSaveClass = "alt alt-success";
                }, function(){
                    $scope.autoSaveTime =  "自动保存失败";
                    $scope.autoSaveClass = "alt alt-error";
                });
                result.generalSale = generalSale;
            }
        }
    }]);