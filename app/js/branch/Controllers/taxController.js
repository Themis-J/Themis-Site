angular.module('tax.controller', [])
    .controller('taxCtrl', ['$scope', 'Dealer', 'DealerService', function ($scope, Dealer, DealerService) {
        $scope.isDone =  ($scope.$parent.$parent.doneMenus.indexOf(parseInt(DealerService.getSelectedMenu())) !== -1);

        $scope.tax = null;
        $scope.active = false;
        var tax = Dealer.getTaxs({dealerID: DealerService.getDealerId(), validDate: DealerService.getValidDate(), departmentID: DealerService.getSelectedDept()}, function () {
            $scope.tax = tax.tax;
        });

        $scope.autoSaveTax = function()
        {
            if (this.form.invalid)
            {
                return;
            }
            var postData = {};
            postData.dealerID = DealerService.getDealerId();
            postData.validDate =  DealerService.getValidDate();
            postData.updateBy =  DealerService.getUserName();
            postData.tax = $scope.tax;

            var success = function(){
                $scope.sign = "icon-check-sign green";
                var currentDate = new Date();
                $scope.autoSaveTime =  "上次自动保存于"+currentDate.getHours()+"点"+currentDate.getMinutes()+"分"+currentDate.getSeconds()+"秒";
                $scope.autoSaveClass = "text-success";
            };

            var failed = function()
            {
                $scope.sign = "icon-remove-sign red";
                $scope.autoSaveTime =  "自动保存失败";
                $scope.autoSaveClass = "text-error";
            }

            Dealer.saveTax({},postData,   $.proxy(success, this), $.proxy(failed, this));
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