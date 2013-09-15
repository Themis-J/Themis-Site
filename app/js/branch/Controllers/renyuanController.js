angular.module('renyuan.controller', [])
    .controller('renyuanCtrl', ['$scope', 'Dealer', 'DealerService', function ($scope, Dealer, DealerService) {
        $scope.isWerixiufeeActive = false;
        $scope.isBanpenfeeActive = false;
        $scope.isWeixiusummaryActive = false;
        $scope.isBanpensummaryActive = false;
        $scope.isWeixiuacclocationActive = false;
        $scope.isBanpenacclocationActive = false;

        if (DealerService.getSelectedDept()==1) {
            $scope.isWerixiufeeActive = true;
            $scope.isBanpenfeeActive = true;
            $scope.isWeixiusummaryActive = true;
            $scope.isBanpensummaryActive = true;

            loadpage1();
        }
        else {
            $scope.isWeixiuacclocationActive = true;
            $scope.isBanpenacclocationActive = true;

            var allocationSet = [];
            var depts = [4,6];
            var hrItems = Dealer.getHR({}, function () {
                $.each(hrItems.items, function (index, saleItem) {
                    $.each(depts, function(index, dept){
                        if (!allocationSet[dept])
                        {
                            allocationSet[dept] = [];
                        }
                        var oneItem = {};
                        $.extend(oneItem, saleItem);
                        oneItem.active = false;
                        oneItem.dept = dept;
                        allocationSet[dept][saleItem.id] = oneItem;
                    });
                });

                loadHrAllocation(allocationSet,depts, 0);
            });
        }

        $scope.employeeFees = [];
        $scope.employeeFeeSummary = [];
        $scope.hrAllocations = [];

        function loadpage1()
        {
            var salesSet = [];
            var depts = [4,6];
            var saleItems = Dealer.getEmployee({}, function () {
                $.each(saleItems.items, function (index, saleItem) {
                    $.each(depts, function(index, dept){
                        if (!salesSet[dept])
                        {
                            salesSet[dept] = [];
                        }
                        var oneItem = {};
                        $.extend(oneItem, saleItem);
                        oneItem.active = false;
                        oneItem.dept = dept;
                        oneItem.data = [];
                        oneItem.data[1] = {feeTypeID:1};
                        oneItem.data[2] = {feeTypeID:2};
                        oneItem.data[3] = {feeTypeID:3};
                        salesSet[dept][saleItem.id] = oneItem;
                    });
                });

                loadFees(salesSet,depts, 0);
            });

            var summarySet = [];
            var summaryItems = Dealer.getEmployeeSunmmary({}, function () {
                $.each(summaryItems.items, function (index, saleItem) {
                    $.each(depts, function(index, dept){
                        if (!summarySet[dept])
                        {
                            summarySet[dept] = [];
                        }
                        var oneItem = {};
                        $.extend(oneItem, saleItem);
                        oneItem.active = false;
                        oneItem.dept = dept;
                        summarySet[dept][saleItem.id] = oneItem;
                    });
                });

                loadFeeSummary(summarySet, depts, 0);
            });
        }

        $scope.toggleMark = function () {
            var navLink = $("#" + $scope.itemIndex + "_" + $scope.depatIndex);
            navLink.children().remove();
            navLink.append($('<i class="icon-check-sign" style="color:green;display:inline"></i>'));
        }

        $scope.autoSaveFee = function()
        {
            if (isNaN(this.employeeFee.data[1].amount) || isNaN(this.employeeFee.data[2].amount) || isNaN(this.employeeFee.data[3].amount))
            {
                return;
            }
            if(this.employeeFee.data[1].amount && this.employeeFee.data[2].amount && this.employeeFee.data[3].amount)
            {
                var postData = {};
                postData.dealerID = DealerService.getDealerId();
                postData.departmentID = DealerService.getSelectedDept();
                postData.validDate =  DealerService.getValidDate();
                postData.updateBy =  DealerService.getUserName();
                postData.detail = [];
                postData.detail.push({
                    itemID: this.employeeFee.id,
                    amount:  this.employeeFee.data[1].amount,
                    feeTypeID: this.employeeFee.data[1].feeTypeID
                });
                this.employeeFee.active = true;
                var result = Dealer.saveEmployeeFee({},postData,function(){
                    var currentDate = new Date();
                    $scope.autoSaveTime =  "上次自动保存于"+currentDate.getHours()+"点"+currentDate.getMinutes()+"分"+currentDate.getSeconds()+"秒";
                    $scope.autoSaveClass = "alt alt-success";
                }, function(){
                    $scope.autoSaveTime =  "自动保存失败";
                    $scope.autoSaveClass = "alt alt-error";
                });
            }
        }

        $scope.autoSaveAllocation = function()
        {
            if (isNaN(this.hrAllocation.allocation))
            {
                return;
            }
            if(this.hrAllocation.allocation)
            {
                var postData = {};
                postData.dealerID = DealerService.getDealerId();
                postData.departmentID = DealerService.getSelectedDept();
                postData.validDate =  DealerService.getValidDate();
                postData.updateBy =  DealerService.getUserName();
                postData.detail = [];
                postData.detail.push({
                    itemID: this.hrAllocation.id,
                    allocation:  this.hrAllocation.allocation
                });
                this.hrAllocation.active = true;
                var result = Dealer.saveHRAllcation({},postData,function(){
                    var currentDate = new Date();
                    $scope.autoSaveTime =  "上次自动保存于"+currentDate.getHours()+"点"+currentDate.getMinutes()+"分"+currentDate.getSeconds()+"秒";
                    $scope.autoSaveClass = "alt alt-success";
                }, function(){
                    $scope.autoSaveTime =  "自动保存失败";
                    $scope.autoSaveClass = "alt alt-error";
                });
            }
        }

        $scope.autoSaveFeeSummary = function()
        {
            if (isNaN(this.employeeSummary.amount))
            {
                return;
            }
            if(this.employeeSummary.amount)
            {
                var postData = {};
                postData.dealerID = DealerService.getDealerId();
                postData.departmentID = DealerService.getSelectedDept();
                postData.validDate =  DealerService.getValidDate();
                postData.updateBy =  DealerService.getUserName();
                postData.detail = [];
                postData.detail.push({
                    itemID: this.employeeSummary.id,
                    amount:  this.employeeSummary.amount
                });
                this.employeeSummary.active = true;
                var result = Dealer.saveEmployeeFeeSunmmary({},postData,function(){
                    var currentDate = new Date();
                    $scope.autoSaveTime =  "上次自动保存于"+currentDate.getHours()+"点"+currentDate.getMinutes()+"分"+currentDate.getSeconds()+"秒";
                    $scope.autoSaveClass = "alt alt-success";
                }, function(){
                    $scope.autoSaveTime =  "自动保存失败";
                    $scope.autoSaveClass = "alt alt-error";
                });
            }
        }

        function loadFees(salesSet, depts, index)
        {
            if(index >= depts.length)
            {
                  return;
            }
            var saleRevenues = Dealer.getEmployeeFee({dealerID: depts[index], validDate: DealerService.getValidDate(), departmentID: DealerService.getSelectedDept()},
                function () {
                    $.each(saleRevenues.detail, function (index, saleRevenue) {
                        var oneSale = salesSet[saleRevenue.departmentID][saleRevenue.itemID];
                        var oneRow = oneSale.data[saleRevenue.feeTypeID];
                        oneRow.amount = saleRevenue.amount;
                        oneRow.feeTypeID = saleRevenue.feeTypeID;
                        oneRow.feeType = saleRevenue.feeType;
                    });

                    $.each(salesSet, function (index, saleInDept) {
                        if (saleInDept)
                        {
                            $.each(saleInDept, function(index, sale){
                                if (sale && sale.id) {
                                    $scope.employeeFees.push(sale);
                                }
                            })
                        }
                    });
                    loadFees(salesSet, depts, index+1);
                    console.log($scope.employeeFees);
                });
        }

        function loadFeeSummary(summarySet, depts, index)
        {
            if(index >= depts.length)
            {
                return;
            }
            var saleRevenues = Dealer.getEmployeeFeeSunmmary({dealerID: depts[index], validDate: DealerService.getValidDate(), departmentID: DealerService.getSelectedDept()},
                function () {
                    $.each(saleRevenues.detail, function (index, saleRevenue) {
                        var oneSale = summarySet[saleRevenue.departmentID][saleRevenue.itemID];
                        oneSale.amount = saleRevenue.amount;
                    });

                    $.each(summarySet, function (index, saleInDept) {
                        if (saleInDept)
                        {
                            $.each(saleInDept, function(index, sale){
                                if (sale && sale.id) {
                                    $scope.employeeFeeSummary.push(sale);
                                }
                            })
                        }
                    });
                    loadFees(summarySet, depts, index+1);
                });
        }

        function loadHrAllocation(allocationSet, depts, index)
        {
            if(index >= depts.length)
            {
                return;
            }
            var saleRevenues = Dealer.getHRAllocation({dealerID: depts[index], validDate: DealerService.getValidDate(), departmentID: DealerService.getSelectedDept()},
                function () {
                    $.each(saleRevenues.detail, function (index, saleRevenue) {
                        var oneSale = allocationSet[saleRevenue.departmentID][saleRevenue.itemID];
                        oneSale.allocation = saleRevenue.allocation;
                    });

                    $.each(allocationSet, function (index, saleInDept) {
                        if (saleInDept)
                        {
                            $.each(saleInDept, function(index, sale){
                                if (sale && sale.id) {
                                    $scope.hrAllocations.push(sale);
                                }
                            })
                        }
                    });
                    loadFees(allocationSet, depts, index+1);
                });
        }
    }]);