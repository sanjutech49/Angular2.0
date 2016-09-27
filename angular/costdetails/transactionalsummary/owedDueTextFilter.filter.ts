/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />

module loancenter {
    'use strict';

    export function oweDueTextFilter() {
        return function(inputStr, amount) {
            return (amount > 0) ? inputStr.replace(/from /gi, 'To ') :  inputStr.replace(/to /gi, 'From ');
        }
    }

    angular.module('loanCenter').filter('oweDueTextFilter', oweDueTextFilter);
}; 