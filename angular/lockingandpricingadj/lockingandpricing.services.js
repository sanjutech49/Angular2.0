/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../ts/global/global.ts" /> 
/// <reference path="../loancenter/loancenter.app.ts" />
var loanCenter;
(function (loanCenter) {
    'use strict';
    var lockingPricingService = (function () {
        function lockingPricingService(ApiRoot, $resource, $q) {
            var _this = this;
            this.ApiRoot = ApiRoot;
            this.$resource = $resource;
            this.$q = $q;
            this.lockLoan = function () {
                return _this.$resource(_this.lockExpireDateUrl, { loanid: 'loanid', useraccountid: 'useraccountid' });
            };
            var vm = this;
            vm.apiPath = ApiRoot + "LockingPricing/";
            vm.lockExpireDateUrl = vm.apiPath + 'LockExpireDate';
        }
        lockingPricingService.className = 'LockingPricingService';
        lockingPricingService.$inject = ['apiRoot', '$resource', '$q',];
        return lockingPricingService;
    })();
    loanCenter.lockingPricingService = lockingPricingService;
    angular.module('lockingandpricingadj').service('lockingPricingService', lockingPricingService);
})(loanCenter || (loanCenter = {}));
//moduleRegistration.registerService(moduleNames.loanCenter, loanCenter.manageAccountService); 
//# sourceMappingURL=lockingandpricing.services.js.map