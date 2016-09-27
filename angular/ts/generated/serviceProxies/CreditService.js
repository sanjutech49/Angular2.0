// This file (CreditService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var CreditService = (function () {
        function CreditService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.ReRunCreditReportGeneric = function (loanId, userAccountId, reRunCredit, borrowerId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'CreditService/ReRunCreditReport'; }
                return _this.httpUtil.get(methodPath, { loanId: loanId, userAccountId: userAccountId, reRunCredit: reRunCredit, borrowerId: borrowerId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.ReRunCreditReport = function (loanId, userAccountId, reRunCredit, borrowerId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'CreditService/ReRunCreditReport'; }
                return _this.ReRunCreditReportGeneric(loanId, userAccountId, reRunCredit, borrowerId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        CreditService.className = 'CreditService';
        CreditService.$inject = ['httpUtil'];
        return CreditService;
    })();
    srv.CreditService = CreditService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.CreditService);
//# sourceMappingURL=CreditService.js.map