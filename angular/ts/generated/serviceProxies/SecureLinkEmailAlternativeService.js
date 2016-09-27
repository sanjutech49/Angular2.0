// This file (SecureLinkEmailAlternativeService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var SecureLinkEmailAlternativeService = (function () {
        function SecureLinkEmailAlternativeService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.GetSecureLinkUrlTokenGeneric = function (secureLinkEmailVM, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkEmailAlternativeService/GetSecureLinkUrlToken'; }
                return _this.httpUtil.post(methodPath, { secureLinkEmailVM: secureLinkEmailVM }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.GetSecureLinkUrlToken = function (secureLinkEmailVM, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkEmailAlternativeService/GetSecureLinkUrlToken'; }
                return _this.GetSecureLinkUrlTokenGeneric(secureLinkEmailVM, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.SendSecureLinkEmailGeneric = function (secureLinkEmailVM, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkEmailAlternativeService/SendSecureLinkEmail'; }
                return _this.httpUtil.post(methodPath, { secureLinkEmailVM: secureLinkEmailVM }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.SendSecureLinkEmail = function (secureLinkEmailVM, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkEmailAlternativeService/SendSecureLinkEmail'; }
                return _this.SendSecureLinkEmailGeneric(secureLinkEmailVM, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.GetSecureLinkEmailTemplatesGeneric = function (secureLinkEmailVM, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkEmailAlternativeService/GetSecureLinkEmailTemplates'; }
                return _this.httpUtil.post(methodPath, { secureLinkEmailVM: secureLinkEmailVM }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.GetSecureLinkEmailTemplates = function (secureLinkEmailVM, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkEmailAlternativeService/GetSecureLinkEmailTemplates'; }
                return _this.GetSecureLinkEmailTemplatesGeneric(secureLinkEmailVM, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        SecureLinkEmailAlternativeService.className = 'SecureLinkEmailAlternativeService';
        SecureLinkEmailAlternativeService.$inject = ['httpUtil'];
        return SecureLinkEmailAlternativeService;
    })();
    srv.SecureLinkEmailAlternativeService = SecureLinkEmailAlternativeService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.SecureLinkEmailAlternativeService);
//# sourceMappingURL=SecureLinkEmailAlternativeService.js.map