// This file (SecureLinkEmailService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var SecureLinkEmailService = (function () {
        function SecureLinkEmailService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.GetSecureLinkEmailTemplatesGeneric = function (loanId, loanApplicationId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkEmailService/GetSecureLinkEmailTemplates'; }
                return _this.httpUtil.get(methodPath, { loanId: loanId, loanApplicationId: loanApplicationId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.GetSecureLinkEmailTemplates = function (loanId, loanApplicationId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkEmailService/GetSecureLinkEmailTemplates'; }
                return _this.GetSecureLinkEmailTemplatesGeneric(loanId, loanApplicationId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        SecureLinkEmailService.className = 'SecureLinkEmailService';
        SecureLinkEmailService.$inject = ['httpUtil'];
        return SecureLinkEmailService;
    })();
    srv.SecureLinkEmailService = SecureLinkEmailService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.SecureLinkEmailService);
//# sourceMappingURL=SecureLinkEmailService.js.map