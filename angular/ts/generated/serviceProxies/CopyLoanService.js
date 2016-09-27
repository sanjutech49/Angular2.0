// This file (CopyLoanService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var CopyLoanService = (function () {
        function CopyLoanService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.CopyLoanGeneric = function (copyLoanViewModel, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'CopyLoanService/CopyLoan'; }
                return _this.httpUtil.post(methodPath, { copyLoanViewModel: copyLoanViewModel }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.CopyLoan = function (copyLoanViewModel, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'CopyLoanService/CopyLoan'; }
                return _this.CopyLoanGeneric(copyLoanViewModel, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        CopyLoanService.className = 'CopyLoanService';
        CopyLoanService.$inject = ['httpUtil'];
        return CopyLoanService;
    })();
    srv.CopyLoanService = CopyLoanService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.CopyLoanService);
//# sourceMappingURL=CopyLoanService.js.map