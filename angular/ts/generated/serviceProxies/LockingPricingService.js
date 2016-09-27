// This file (LockingPricingService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var LockingPricingService = (function () {
        function LockingPricingService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.LoadLookupsGeneric = function (userAccountId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LockingPricingService/LoadLookups'; }
                return _this.httpUtil.get(methodPath, { userAccountId: userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.LoadLookups = function (userAccountId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LockingPricingService/LoadLookups'; }
                return _this.LoadLookupsGeneric(userAccountId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.LoadLockExpireDateGeneric = function (successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LockingPricingService/LoadLockExpireDate'; }
                return _this.httpUtil.get(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.LoadLockExpireDate = function (serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LockingPricingService/LoadLockExpireDate'; }
                return _this.LoadLockExpireDateGeneric(successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        LockingPricingService.className = 'LockingPricingService';
        LockingPricingService.$inject = ['httpUtil'];
        return LockingPricingService;
    })();
    srv.LockingPricingService = LockingPricingService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.LockingPricingService);
//# sourceMappingURL=LockingPricingService.js.map