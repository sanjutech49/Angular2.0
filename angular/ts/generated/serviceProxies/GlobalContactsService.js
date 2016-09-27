// This file (GlobalContactsService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var GlobalContactsService = (function () {
        function GlobalContactsService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.AddCompanyContactGeneric = function (opEnvelope, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'GlobalContactsService/AddCompanyContact'; }
                return _this.httpUtil.post(methodPath, { opEnvelope: opEnvelope }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.AddCompanyContact = function (opEnvelope, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'GlobalContactsService/AddCompanyContact'; }
                return _this.AddCompanyContactGeneric(opEnvelope, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.GetEmptyCompanyGeneric = function (successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'GlobalContactsService/GetEmptyCompany'; }
                return _this.httpUtil.get(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.GetEmptyCompany = function (serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'GlobalContactsService/GetEmptyCompany'; }
                return _this.GetEmptyCompanyGeneric(successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.GetEmptyCompanyContactGeneric = function (successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'GlobalContactsService/GetEmptyCompanyContact'; }
                return _this.httpUtil.get(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.GetEmptyCompanyContact = function (serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'GlobalContactsService/GetEmptyCompanyContact'; }
                return _this.GetEmptyCompanyContactGeneric(successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.GetGlobalContactsByLegalEntityTypeGeneric = function (legalEntityTypeMask, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'GlobalContactsService/GetGlobalContactsByLegalEntityType'; }
                return _this.httpUtil.get(methodPath, { legalEntityTypeMask: legalEntityTypeMask }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.GetGlobalContactsByLegalEntityType = function (legalEntityTypeMask, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'GlobalContactsService/GetGlobalContactsByLegalEntityType'; }
                return _this.GetGlobalContactsByLegalEntityTypeGeneric(legalEntityTypeMask, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.GetGlobalContactsSubListGeneric = function (opEnvelope, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'GlobalContactsService/GetGlobalContactsSubList'; }
                return _this.httpUtil.post(methodPath, { opEnvelope: opEnvelope }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.GetGlobalContactsSubList = function (opEnvelope, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'GlobalContactsService/GetGlobalContactsSubList'; }
                return _this.GetGlobalContactsSubListGeneric(opEnvelope, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.SaveGeneric = function (globalContactsVm, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'GlobalContactsService/Save'; }
                return _this.httpUtil.post(methodPath, { globalContactsVm: globalContactsVm }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.Save = function (globalContactsVm, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'GlobalContactsService/Save'; }
                return _this.SaveGeneric(globalContactsVm, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        GlobalContactsService.className = 'GlobalContactsService';
        GlobalContactsService.$inject = ['httpUtil'];
        return GlobalContactsService;
    })();
    srv.GlobalContactsService = GlobalContactsService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.GlobalContactsService);
//# sourceMappingURL=GlobalContactsService.js.map