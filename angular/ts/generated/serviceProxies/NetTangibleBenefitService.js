// This file (NetTangibleBenefitService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var NetTangibleBenefitService = (function () {
        function NetTangibleBenefitService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.NtbRequiredGeneric = function (request, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'NetTangibleBenefitService/NtbRequired'; }
                return _this.httpUtil.post(methodPath, { request: request }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.NtbRequired = function (request, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'NetTangibleBenefitService/NtbRequired'; }
                return _this.NtbRequiredGeneric(request, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.NtbBenefitActivationsGeneric = function (request, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'NetTangibleBenefitService/NtbBenefitActivations'; }
                return _this.httpUtil.post(methodPath, { request: request }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.NtbBenefitActivations = function (request, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'NetTangibleBenefitService/NtbBenefitActivations'; }
                return _this.NtbBenefitActivationsGeneric(request, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        NetTangibleBenefitService.className = 'NetTangibleBenefitService';
        NetTangibleBenefitService.$inject = ['httpUtil'];
        return NetTangibleBenefitService;
    })();
    srv.NetTangibleBenefitService = NetTangibleBenefitService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.NetTangibleBenefitService);
//# sourceMappingURL=NetTangibleBenefitService.js.map