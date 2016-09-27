// This file (LoanLockHistoryService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var LoanLockHistoryService = (function () {
        function LoanLockHistoryService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.LoadGeneric = function (loanId, userAccountId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanLockHistoryService/Load'; }
                return _this.httpUtil.get(methodPath, { loanId: loanId, userAccountId: userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.Load = function (loanId, userAccountId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanLockHistoryService/Load'; }
                return _this.LoadGeneric(loanId, userAccountId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        LoanLockHistoryService.className = 'LoanLockHistoryService';
        LoanLockHistoryService.$inject = ['httpUtil'];
        return LoanLockHistoryService;
    })();
    srv.LoanLockHistoryService = LoanLockHistoryService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.LoanLockHistoryService);
//# sourceMappingURL=LoanLockHistoryService.js.map