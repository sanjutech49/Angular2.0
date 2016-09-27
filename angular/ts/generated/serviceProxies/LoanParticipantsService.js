// This file (LoanParticipantsService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var LoanParticipantsService = (function () {
        function LoanParticipantsService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.EagerLoadGeneric = function (loanId, userAccountId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanParticipantsService/EagerLoad'; }
                return _this.httpUtil.get(methodPath, { loanId: loanId, userAccountId: userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.EagerLoad = function (loanId, userAccountId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanParticipantsService/EagerLoad'; }
                return _this.EagerLoadGeneric(loanId, userAccountId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.GetEmptyCompanyContactGeneric = function (successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanParticipantsService/GetEmptyCompanyContact'; }
                return _this.httpUtil.get(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.GetEmptyCompanyContact = function (serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanParticipantsService/GetEmptyCompanyContact'; }
                return _this.GetEmptyCompanyContactGeneric(successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.SaveGeneric = function (loanVm, userAccountId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanParticipantsService/Save'; }
                return _this.httpUtil.post(methodPath, { loanVm: loanVm, userAccountId: userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.Save = function (loanVm, userAccountId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanParticipantsService/Save'; }
                return _this.SaveGeneric(loanVm, userAccountId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        LoanParticipantsService.className = 'LoanParticipantsService';
        LoanParticipantsService.$inject = ['httpUtil'];
        return LoanParticipantsService;
    })();
    srv.LoanParticipantsService = LoanParticipantsService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.LoanParticipantsService);
//# sourceMappingURL=LoanParticipantsService.js.map