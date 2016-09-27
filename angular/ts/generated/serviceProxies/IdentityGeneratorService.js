// This file (IdentityGeneratorService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var IdentityGeneratorService = (function () {
        function IdentityGeneratorService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.GetGuidsGeneric = function (count, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'IdentityGeneratorService/GetGuids'; }
                return _this.httpUtil.get(methodPath, { count: count }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.GetGuids = function (count, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'IdentityGeneratorService/GetGuids'; }
                return _this.GetGuidsGeneric(count, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        IdentityGeneratorService.className = 'IdentityGeneratorService';
        IdentityGeneratorService.$inject = ['httpUtil'];
        return IdentityGeneratorService;
    })();
    srv.IdentityGeneratorService = IdentityGeneratorService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.IdentityGeneratorService);
//# sourceMappingURL=IdentityGeneratorService.js.map