// This file (EncompassService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var EncompassService = (function () {
        function EncompassService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.UpdateLoanInEncompassGeneric = function (loanVM, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'EncompassService/UpdateLoanInEncompass'; }
                return _this.httpUtil.post(methodPath, { loanVM: loanVM }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.UpdateLoanInEncompass = function (loanVM, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'EncompassService/UpdateLoanInEncompass'; }
                return _this.UpdateLoanInEncompassGeneric(loanVM, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        EncompassService.className = 'EncompassService';
        EncompassService.$inject = ['httpUtil'];
        return EncompassService;
    })();
    srv.EncompassService = EncompassService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.EncompassService);
//# sourceMappingURL=EncompassService.js.map