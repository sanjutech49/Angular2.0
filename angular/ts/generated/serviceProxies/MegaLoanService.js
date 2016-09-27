// This file (MegaLoanService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var MegaLoanService = (function () {
        function MegaLoanService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.EagerLoadGeneric = function (loanId, userAccountId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'MegaLoanService/EagerLoad'; }
                return _this.httpUtil.get(methodPath, { loanId: loanId, userAccountId: userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.EagerLoad = function (loanId, userAccountId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'MegaLoanService/EagerLoad'; }
                return _this.EagerLoadGeneric(loanId, userAccountId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.SaveGeneric = function (loan, userAccountId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'MegaLoanService/Save'; }
                return _this.httpUtil.post(methodPath, { loan: loan, userAccountId: userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.Save = function (loan, userAccountId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'MegaLoanService/Save'; }
                return _this.SaveGeneric(loan, userAccountId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        MegaLoanService.className = 'MegaLoanService';
        MegaLoanService.$inject = ['httpUtil'];
        return MegaLoanService;
    })();
    srv.MegaLoanService = MegaLoanService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.MegaLoanService);
//# sourceMappingURL=MegaLoanService.js.map