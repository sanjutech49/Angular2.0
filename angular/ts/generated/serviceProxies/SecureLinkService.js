// This file (SecureLinkService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var SecureLinkService = (function () {
        function SecureLinkService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.ObtainLoanApplicationIdGeneric = function (secureLinkToken, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkService/ObtainLoanApplicationId'; }
                return _this.httpUtil.get(methodPath, { secureLinkToken: secureLinkToken }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.ObtainLoanApplicationId = function (secureLinkToken, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkService/ObtainLoanApplicationId'; }
                return _this.ObtainLoanApplicationIdGeneric(secureLinkToken, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.ValidatePinsGeneric = function (secureLinkAuthenticationViewModel, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkService/ValidatePins'; }
                return _this.httpUtil.post(methodPath, { secureLinkAuthenticationViewModel: secureLinkAuthenticationViewModel }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.ValidatePins = function (secureLinkAuthenticationViewModel, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkService/ValidatePins'; }
                return _this.ValidatePinsGeneric(secureLinkAuthenticationViewModel, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.GetSigningRoomGeneric = function (secureLinkAuthenticationViewModel, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkService/GetSigningRoom'; }
                return _this.httpUtil.post(methodPath, { secureLinkAuthenticationViewModel: secureLinkAuthenticationViewModel }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.GetSigningRoom = function (secureLinkAuthenticationViewModel, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkService/GetSigningRoom'; }
                return _this.GetSigningRoomGeneric(secureLinkAuthenticationViewModel, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.HandleSigningRoomSentGeneric = function (secureLinkAuthenticationViewModel, envelopeId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkService/HandleSigningRoomSent'; }
                return _this.httpUtil.post(methodPath, { secureLinkAuthenticationViewModel: secureLinkAuthenticationViewModel, envelopeId: envelopeId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.HandleSigningRoomSent = function (secureLinkAuthenticationViewModel, envelopeId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkService/HandleSigningRoomSent'; }
                return _this.HandleSigningRoomSentGeneric(secureLinkAuthenticationViewModel, envelopeId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.HandleSigningCompleteGeneric = function (secureLinkAuthenticationViewModel, envelopeId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkService/HandleSigningComplete'; }
                return _this.httpUtil.post(methodPath, { secureLinkAuthenticationViewModel: secureLinkAuthenticationViewModel, envelopeId: envelopeId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.HandleSigningComplete = function (secureLinkAuthenticationViewModel, envelopeId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'SecureLinkService/HandleSigningComplete'; }
                return _this.HandleSigningCompleteGeneric(secureLinkAuthenticationViewModel, envelopeId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        SecureLinkService.className = 'SecureLinkService';
        SecureLinkService.$inject = ['httpUtil'];
        return SecureLinkService;
    })();
    srv.SecureLinkService = SecureLinkService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.SecureLinkService);
//# sourceMappingURL=SecureLinkService.js.map