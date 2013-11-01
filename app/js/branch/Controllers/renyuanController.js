angular.module('renyuan.controller', [])
    .controller('renyuanCtrl', ['$scope', 'Dealer', 'DealerService', function ($scope, Dealer, DealerService) {
        $scope.isDone = ($scope.$parent.$parent.doneMenus.indexOf(parseInt(DealerService.getSelectedMenu())) !== -1);

        if (DealerService.getSelectedDept() == 11) {
            $scope.employeeFees = [];
            $scope.employeeFeeSummary = [];

            loadpage1();
        }
        else {
            $scope.hrAllocations = [];
            $scope.itemSummary = [];

            $scope.deptMap = [
                {name: '--请选择待输入部门--', id: 0},
                {name: '新车销售部', id: 1},
                {name: '二手车部', id: 2},
                {name: '租恁事业部', id: 3},
                {name: '维修部', id: 4},
                {name: '备件部', id: 5},
                {name: '钣喷部', id: 6},
                {name: '其它部', id: 7}
            ];
            $scope.depart = $scope.deptMap[0];

            $scope.deptSummary = [
                {name: '新车销售部', value: 1, sum: 0},
                {name: '二手车部', value: 2, sum: 0},
                {name: '租恁事业部', value: 3, sum: 0},
                {name: '维修部', value: 4, sum: 0},
                {name: '备件部', value: 5, sum: 0},
                {name: '钣喷部', value: 6, sum: 0},
                {name: '其它部', value: 7, sum: 0}
            ];

            var allocationSet = [];
            var depts = [1, 2, 3, 4, 5, 6, 7];

            var hrItems = Dealer.getHR({}, function () {
                $.each(hrItems.items, function (index, saleItem) {
                    $.each(depts, function (index, dept) {
                        if (!allocationSet[dept]) {
                            allocationSet[dept] = [];
                        }
                        var oneItem = {};
                        $.extend(oneItem, saleItem);
                        oneItem.dept = dept;
                        allocationSet[dept][saleItem.id] = oneItem;
                    });

                    var oneSummary = {};
                    oneSummary.id = saleItem.id;
                    oneSummary.name = saleItem.name;
                    oneSummary.value = 0;
                    $scope.itemSummary.push(oneSummary);
                });

                loadHrAllocation(allocationSet, depts, 0);
            });
        }
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

                var allocId =  this.hrAllocation.id;
                var allocDept = this.hrAllocation.dept;
                var itemSum = 0;
                var deptSum = 0;
                $.each($scope.hrAllocations, function(itemIndex, oneAllocation){
                    if (allocId === oneAllocation.id && !isNaN(oneAllocation.allocation))
                    {
                        itemSum =  itemSum +  parseInt(oneAllocation.allocation);
                    }
                    if (allocDept === oneAllocation.dept && !isNaN(oneAllocation.allocation))
                    {
                        deptSum = deptSum +  parseInt(oneAllocation.allocation);
                    }
                });
                $.each($scope.itemSummary, function(itemIndex, oneSummary){
                    if (oneSummary.id === allocId)
                    {
                        oneSummary.value =  itemSum;
                    }
                });
                $.each($scope.deptSummary, function(deptIndex, oneSummary){
                    if (allocDept === oneSummary.value)
                    {
                        oneSummary.sum = deptSum;
                    }
                });

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

                $scope.$apply();

                $('.hasTooltip').each(function () {
                    $(this).qtip({
                        content: {
                            text: $(this).next('div')
                        },
                        hide: {
                            event: 'unfocus'
                        },
                        position: {
                            at: 'bottom left',
                            target: $(this)
                        },
                        style: {
                            def: false,
                            classes: 'tip qtip-rounded qtip-bootstrap'
                        }
                    });
                });
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

        function loadHrAllocation(allocationSet, depts, deIndex) {
            if (deIndex >= depts.length) {
                $.each($scope.hrAllocations, function(index, alloc){
                    if (!isNaN(alloc.allocation))
                    {
                        $.each($scope.itemSummary, function(itemIndex, oneSummary){
                            if (alloc && alloc.id === oneSummary.id)
                            {
                                oneSummary.value =  oneSummary.value + parseInt(alloc.allocation);
                            }
                        });
                        $.each($scope.deptSummary, function(deptIndex, oneSummary){
                            if (alloc && alloc.dept === oneSummary.value)
                            {
                                oneSummary.sum = oneSummary.sum + parseInt(alloc.allocation);
                            }
                        });
                    }
                });

                $scope.$apply();

                $('.hasTooltip').each(function () {
                    $(this).qtip({
                        content: {
                            text: $(this).next('div')
                        },
                        hide: {
                            event: 'unfocus'
                        },
                        position: {
                            at: 'bottom left',
                            target: $(this)
                        },
                        style: {
                            def: false,
                            classes: 'tip qtip-rounded qtip-bootstrap'
                        }
                    });
                });
                return;
            }
            var saleRevenues = Dealer.getHRAllocation({dealerID: DealerService.getDealerId(), validDate: DealerService.getValidDate(), departmentID: depts[deIndex]},
                function () {
                    $.each(saleRevenues.detail, function (index, saleRevenue) {
                        var oneSale = allocationSet[saleRevenue.departmentID][saleRevenue.itemID];
                        oneSale.allocation = saleRevenue.allocation;
                    });

                    $.each(allocationSet, function (index, saleInDept) {
                        if (saleInDept) {
                            $.each(saleInDept, function (index, sale) {
                                if (sale && (sale.dept === depts[deIndex])) {
                                    $scope.hrAllocations.push(sale);
                                }
                            })
                        }
                    });

                    loadHrAllocation(allocationSet, depts, deIndex + 1);
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

                    if ($('#collapsSix').find('i.icon-check-sign').size() == 2) {
                        $('#six').append($('<i class="icon-check-sign" style="color:green;display:inline"></i>'));
                    }
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