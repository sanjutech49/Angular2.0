// This file (PricingService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var PricingService = (function () {
        function PricingService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.StartNewProspectGeneric = function (successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'PricingService/StartNewProspect'; }
                return _this.httpUtil.get(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.StartNewProspect = function (serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'PricingService/StartNewProspect'; }
                return _this.StartNewProspectGeneric(successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.CreateSmartGFEGeneric = function (loanVM, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'PricingService/CreateSmartGFE'; }
                return _this.httpUtil.post(methodPath, { loanVM: loanVM }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.CreateSmartGFE = function (loanVM, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'PricingService/CreateSmartGFE'; }
                return _this.CreateSmartGFEGeneric(loanVM, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.GetGFEDataGeneric = function (loanVM, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'PricingService/GetGFEData'; }
                return _this.httpUtil.post(methodPath, { loanVM: loanVM }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.GetGFEData = function (loanVM, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'PricingService/GetGFEData'; }
                return _this.GetGFEDataGeneric(loanVM, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.UpdateLoanVmGeneric = function (loan, guid, legacyProduct, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'PricingService/UpdateLoanVm'; }
                return _this.httpUtil.post(methodPath, { loan: loan, guid: guid, legacyProduct: legacyProduct }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.UpdateLoanVm = function (loan, guid, legacyProduct, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'PricingService/UpdateLoanVm'; }
                return _this.UpdateLoanVmGeneric(loan, guid, legacyProduct, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        PricingService.className = 'PricingService';
        PricingService.$inject = ['httpUtil'];
        return PricingService;
    })();
    srv.PricingService = PricingService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.PricingService);
//# sourceMappingURL=PricingService.js.map