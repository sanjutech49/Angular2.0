// This file (LoanImportService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var LoanImportService = (function () {
        function LoanImportService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.ImportFNMFileGeneric = function (companyProfileId, userID, fileContent, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanImportService/ImportFNMFile'; }
                return _this.httpUtil.get(methodPath, { companyProfileId: companyProfileId, userID: userID, fileContent: fileContent }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.ImportFNMFile = function (companyProfileId, userID, fileContent, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanImportService/ImportFNMFile'; }
                return _this.ImportFNMFileGeneric(companyProfileId, userID, fileContent, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        LoanImportService.className = 'LoanImportService';
        LoanImportService.$inject = ['httpUtil'];
        return LoanImportService;
    })();
    srv.LoanImportService = LoanImportService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.LoanImportService);
//# sourceMappingURL=LoanImportService.js.map