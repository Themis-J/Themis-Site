'use strict';

/* Directives */


angular.module('themis.directives', []).
    directive('passEqual', [function () {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, c) {
                scope.$watch(attrs.ngModel, function () {
                    if (scope.password1 && scope.password2) {
                        if (scope.password1 == scope.password2) {
                            scope.the_form.inputPassword1.$setValidity('equal', true);
                            scope.the_form.inputPassword2.$setValidity('equal', true);
                        }
                        else {
                            c.$setValidity('equal', false);
                        }
                    }
                });
            }
        }
    }])
    .directive('bindHtmlUnsafe', function ($compile) {
        return function ($scope, $element, $attrs) {
            var compile = function (newHTML) { // Create re-useable compile function
                newHTML = $compile(newHTML)($scope); // Compile html
                $element.html('').append(newHTML); // Clear and append it
            };

            var htmlName = $attrs.bindHtmlUnsafe; // Get the name of the variable
            // Where the HTML is stored

            $scope.$watch(htmlName, function (newHTML) { // Watch for changes to
                // the HTML
                if (!newHTML) return;
                compile(newHTML);   // Compile it
            });

        }
    })
;
