// This file (CostService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var CostService = (function () {
        function CostService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.EagerLoadGeneric = function (loanId, userAccountId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'CostService/EagerLoad'; }
                return _this.httpUtil.get(methodPath, { loanId: loanId, userAccountId: userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.EagerLoad = function (loanId, userAccountId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'CostService/EagerLoad'; }
                return _this.EagerLoadGeneric(loanId, userAccountId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.SaveGeneric = function (loanVm, userAccountId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'CostService/Save'; }
                return _this.httpUtil.post(methodPath, { loanVm: loanVm, userAccountId: userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.Save = function (loanVm, userAccountId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'CostService/Save'; }
                return _this.SaveGeneric(loanVm, userAccountId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.GetActiveDisclosureDetailsGeneric = function (loanId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'CostService/GetActiveDisclosureDetails'; }
                return _this.httpUtil.get(methodPath, { loanId: loanId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.GetActiveDisclosureDetails = function (loanId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'CostService/GetActiveDisclosureDetails'; }
                return _this.GetActiveDisclosureDetailsGeneric(loanId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        CostService.className = 'CostService';
        CostService.$inject = ['httpUtil'];
        return CostService;
    })();
    srv.CostService = CostService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.CostService);
//# sourceMappingURL=CostService.js.map