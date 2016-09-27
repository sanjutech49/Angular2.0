/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />
//Jacob Nix - 01/05/2016
//Attribute Directive designed to allow formatting input as currency filtered.
//
//example:
//<input type"text" ng-model="myDollarInput" format-currency />
var directive;
(function (directive) {
    var FormatCurrencyDirective = (function () {
        function FormatCurrencyDirective($filter) {
            var _this = this;
            this.$filter = $filter;
            this.restrict = 'A';
            this.require = 'ngModel';
            this.link = function ($scope, element, attrs, ngModel) {
                if (!ngModel)
                    return;
                var __this = _this;
                function formatter(value) {
                    value = value ? parseFloat(removeFormat(value)) : "";
                    var formattedValue = __this.$filter('currency')(value);
                    element.val(formattedValue);
                    return formattedValue;
                }
                function removeFormat(value) {
                    return value.toString().replace(/[^0-9._-]/g, '');
                }
                ngModel.$formatters.push(formatter);
                element.bind('focus', function () {
                    //When you click on it, remove the '$' and any additional garbage.
                    element.val(removeFormat(element.val()));
                });
                element.bind('blur', function () {
                    //When focus is dropped from the input, format our input.
                    if (element.val() != 0)
                        formatter(element.val());
                });
            };
        }
        FormatCurrencyDirective.createNew = function (args) {
            return new FormatCurrencyDirective(args[0]);
        };
        FormatCurrencyDirective.className = 'formatCurrency';
        FormatCurrencyDirective.$inject = ['$filter'];
        return FormatCurrencyDirective;
    })();
    directive.FormatCurrencyDirective = FormatCurrencyDirective;
    moduleRegistration.registerDirective(consumersite.moduleName, FormatCurrencyDirective);
})(directive || (directive = {}));
//# sourceMappingURL=formatCurrency.directive.js.map