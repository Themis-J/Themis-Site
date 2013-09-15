angular.module('lirun.controller', [])
    .controller('lirunCtrl', ['$scope', 'Dealer', 'DealerService', '$filter', function ($scope, Dealer, DealerService, $filter) {
        $scope.isJiaocheActive = false;
        $scope.isHuocheActive = false;
        $scope.isQitaJinxiangActive = false;
        $scope.isFujiaActive = false;
        $scope.isQitaShouruActive = false;

        $scope.vehicleSummary = [];
        $scope.salesSummary = [];
        $scope.generalSummary = [];

        $scope.amountChange = function(type, list, curOne)
        {
            if (!this.form.amount.$invalid)
            {
                var lists = eval(list);
                var newSummary = 0;
                var filter = {categoryID : curOne.categoryID};
                var filtered = $filter('filter')(lists, filter);
                $.each(filtered, function(index, filteredOne){
                    if (!isNaN(filteredOne.amount))
                    {
                        newSummary += parseInt(filteredOne.amount);
                    }
                });
                var summary = eval(type);
                summary[curOne.categoryID] = newSummary;
            }
        }

        if (DealerService.getSelectedDept() == 1) {
            $scope.isJiaocheActive = true;
            $scope.isHuocheActive = true;
            $scope.vehicleRevenues = [];

            var vehicleSet = [];
            var vehicles = Dealer.getVehicles({}, function () {
                $.each(vehicles.items, function (index, vehicle) {
                    vehicle.active = false;
                    vehicleSet[vehicle.id] = vehicle;
                    $scope.vehicleSummary[vehicle.categoryID] = 0;
                });

                var vehiclesRevenue = Dealer.getVehicleRevenue({dealerID: DealerService.getDealerId(), validDate: DealerService.getValidDate(), departmentID: DealerService.getSelectedDept()},
                    function () {
                        $.each(vehiclesRevenue.detail, function (index, vehicle) {
                            var oneVehicle = vehicleSet[vehicle.vehicleID];
                            oneVehicle.count = vehicle.count;
                            oneVehicle.amount = vehicle.amount;
                            oneVehicle.margin = vehicle.margin;
                            if (!isNaN(oneVehicle.amount))
                            {
                                $scope.vehicleSummary[vehicle.categoryID] += parseInt(oneVehicle.amount);
                            }
                        });

                        $.each(vehicleSet, function (index, vehicle) {
                            if (vehicle && vehicle.id) {
                                $scope.vehicleRevenues.push(vehicle);
                            }
                        });

                    }
                );
            });
        }

        if (DealerService.getSelectedDept() >= 1 && DealerService.getSelectedDept() < 7) {
            $scope.isFujiaActive = true;
            $scope.isQitaShouruActive = true;
            $scope.sales = [];

            var salesSet = [];
            var saleItems = Dealer.getSales({}, function () {
                $.each(saleItems.items, function (index, saleItem) {
                    saleItem.active = false;
                    salesSet[saleItem.id] = saleItem;
                    $scope.salesSummary[saleItem.categoryID] = 0;
                });

                var saleRevenues = Dealer.getSalesRevenue({dealerID: DealerService.getDealerId(), validDate: DealerService.getValidDate(), departmentID: DealerService.getSelectedDept()},
                    function () {
                        $.each(saleRevenues.detail, function (index, saleRevenue) {
                            var oneSale = salesSet[saleRevenue.itemID];
                            oneSale.count = saleRevenue.count;
                            oneSale.amount = saleRevenue.amount;
                            oneSale.margin = saleRevenue.margin;
                            if (!isNaN(oneSale.amount))
                            {
                                $scope.salesSummary[oneSale.categoryID] += parseInt(oneSale.amount);
                            }
                        });

                        $.each(salesSet, function (index, sale) {
                            if (sale && sale.id) {
                                $scope.sales.push(sale);
                            }
                        });
                    })
            });

        }

        if (DealerService.getSelectedDept() == 7) {
            $scope.isQitaJinxiangActive = true;
            $scope.generalSales = [];

            var generalSet = [];
            var genetalItems = Dealer.getGeneral({categoryID: 8}, function () {
                $.each(genetalItems.items, function (index, saleItem) {
                    saleItem.active = false;
                    generalSet[saleItem.id] = saleItem;
                    $scope.generalSummary[saleItem.categoryID] = 0;
                });

                var generalRevenues = Dealer.getGeneralJournal({dealerID: DealerService.getDealerId(), validDate: DealerService.getValidDate(), departmentID: DealerService.getSelectedDept(), categoryID: 8},
                    function () {
                        $.each(generalRevenues.detail, function (index, saleRevenue) {
                            var oneSale = generalSet[saleRevenue.itemID];
                            oneSale.amount = saleRevenue.amount;
                            if (!isNaN(oneSale.amount))
                            {
                                $scope.generalSummary[oneSale.categoryID] += parseInt(oneSale.amount);
                            }
                        });

                        $.each(generalSet, function (index, sale) {
                            if (sale && sale.id) {
                                $scope.generalSales.push(sale);
                            }
                        });
                    })
            });
        }

        $scope.toggleMark = function () {
            var navLink = $("#" + DealerService.getSelectedItem() + "_" + DealerService.getSelectedDept());
            navLink.children().remove();
            navLink.append($('<i class="icon-check-sign" style="color:green;display:inline"></i>'));
        }

        $scope.autoSaveVehivleRevenue = function(proxy)
        {
            if(!this.form.$invalid)
            {
                var postData = {};
                postData.dealerID = DealerService.getDealerId();
                postData.departmentID = DealerService.getSelectedDept();
                postData.validDate =  DealerService.getValidDate();
                postData.updateBy =  DealerService.getUserName();
                postData.detail = [];
                postData.detail.push({
                    itemID: this.vehivleRevenue.id,
                    amount:  this.vehivleRevenue.amount,
                    margin: this.vehivleRevenue.margin,
                    count: this.vehivleRevenue.count
                });
                Dealer.saveVehicleRevenue({},postData,function(){
                    this.vehivleRevenue.active = true;
                    var currentDate = new Date();
                    $scope.autoSaveTime =  "上次自动保存于"+currentDate.getHours()+"点"+currentDate.getMinutes()+"分"+currentDate.getSeconds()+"秒";
                    $scope.autoSaveClass = "alt alt-success";
                }, function(){
                    $scope.autoSaveTime =  "自动保存失败";
                    $scope.autoSaveClass = "alt alt-error";
                });
            }
        }

        $scope.autoSaveSalesRevenue = function()
        {
            if(!this.form.$invalid)
            {
                var postData = {};
                postData.dealerID = DealerService.getDealerId();
                postData.departmentID = DealerService.getSelectedDept();
                postData.validDate =  DealerService.getValidDate();
                postData.updateBy =  DealerService.getUserName();
                postData.detail = [];
                postData.detail.push({
                    itemID: this.sale.id,
                    amount:  this.sale.amount,
                    margin: this.sale.margin,
                    count: this.sale.count
                });
                Dealer.saveSalesRevenue({},postData,function(a,b,c,d){
                    this.sale.active = true;
                    var currentDate = new Date();
                    $scope.autoSaveTime =  "上次自动保存于"+currentDate.getHours()+"点"+currentDate.getMinutes()+"分"+currentDate.getSeconds()+"秒";
                    $scope.autoSaveClass = "alt alt-success";
                }, function(){
                    $scope.autoSaveTime =  "自动保存失败";
                    $scope.autoSaveClass = "alt alt-error";
                });
            }
        }

        $scope.autoSaveGeneralRevenue = function()
        {
            if(!this.form.$invalid)
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
                Dealer.saveGeneralJournal({},postData,function(){
                    this.generalSale.active = true;
                    var currentDate = new Date();
                    $scope.autoSaveTime =  "上次自动保存于"+currentDate.getHours()+"点"+currentDate.getMinutes()+"分"+currentDate.getSeconds()+"秒";
                    $scope.autoSaveClass = "alt alt-success";
                }, function(){
                    $scope.autoSaveTime =  "自动保存失败";
                    $scope.autoSaveClass = "alt alt-error";
                });
            }
        }

    }]);