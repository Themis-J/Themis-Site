'use strict';

angular.module('masterApp.controllers', [])
	.controller('headEditCtrl', ['$scope',
	function($scope) {
		$scope.items = ['overallAbs',
						'overallPercentage',
						'departmentOp', 
						'departmentAbs', 
						'departmentPercentage', 
						'departmentOpComp', 
						'salesAbs', ];
        
		$scope.goto = function(itemId)
        {
        	$scope.$apply(function(){
            });
            $scope.subpage = 'partials/head/' + $scope.items[itemId] + '.html';
        };
        
        $scope.bindEvent = function()
        {
            $('ul.nav.nav-pills li a').click(function() {
                $(this).parent().addClass('active').siblings().removeClass('active');
            });
        };

        $scope.$on('$includeContentLoaded', function () {
        });
        
        $scope.subpage = 'partials/head/' + $scope.items[0] + '.html';


  }])
    .controller('branchHeadCtrl', [ '$scope', '$route', '$location', 'DealerService','UserService','Auth', function($scope, $route,$location,DealerService,UserService,Auth)
    {
        $scope.signout = function() {
            Auth.logout({}, function () {
                UserService.setupUser(null);
                $location.path('/guest/login');
            })
        }
    }
    ]);
