// This file (LookupService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var LookupService = (function () {
        function LookupService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.EagerLoadGeneric = function (lookupId, keyword, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LookupService/EagerLoad'; }
                return _this.httpUtil.get(methodPath, { lookupId: lookupId, keyword: keyword }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.EagerLoad = function (lookupId, keyword, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LookupService/EagerLoad'; }
                return _this.EagerLoadGeneric(lookupId, keyword, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        LookupService.className = 'LookupService';
        LookupService.$inject = ['httpUtil'];
        return LookupService;
    })();
    srv.LookupService = LookupService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.LookupService);
//# sourceMappingURL=LookupService.js.map