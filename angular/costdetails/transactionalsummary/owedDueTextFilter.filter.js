/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
var loancenter;
(function (loancenter) {
    'use strict';
    function oweDueTextFilter() {
        return function (inputStr, amount) {
            return (amount > 0) ? inputStr.replace(/from /gi, 'To ') : inputStr.replace(/to /gi, 'From ');
        };
    }
    loancenter.oweDueTextFilter = oweDueTextFilter;
    angular.module('loanCenter').filter('oweDueTextFilter', oweDueTextFilter);
})(loancenter || (loancenter = {}));
;
//# sourceMappingURL=owedDueTextFilter.filter.js.map