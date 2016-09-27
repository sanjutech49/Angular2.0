// This file (AusService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var AusService = (function () {
        function AusService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.EagerLoadGeneric = function (loanId, userAccountId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'AusService/EagerLoad'; }
                return _this.httpUtil.get(methodPath, { loanId: loanId, userAccountId: userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.EagerLoad = function (loanId, userAccountId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'AusService/EagerLoad'; }
                return _this.EagerLoadGeneric(loanId, userAccountId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        AusService.className = 'AusService';
        AusService.$inject = ['httpUtil'];
        return AusService;
    })();
    srv.AusService = AusService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.AusService);
//# sourceMappingURL=AusService.js.map