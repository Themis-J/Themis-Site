'use strict';

angular.module('departmentAbs.controllers', [])
	.controller('departmentAbsCtrl', ['$scope', '$http', 'ReportRestClient', 'ReportService', 'config', function($scope, $http, restClient, reportService, config) {
		$scope.charts = [
			{text:'营业额', display:false, chart:null},
    		{text:'毛利', display:false, chart:null},
    		{text:'费用', display:false, chart:null},
    		{text:'运营利润', display:true, chart:null},
    		];
        
    	var currentDate = new Date();
  		reportService.setCurrentYear(currentDate.getFullYear());
  		$scope.yearOptions = reportService.getYearList();
  		$scope.selectedYearOption = $scope.yearOptions[0];
		
		$scope.monthOptions = [];
		reportService.setMonthOfYear(currentDate.getMonth());
		$scope.monthOptions = reportService.getMonthList();
		$scope.selectedMonthOption = $scope.monthOptions[reportService.getMonthOfYear()-1];
    	
    	$scope.selectedTime = 0;
    	$scope.selectReportYear = function() {
    		reportService.setCurrentYear($scope.selectedYearOption.id);
    		$scope.selectTime($scope.selectedTime);
    	};
		$scope.selectReportMonth = function() {
    		reportService.setMonthOfYear($scope.selectedMonthOption.id);
    		$scope.selectTime($scope.selectedTime);
    	};
    	
    	$scope.departmentOptions = [];
    	reportService.getDepartments(restClient(config.currentMode).queryDepartments, {}, function(departments) {
    		$scope.departmentOptions = departments;
    		$scope.selectedDepartmentOption = $scope.departmentOptions[0];
			// called on page is loaded
			$scope.showReport();
		});
		
		$scope.selectReportDepartment = function() {
			$scope.showReport();
		};
		
    	$scope.showReport = function()
        {
        	var params = null;
        	if ( $scope.selectedTime == 0 ) {
        		params = {year: reportService.getCurrentYear(), departmentID: $scope.selectedDepartmentOption.id};
        	}
        	if ( $scope.selectedTime == 1 ) {
        		params = {year: reportService.getCurrentYear(), monthOfYear: reportService.getMonthOfYear(), departmentID: $scope.selectedDepartmentOption.id};
        	}
        	for ( var i=0; i< $scope.charts.length;i++ ) {
        		if ( $scope.charts[i].display == true ) {
        			$scope.draw(restClient(config.currentMode).queryOverallIncomeReport, params, i);
        		} 
        	}
        	
        };
        $scope.drawDrilldown = function (pRestClient, pDealerName, pDealerID, index) {
        	var params = null;
        	if ( $scope.selectedTime == 0 ) {
        		params = {year: reportService.getCurrentYear(), dealerID: pDealerID, departmentID: $scope.selectedDepartmentOption.id};
        	}
        	if ( $scope.selectedTime == 1 ) {
        		params = {year: reportService.getCurrentYear(), monthOfYear: reportService.getMonthOfYear(), dealerID: pDealerID, departmentID: $scope.selectedDepartmentOption.id};
        	}
        	pRestClient(params, function(data) {
        		var chartData = [
				        	{
				        		id: 'report_revenue',
				        		title: '营业额',
				        		yAxisTitle: '营业额',
				        		series: { previous:[], current:[]}
				        	}, 
				        	{
				        		id: 'report_margin',
				        		title: '毛利',
				        		yAxisTitle: '毛利',
				        		series: { previous:[], current:[]}
				        	},
				        	{
				        		id: 'report_expense',
				        		title: '费用',
				        		yAxisTitle: '费用',
				        		series: { previous:[], current:[]}
				        	}, 
				        	{
				        		id: 'report_opProfit',
				        		title: '运营利润',
				        		yAxisTitle: '运营利润',
				        		series: { previous:[], current:[]}
				        	},

				    ]; 
	            	var chartCategories = [{ categories: null }];
	            	var departments = [];
					for (var j = 0; j < $scope.departmentOptions.length; j++) {
						departments[j] = $scope.departmentOptions[j].name;
					}
					
					var previousDetail = data.detail[0].departmentDetail;
	            	for ( var i in previousDetail ) {
	            		if (i == 0) {
	            			// nothing
	            		} else {
	            		chartData[0].series.previous[i-1] = previousDetail[i].revenue.amount;
	            		chartData[1].series.previous[i-1] = previousDetail[i].margin.amount;
	            		chartData[2].series.previous[i-1] = previousDetail[i].expense.amount;
	            		chartData[3].series.previous[i-1] = previousDetail[i].opProfit.amount;
	            		}
	            	};
	            	chartCategories[0].categories = departments;
					var currentDetail = data.detail[1].departmentDetail;
					for ( var i in currentDetail ) {
						if (i == 0) {
	            			// nothing
	            		} else {
						chartData[0].series.current[i-1] = currentDetail[i].revenue.amount;
	            		chartData[1].series.current[i-1] = currentDetail[i].margin.amount;
	            		chartData[2].series.current[i-1] = currentDetail[i].expense.amount;
	            		chartData[3].series.current[i-1] = currentDetail[i].opProfit.amount;
	            		}
	            	};
	            	
			        var chartWidth = $(window).width() * 0.60;
			        if ( reportService.getFullScreen() ) {
			        	chartWidth = $(window).width();
					}
			        var chartColumnCurrent = '今年';
	            	if ( $scope.selectedTime == 1 ) {
	            		chartColumnCurrent = '当月';
	            	}
			       	var currentData = chartData[index];
			       	$scope.charts[index].chart = $('#' + currentData.id).highcharts({
			                chart: {
			                	zoomType: 'xy',
			                    height:$(window).height()*0.60,
			                    width: chartWidth,
			                },
			                title: {
			                    text: pDealerName + '-' + currentData.title
			                },
			                subtitle: {
			                    text: '部门对比 (再次点击回到上一级)'
			                },
			                xAxis: chartCategories,
			                yAxis: [{
			                    title: {
			                        text: currentData.yAxisTitle
			                    },
			                    min:-10000
			                }
							],
			                tooltip: {
			                    formatter: function() {
			                        var tooltip = this.series.name +': '+ this.y +'<br/>';
			                        return  tooltip;
			                    },
			                    useHTML: true
			                },
			                plotOptions: {
			                    column: {
			                    	cursor: 'pointer',
			                    	point: {
				                        events: {
				                            click: function() {
				                            	var params = null;
									        	if ( $scope.selectedTime == 0 ) {
									        		params = {year: reportService.getCurrentYear(), departmentID: $scope.selectedDepartmentOption.id};
									        	}
									        	if ( $scope.selectedTime == 1 ) {
									        		params = {year: reportService.getCurrentYear(), monthOfYear: reportService.getMonthOfYear(), departmentID: $scope.selectedDepartmentOption.id};
									        	}
				                            	$scope.draw(restClient(config.currentMode).queryOverallIncomeReport, params, index); 
				                            }
				                        }
				                    },
			                    }
			                },
			                series: [
				                    {
				                        type: 'column',
				                        name: chartColumnCurrent,
				                        data: chartData[index].series.current
				                    },
				            ]
			        	}).highcharts();
			    
			  });
		};
        $scope.draw = function (pRestClient, params, index) {
			Highcharts.theme = config.highChartsTheme;
			
            // Apply the theme
            var highchartsOptions = Highcharts.setOptions(Highcharts.theme); 
 			
            pRestClient(params, function(data) {
            	var chartData = [
				        	{
				        		id: 'report_revenue',
				        		title: '营业额',
				        		yAxisTitle: '营业额',
				        		series: { previous:[], current:[], previousReference:[], currentReference:[], currentPercentage:[], }
				        	}, 
				        	{
				        		id: 'report_margin',
				        		title: '毛利',
				        		yAxisTitle: '毛利',
				        		series: { previous:[], current:[], previousReference:[], currentReference:[], currentPercentage:[], }
				        	},
				        	{
				        		id: 'report_expense',
				        		title: '费用',
				        		yAxisTitle: '费用',
				        		series: { previous:[], current:[], previousReference:[], currentReference:[], currentPercentage:[], }
				        	}, 
				        	{
				        		id: 'report_opProfit',
				        		title: '运营利润',
				        		yAxisTitle: '运营利润',
				        		series: { previous:[], current:[], previousReference:[], currentReference:[], currentPercentage:[], }
				        	},

				    ]; 
	            	var chartCategories = [{ categories: null }];
	            	var dealers = [];
	            	var previousDetail = data.detail[0].detail;
	            	var previousYear = data.detail[0].year;
	            	for ( var i in previousDetail ) {
	            		dealers[i] = previousDetail[i].code;
	            		chartData[0].series.previous[i] = {y: previousDetail[i].revenue.amount, detail: previousDetail[i], drilldown:{dealerID: previousDetail[i].id, type: 'revenue', index:0}};
	            		chartData[0].series.previousReference[i] = previousDetail[i].revenue.reference;
	            		
	            		chartData[1].series.previous[i] = {y: previousDetail[i].margin.amount, detail: previousDetail[i], drilldown:{dealerID: previousDetail[i].id, type: 'margin', index:1}};
	            		chartData[1].series.previousReference[i] = previousDetail[i].margin.reference;

	            		chartData[2].series.previous[i] = {y: previousDetail[i].expense.amount, detail: previousDetail[i], drilldown:{dealerID: previousDetail[i].id, type: 'expense', index:2}};
	            		chartData[2].series.previousReference[i] = previousDetail[i].expense.reference;
	            		
	            		chartData[3].series.previous[i] = {y: previousDetail[i].opProfit.amount, detail: previousDetail[i], drilldown:{dealerID: previousDetail[i].id, type: 'opProfit', index:3}};
	            		chartData[3].series.previousReference[i] = previousDetail[i].opProfit.reference;
	            	};
	            	
					chartCategories[0].categories = dealers;
					var currentDetail = data.detail[1].detail;
					for ( var i in currentDetail ) {
	            		chartData[0].series.current[i] = {y: currentDetail[i].revenue.amount, detail: currentDetail[i], drilldown:{dealerID: currentDetail[i].id, type: 'revenue', index:0}};
	            		chartData[0].series.currentReference[i] = currentDetail[i].revenue.reference;
	            		chartData[0].series.currentPercentage[i] = currentDetail[i].revenue.percentage * 100;
	            		
	            		chartData[1].series.current[i] = {y: currentDetail[i].margin.amount, detail: currentDetail[i], drilldown:{dealerID: currentDetail[i].id, type: 'margin', index:1}};
	            		chartData[1].series.currentReference[i] = currentDetail[i].margin.reference;
	            		chartData[1].series.currentPercentage[i] = currentDetail[i].margin.percentage * 100;
	            		
	            		chartData[2].series.current[i] = {y: currentDetail[i].expense.amount, detail: currentDetail[i], drilldown:{dealerID: currentDetail[i].id, type: 'expense', index:2}};
	            		chartData[2].series.currentReference[i] = currentDetail[i].expense.reference;
	            		chartData[2].series.currentPercentage[i] = currentDetail[i].expense.percentage * 100;
	            		
	            		chartData[3].series.current[i] = {y: currentDetail[i].opProfit.amount, detail: currentDetail[i], drilldown:{dealerID: currentDetail[i].id, type: 'opProfit', index:3}};
	            		chartData[3].series.currentPercentage[i] = currentDetail[i].opProfit.percentage * 100;
	            		chartData[3].series.currentReference[i] = currentDetail[i].opProfit.reference;
	            	};
	            	
	            	var chartSubtitle = '年度对比（点击柱子进入此列经销商该年部门对比）';
	            	if ( $scope.selectedTime == 1 ) {
	            		chartSubtitle = '月对比（点击柱子进入此列经销商该月部门对比）';
	            	}
	            	
	            	var chartColumnPrevious = '去年';
	            	if ( $scope.selectedTime == 1 ) {
	            		chartColumnPrevious = '月均';
	            	}
	            	var chartColumnCurrent = '今年';
	            	if ( $scope.selectedTime == 1 ) {
	            		chartColumnCurrent = '当月';
	            	}
	            	var chartColumnPreviousRef = '去年参考值';
	            	if ( $scope.selectedTime == 1 ) {
	            		chartColumnPreviousRef = '月均参考值';
	            	}
	            	var chartColumnCurrentRef = '今年参考值';
	            	if ( $scope.selectedTime == 1 ) {
	            		chartColumnCurrentRef = '当月参考值';
	            	}
				        
			        var chartWidth = $(window).width() * 0.60;
			        if ( reportService.getFullScreen() ) {
			        	chartWidth = $(window).width();
					}
			                    		
			        chartData = [chartData[index]];
			        
		        	for (var i=0;i<chartData.length;i++) 
	  				{
			        	var currentData = chartData[i];
			        	$scope.charts[index].chart = $('#' + currentData.id).highcharts({
			                chart: {
			                	zoomType: 'xy',
			                    height:$(window).height()*0.60,
			                    width: chartWidth,
			                },
			                title: {
			                    text: currentData.title
			                },
			                subtitle: {
			                    text: chartSubtitle
			                },
			                xAxis: chartCategories,
			                yAxis: [{
			                    title: {
			                        text: currentData.yAxisTitle
			                    },
			                    min:-10000
			                },
		                    {
		                        gridLineWidth: 0,
		                        title: {
		                            text: '增长百分比 (%)'
		                        },
		                        labels: {
		                            formatter: function() {
		                                return this.value +' %';
		                            }
		                        }
		                        ,
		                        opposite: true
		                    },
							],
			                tooltip: {
			                    formatter: function() {
			                        var tooltip = this.series.name +': '+ this.y +'<br/>';
			                        return  tooltip;
			                    },
			                    useHTML: true
			                },
			                plotOptions: {
			                    column: {
			                    	cursor: 'pointer',
			                    	point: {
				                        events: {
				                            click: function() {
				                            	var drilldown = this.drilldown;
				                                if (drilldown) { // drill down
				                                    $scope.drawDrilldown(restClient(config.currentMode).queryDepartmentIncomeReport, this.detail.name, drilldown.dealerID, drilldown.index);
					                            } 
				                            }
				                        }
				                    },
			                    }
			                },
			                series: [
				                    {
				                        type: 'column',
				                        name: chartColumnPrevious,
				                        data: currentData.series.previous
				                    },
				                    {
				                        type: 'column',
				                        name: chartColumnCurrent,
				                        data: currentData.series.current
				                    },
				                    {
				                        type: 'spline',
				                        name: chartColumnPreviousRef,
				                        data: currentData.series.previousReference
				                    },
				                    {
				                        type: 'spline',
				                        name: chartColumnCurrentRef,
				                        data: currentData.series.currentReference
				                    },
				                    {
				                        type: 'spline',
				                        name: '增长比例(%)',
				                        yAxis: 1,
				                        data: currentData.series.currentPercentage
				                    }
				            ]
			        	}).highcharts();
			        }
		        
			  });
		};

		$scope.times = [
    		{text:'年', value:0, isDefault: true},
    		{text:'月', value:1, isDefault: false}];
    	
    	$scope.selectTime = function(x) {
    		if ( x == 0 ) { // year
    			$scope.selectedTime = 0;
    			$scope.showReport();
    		}
    		if ( x == 1 ) { // month
    			$scope.selectedTime = 1;
    			$scope.showReport();
    		}
    	};
    	
        reportService.setFullScreen(false);

        $scope.toggleFullScreen = function()
        {
            if (reportService.getFullScreen())
            {
                $('#container_div').addClass('container');
                $('#container_div').removeClass('row-fluid');
                $("#header").removeClass('hide');
                $("#nav_div").removeClass('hide');
                $("#report_div").removeClass('span12');
                $("#report_div").addClass('span9');
                reportService.setFullScreen(false);
                $scope.showReport();
                
            }
            else
            {
                $('#container_div').removeClass('container');
                $('#container_div').addClass('row-fluid');
                $("#header").addClass('hide');
                $("#nav_div").addClass('hide');
                $("#report_div").removeClass('span9');
                $("#report_div").addClass('span12');
                reportService.setFullScreen(true);
                $scope.showReport();
               
            }
        };

  }]);
