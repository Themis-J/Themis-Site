angular.module('lirun.controller', [])
    .controller('lirunCtrl', ['$scope','Dealer','DealerService', function ($scope, Dealer, DealerService){
        $scope.carClass = "hide";
        $scope.truckClass = "hide";

        if (DealerService.getSelectedDept() == 1)
        {
            $scope.carClass = "";
            $scope.truckClass = "";

            $scope.vehicleRevenue = [];
            $scope.vehicleRevenue['新轿车零售'] = [];
            $scope.vehicleRevenue['新货车零售'] = [];

            var vehicleSet = [];
            var vehicles = Dealer.getVehicles({}, function(){
                $.each(vehicles.items, function(index, vehicle){
                    vehicle.count = 0;
                    vehicle.amount = 0;
                    vehicle.margin = 0;
                    vehicleSet[vehicle.id] = vehicle;
                });

                var vehiclesRevenue = Dealer.getVehicleRevenue({dealerID:DealerService.getDealerId(), validDate: DealerService.getValidDate(), departmentID:DealerService.getSelectedDept()},
                    function(){
                        $.each(vehiclesRevenue.detail, function(index, vehicle){
                            var oneVehicle = vehicleSet[vehicle.vehicleID];
                            oneVehicle.count = vehicle.count;
                            oneVehicle.amount = vehicle.amount;
                            oneVehicle.margin = vehicle.margin;
                        });

                        $.each(vehicleSet, function(index, vehicle){
                            if(vehicle && vehicle.id)
                            {
                                 $scope.vehicleRevenue[vehicle.category].push(vehicle);
                            }
                        });

                    }
                );
            });
        }

        var saleCates= [3, 7];
        $scope.sales = [];
        for(var i=0; i<saleCates.length; i++)
        {
            $scope.sales[saleCates[i]] = [];
            $scope.sales[saleCates[i]].display = 'hide';
        }

        if (DealerService.getSelectedDept() >= 1)
        {
            for(var i=0; i<saleCates.length; i++)
            {
                var salesSet = [];
                var saleItems = Dealer.getSales({categoryID: saleCates[i]},function(){
                    $.each(saleItems.items, function(index, saleItem){
                        saleItem.count = 0;
                        saleItem.amount = 0;
                        saleItem.margin = 0;
                        salesSet[saleItem.id] = saleItem;
                    });

                    var saleRevenues = Dealer.getSalesRevenue({dealerID:DealerService.getDealerId(), validDate: DealerService.getValidDate(), departmentID:DealerService.getSelectedDept(),categoryID: saleCates[i]},
                        function(){
                            $.each(saleRevenues.detail, function(index, saleRevenue){
                                var oneSale = salesSet[saleRevenue.itemID];
                                oneSale.count = saleRevenue.count;
                                oneSale.amount = saleRevenue.amount;
                                oneSale.margin = saleRevenue.margin;
                            });

                            $.each(salesSet, function(index, sale){
                                if(sale && sale.id)
                                {
                                    $scope.sales[saleCates[i]].push(sale);
                                }
                            });
                    })
                });

                $scope.sales[saleCates[i]].display = '';
            }
         }

        var generalCates= [8];
        $scope.generalSales = [];
        for(var i=0; i<generalCates.length; i++)
        {
            $scope.generalSales[generalCates[i]] = [];
            $scope.generalSales[generalCates[i]].display = 'hide';
        }

        if (DealerService.getSelectedDept() == 0)
        {
            for(var i=0; i<generalCates.length; i++)
            {
                var salesSet = [];
                var saleItems = Dealer.getGeneral({categoryID: generalCates[i]},function(){
                    $.each(saleItems.items, function(index, saleItem){
                        saleItem.amount = 0;
                        salesSet[saleItem.id] = saleItem;
                    });

                    var saleRevenues = Dealer.getGeneralJournal({dealerID:DealerService.getDealerId(), validDate: DealerService.getValidDate(), departmentID:DealerService.getSelectedDept(),categoryID: generalCates[i]},
                        function(){
                            $.each(saleRevenues.detail, function(index, saleRevenue){
                                var oneSale = salesSet[saleRevenue.itemID];
                                oneSale.amount = saleRevenue.amount;
                            });

                            $.each(salesSet, function(index, sale){
                                if(sale && sale.id)
                                {
                                    $scope.generalSales[generalCates[i]].push(sale);
                                }
                            });
                        })
                });

                $scope.generalSales[generalCates[i]].display = '';
            }
        }

        $scope.toggleMark = function()
        {
            var navLink = $("#"+$scope.itemIndex+"_"+$scope.depatIndex);
            navLink.children().remove();
            navLink.append($('<i class="icon-check-sign" style="color:green;display:inline"></i>'));
        }
    }]);