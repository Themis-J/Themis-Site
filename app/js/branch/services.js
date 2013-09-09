'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('branchApp.services', ['ngResource'])
    .factory('Dealer', ['$resource', 'config', function ($resource, config) {
        return $resource(config.service.url + '/dealer/:path', {}, {
            getStatus: {method: 'GET', params: {path: 'menu/entrystatus'}, isArray: false},
            saveStatus: {method: 'POST', params: {path: 'menu/entrystatus'}, isArray: false},
            getVehicles: {method: 'GET', params: {path: 'vehicle'}, isArray: false},
            getVehicleRevenue: {method: 'GET', params: {path: 'vehicleSalesRevenue'}, isArray: false},
            saveVehicleRevenue: {method: 'POST', params: {path: 'vehicleSalesRevenue'}, isArray: false},
            getTax: {method: 'GET', params: {path: 'tax'}, isArray: false},
            saveTax: {method: 'POST', params: {path: 'tax'}, isArray: false},
            getSales: {method: 'GET', params: {path: 'salesServiceRevenue/items'}, isArray: false},
            getSalesRevenue: {method: 'GET', params: {path: 'salesServiceRevenue'}, isArray: false},
            saveSalesRevenue: {method: 'POST', params: {path: 'salesServiceRevenue'}, isArray: false},
            getGeneral: {method: 'GET', params: {path: 'generalJournal/items'}, isArray: false},
            getGeneralJournal: {method: 'GET', params: {path: 'generalJournal'}, isArray: false},
            saveGeneralJournal: {method: 'POST', params: {path: 'generalJournal'}, isArray: false},
            saveInventoryDuration: {method: 'POST', params: {path: 'inventory/duration'}, isArray: false},
            getAccountItems: {method: 'GET', params: {path: 'accountReceivable/duration/items'}, isArray: false},
            getAccountDuration: {method: 'GET', params: {path: 'accountReceivable/duration'}, isArray: false},
            saveAccountDuration: {method: 'POST', params: {path: 'accountReceivable/duration'}, isArray: false},
            getEmployeeFee: {method: 'GET', params: {path: 'employee/fee'}, isArray: false},
            saveEmployeeFee: {method: 'POST', params: {path: 'employee/fee'}, isArray: false},
            getEmployeeFeeSunmmary:  {method: 'GET', params: {path: 'employee/feeSummary'}, isArray: false},
            saveEmployeeFeeSunmmary:  {method: 'POST', params: {path: 'employee/feeSummary'}, isArray: false},
            getHRAllocation:  {method: 'GET', params: {path: 'hr/allocation'}, isArray: false},
            saveHRAllcation: {method: 'POST', params: {path: 'hr/allocation'}, isArray: false}
        });
    }
    ]).
    factory('DealerService', [function(){
        var dealerId = 11;
        var selectedYear = 2013;
        var selectedMonth = '08';
        var selectedDept = 1;

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
            }
        };
    }])
    ;
