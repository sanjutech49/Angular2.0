/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />

//Jacob Nix - 01/05/2016
//Attribute Directive designed to allow formatting input as currency filtered.
//
//example:
//<input type"text" ng-model="myDollarInput" format-currency />


module directive {

    export class FormatCurrencyDirective implements ng.IDirective {

        static className = 'formatCurrency';

        static $inject = ['$filter'];

        constructor(private $filter: ng.IFilterService) { }

        static createNew(args: any[]): FormatCurrencyDirective {
            return new FormatCurrencyDirective(args[0]);
        }

        restrict = 'A';

        require = 'ngModel';

        link = ($scope: any, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: INgModelController) => {

            if (!ngModel) return;

            var __this = this;
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
        }
    }

    moduleRegistration.registerDirective(consumersite.moduleName, FormatCurrencyDirective);
}