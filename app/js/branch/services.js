'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('branchApp.services', ['ngResource'])
    .factory('Dealer', ['$resource', 'config', function ($resource, config) {
        return $resource(config.service.url + '/dealer/:path/:subpath/:item', {}, {
            getStatus: {method: 'GET', params: {path: 'menu', subpath:'entrystatus'}, isArray: false},
            saveStatus: {method: 'POST', params: {path: 'menu', subpath:'entrystatus'}, isArray: false},
            getVehicles: {method: 'GET', params: {path: 'vehicle'}, isArray: false},
            getVehicleRevenue: {method: 'GET', params: {path: 'vehicleSalesRevenue'}, isArray: false},
            saveVehicleRevenue: {method: 'POST', params: {path: 'vehicleSalesRevenue'}, isArray: false},
            getTaxs: {method: 'GET', params: {path: 'tax'}, isArray: false},
            saveTax: {method: 'POST', params: {path: 'tax'}, isArray: false},
            getSales: {method: 'GET', params: {path: 'salesServiceRevenue', subpath:'items'}, isArray: false},
            getSalesRevenue: {method: 'GET', params: {path: 'salesServiceRevenue'}, isArray: false},
            saveSalesRevenue: {method: 'POST', params: {path: 'salesServiceRevenue'}, isArray: false},
            getGeneral: {method: 'GET', params: {path: 'generalJournal', subpath:'items'}, isArray: false},
            getGeneralJournal: {method: 'GET', params: {path: 'generalJournal'}, isArray: false},
            saveGeneralJournal: {method: 'POST', params: {path: 'generalJournal'}, isArray: false},
            getInventory: {method: 'GET', params: {path: 'inventory', subpath:'duration', item:'items'}, isArray: false},
            getInventoryDuration: {method: 'GET', params: {path: 'inventory', subpath:'duration'}, isArray: false},
            saveInventoryDuration: {method: 'POST', params: {path: 'inventory', subpath:'duration'}, isArray: false},
            getAccountItems: {method: 'GET', params: {path: 'accountReceivable', subpath:'duration', item:'items'}, isArray: false},
            getAccountDuration: {method: 'GET', params: {path: 'accountReceivable', subpath:'duration'}, isArray: false},
            saveAccountDuration: {method: 'POST', params: {path: 'accountReceivable', subpath:'duration'}, isArray: false},
            getEmployee: {method: 'GET', params: {path: 'employee', subpath:'fee', item:'items'}, isArray: false},
            getEmployeeFee: {method: 'GET', params: {path: 'employee', subpath:'fee'}, isArray: false},
            saveEmployeeFee: {method: 'POST', params: {path: 'employee', subpath:'fee'}, isArray: false},
            getEmployeeSunmmary:  {method: 'GET', params: {path: 'employee', subpath:'feeSummary', item:'items'}, isArray: false},
            getEmployeeFeeSunmmary:  {method: 'GET', params: {path: 'employee', subpath:'feeSummary'}, isArray: false},
            saveEmployeeFeeSunmmary:  {method: 'POST', params: {path: 'employee', subpath:'feeSummary'}, isArray: false},
            getHR:  {method: 'GET', params: {path: 'hr', subpath:'allocation', item:'items'}, isArray: false},
            getHRAllocation:  {method: 'GET', params: {path: 'hr', subpath:'allocation'}, isArray: false},
            saveHRAllcation: {method: 'POST', params: {path: 'hr', subpath:'allocation'}, isArray: false}
        });
    }
    ]).
    factory('DealerService', [function(){
        var dealerId = 11;
        var selectedYear = 2013;
        var selectedMonth = '08';
        var selectedDept = 1;
        var selectedItem = 0;
        var userName = "tester";

        return {
            getDealerId: function()
            {
                return dealerId;
            },

            getValidDate: function()
            {
                return selectedYear+"-"+selectedMonth+"-01";
            },

            getSelectedDept: function()
            {
                return  selectedDept;
            },

            getUserName: function()
            {
               return userName;
            },

            setDealerId: function(dealer)
            {
                dealerId = dealer;
            },

            setSelectedYear: function(year)
            {
                selectedYear = year;
            },

            setSelectedMonth: function(month)
            {
                selectedMonth = month;
            },

            setSelectedDept: function(dept)
            {
                selectedDept = dept;
            },

            setUserName: function(user)
            {
                userName = user;
            },

            setSelectedItem: function(item)
            {
                selectedItem = item;
            },

            getSelectedItem: function()
            {
                return selectedItem;
            }
        };
    }])
    ;
