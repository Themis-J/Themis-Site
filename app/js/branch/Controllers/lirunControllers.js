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
                        console.log($scope.vehicleRevenue);
                    }
                );
            });
        }



        $scope.salesRevenue = {};

        $scope.toggleMark = function()
        {
            var navLink = $("#"+$scope.itemIndex+"_"+$scope.depatIndex);
            navLink.children().remove();
            navLink.append($('<i class="icon-check-sign" style="color:green;display:inline"></i>'));
        }
    }]);