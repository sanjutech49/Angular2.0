(function () {
    'use strict';

    angular.module('loanDetails')
        .directive('productInfo', productInfo);

    function productInfo() {
        return {
            restrict: 'E',
            scope: {
                productInfoHeight: '='
            },
            templateUrl: 'angular/loandetails/sections/productinfodirective.html', 
            link: function (scope, element, attrs) {
                scope.productInfoHeight = element[0].offsetHeight > 20;
            }
        }
    }
})();