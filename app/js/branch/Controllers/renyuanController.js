angular.module('renyuan.controller', [])
    .controller('renyuanCtrl', ['$scope', 'Dealer', 'DealerService', function ($scope, Dealer, DealerService) {
        $scope.isDone = ($scope.$parent.$parent.doneMenus.indexOf(parseInt(DealerService.getSelectedMenu())) !== -1);

        if (DealerService.getSelectedDept() == 11) {

            loadpage1();
        }
        else {

            var allocationSet = [];
            var depts = [4, 6];
            var hrItems = Dealer.getHR({}, function () {
                $.each(hrItems.items, function (index, saleItem) {
                    $.each(depts, function (index, dept) {
                        if (!allocationSet[dept]) {
                            allocationSet[dept] = [];
                        }
                        var oneItem = {};
                        $.extend(oneItem, saleItem);
                        oneItem.active = false;
                        oneItem.dept = dept;
                        allocationSet[dept][saleItem.id] = oneItem;
                    });
                });

                loadHrAllocation(allocationSet, depts, 0);
            });
        }

        $scope.employeeFees = [];
        $scope.employeeFeeSummary = [];
        $scope.hrAllocations = [];

        function loadpage1() {
            var salesSet = [];
            var depts = [4, 6];
            var saleItems = Dealer.getEmployee({}, function () {
                $.each(saleItems.items, function (index, saleItem) {
                    $.each(depts, function (index, dept) {
                        if (!salesSet[dept]) {
                            salesSet[dept] = [];
                        }
                        var oneItem = {};
                        $.extend(oneItem, saleItem);
                        oneItem.sign = "";
                        oneItem.dept = dept;
                        oneItem.data = [];
                        oneItem.data[0] = {feeTypeID: 0};
                        oneItem.data[1] = {feeTypeID: 1};
                        oneItem.data[2] = {feeTypeID: 2};
                        salesSet[dept][saleItem.id] = oneItem;
                    });
                });

                loadFees(salesSet, depts, 0);
            });

            var summarySet = [];
            var summaryItems = Dealer.getEmployeeSunmmary({}, function () {
                $.each(summaryItems.items, function (index, saleItem) {
                    $.each(depts, function (index, dept) {
                        if (!summarySet[dept]) {
                            summarySet[dept] = [];
                        }
                        var oneItem = {};
                        $.extend(oneItem, saleItem);
                        oneItem.sign = "";
                        oneItem.dept = dept;
                        summarySet[dept][saleItem.id] = oneItem;
                    });
                });

                loadFeeSummary(summarySet, depts, 0);
            });
        }

        $scope.autoSaveFee = function () {
            if (!this.form.$invalid) {
                var itemsToSave = [0, 1, 2];

                for (var i = 0; i < itemsToSave.length; i++) {
                    var postData = {};
                    postData.dealerID = DealerService.getDealerId();
                    postData.departmentID = this.employeeFee.dept;
                    postData.validDate = DealerService.getValidDate();
                    postData.updateBy = DealerService.getUserName();
                    postData.detail = [];
                    postData.detail.push({
                        itemID: this.employeeFee.id,
                        amount: this.employeeFee.data[itemsToSave[i]].amount,
                        feeTypeID: this.employeeFee.data[itemsToSave[i]].feeTypeID
                    });

                    var success = function () {
                        this.employeeFee.sign = "icon-check-sign green";
                        var currentDate = new Date();
                        $scope.autoSaveTime = "上次自动保存于" + currentDate.getHours() + "点" + currentDate.getMinutes() + "分" + currentDate.getSeconds() + "秒";
                        $scope.autoSaveClass = "text-success";
                    };

                    var failed = function () {
                        this.employeeFee.sign = "icon-remove-sign red";
                        $scope.autoSaveTime = "自动保存失败";
                        $scope.autoSaveClass = "text-error";
                    };

                    var result = Dealer.saveEmployeeFee({}, postData, $.proxy(success, this), $.proxy(failed, this));
                }
            }
        }

        $scope.autoSaveAllocation = function () {
            if (!this.form.$invalid) {
                var postData = {};
                postData.dealerID = DealerService.getDealerId();
                postData.departmentID = this.hrAllocation.dept;
                postData.validDate = DealerService.getValidDate();
                postData.updateBy = DealerService.getUserName();
                postData.detail = [];
                postData.detail.push({
                    itemID: this.hrAllocation.id,
                    allocation: this.hrAllocation.allocation
                });
                var success = function () {
                    this.hrAllocation.sign = "icon-check-sign green";
                    var currentDate = new Date();
                    $scope.autoSaveTime = "上次自动保存于" + currentDate.getHours() + "点" + currentDate.getMinutes() + "分" + currentDate.getSeconds() + "秒";
                    $scope.autoSaveClass = "text-success";
                };

                var failed = function () {
                    this.hrAllocation.sign = "icon-remove-sign red";
                    $scope.autoSaveTime = "自动保存失败";
                    $scope.autoSaveClass = "text-error";
                };

                var result = Dealer.saveHRAllcation({}, postData, $.proxy(success, this), $.proxy(failed, this));
            }
        }

        $scope.autoSaveFeeSummary = function () {
            if (!this.form.$invalid) {
                var postData = {};
                postData.dealerID = DealerService.getDealerId();
                postData.departmentID = this.employeeSummary.dept;
                postData.validDate = DealerService.getValidDate();
                postData.updateBy = DealerService.getUserName();
                postData.detail = [];
                postData.detail.push({
                    itemID: this.employeeSummary.id,
                    amount: this.employeeSummary.amount
                });

                var success = function () {
                    this.employeeSummary.sign = "icon-check-sign green";
                    var currentDate = new Date();
                    $scope.autoSaveTime = "上次自动保存于" + currentDate.getHours() + "点" + currentDate.getMinutes() + "分" + currentDate.getSeconds() + "秒";
                    $scope.autoSaveClass = "text-success";
                };

                var failed = function () {
                    this.employeeSummary.sign = "icon-remove-sign red";
                    $scope.autoSaveTime = "自动保存失败";
                    $scope.autoSaveClass = "text-error";
                };

                var result = Dealer.saveEmployeeFeeSunmmary({}, postData, $.proxy(success, this), $.proxy(failed, this));
            }
        }

        function loadFees(salesSet, depts, index) {
            if (index >= depts.length) {
                return;
            }
            var saleRevenues = Dealer.getEmployeeFee({dealerID: DealerService.getDealerId(), validDate: DealerService.getValidDate(), departmentID: depts[index]},
                function () {
                    $.each(saleRevenues.detail, function (index, saleRevenue) {
                        var oneSale = salesSet[saleRevenues.departmentID][saleRevenue.itemID];
                        var oneRow = oneSale.data[saleRevenue.feeTypeID];
                        oneRow.amount = saleRevenue.amount;
                        oneRow.feeTypeID = saleRevenue.feeTypeID;
                        oneRow.feeType = saleRevenue.feeType;
                    });

                    $.each(salesSet, function (index, saleInDept) {
                        if (saleInDept) {
                            $.each(saleInDept, function (index, sale) {
                                if (sale && sale.id) {
                                    $scope.employeeFees.push(sale);
                                }
                            })
                        }
                    });
                    loadFees(salesSet, depts, index + 1);
                });
        }

        function loadFeeSummary(summarySet, depts, index) {
            if (index >= depts.length) {
                return;
            }
            var saleRevenues = Dealer.getEmployeeFeeSunmmary({dealerID: DealerService.getDealerId(), validDate: DealerService.getValidDate(), departmentID: depts[index]},
                function () {
                    $.each(saleRevenues.detail, function (index, saleRevenue) {
                        var oneSale = summarySet[saleRevenues.departmentID][saleRevenue.itemID];
                        oneSale.amount = saleRevenue.amount;
                    });

                    $.each(summarySet, function (index, saleInDept) {
                        if (saleInDept) {
                            $.each(saleInDept, function (index, sale) {
                                if (sale && sale.id) {
                                    $scope.employeeFeeSummary.push(sale);
                                }
                            })
                        }
                    });
                    loadFeeSummary(summarySet, depts, index + 1);
                });
        }

        function loadHrAllocation(allocationSet, depts, index) {
            if (index >= depts.length) {
                return;
            }
            var saleRevenues = Dealer.getHRAllocation({dealerID: DealerService.getDealerId(), validDate: DealerService.getValidDate(), departmentID: depts[index]},
                function () {
                    $.each(saleRevenues.detail, function (index, saleRevenue) {
                        var oneSale = allocationSet[saleRevenue.departmentID][saleRevenue.itemID];
                        oneSale.allocation = saleRevenue.allocation;
                    });

                    $.each(allocationSet, function (index, saleInDept) {
                        if (saleInDept) {
                            $.each(saleInDept, function (index, sale) {
                                if (sale && sale.id) {
                                    $scope.hrAllocations.push(sale);
                                }
                            })
                        }
                    });
                    loadHrAllocation(allocationSet, depts, index + 1);
                });
        }

        $scope.toggleMark = function () {
            var postData = {};
            postData.dealerID = DealerService.getDealerId();
            postData.itemID = DealerService.getSelectedMenu();
            postData.validDate = DealerService.getValidDate();
            postData.updateBy = DealerService.getUserName();

            Dealer.saveStatus({}, postData, function () {
                var navLink = $("#" + DealerService.getSelectedMenu());
                navLink.children().remove();
                if (!$scope.isDone) {
                    $scope.$parent.$parent.doneMenus.push(parseInt(DealerService.getSelectedMenu()));
                    navLink.append($('<i class="icon-check-sign" style="color:green;display:inline"></i>'));
                }
                else {
                    $scope.$parent.$parent.doneMenus = jQuery.grep($scope.$parent.$parent.doneMenus, function (value) {
                        return value != parseInt(DealerService.getSelectedMenu());
                    });
                }
                $scope.isDone = !$scope.isDone;
            });
        }
    }]);