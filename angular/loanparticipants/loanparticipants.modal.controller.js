/// <reference path="../../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
var loan;
(function (loan) {
    var LoanParticipantsModal = (function () {
        function LoanParticipantsModal(wrappedLoan, applicationData, $modalInstance, manageAccountService, NavigationSvc, $rootScope) {
            var _this = this;
            this.wrappedLoan = wrappedLoan;
            this.applicationData = applicationData;
            this.$modalInstance = $modalInstance;
            this.manageAccountService = manageAccountService;
            this.NavigationSvc = NavigationSvc;
            this.$rootScope = $rootScope;
            this.primaryApplicationModel = [];
            this.clonedParticipants = {};
            this.log = function (variable) {
                console.log(variable);
            };
            this.close = function () {
                _this.clonedParticipants = {};
                _this.$modalInstance.dismiss('cancel');
            };
            this.save = function () {
                _this.$rootScope.$broadcast('ModalDoneLoanParticipants');
                _this.wrappedLoan.ref.loanParticipants = _this.clonedParticipants;
                _this.close();
                //this.NavigationSvc.SaveAndUpdateWrappedLoan(this.applicationData.currentUserId, this.wrappedLoan);
            };
            this.saveAndClose = function () {
                _this.save();
                _this.close();
            };
            this.accountStatus = function (application) {
                if (application.isSpouseOnTheLoan) {
                    application.coBorrower.userAccount.isCoBorrower = true;
                }
                application.borrowerAccountStatus = _this.manageAccountService.accountStatus(application.borrower.userAccount, application.coBorrower.userAccount, application.isSpouseOnTheLoan);
                if (application.isSpouseOnTheLoan) {
                    application.coBorrowerAccountStatus = _this.manageAccountService.accountStatus(application.coBorrower.userAccount, application.borrower.userAccount, application.isSpouseOnTheLoan);
                }
            };
            this.manageAccountsModal = function (model, application, isCoBorrower, event) {
                if (model.username == null || model.username == undefined || model.username.trim() === '') {
                    return;
                }
                //next conditions are for joint account
                if (isCoBorrower && application.getBorrower().userAccount.username && !(model.userAccountId > 0)) {
                    model = angular.copy(_this.wrappedLoan.ref.active.getBorrower().userAccount);
                    model.userAccountId = 0;
                }
                else if (application.getBorrower().userAccount.username == application.getCoBorrower().userAccount.originalUsername && !(model.userAccountId > 0)) {
                    var username = model.username;
                    model = new cls.UserAccountViewModel();
                    model.username = username;
                    model.originalUsername = username;
                    model.isOnlineUser = false;
                    model.userAccountId = 0;
                }
                var accountStatus = function () {
                    _this.accountStatus(application);
                };
                model.isCoBorrower = isCoBorrower;
                var manageUserAccount = new cls.ManageUserAccountsViewModel();
                manageUserAccount.userAccount = model;
                var confirmationPopup = _this.manageAccountService.openManageAccount(_this.wrappedLoan, manageUserAccount, event, accountStatus, _this.applicationData);
                confirmationPopup.result.then(function () {
                });
            };
            angular.forEach(this.wrappedLoan.ref.getLoanApplications(), function (v, k) {
                _this.primaryApplicationModel[k] = v.isPrimary;
            });
            angular.copy(this.wrappedLoan.ref.loanParticipants, this.clonedParticipants);
        }
        LoanParticipantsModal.$inject = ['wrappedLoan', 'applicationData', '$modalInstance', 'manageAccountService', 'NavigationSvc', '$rootScope'];
        return LoanParticipantsModal;
    })();
    angular.module('loanCenter').controller('LoanParticipantsModal', LoanParticipantsModal);
})(loan || (loan = {}));
//# sourceMappingURL=loanparticipants.modal.controller.js.map