// This file (TransactionSummaryService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var TransactionSummaryService = (function () {
        function TransactionSummaryService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.EagerLoadGeneric = function (loanId, userAccountId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'TransactionSummaryService/EagerLoad'; }
                return _this.httpUtil.get(methodPath, { loanId: loanId, userAccountId: userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.EagerLoad = function (loanId, userAccountId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'TransactionSummaryService/EagerLoad'; }
                return _this.EagerLoadGeneric(loanId, userAccountId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.GetDropdownDictionaryGeneric = function (opEnvelope, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'TransactionSummaryService/GetDropdownDictionary'; }
                return _this.httpUtil.post(methodPath, { opEnvelope: opEnvelope }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.GetDropdownDictionary = function (opEnvelope, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'TransactionSummaryService/GetDropdownDictionary'; }
                return _this.GetDropdownDictionaryGeneric(opEnvelope, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.InitEmptyCreditOrDebitGeneric = function (opEnvelope, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'TransactionSummaryService/InitEmptyCreditOrDebit'; }
                return _this.httpUtil.post(methodPath, { opEnvelope: opEnvelope }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.InitEmptyCreditOrDebit = function (opEnvelope, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'TransactionSummaryService/InitEmptyCreditOrDebit'; }
                return _this.InitEmptyCreditOrDebitGeneric(opEnvelope, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.RemoveCreditOrDebitGeneric = function (opEnvelope, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'TransactionSummaryService/RemoveCreditOrDebit'; }
                return _this.httpUtil.post(methodPath, { opEnvelope: opEnvelope }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.RemoveCreditOrDebit = function (opEnvelope, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'TransactionSummaryService/RemoveCreditOrDebit'; }
                return _this.RemoveCreditOrDebitGeneric(opEnvelope, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.SaveGeneric = function (loanVm, userAccountId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'TransactionSummaryService/Save'; }
                return _this.httpUtil.post(methodPath, { loanVm: loanVm, userAccountId: userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.Save = function (loanVm, userAccountId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'TransactionSummaryService/Save'; }
                return _this.SaveGeneric(loanVm, userAccountId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.UnlinkDoubleEntryGeneric = function (opEnvelope, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'TransactionSummaryService/UnlinkDoubleEntry'; }
                return _this.httpUtil.post(methodPath, { opEnvelope: opEnvelope }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.UnlinkDoubleEntry = function (opEnvelope, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'TransactionSummaryService/UnlinkDoubleEntry'; }
                return _this.UnlinkDoubleEntryGeneric(opEnvelope, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.UnRemoveCreditOrDebitGeneric = function (opEnvelope, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'TransactionSummaryService/UnRemoveCreditOrDebit'; }
                return _this.httpUtil.post(methodPath, { opEnvelope: opEnvelope }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.UnRemoveCreditOrDebit = function (opEnvelope, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'TransactionSummaryService/UnRemoveCreditOrDebit'; }
                return _this.UnRemoveCreditOrDebitGeneric(opEnvelope, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.UpdateCreditOrDebitGeneric = function (opEnvelope, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'TransactionSummaryService/UpdateCreditOrDebit'; }
                return _this.httpUtil.post(methodPath, { opEnvelope: opEnvelope }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.UpdateCreditOrDebit = function (opEnvelope, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'TransactionSummaryService/UpdateCreditOrDebit'; }
                return _this.UpdateCreditOrDebitGeneric(opEnvelope, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        TransactionSummaryService.className = 'TransactionSummaryService';
        TransactionSummaryService.$inject = ['httpUtil'];
        return TransactionSummaryService;
    })();
    srv.TransactionSummaryService = TransactionSummaryService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.TransactionSummaryService);
//# sourceMappingURL=TransactionSummaryService.js.map