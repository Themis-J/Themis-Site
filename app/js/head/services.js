'use strict';

/* Services */
angular.module('masterApp.services', ['ngResource'])
	.factory('ReportRestClient', ['$resource', 'config', function ($resource, config) {		
		return function(mode) {
        	var services = {
	        	remote: $resource(
		        	config.service.url + '/:root/:path/:subpath', {}, {
		            queryOverallIncomeReport: {method: 'GET', params: {root:'report', path: 'query', subpath:'overallIncomeReport'}, isArray: false},
		            queryOverallPercentageIncomeReport: {method: 'GET', params: {root:'report', path: 'query', subpath:'overallIncomeReport'}, isArray: false},
		            queryDepartmentIncomeReport: {method: 'GET', params: {root:'report', path: 'query', subpath:'departmentIncomeReport'}, isArray: false},
		            queryDealerSalesReport: {method: 'GET', params: {root:'report', path: 'query', subpath:'salesReport'}, isArray: false},
		            queryDepartments: {method: 'GET', params: {root:'dealer', path: 'department', subpath:''}, isArray: false},
		            queryDealers: {method: 'GET', params: {root:'dealer', path: 'list', subpath:''}, isArray: false}
		        }),
	        	local: $resource(
		        	config.service.localUrl + '/:path/:subpath', {}, {
		            queryOverallIncomeReport: {method: 'GET', params: {path: '', subpath:'queryYearlyIncomeReport.json'}, isArray: false},
		            queryOverallPercentageIncomeReport: {method: 'GET', params: {path: '', subpath:'queryYearlyPercentageIncomeReport.json'}, isArray: false},
		            queryDepartmentIncomeReport: {method: 'GET', params: {path: '', subpath:'queryDepartmentIncomeReport.json'}, isArray: false},
		            queryDealerSalesReport: {method: 'GET', params: {path: '', subpath:'queryDealerSalesReport.json'}, isArray: false},
		            queryDepartments: {method: 'GET', params: {path: '', subpath:'departments.json'}, isArray: false},
		            queryDealers: {method: 'GET', params: {path: '', subpath:'dealers.json'}, isArray: false}
		        })
	        };
	        if ( mode == 'local' ) {
	        	return services.local;
	        }
        	return services.remote;
        };
    }
    ]).
    factory('ReportService', [function(){
    	var monthOfYear = -1;
    	var currentYear = -1;
    	var charts = [];
    	var isFullScreen = false;
        return {
        	setCurrentYear: function(year) {
        		currentYear = year;
        	},
        	getCurrentYear: function() {
        		return currentYear;
        	},
        	setMonthOfYear: function(month){
        		monthOfYear = month;
        	},
        	getMonthOfYear: function() {
        		return monthOfYear;
        	},
        	setFullScreen: function(flag){
        		isFullScreen = flag;
        	},
        	getFullScreen: function() {
        		return isFullScreen;
        	},
        	getDepartments: function(restClient, params, callback) {
        		restClient(params, function(data) {
        			var departments = [];
        			var j = 0;
        			for ( var i = 0; i < data.items.length; i++) {
        				if (data.items[i].id != 0) {
        					departments[j++]=data.items[i];        					
        				}
        			}
        			callback(departments);
        		});
        	},
        	getDealers: function(restClient, params, callback) {
        		restClient(params, function(data) {
        			callback(data.items);
        		});
        	},
        	getMonthList: function() {
        		var months = [];
        		for (var i=0;i<12;i++) 
		  		{
		  			months[i] = {name: (i+1) + '月', id: i+1};
		  		}
		  		return months;
        	}, 
        	getYearList: function() {
        		var currentDate = new Date();
        		var years = [];
		  		var j = 0;
		  		for (var i=currentDate.getFullYear();i>1980;i--) 
		  		{
		  			years[j++] = {name: i + '年', id: i};
		  		}
		  		return years;
        	}
        };
    }])
    ;
