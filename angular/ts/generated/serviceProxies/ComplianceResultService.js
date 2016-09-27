// This file (ComplianceResultService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var ComplianceResultService = (function () {
        function ComplianceResultService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.GetGeneric = function (loanId, userAccountId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ComplianceResultService/Get'; }
                return _this.httpUtil.get(methodPath, { loanId: loanId, userAccountId: userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.Get = function (loanId, userAccountId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ComplianceResultService/Get'; }
                return _this.GetGeneric(loanId, userAccountId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.SubmitGeneric = function (request, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ComplianceResultService/Submit'; }
                return _this.httpUtil.post(methodPath, { request: request }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.Submit = function (request, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ComplianceResultService/Submit'; }
                return _this.SubmitGeneric(request, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        ComplianceResultService.className = 'ComplianceResultService';
        ComplianceResultService.$inject = ['httpUtil'];
        return ComplianceResultService;
    })();
    srv.ComplianceResultService = ComplianceResultService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.ComplianceResultService);
//# sourceMappingURL=ComplianceResultService.js.map