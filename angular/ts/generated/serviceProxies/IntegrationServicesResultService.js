// This file (IntegrationServicesResultService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var IntegrationServicesResultService = (function () {
        function IntegrationServicesResultService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.GetGeneric = function (loanId, userAccountId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'IntegrationServicesResultService/Get'; }
                return _this.httpUtil.get(methodPath, { loanId: loanId, userAccountId: userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.Get = function (loanId, userAccountId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'IntegrationServicesResultService/Get'; }
                return _this.GetGeneric(loanId, userAccountId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        IntegrationServicesResultService.className = 'IntegrationServicesResultService';
        IntegrationServicesResultService.$inject = ['httpUtil'];
        return IntegrationServicesResultService;
    })();
    srv.IntegrationServicesResultService = IntegrationServicesResultService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.IntegrationServicesResultService);
//# sourceMappingURL=IntegrationServicesResultService.js.map