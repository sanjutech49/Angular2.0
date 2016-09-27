// This file (ApplicationDataService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var ApplicationDataService = (function () {
        function ApplicationDataService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.LoadLosFoldersGeneric = function (successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadLosFolders'; }
                return _this.httpUtil.get(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.LoadLosFolders = function (serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadLosFolders'; }
                return _this.LoadLosFoldersGeneric(successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.LoadPreApprovalLetterTemplatesGeneric = function (successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadPreApprovalLetterTemplates'; }
                return _this.httpUtil.get(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.LoadPreApprovalLetterTemplates = function (serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadPreApprovalLetterTemplates'; }
                return _this.LoadPreApprovalLetterTemplatesGeneric(successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.LoadConfigurationGeneric = function (successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadConfiguration'; }
                return _this.httpUtil.get(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.LoadConfiguration = function (serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadConfiguration'; }
                return _this.LoadConfigurationGeneric(successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.LoadImpoundScheduleGeneric = function (successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadImpoundSchedule'; }
                return _this.httpUtil.get(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.LoadImpoundSchedule = function (serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadImpoundSchedule'; }
                return _this.LoadImpoundScheduleGeneric(successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.LoadLicenseGeneric = function (successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadLicense'; }
                return _this.httpUtil.get(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.LoadLicense = function (serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadLicense'; }
                return _this.LoadLicenseGeneric(successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.LoadDocumentCategoriesGeneric = function (successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadDocumentCategories'; }
                return _this.httpUtil.get(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.LoadDocumentCategories = function (serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadDocumentCategories'; }
                return _this.LoadDocumentCategoriesGeneric(successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.LoadDocumentClassesGeneric = function (successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadDocumentClasses'; }
                return _this.httpUtil.get(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.LoadDocumentClasses = function (serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadDocumentClasses'; }
                return _this.LoadDocumentClassesGeneric(successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.LoadDocumentMappingsGeneric = function (successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadDocumentMappings'; }
                return _this.httpUtil.get(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.LoadDocumentMappings = function (serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadDocumentMappings'; }
                return _this.LoadDocumentMappingsGeneric(successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.LoadIntegrationsSettingGeneric = function (successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadIntegrationsSetting'; }
                return _this.httpUtil.get(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.LoadIntegrationsSetting = function (serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadIntegrationsSetting'; }
                return _this.LoadIntegrationsSettingGeneric(successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.LoadNtbBenefitConfigurationsGeneric = function (successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadNtbBenefitConfigurations'; }
                return _this.httpUtil.get(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.LoadNtbBenefitConfigurations = function (serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'ApplicationDataService/LoadNtbBenefitConfigurations'; }
                return _this.LoadNtbBenefitConfigurationsGeneric(successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        ApplicationDataService.className = 'ApplicationDataService';
        ApplicationDataService.$inject = ['httpUtil'];
        return ApplicationDataService;
    })();
    srv.ApplicationDataService = ApplicationDataService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.ApplicationDataService);
//# sourceMappingURL=ApplicationDataService.js.map