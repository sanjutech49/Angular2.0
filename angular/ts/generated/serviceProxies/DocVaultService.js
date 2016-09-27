// This file (DocVaultService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var DocVaultService = (function () {
        function DocVaultService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.FilterByLoanNumberGeneric = function (loanNumber, counter, currentUserId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'DocVaultService/FilterByLoanNumber'; }
                return _this.httpUtil.get(methodPath, { loanNumber: loanNumber, counter: counter, currentUserId: currentUserId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.FilterByLoanNumber = function (loanNumber, counter, currentUserId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'DocVaultService/FilterByLoanNumber'; }
                return _this.FilterByLoanNumberGeneric(loanNumber, counter, currentUserId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.GetDocVaultDocumentsGeneric = function (loanNumber, currentUserId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'DocVaultService/GetDocVaultDocuments'; }
                return _this.httpUtil.get(methodPath, { loanNumber: loanNumber, currentUserId: currentUserId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.GetDocVaultDocuments = function (loanNumber, currentUserId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'DocVaultService/GetDocVaultDocuments'; }
                return _this.GetDocVaultDocumentsGeneric(loanNumber, currentUserId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        DocVaultService.className = 'DocVaultService';
        DocVaultService.$inject = ['httpUtil'];
        return DocVaultService;
    })();
    srv.DocVaultService = DocVaultService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.DocVaultService);
//# sourceMappingURL=DocVaultService.js.map