/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../ts/lib/common.util.ts" />
/// <reference path="../../ts/global/global.ts" />

module filters {

    export class CurrencyFilter {

        static className = "currencyFilter";

        static $inject = [];

        static factory(): Function {
            return (input: any) => {
                if (isNaN(input)) {
                    return input;
                }
                else {
                    return '$' + input;
                }
            }
        }
    }

    moduleRegistration.registerFilter(consumersite.moduleName, CurrencyFilter);
} 