angular.module('tax.controller', [])
    .controller('taxCtrl', ['$scope', 'Dealer', 'DealerService', function ($scope, Dealer, DealerService) {

        $scope.tax = null;
        $scope.active = false;
        var tax = Dealer.getTaxs({dealerID: DealerService.getDealerId(), validDate: DealerService.getValidDate(), departmentID: DealerService.getSelectedDept()}, function () {
            $scope.tax = tax.tax;
        });

        $scope.toggleMark = function () {
            var navLink = $("#" + $scope.itemIndex + "_" + $scope.depatIndex);
            navLink.children().remove();
            navLink.append($('<i class="icon-check-sign" style="color:green;display:inline"></i>'));
        }

        $scope.autoSaveTax = function()
        {
            if (isNaN($scope.tax))
            {
                return;
            }
            var postData = {};
            postData.dealerID = DealerService.getDealerId();
            postData.validDate =  DealerService.getValidDate();
            postData.updateBy =  DealerService.getUserName();
            postData.tax = $scope.tax;
            $scope.active = true;
            Dealer.saveTax({},postData, function(){
                var currentDate = new Date();
                $scope.autoSaveTime =  "上次自动保存于"+currentDate.getHours()+"点"+currentDate.getMinutes()+"分"+currentDate.getSeconds()+"秒";
                $scope.autoSaveClass = "alt alt-success";
            }, function(){
                $scope.autoSaveTime =  "自动保存失败";
                $scope.autoSaveClass = "alt alt-error";
            });
        }
    }]);