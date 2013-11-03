'use strict';

angular.module('departmentPercentage.controllers', [])
	.controller('departmentPercentageCtrl', ['$scope', '$http', 'ReportRestClient', 'ReportService', 'config', function($scope, $http, restClient, reportService, config) {
		$scope.charts = [
			{text:'营业额', chart:null},
    		{text:'毛利', chart:null},
    		{text:'费用', chart:null},
    		{text:'运营利润', chart:null},
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
    	
    	$scope.departments = [];
    	$scope.dealerOptions = [];
    	reportService.getDealers(restClient(config.currentMode).queryDealers, {}, function(dealers) {
    		$scope.dealerOptions = dealers;
    		$scope.selectedDealerOption = $scope.dealerOptions[0];
			reportService.getDepartments(restClient(config.currentMode).queryDepartments, {}, function(departments) {
	    		$scope.departments = departments;
	    		// called on page is loaded
				$scope.showReport();
			});
		});
		
		$scope.selectDealer = function() {
			$scope.showReport();
		};
		
    	$scope.showReport = function()
        {
        	var params = null;
        	if ( $scope.selectedTime == 0 ) {
        		params = {year: reportService.getCurrentYear(), dealerID: $scope.selectedDealerOption.id};
        	}
        	if ( $scope.selectedTime == 1 ) {
        		params = {year: reportService.getCurrentYear(), monthOfYear: reportService.getMonthOfYear(), dealerID: $scope.selectedDealerOption.id};
        	}
        	for ( var i=0; i< $scope.charts.length;i++ ) {
        		$scope.draw(restClient(config.currentMode).queryDepartmentIncomeReport, params, i); 
        	}
        	
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
				        		series: { previous:[], current:[], percentage: [],}
				        	}, 
				        	{
				        		id: 'report_margin',
				        		title: '毛利',
				        		yAxisTitle: '毛利',
				        		series: { previous:[], current:[], percentage: [],}
				        	},
				        	{
				        		id: 'report_expense',
				        		title: '费用',
				        		yAxisTitle: '费用',
				        		series: { previous:[], current:[], percentage: [],}
				        	}, 
				        	{
				        		id: 'report_opProfit',
				        		title: '运营利润',
				        		yAxisTitle: '运营利润',
				        		series: { previous:[], current:[], percentage: [],}
				        	},

				    ]; 
	            	var chartCategories = [{ categories: null }];
	            	var departments = [];
	            	for ( var i = 0; i < $scope.departments.length;i++ ) {
	            		departments[i] = $scope.departments[i].name;
	            	}
	            	chartCategories[0].categories = departments;
					
	            	var previousDetail = data.detail[0].departmentDetail;
	            	var previousYear = data.detail[0].year;
	            	for ( var i = 1;i < previousDetail.length; i++ ) {
	            		chartData[0].series.previous[i-1] = [previousDetail[i].name, previousDetail[i].revenue.amount];
	            		chartData[1].series.previous[i-1] = [previousDetail[i].name, previousDetail[i].margin.amount];
	            		chartData[2].series.previous[i-1] = [previousDetail[i].name, previousDetail[i].expense.amount];
	            		chartData[3].series.previous[i-1] = [previousDetail[i].name, previousDetail[i].opProfit.amount];
	            	};
	            	
					var currentDetail = data.detail[1].departmentDetail;
					for ( var i = 1;i < currentDetail.length; i++ ) {
	            		chartData[0].series.current[i-1] = [currentDetail[i].name, currentDetail[i].revenue.amount];
	            		chartData[1].series.current[i-1] = [currentDetail[i].name, currentDetail[i].margin.amount];
	            		chartData[2].series.current[i-1] = [currentDetail[i].name, currentDetail[i].expense.amount];
	            		chartData[3].series.current[i-1] = [currentDetail[i].name, currentDetail[i].opProfit.amount];
	            		
	            		chartData[0].series.percentage[i-1] = [currentDetail[i].name, currentDetail[i].revenue.percentage];
	            		chartData[1].series.percentage[i-1] = [currentDetail[i].name, currentDetail[i].margin.percentage];
	            		chartData[2].series.percentage[i-1] = [currentDetail[i].name, currentDetail[i].expense.percentage];
	            		chartData[3].series.percentage[i-1] = [currentDetail[i].name, currentDetail[i].opProfit.percentage];
	            	};
	            	
	            	var chartSubtitle = '年度对比';
	            	if ( $scope.selectedTime == 1 ) {
	            		chartSubtitle = '月对比';
	            	}
	            	
	            	var chartColumnPrevious = '去年';
	            	if ( $scope.selectedTime == 1 ) {
	            		chartColumnPrevious = '月均';
	            	}
	            	var chartColumnCurrent = '今年';
	            	if ( $scope.selectedTime == 1 ) {
	            		chartColumnCurrent = '当月';
	            	}  
			        var chartWidth = $(window).width() * 0.60;
			        if ( reportService.getFullScreen() ) {
			        	chartWidth = $(window).width();
					}
			                    		
			        chartData = [chartData[index]];
			        for (var i=0;i<chartData.length;i++) 
	  				{
			        	var currentData = chartData[i];
			        	
			        	//draw bar chart
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
				                            	// do nothing here
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
			                        name: '增长比例(%)',
			                        yAxis: 1,
			                        data: currentData.series.percentage
			                    	},
				                    {
							            type: 'pie',
							            name: currentData.title + '百分比',
							            data: currentData.series.current,
							            size: 100,
							            dataLabels: {
						                    enabled: true,
						                    color: '#000000',
						                    connectorColor: '#000000',
						                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
						                }
							        }
				            ]
			        	}).highcharts();
			        	
			        	//draw pie chart
			        	//$('#' + currentData.id + '_pie').highcharts({
					    //    chart: {
					    //    	height:$(window).height()*0.60,
			            //        width: chartWidth,
					    //        plotBackgroundColor: null,
					    //        plotBorderWidth: null,
					    //        plotShadow: false
					    //    },
					    //    title: {
					    //        text: '各部门' + currentData.title + '百分比'
					    //    },
					    //    tooltip: {
					    //	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
					    //    },
					    //    plotOptions: {
					    //        pie: {
					    //            allowPointSelect: true,
					       //         cursor: 'pointer',
					       //         dataLabels: {
					       //             enabled: true,
					       //             color: '#000000',
					       //             connectorColor: '#000000',
					       //             format: '<b>{point.name}</b>: {point.percentage:.1f} %'
					      //          }
					      //      }
					      //  },
					      //  series: [{
					     //       type: 'pie',
					     //       name: currentData.title + '百分比',
					     //       data: currentData.series.current
					     //   }]
					    //});
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
