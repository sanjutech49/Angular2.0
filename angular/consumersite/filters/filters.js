/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../ts/lib/common.util.ts" />
/// <reference path="../../ts/global/global.ts" />
var filters;
(function (filters) {
    var CurrencyFilter = (function () {
        function CurrencyFilter() {
        }
        CurrencyFilter.factory = function () {
            return function (input) {
                if (isNaN(input)) {
                    return input;
                }
                else {
                    return '$' + input;
                }
            };
        };
        CurrencyFilter.className = "currencyFilter";
        CurrencyFilter.$inject = [];
        return CurrencyFilter;
    })();
    filters.CurrencyFilter = CurrencyFilter;
    moduleRegistration.registerFilter(consumersite.moduleName, CurrencyFilter);
})(filters || (filters = {}));
//# sourceMappingURL=filters.js.map