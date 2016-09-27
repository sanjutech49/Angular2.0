// This file (ActivityService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var ActivityService = (function () {
        function ActivityService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.UpdateCompleteLoanApplicationStepStatusesGeneric = function (loanId, stepName, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ActivityService/UpdateCompleteLoanApplicationStepStatuses'; }
                return _this.httpUtil.get(methodPath, { loanId: loanId, stepName: stepName }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.UpdateCompleteLoanApplicationStepStatuses = function (loanId, stepName, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ActivityService/UpdateCompleteLoanApplicationStepStatuses'; }
                return _this.UpdateCompleteLoanApplicationStepStatusesGeneric(loanId, stepName, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.UpdatePreApprovalStepStatusesGeneric = function (loanId, stepName, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ActivityService/UpdatePreApprovalStepStatuses'; }
                return _this.httpUtil.get(methodPath, { loanId: loanId, stepName: stepName }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.UpdatePreApprovalStepStatuses = function (loanId, stepName, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ActivityService/UpdatePreApprovalStepStatuses'; }
                return _this.UpdatePreApprovalStepStatusesGeneric(loanId, stepName, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        ActivityService.className = 'ActivityService';
        ActivityService.$inject = ['httpUtil'];
        return ActivityService;
    })();
    srv.ActivityService = ActivityService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.ActivityService);
//# sourceMappingURL=ActivityService.js.map