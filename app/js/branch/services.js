'use strict';

/* Services */

// In this case it is a simple value service.
angular.module('branch.services', ['ngResource', 'ngCookies'])
    .factory('Dealer', ['$resource', 'config', function ($resource, config) {
        return $resource(config.service.url + '/dealer/:path/:subpath/:item', {}, {
            getStatus: {method: 'GET', params: {path: 'menu', subpath: 'entrystatus'}, isArray: false},
            saveStatus: {method: 'POST', params: {path: 'menu', subpath: 'entrystatus'}, isArray: false},
            getVehicles: {method: 'GET', params: {path: 'vehicle'}, isArray: false},
            getVehicleRevenue: {method: 'GET', params: {path: 'vehicleSalesRevenue'}, isArray: false},
            saveVehicleRevenue: {method: 'POST', params: {path: 'vehicleSalesRevenue'}, isArray: false},
            getTaxs: {method: 'GET', params: {path: 'tax'}, isArray: false},
            saveTax: {method: 'POST', params: {path: 'tax'}, isArray: false},
            getSales: {method: 'GET', params: {path: 'salesServiceRevenue', subpath: 'items'}, isArray: false},
            getSalesRevenue: {method: 'GET', params: {path: 'salesServiceRevenue'}, isArray: false},
            saveSalesRevenue: {method: 'POST', params: {path: 'salesServiceRevenue'}, isArray: false},
            getGeneral: {method: 'GET', params: {path: 'generalJournal', subpath: 'items'}, isArray: false},
            getGeneralJournal: {method: 'GET', params: {path: 'generalJournal'}, isArray: false},
            saveGeneralJournal: {method: 'POST', params: {path: 'generalJournal'}, isArray: false},
            getInventory: {method: 'GET', params: {path: 'inventory', subpath: 'duration', item: 'items'}, isArray: false},
            getInventoryDuration: {method: 'GET', params: {path: 'inventory', subpath: 'duration'}, isArray: false},
            saveInventoryDuration: {method: 'POST', params: {path: 'inventory', subpath: 'duration'}, isArray: false},
            getAccountItems: {method: 'GET', params: {path: 'accountReceivable', subpath: 'duration', item: 'items'}, isArray: false},
            getAccountDuration: {method: 'GET', params: {path: 'accountReceivable', subpath: 'duration'}, isArray: false},
            saveAccountDuration: {method: 'POST', params: {path: 'accountReceivable', subpath: 'duration'}, isArray: false},
            getEmployee: {method: 'GET', params: {path: 'employee', subpath: 'fee', item: 'items'}, isArray: false},
            getEmployeeFee: {method: 'GET', params: {path: 'employee', subpath: 'fee'}, isArray: false},
            saveEmployeeFee: {method: 'POST', params: {path: 'employee', subpath: 'fee'}, isArray: false},
            getEmployeeSunmmary: {method: 'GET', params: {path: 'employee', subpath: 'feeSummary', item: 'items'}, isArray: false},
            getEmployeeFeeSunmmary: {method: 'GET', params: {path: 'employee', subpath: 'feeSummary'}, isArray: false},
            saveEmployeeFeeSunmmary: {method: 'POST', params: {path: 'employee', subpath: 'feeSummary'}, isArray: false},
            getHR: {method: 'GET', params: {path: 'hr', subpath: 'allocation', item: 'items'}, isArray: false},
            getHRAllocation: {method: 'GET', params: {path: 'hr', subpath: 'allocation'}, isArray: false},
            saveHRAllcation: {method: 'POST', params: {path: 'hr', subpath: 'allocation'}, isArray: false},
            list: {method: 'GET', params: {path: 'list'}, isArray: false}
        });
    }
    ])
    .factory('User', ['$resource', 'config', function ($resource, config) {
        return $resource(config.service.url + '/user/:path', {}, {
            addUser: {method: 'POST', params: {path: 'add'}, isArray: false},
            resetPass: {method: 'POST', params: {path: 'resetpwd'}, isArray: false}
        });
    }])
    .factory('DealerService', ['$cookieStore', function ($cookieStore) {
        var dealerId = null;
        var dealerFullName = null;
        var defaultDealerId = 11;
        var selectedYear = null;
        var defaultYear = new Date().getFullYear();
        var selectedMonth = null;
        var defaultMonth = new Date().getMonth();
        var selectedDept = null;
        var selectedDeptString = null;
        var defaultDept = 0;
        var selectedItem = null;
        var defaultItem = 7;
        var selectedMenu = null;
        var defaultMenuId = -1;
        var userName = null;
        var defaultUser = "tester";

        return {
            getDealerId: function () {
                if (dealerId) {
                    return dealerId;
                }
                else {
                    if ($cookieStore.get('dealerId')) {
                        return $cookieStore.get('dealerId');
                    }
                    else {
                        return defaultDealerId;
                    }
                }
            },
            getDealerFullName: function () {
                if (dealerFullName) {
                    return dealerFullName;
                }
                else {
                    if ($cookieStore.get('dealerFullName')) {
                        return $cookieStore.get('dealerFullName');
                    }
                    else {
                        return "";
                    }
                }
            },
            getSelectedYear: function () {
                if (selectedYear) {
                    return selectedYear;
                }
                else {
                    if ($cookieStore.get('selectedYear')) {
                        return $cookieStore.get('selectedYear');
                    }
                    else {
                        return defaultYear;
                    }
                }
            },
            getSelectedMonth: function () {
                if (selectedMonth) {
                    return parseInt(selectedMonth);
                }
                else {
                    if ($cookieStore.get('selectedMonth')) {
                        return parseInt($cookieStore.get('selectedMonth'));
                    }
                    else {
                        return  parseInt(defaultMonth);
                    }
                }
            },
            getValidDate: function () {
                if (selectedYear && selectedMonth) {
                    var month = parseInt(selectedMonth) + 1;
                    return selectedYear + "-" + (parseInt(month) < 10 ? ('0' + month) : month) + "-01";
                }
                else {
                    var year, month;
                    if (!selectedYear) {
                        if ($cookieStore.get('selectedYear')) {
                            year = $cookieStore.get('selectedYear');
                        }
                        else {
                            year = defaultYear;
                        }
                    }

                    if (!selectedMonth) {
                        if ($cookieStore.get('selectedMonth')) {
                            month = $cookieStore.get('selectedMonth');
                        }
                        else {
                            month = defaultMonth;
                        }
                    }
                    month = parseInt(month) + 1;
                    return year + "-" + (parseInt(month) < 10 ? ('0' + month) : month) + "-01";
                }
            },

            getSelectedDept: function () {
                if (selectedDept) {
                    return selectedDept;
                }
                else {
                    if ($cookieStore.get('selectedDept')) {
                        return $cookieStore.get('selectedDept');
                    }
                    else {
                        return defaultDept;
                    }
                }
            },

            getSelectedDeptString: function () {
                if (selectedDeptString) {
                    return selectedDeptString;
                }
                else {
                    if ($cookieStore.get('selectedDeptString')) {
                        return $cookieStore.get('selectedDeptString');
                    }
                    else {
                        return '';
                    }
                }
            },

            getUserName: function () {
                if (userName) {
                    return userName;
                }
                else {
                    if ($cookieStore.get('userName')) {
                        return $cookieStore.get('userName');
                    }
                    else {
                        return defaultUser;
                    }
                }
            },

            getSelectedItem: function () {
                if (selectedItem) {
                    return selectedItem;
                }
                else {
                    if ($cookieStore.get('selectedItem')) {
                        return $cookieStore.get('selectedItem');
                    }
                    else {
                        return defaultItem;
                    }
                }
            },

            setDealerId: function (dealer) {
                dealerId = dealer;
                $cookieStore.put('dealerId', dealer.toString());
            },

            setDealerFullName: function(fullName)
            {
                dealerFullName = fullName;
                $cookieStore.put('dealerFullName', fullName.toString());
            },

            setSelectedYear: function (year) {
                selectedYear = year;
                $cookieStore.put('selectedYear', year.toString());
            },

            setSelectedMonth: function (month) {
                selectedMonth = month;
                $cookieStore.put('selectedMonth', month.toString());
            },

            setSelectedDept: function (dept) {
                selectedDept = dept;
                $cookieStore.put('selectedDept', dept.toString());
            },

            setSelectedDeptString: function (deptString) {
                selectedDeptString = deptString;
                $cookieStore.put('selectedDeptString', deptString.toString());
            },

            setUserName: function (user) {
                userName = user;
                $cookieStore.put('userName', user);
            },

            setSelectedItem: function (item) {
                selectedItem = item;
                $cookieStore.put('selectedItem', item.toString());
            },

            setSelectedMenu: function (menu) {
                selectedMenu = menu;
                $cookieStore.put('selectedMenu', menu.toString());
            },

            getSelectedMenu: function () {
                if (selectedMenu) {
                    return selectedMenu;
                }
                else {
                    if ($cookieStore.get('selectedMenu')) {
                        return $cookieStore.get('selectedMenu');
                    }
                    else {
                        return defaultMenuId;
                    }
                }
            }

        };
    }])
;
