'use strict';

angular.module('salesAbs.controllers', [])
	.controller('salesAbsCtrl', ['$scope', '$http', 'ReportRestClient', 'ReportService', 'config', function($scope, $http, restClient, reportService, config) {
		$scope.charts = [
    		{id: 'report_retail', text:'零售销量', display:true},
    		{id: 'report_wholesale', text:'批发销量', display:true},
    		{id: 'report_other', text:'他店调车量', display:true}];
    	
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
    	
    	$scope.showReport = function()
        {
        	var params = null;
        	if ( $scope.selectedTime == 0 ) {
        		params = {year: reportService.getCurrentYear()};
        	}
        	if ( $scope.selectedTime == 1 ) {
        		params = {year: reportService.getCurrentYear(), monthOfYear: reportService.getMonthOfYear()};
        	}
        	for ( var i=0; i< $scope.charts.length;i++ ) {
        		if ( $scope.charts[i].display == true ) {
        			$scope.draw(restClient(config.currentMode).queryDealerSalesReport, params, i);
        		} 
        	}
        	
        };
        $scope.draw = function (restClient, params, index) {
	        	Highcharts.theme = config.highChartsTheme;
				
	            // Apply the theme
	            var highchartsOptions = Highcharts.setOptions(Highcharts.theme); 
	 			
	            restClient(params, function(data) {
	            	var chartData = [
				        	{
				        		id: 'report_retail',
				        		title: '零售销量',
				        		yAxisTitle: '零售销量',
				        		series: { previous:[], current:[], previousReference:[], currentReference:[], currentPercentage:[], }
				        	},
				        	{
				        		id: 'report_wholesale',
				        		title: '批发销量',
				        		yAxisTitle: '批发销量',
				        		series: { previous:[], current:[], previousReference:[], currentReference:[], currentPercentage:[], }
				        	},
				        	{
				        		id: 'report_other',
				        		title: '他店调车量',
				        		yAxisTitle: '他店调车量',
				        		series: { previous:[], current:[], previousReference:[], currentReference:[], currentPercentage:[], }
				        	}
				    ]; 
	            	var chartCategories = [{ categories: null }];
	            	var dealers = [];
	            	var previousDetail = data.detail[0].salesDetail;
	            	for ( var i in previousDetail ) {
	            		dealers[i] = previousDetail[i].code;
	            		chartData[0].series.previous[i] = previousDetail[i].retail.amount;
	            		chartData[0].series.previousReference[i] = previousDetail[i].retail.reference;
	            		
	            		chartData[1].series.previous[i] = previousDetail[i].wholesale.amount;
	            		chartData[1].series.previousReference[i] = previousDetail[i].wholesale.reference;
	            		
	            		chartData[2].series.previous[i] = previousDetail[i].other.amount;
	            		chartData[2].series.previousReference[i] = previousDetail[i].other.reference;
	            		
	            	};
	            	
					chartCategories[0].categories = dealers;
					var currentDetail = data.detail[1].salesDetail;
					for ( var i in currentDetail ) {
	            		chartData[0].series.current[i] = currentDetail[i].retail.amount;
	            		chartData[0].series.currentPercentage[i] = currentDetail[i].retail.percentage * 100;
	            		chartData[0].series.currentReference[i] = currentDetail[i].retail.reference;
	            		
	            		chartData[1].series.current[i] = currentDetail[i].wholesale.amount;
	            		chartData[1].series.currentPercentage[i] = currentDetail[i].wholesale.percentage * 100;
	            		chartData[1].series.currentReference[i] = currentDetail[i].wholesale.reference;
	            		
	            		chartData[2].series.current[i] = currentDetail[i].other.amount;
	            		chartData[2].series.currentReference[i] = currentDetail[i].other.reference;
	            		chartData[2].series.currentPercentage[i] = currentDetail[i].other.percentage * 100;
	            		
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
			        	chartWidth = $(window).width() * 0.90;
					}
			        
			        chartData = [chartData[index]];
			        for (var i=0;i<chartData.length;i++) 
	  				{
			        	var currentData = chartData[i];
			        	$('#' + currentData.id).highcharts({
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
			                    	cursor: 'pointer'
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
			        	});
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

		// called on page is loaded
		$scope.showReport();
  }]);
