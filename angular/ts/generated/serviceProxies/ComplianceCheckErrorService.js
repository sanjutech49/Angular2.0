// This file (ComplianceCheckErrorService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var ComplianceCheckErrorService = (function () {
        function ComplianceCheckErrorService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.GetGeneric = function (loanId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ComplianceCheckErrorService/Get'; }
                return _this.httpUtil.get(methodPath, { loanId: loanId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.Get = function (loanId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ComplianceCheckErrorService/Get'; }
                return _this.GetGeneric(loanId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        ComplianceCheckErrorService.className = 'ComplianceCheckErrorService';
        ComplianceCheckErrorService.$inject = ['httpUtil'];
        return ComplianceCheckErrorService;
    })();
    srv.ComplianceCheckErrorService = ComplianceCheckErrorService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.ComplianceCheckErrorService);
//# sourceMappingURL=ComplianceCheckErrorService.js.map