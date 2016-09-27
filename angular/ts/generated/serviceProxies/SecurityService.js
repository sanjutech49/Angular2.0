// This file (SecurityService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var SecurityService = (function () {
        function SecurityService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.AuthenticateUserGeneric = function (userName, password, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecurityService/AuthenticateUser'; }
                return _this.httpUtil.get(methodPath, { userName: userName, password: password }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.AuthenticateUser = function (userName, password, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecurityService/AuthenticateUser'; }
                return _this.AuthenticateUserGeneric(userName, password, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.GetLoanContextGeneric = function (token, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecurityService/GetLoanContext'; }
                return _this.httpUtil.get(methodPath, { token: token }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.GetLoanContext = function (token, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecurityService/GetLoanContext'; }
                return _this.GetLoanContextGeneric(token, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        SecurityService.className = 'SecurityService';
        SecurityService.$inject = ['httpUtil'];
        return SecurityService;
    })();
    srv.SecurityService = SecurityService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.SecurityService);
//# sourceMappingURL=SecurityService.js.map