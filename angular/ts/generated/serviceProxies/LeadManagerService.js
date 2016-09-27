// This file (LeadManagerService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var LeadManagerService = (function () {
        function LeadManagerService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.UpsertGeneric = function (model, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LeadManagerService/Upsert'; }
                return _this.httpUtil.post(methodPath, { model: model }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.Upsert = function (model, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LeadManagerService/Upsert'; }
                return _this.UpsertGeneric(model, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        LeadManagerService.className = 'LeadManagerService';
        LeadManagerService.$inject = ['httpUtil'];
        return LeadManagerService;
    })();
    srv.LeadManagerService = LeadManagerService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.LeadManagerService);
//# sourceMappingURL=LeadManagerService.js.map