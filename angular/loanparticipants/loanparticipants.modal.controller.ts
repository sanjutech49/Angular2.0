/// <reference path="../../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />

module loan {

    class LoanParticipantsModal {
        static $inject = ['wrappedLoan', 'applicationData', '$modalInstance', 'manageAccountService', 'NavigationSvc', '$rootScope'];
        public primaryApplicationModel: Array<boolean> = [];
        public clonedParticipants = {};

        constructor(public wrappedLoan, public applicationData, private $modalInstance: angular.ui.bootstrap.IModalServiceInstance, public manageAccountService, public NavigationSvc, private $rootScope) {
            angular.forEach(this.wrappedLoan.ref.getLoanApplications(),(v, k) => {
                this.primaryApplicationModel[k] = v.isPrimary;
            });
            angular.copy(this.wrappedLoan.ref.loanParticipants, this.clonedParticipants);
        }

        log = (variable) => {
            console.log(variable);
        }

        close = (): void => {
            this.clonedParticipants = {};
            this.$modalInstance.dismiss('cancel');
        }

        save = (): void => {
            this.$rootScope.$broadcast('ModalDoneLoanParticipants');
            this.wrappedLoan.ref.loanParticipants = this.clonedParticipants;
            this.close();
            //this.NavigationSvc.SaveAndUpdateWrappedLoan(this.applicationData.currentUserId, this.wrappedLoan);
        }

        saveAndClose = (): void => {
            this.save();
            this.close();
        }

        accountStatus = (application) => {
            if (application.isSpouseOnTheLoan) {
                application.coBorrower.userAccount.isCoBorrower = true;
            }

            application.borrowerAccountStatus = this.manageAccountService.accountStatus(application.borrower.userAccount, application.coBorrower.userAccount, application.isSpouseOnTheLoan);

            if (application.isSpouseOnTheLoan) {
                application.coBorrowerAccountStatus = this.manageAccountService.accountStatus(application.coBorrower.userAccount, application.borrower.userAccount, application.isSpouseOnTheLoan);
            }
        }

        manageAccountsModal = (model, application, isCoBorrower, event)  => {
            if (model.username == null || model.username == undefined || model.username.trim() === '') {
                return;
            }

            //next conditions are for joint account
            if (isCoBorrower && application.getBorrower().userAccount.username && !(model.userAccountId > 0)) {
                model = angular.copy(this.wrappedLoan.ref.active.getBorrower().userAccount);
                model.userAccountId = 0;

            } else if (application.getBorrower().userAccount.username ==
                application.getCoBorrower().userAccount.originalUsername && !(model.userAccountId > 0)) {
                var username = model.username;
                model = new cls.UserAccountViewModel();
                model.username = username;
                model.originalUsername = username;
                model.isOnlineUser = false;
                model.userAccountId = 0;
            }
            var accountStatus = () => {
                this.accountStatus(application);
            }

            model.isCoBorrower = isCoBorrower;
            var manageUserAccount = new cls.ManageUserAccountsViewModel();
            manageUserAccount.userAccount = model;
            var confirmationPopup = this.manageAccountService.openManageAccount(this.wrappedLoan, manageUserAccount, event, accountStatus, this.applicationData);
            confirmationPopup.result.then(function () {

            });
        }
    }

    angular.module('loanCenter').controller('LoanParticipantsModal', LoanParticipantsModal);
} 