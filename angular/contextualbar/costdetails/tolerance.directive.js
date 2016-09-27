(function () {
    angular.module('loanCenter').directive('impTolerance', function () {
        return {
            restrict: 'E',
            templateUrl: 'angular/contextualbar/costdetails/tolerance.html',
            scope: {
                'model': '=',
                'costs': '=',
                'headerTitle': '@',
                'lastSection': '&',
                'threshHold': '@'
            },
            controller: function ($scope, $element, $attrs) {
                $scope.unlimitedTolerance = ($attrs.unlimitedTolerance == 'false') ? false : true;
                $scope.lastSection = ($attrs.lastSection == 'false') ? false : true;
                $scope.getColorCode = function (value) {
                    if (parseFloat($scope.threshHold) == 100)
                        return (parseFloat(value) > 0) ? 'alert-red' : 'primary-green';
                    return (parseFloat(value) > parseFloat($scope.threshHold)) ? 'alert-red' : 'primary-green';
                }
            }
        };
    });
})()