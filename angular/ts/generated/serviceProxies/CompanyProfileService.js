// This file (CompanyProfileService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var CompanyProfileService = (function () {
        function CompanyProfileService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.EagerLoadCompanyProfileGeneric = function (successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'CompanyProfileService/EagerLoadCompanyProfile'; }
                return _this.httpUtil.get(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.EagerLoadCompanyProfile = function (serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'CompanyProfileService/EagerLoadCompanyProfile'; }
                return _this.EagerLoadCompanyProfileGeneric(successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.LoadBranchesGeneric = function (stateName, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'CompanyProfileService/LoadBranches'; }
                return _this.httpUtil.get(methodPath, { stateName: stateName }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.LoadBranches = function (stateName, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'CompanyProfileService/LoadBranches'; }
                return _this.LoadBranchesGeneric(stateName, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        CompanyProfileService.className = 'CompanyProfileService';
        CompanyProfileService.$inject = ['httpUtil'];
        return CompanyProfileService;
    })();
    srv.CompanyProfileService = CompanyProfileService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.CompanyProfileService);
//# sourceMappingURL=CompanyProfileService.js.map