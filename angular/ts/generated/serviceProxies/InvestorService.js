// This file (InvestorService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var InvestorService = (function () {
        function InvestorService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.GetProductRuleGeneric = function (ruCode, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'InvestorService/GetProductRule'; }
                return _this.httpUtil.get(methodPath, { ruCode: ruCode }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.GetProductRule = function (ruCode, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'InvestorService/GetProductRule'; }
                return _this.GetProductRuleGeneric(ruCode, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        InvestorService.className = 'InvestorService';
        InvestorService.$inject = ['httpUtil'];
        return InvestorService;
    })();
    srv.InvestorService = InvestorService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.InvestorService);
//# sourceMappingURL=InvestorService.js.map