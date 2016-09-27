// This file (UserService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var UserService = (function () {
        function UserService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.EagerLoadGeneric = function (userId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'UserService/EagerLoad'; }
                return _this.httpUtil.get(methodPath, { userId: userId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.EagerLoad = function (userId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'UserService/EagerLoad'; }
                return _this.EagerLoadGeneric(userId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.LoadGeneric = function (username, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'UserService/Load'; }
                return _this.httpUtil.get(methodPath, { username: username }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.Load = function (username, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'UserService/Load'; }
                return _this.LoadGeneric(username, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.LoadUserAccountByIdGeneric = function (userId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'UserService/LoadUserAccountById'; }
                return _this.httpUtil.get(methodPath, { userId: userId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.LoadUserAccountById = function (userId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'UserService/LoadUserAccountById'; }
                return _this.LoadUserAccountByIdGeneric(userId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.CreateOrUpdateUserAccountsGeneric = function (loanId, borrower, coBorrower, isSpouseOnTheLoan, loUserId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'UserService/CreateOrUpdateUserAccounts'; }
                return _this.httpUtil.post(methodPath, { loanId: loanId, borrower: borrower, coBorrower: coBorrower, isSpouseOnTheLoan: isSpouseOnTheLoan, loUserId: loUserId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.CreateOrUpdateUserAccounts = function (loanId, borrower, coBorrower, isSpouseOnTheLoan, loUserId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'UserService/CreateOrUpdateUserAccounts'; }
                return _this.CreateOrUpdateUserAccountsGeneric(loanId, borrower, coBorrower, isSpouseOnTheLoan, loUserId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.LoadLoanOfficersGeneric = function (branchOfficerName, branchId, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'UserService/LoadLoanOfficers'; }
                return _this.httpUtil.get(methodPath, { branchOfficerName: branchOfficerName, branchId: branchId }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.LoadLoanOfficers = function (branchOfficerName, branchId, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'UserService/LoadLoanOfficers'; }
                return _this.LoadLoanOfficersGeneric(branchOfficerName, branchId, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        UserService.className = 'UserService';
        UserService.$inject = ['httpUtil'];
        return UserService;
    })();
    srv.UserService = UserService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.UserService);
//# sourceMappingURL=UserService.js.map