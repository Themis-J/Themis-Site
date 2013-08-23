'use strict';

angular.module('myApp.controllers', []).
  controller('editCtrl', ['$scope',function($scope) {
        $scope.items = ['lirun','jingying', 'sunyi', 'zhangkuan', 'kucun', 'renyuan', 'shui'];
        $scope.deptmts = ['新车销售部','二手车部','租赁事业部','维修部','配件部','钣喷部','水平事业部'];

        $scope.subpage = 'partials/branch/' + $scope.items[0] + '.html';
        $scope.depat =  $scope.deptmts[0];
        $scope.report = {};
        $scope.report.width;
        $scope.report.height;
        $scope.report.isFull = false;

        $scope.showReport = function(itemId, deptmtId)
        {
            drawReport();
        }

        $scope.bindEvent = function()
        {
            $('ul.nav.nav-pills li a').click(function() {
                $(this).parent().addClass('active').siblings().removeClass('active');
            });
        }

        $scope.toggleFullScreen = function()
        {
            if ($scope.report.isFull)
            {
                $("#header").removeClass('hide');
                $("#nav_div").removeClass('hide');
                $("#report_div").removeClass('span12');
                $("#report_div").addClass('span10');
                drawReport();
                $scope.report.isFull = false;
            }
            else
            {
                $("#header").addClass('hide');
                $("#nav_div").addClass('hide');
                $("#report_div").removeClass('span10');
                $("#report_div").addClass('span12');
                drawReport();
                $scope.report.isFull = true;
            }
        }

        $scope.$on('$viewContentLoaded', function () {
            $scope.report.width  = $('#report_div').width();
            $scope.report.height = $('#report_div').height();
            drawReport();
        });

        function drawReport()
        {
            Highcharts.theme = {
                colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                chart: {
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                        stops: [
                            [0, 'rgb(255, 255, 255)'],
                            [1, 'rgb(240, 240, 255)']
                        ]
                    },
                    borderWidth: 0,
                    plotBackgroundColor: 'rgba(255, 255, 255, .9)',
                    plotShadow: true,
                    plotBorderWidth: 1
                },
                title: {
                    style: {
                        color: '#000',
                        font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
                    }
                },
                subtitle: {
                    style: {
                        color: '#666666',
                        font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
                    }
                },
                xAxis: {
                    gridLineWidth: 1,
                    lineColor: '#000',
                    tickColor: '#000',
                    labels: {
                        style: {
                            color: '#000',
                            font: '11px Trebuchet MS, Verdana, sans-serif'
                        }
                    },
                    title: {
                        style: {
                            color: '#333',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            fontFamily: 'Trebuchet MS, Verdana, sans-serif'

                        }
                    }
                },
                yAxis: {
                    minorTickInterval: 'auto',
                    lineColor: '#000',
                    lineWidth: 1,
                    tickWidth: 1,
                    tickColor: '#000',
                    labels: {
                        style: {
                            color: '#000',
                            font: '11px Trebuchet MS, Verdana, sans-serif'
                        }
                    },
                    title: {
                        style: {
                            color: '#333',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                        }
                    }
                },
                legend: {
                    itemStyle: {
                        font: '9pt Trebuchet MS, Verdana, sans-serif',
                        color: 'black'

                    },
                    itemHoverStyle: {
                        color: '#039'
                    },
                    itemHiddenStyle: {
                        color: 'gray'
                    }
                },
                labels: {
                    style: {
                        color: '#99b'
                    }
                },

                navigation: {
                    buttonOptions: {
                        theme: {
                            stroke: '#CCCCCC'
                        }
                    }
                }
            };

            // Apply the theme
            var highchartsOptions = Highcharts.setOptions(Highcharts.theme);

            var chart = $('#report').highcharts({
                chart: {
                    zoomType: 'xy',
                    height:$(window).height()*0.75
                },
                title: {
                    text: '税前净利润报表'
                },
                subtitle: {
                    text: '年度对比'
                },
                xAxis: [{
                    categories: [
                        'CN01-03',
                        'CN01-11',
                        'CN01-14',
                        'CN01-13',
                        'CN01-12',
                        'CN01-16',
                        'CN01-20',
                        'CN01-09',
                        'CN01-21',
                        'CN01-05',
                        'CN01-19',
                        'CN01-02',
                        'CN01-17',
                        'CN01-08',
                        'CN01-01',
                        'CN01-18',
                        'CN01-07',
                        'CN01-15',
                        'CN01-10',
                        'CN01-06'
                    ]
                }],
                yAxis: [{
                    title: {
                        text: '税前净利润 (元)'
                    },
                    min:-31000
                },
                    {
                        gridLineWidth: 0,
                        title: {
                            text: '税前净增长百分比 (%)'
                        },
                        labels: {
                            formatter: function() {
                                return this.value +' %';
                            }
                        }
                        ,
                        opposite: true
                    }],
                tooltip: {
                    formatter: function() {
                        var tooltip = this.series.name +': '+ this.y +'<br/>';
                        if (this.point.stackTotal)
                        {
                            tooltip =  '<b>'+ this.x +'</b><br/>'  + tooltip;
                            tooltip += '总计: '+ this.point.stackTotal;
                        }

                        return  tooltip;
                    },
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series: [
                    {
                        type: 'column',
                        name: '新车部',
                        data: [6443, 5277, 4601, 3105, 2175, 1954, 4370, 1210, 1391, 2339, 3207, 5685, 1305, -426, -775, -2643, -3483, -3519, -4481, -6089],
                        stack: '今年'
                    },
                    {
                        type: 'column',
                        name: '二手车部',
                        data: [8443, 7277, 5301, 4105, 3175, 2954, 2370, 2210, 2175, 2091, 1907, 1833, 1723, -426, -675, -2843, -3283, -3519, -4481, -6089],
                        stack: '今年'
                    },
                    {
                        type: 'column',
                        name: '机修部',
                        data: [8443, 7277, 5301, 4105, 3175, 2954, 2370, 2210, 2175, 2091, 1907, 1833, 1723, -426, -675, -2843, -3283, -3519, -4481, -6089],
                        stack: '今年'
                    },
                    {
                        type: 'column',
                        name: '备件部',
                        data:  [6443, 5277, 4601, 3105, 2175, 1954, 4370, 1210, 1391, 2339, 3207, 5685, 1305, -426, -775, -2643, -3483, -3519, -4481, -6089],
                        stack: '今年'
                    },
                    {
                        type: 'column',
                        name: '钣喷部',
                        data: [6443, 5277, 4601, 3105, 2175, 1954, 4370, 1210, 1391, 2339, 3207, 5685, 1305, -426, -775, -2643, -3483, -3519, -4481, -6089],
                        stack: '今年'
                    },

                    {
                        type: 'column',
                        name: '新车部(去年)',
                        data: [5443, 4277, 3601, 2105, 1175, 1154, 3370, 1010, 1191, 1339, 2207, 4685, 1105, -1426, -1775, -3643, -4483, -4519, -5481, -7089],
                        stack: '去年'
                    },
                    {
                        type: 'column',
                        name: '二手车部(去年)',
                        data: [7443, 6277, 4301, 3105, 2175, 1954, 1370, 1210, 1175, 1091, 1207, 933, 1323, -726, -975, -3343, -4283, -4519, -4981, -7089] ,
                        stack: '去年'
                    },
                    {
                        type: 'column',
                        name: '机修部(去年)',
                        data: [5443, 4277, 3601, 2105, 1175, 1154, 3370, 1010, 1191, 1339, 2207, 4685, 1105, -1426, -1775, -3643, -4483, -4519, -5481, -7089],
                        stack: '去年'
                    },
                    {
                        type: 'column',
                        name: '备件部(去年)',
                        data: [7443, 6277, 4301, 3105, 2175, 1954, 1370, 1210, 1175, 1091, 1207, 933, 1323, -726, -975, -3343, -4283, -4519, -4981, -7089] ,
                        stack: '去年'
                    },
                    {
                        type: 'column',
                        name: '钣喷部(去年)',
                        data: [5443, 4277, 3601, 2105, 1175, 1154, 3370, 1010, 1191, 1339, 2207, 4685, 1105, -1426, -1775, -3643, -4483, -4519, -5481, -7089],
                        stack: '去年'
                    },
                    {
                        type: 'spline',
                        name: '平均净利润',
                        data: [8300, 8300, 8300, 8300, 8300, 8300, 8300, 8300, 8300, 8300, 8300, 8300, 8300, 8300, 8300, 8300, 8300, 8300, 8300, 8300]
                    },
                    {
                        type: 'spline',
                        name: '净利润增长比例(%)',
                        yAxis: 1,
                        data: [3.1, 2.4, 3.5, 3.2, 3.2, 3.2, 3.3, 2.9, 4.1, 3.9, 3.6, 3.2, 4.1, 3.9, 3.6,  2.9, 2.1,  3.2, 2.9, 2.4]
                    }
                ]
            });

            return chart;
        }
  }])

  .controller('viewCtrl', ['$scope',function($scope) {

  }]);
