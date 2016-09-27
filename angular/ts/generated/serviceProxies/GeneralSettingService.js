// This file (GeneralSettingService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var GeneralSettingService = (function () {
        function GeneralSettingService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.EagerLoadGeneralSettingsDataGeneric = function (successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'GeneralSettingService/EagerLoadGeneralSettingsData'; }
                return _this.httpUtil.get(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.EagerLoadGeneralSettingsData = function (serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'GeneralSettingService/EagerLoadGeneralSettingsData'; }
                return _this.EagerLoadGeneralSettingsDataGeneric(successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        GeneralSettingService.className = 'GeneralSettingService';
        GeneralSettingService.$inject = ['httpUtil'];
        return GeneralSettingService;
    })();
    srv.GeneralSettingService = GeneralSettingService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.GeneralSettingService);
//# sourceMappingURL=GeneralSettingService.js.map