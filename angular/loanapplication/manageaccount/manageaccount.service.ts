/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../ts/global/global.ts" /> 
/// <reference path="../../loancenter/loancenter.app.ts" />



module loanCenter {
    'use strict';

    export class manageAccountService {
        static className = 'ManageAccountService';
        static $inject = ['apiRoot', 'modalPopoverFactory', '$resource', '$q', 'enums'];

        apiPath: string;
        activeUserAccounts: srv.IUserAccountViewModel[] = null;
        activeUserName: string = null;
        currentUserAccountId: number;
        userAccounts: any;
        usernameBeforeOpenModal: string;

        public model: cls.ManageUserAccountsViewModel;
        borrowerManageUserAccount: cls.ManageUserAccountsViewModel;
        coBorrowerManageUserAccount: cls.ManageUserAccountsViewModel; 

        // todo: this implementation is ackward, inject the loan or move the logic somewhere else
        private wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>;
        public applicationData: any;


        constructor(private ApiRoot: string,
            private modalPopoverFactory: any,
            private $resource: ng.resource.IResourceService,
            private $q: ng.IQService,
            public enums
            ) {

            var vm = this;
            vm.modalPopoverFactory = modalPopoverFactory;
            vm.apiPath = ApiRoot + 'user/';
            vm.enums = enums;
            vm.userAccounts = vm.$resource(vm.apiPath + 'UserAccounts?username=:username', {
                username: '@username'
            });
        }
        //open popup
        openManageAccount = (wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, openModel: cls.ManageUserAccountsViewModel, event: ng.IAngularEvent, callback, applicationData) => {
            var self = this;
            var templateUrl = 'angular/loanapplication/manageaccount/manageaccount.html';

            this.wrappedLoan = wrappedLoan;
            this.applicationData = applicationData;
            this.currentUserAccountId = applicationData.currentUserId;
            this.usernameBeforeOpenModal = openModel.userAccount.username;
            var borrower = wrappedLoan.ref.active.getBorrower();

            this.model = this.coBorrowerManageUserAccount && openModel.userAccount.isCoBorrower ? angular.copy(this.coBorrowerManageUserAccount) :
                this.borrowerManageUserAccount && !openModel.userAccount.isCoBorrower ? angular.copy(this.borrowerManageUserAccount) : angular.copy(openModel);
            this.model.automaticallyOpen = openModel.automaticallyOpen || this.model.automaticallyOpen;
            this.model.originalUserAccountId = openModel.userAccount.userAccountId;
            if (borrower && borrower.userAccount) {
                this.model.borrowerUserAccountId = borrower.userAccount.userAccountId;
                this.model.borrowerUsername = borrower.userAccount.username;
            }
            self.prepareModel(this.model);
            var ctrl: any = {};
            var selfCtrl = this.accountController(this.model, ctrl, this.wrappedLoan, callback);
           
            //automaticly open popup for non existing user as online user
            if (this.model.automaticallyOpen && !this.model.isVerifyAccountInformationVisible && !this.model.userAccount.isCoBorrower) {
                this.model.userAccount.isOnlineUser = true;
            }
            if ((this.borrowerManageUserAccount && !this.model.userAccount.isCoBorrower && !this.borrowerManageUserAccount.userAccount.isOnlineUser && this.borrowerManageUserAccount.userAccount.isActivated) ||
                (this.coBorrowerManageUserAccount && this.model.userAccount.isCoBorrower && !this.coBorrowerManageUserAccount.userAccount.isOnlineUser && this.coBorrowerManageUserAccount.userAccount.isActivated)) {
                this.model.userAccount.isOnlineUser = false;
                this.model.automaticallyOpen = false;
            }
            var confirmationPopup = this.modalPopoverFactory.openModalPopover(templateUrl, selfCtrl, this.model, event);

            ctrl.confirmationPopup = confirmationPopup;
            confirmationPopup.result.then(function (data) {

            }, function () {
                    self.cancelChanges(self.model);
                });
            return confirmationPopup;
        }

        prepareModel = (model: cls.ManageUserAccountsViewModel) => {
            var vm = this;
            model.accountOptions = vm.applicationData.lookup.accountOptions;
            model.securityQuestions = vm.wrappedLoan.ref.lookup.securityQuestions;
            model.userAccount.currentUserAccountId = this.currentUserAccountId;
            model.userAccount.loanId = vm.wrappedLoan.ref.loanId;
            model.userAccount.resetPassword = false;
            model.userAccount.originalUsername = this.model.userAccount.username;
            model.userAccount.originalSecurityQuestionId = this.model.userAccount.securityQuestionId;
            model.userAccount.originalSecurityAnswer = this.model.userAccount.securityAnswer;
            if (model.userAccount.userAccountId == undefined) {
                model.userAccount.userAccountId = 0;
            }
            if (model.userAccount.isActivated && (this.model.originalUserAccountId != 0 || this.model.originalUserAccountId != this.model.userAccount.userAccountId)) {
                model.userAccount.sendActivationEmail = true;
            }
            else {
                model.userAccount.sendActivationEmail = false;
            }
        }

        accountController = (model: cls.ManageUserAccountsViewModel, ctrl: any, wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, callback) => {
            model.isJointAccount = wrappedLoan.ref.active.getBorrower().userAccount.username == wrappedLoan.ref.active.getCoBorrower().userAccount.username &&
            wrappedLoan.ref.active.isSpouseOnTheLoan;

            model.isSeparateAccount = false;
            ctrl.IsResendActive = model.userAccount.isActivated ? true : false;
            ctrl.isBorrowerOnline = this.wrappedLoan.ref.active.getBorrower().userAccount.isOnlineUser;
            ctrl.isDisabledActionBtn = this.isDisabledActionBtn;
            ctrl.onEmailBlur = this.onEmailBlur;
            ctrl.onConfirmEmailBlur = this.onConfirmEmailBlur;
            ctrl.preventPaste = this.preventPaste;
            ctrl.saveUserAccount = this.saveUserAccount;
            ctrl.resetPasswordChanged = this.resetPasswordChanged;
            ctrl.sendActivationEmailChanged = this.sendActivationEmailChanged;
            ctrl.onAccountOptionChange = this.onAccountOptionChange;
            ctrl.callback = callback;
            ctrl.cancelChanges = this.cancelChanges;
            model.sendVerification = false;
            if (model.userAccount.username == this.wrappedLoan.ref.active.getBorrower().userAccount.username) {
                model.coBorrowerAccountOptionId = this.enums.accountOptions.jointWithBorrower;
                model.userAccount.isOnlineUser = ctrl.isBorrowerOnline;
            }
            else {
                model.coBorrowerAccountOptionId = this.enums.accountOptions.separateFromBorrower;
                model.isSeparateAccount = true;
                model.userAccount.isOnlineUser = ctrl.isBorrowerOnline;
            }

            ctrl.cancelButton = model.userAccount.isCoBorrower && model.coBorrowerAccountOptionId == this.enums.accountOptions.jointWithBorrower ? 'Close' : 'Cancel';

            //security question and answer should be visible if user was created as offline through the system and we change it to the online
            model.isSecurityVisible = common.string.isNullOrWhiteSpace(model.userAccount.securityAnswer) && !model.userAccount.isOnlineUser;

            return ctrl;
        }

        sendActivationEmailChanged = (model: srv.IUserAccountViewModel, value: boolean, event: ng.IAngularEvent) => {
            //if (model.userAccount.resetPassword) {
            //event.preventDefault();
            //return;
            //}
        }

        resetPasswordChanged = (model: srv.IUserAccountViewModel, value: boolean, event: ng.IAngularEvent) => {
            //if (model.userAccount.isResetPasswordDisabled) {
            //    event.preventDefault();
            //    return;
            //}
        }
        //method for coBorrower
        onAccountOptionChange = (model: cls.ManageUserAccountsViewModel, ctrl: any) => {
            model.isSeparateAccount = model.coBorrowerAccountOptionId == this.enums.accountOptions.separateFromBorrower;
            if (model.isSeparateAccount) {
                model.userAccount.username = "";
                model.userAccount.confirmEmail = "";
                model.userAccount.securityAnswer = "";
                model.userAccount.securityQuestionId = 0;
                model.userAccount.isActivated = false;
            }

            ctrl.cancelButton = model.userAccount.isCoBorrower && model.coBorrowerAccountOptionId == this.enums.accountOptions.jointWithBorrower ? 'Close' : 'Cancel';
        }



        isDisabledActionBtn = (model: cls.ManageUserAccountsViewModel, ctrl: any) => {
            var invalid = false;
            if (typeof model.userAccount.username === 'undefined' || model.userAccount.username.trim() === '') {
                invalid = true;
            }

            if (typeof model.userAccount.confirmEmail === 'undefined' || model.userAccount.confirmEmail.trim() === '') {
                invalid = true;
            }

            if (!invalid && model.userAccount.username.trim().toLowerCase() !== model.userAccount.confirmEmail.trim().toLowerCase()) {
                invalid = true;
            }

            if ((typeof model.userAccount.securityAnswer === 'undefined' || model.userAccount.securityAnswer == null || model.userAccount.securityAnswer.trim() === '') && model.userAccount.isOnlineUser ) {
                invalid = true;
            }
            if (model.coBorrowerAccountOptionId == this.enums.accountOptions.separateFromBorrower && model.userAccount.isCoBorrower && model.userAccount.username == this.wrappedLoan.ref.active.getBorrower().userAccount.username) {
                invalid = true;
            }
            if (model.coBorrowerAccountOptionId == this.enums.accountOptions.jointWithBorrower && model.userAccount.isCoBorrower && model.userAccount.username != this.wrappedLoan.ref.active.getBorrower().userAccount.username) {
                invalid = true;
            }
            if (model.isVerifyAccountInformationVisible && (!model.VerifyBorrowerName && model.isVerifyBorrowerNameVisible || !model.VerifyCoBorrowerName && model.isVerifyCoBorrowerNameVisible || !model.VerifySubjectPropertyAddress && model.isVerifySubjectPropertyAddressVisible || !model.VerifySecurityQuestion && model.isVerifySecurityQuestionVisible)) {
                invalid = true;
            }
            return invalid;
        }

        sendVerificationMail = (model: cls.ManageUserAccountsViewModel, ctrl: any) => {
            if (model.userAccount.username != null && model.userAccount.username.trim().toLowerCase() != model.userAccount.originalUsername.trim().toLowerCase()
                && model.userAccount.confirmEmail != null && model.userAccount.username.trim().toLowerCase() === model.userAccount.confirmEmail.trim().toLowerCase()) {
                model.sendVerification = true;
            }
            else {
                model.sendVerification = false;
            }
            model.userAccount.sendActivationEmail = !model.userAccount.isActivated;
            model.userAccount.sendVerificationEmail = model.userAccount.isActivated;
        }

        onConfirmEmailBlur = (model: cls.ManageUserAccountsViewModel, ctrl: any) => {
            model.userAccount.invalidConfirm = model.userAccount.confirmEmail == null || model.userAccount.confirmEmail.trim() === '';
            if (!model.userAccount.invalidConfirm) {
                model.userAccount.invalidConfirm = model.userAccount.username.trim().toLowerCase() !== model.userAccount.confirmEmail.trim().toLowerCase();
            }

            this.sendVerificationMail(model, ctrl);
        }

        onEmailBlur = (manageModel: cls.ManageUserAccountsViewModel, ctrl: any) => {
            var vm = this;

            var username = manageModel.userAccount.username;
            vm.model = manageModel;
            if (manageModel.userAccount.username != vm.wrappedLoan.ref.active.getBorrower().userAccount.username && !manageModel.userAccount.isCoBorrower || manageModel.userAccount.isCoBorrower && manageModel.userAccount.username != vm.wrappedLoan.ref.active.getCoBorrower().userAccount.username) {

                vm.existingUser(vm.wrappedLoan, manageModel.userAccount.username, manageModel.userAccount.isCoBorrower, vm.updateIn, ctrl.callback);

                vm.model.isSeparateAccount = manageModel.userAccount.isCoBorrower;

                if (vm.model.userAccount.userAccountId != 0) {
                    ctrl.IsResendActive = true;
                    vm.model.userAccount.sendActivationEmail = true;
                }
            }
            else {
                vm.model.userAccount.usernameTaken = false;
                vm.model.isSeparateAccount = false;
            }
            this.sendVerificationMail(vm.model, ctrl);
        }

        existingUser = (wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, username: string, isCoBorrower:boolean, callBackFrom: any, callback) => {
            var vm = this;

            vm.wrappedLoan = wrappedLoan;
            vm.coBorrowerManageUserAccount = null;
            vm.borrowerManageUserAccount = null;

            if (callBackFrom == null) {
                callBackFrom = vm.updateFromPage;
                vm.model = new cls.ManageUserAccountsViewModel();
                vm.model.userAccount = new cls.UserAccountViewModel();
            }

            vm.getUserAccounts(username, false).then(function (data: any) {

                if (callBackFrom) {
                    callBackFrom(data, vm.wrappedLoan, isCoBorrower, callback);

                }
                vm.wrappedLoan = wrappedLoan;
            });

        }

        updateFromPage = (manageUserAccounts: any, wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, isCoBorrower: boolean, callback, connect: boolean = false) => {
            var vm = this;

            vm.setUserAcounts(manageUserAccounts, wrappedLoan, isCoBorrower);
            vm.connectUserAccount(vm.wrappedLoan, vm.borrowerManageUserAccount && (!vm.borrowerManageUserAccount.userAccount.isActivated || connect), vm.coBorrowerManageUserAccount && (!vm.coBorrowerManageUserAccount.userAccount.isActivated || connect), isCoBorrower);

            if (callback) {
                callback();
            }
        }

        updateIn = (manageUserAccounts: any, wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, isCoBorrower: boolean, callback) => {
            var vm = this;
            vm.setUserAcounts(manageUserAccounts, wrappedLoan,isCoBorrower);
            var temp = isCoBorrower && vm.coBorrowerManageUserAccount ? angular.copy(vm.coBorrowerManageUserAccount) : vm.borrowerManageUserAccount ?
                angular.copy(vm.borrowerManageUserAccount) : vm.cretaNewManageUserAccountModel(isCoBorrower);
            temp.userAccount.username = vm.model.userAccount.username;
            temp.originalUserAccountId = vm.model.userAccount.userAccountId;
            temp.userAccount.isCoBorrower = vm.model.userAccount.isCoBorrower;
            vm.model.userAccount = angular.copy(temp.userAccount);
            vm.model.recentSubjectPropertyAddress = angular.copy(temp.recentSubjectPropertyAddress);
            vm.model.borrowerFirstName = temp.borrowerFirstName;
            vm.model.coBorrowerFirstName = temp.coBorrowerFirstName;
            vm.model.borrowerLastName = temp.borrowerLastName;
            vm.model.coBorrowerLastName = temp.coBorrowerLastName;
            vm.model.automaticallyOpen = true;
            vm.prepareModel(vm.model);
        }

        cretaNewManageUserAccountModel = (isCoBorrower: boolean) => {
            var result = new cls.ManageUserAccountsViewModel();
            result.userAccount = isCoBorrower ? angular.copy(this.wrappedLoan.ref.active.getCoBorrower().userAccount) : angular.copy(this.wrappedLoan.ref.active.getBorrower().userAccount);
            result.recentSubjectPropertyAddress = new cls.PropertyViewModel();
            result.userAccount.isOnlineUser = isCoBorrower ? this.wrappedLoan.ref.active.getBorrower().userAccount.isOnlineUser : false;
            return result;
        }

        getUserAccounts = (username: string, forceReload: boolean = null) => {
            var vm = this;
            var def = vm.$q.defer();

            if (vm.activeUserAccounts == null || vm.model && vm.model.userAccount &&  vm.model.userAccount.originalUsername  != username || forceReload) {
                vm.userAccounts
                    .get({ username: username }).$promise.then(function (data) {
                    vm.activeUserAccounts = data;
                    if (vm.model && vm.model.userAccount) {
                        vm.model.userAccount.username = username;
                    }

                    def.resolve(data.manageUserAccountsList);
                }, function (errorMsg) {
                        def.reject(errorMsg);
                    });
            }
            else {
                def.resolve(vm.activeUserAccounts);
            }

            return def.promise;

        }

        setUserAcounts = (manageUserAccounts: any, wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, isCoBorrower: boolean) => {
            var vm = this;
            if (manageUserAccounts.length == 0) {
                vm.coBorrowerManageUserAccount = vm.borrowerManageUserAccount = null;
            }
            if (manageUserAccounts.length > 0) {
                var coBorrowerUserAccount = wrappedLoan.ref.active.getCoBorrower().userAccount;
                if (manageUserAccounts[0].userAccount.isCoBorrower == true && coBorrowerUserAccount.userAccountId == 0
                    || manageUserAccounts[0].userAccount.userAccountId == coBorrowerUserAccount.userAccountId
                    || manageUserAccounts.length == 1 && isCoBorrower && vm.wrappedLoan.ref.active.getBorrower().userAccount.username != manageUserAccounts[0].userAccount.username
                    || manageUserAccounts.length == 2 && manageUserAccounts[0].userAccount.userAccountId > manageUserAccounts[1].userAccount.userAccountId) {
                    vm.coBorrowerManageUserAccount = new cls.ManageUserAccountsViewModel(manageUserAccounts[0]);
                    vm.coBorrowerManageUserAccount.recentSubjectPropertyAddress = new cls.PropertyViewModel(wrappedLoan.ref.getTransactionInfoRef(), manageUserAccounts[0].recentSubjectPropertyAddress);
                    vm.coBorrowerManageUserAccount.userAccount.isCoBorrower = true;
                }
                else {
                    vm.borrowerManageUserAccount = new cls.ManageUserAccountsViewModel(manageUserAccounts[0]);
                    vm.borrowerManageUserAccount.recentSubjectPropertyAddress = new cls.PropertyViewModel(wrappedLoan.ref.getTransactionInfoRef(), manageUserAccounts[0].recentSubjectPropertyAddress);
                }
            }
            if (manageUserAccounts.length > 1) {
                if (vm.borrowerManageUserAccount == null) {
                    vm.borrowerManageUserAccount = new cls.ManageUserAccountsViewModel(manageUserAccounts[1]);
                    vm.borrowerManageUserAccount.recentSubjectPropertyAddress = new cls.PropertyViewModel(wrappedLoan.ref.getTransactionInfoRef(), manageUserAccounts[1].recentSubjectPropertyAddress);
                }
                else {
                    vm.coBorrowerManageUserAccount = new cls.ManageUserAccountsViewModel(manageUserAccounts[1]);
                    vm.coBorrowerManageUserAccount.recentSubjectPropertyAddress = new cls.PropertyViewModel(wrappedLoan.ref.getTransactionInfoRef(), manageUserAccounts[1].recentSubjectPropertyAddress);
                }
            }
            if (vm.coBorrowerManageUserAccount && vm.model.coBorrowerAccountOptionId != this.enums.accountOptions.separateFromBorrower) {
                if (vm.borrowerManageUserAccount) {
                    vm.borrowerManageUserAccount.userAccount.jointAccountId = vm.coBorrowerManageUserAccount.userAccount.userAccountId;
                }
                vm.coBorrowerManageUserAccount.userAccount.jointAccountId = vm.borrowerManageUserAccount == null ? null : vm.borrowerManageUserAccount.userAccount.userAccountId;
                vm.coBorrowerManageUserAccount.userAccount.isCoBorrower = true;
            }
        }

        setBorrowerAccount = (userAccountModel: srv.IUserAccountViewModel, serverModel, isCoBorrower) => {
            if (userAccountModel.userAccountId == undefined || userAccountModel.userAccountId <= 0) {
                userAccountModel = new cls.UserAccountViewModel(serverModel);
            }
            else {
                userAccountModel.username = userAccountModel.originalUsername;
                userAccountModel.isEmailValid = true;
            }
            userAccountModel.isOnlineUser = serverModel.isOnlineUser;
            userAccountModel.isCoBorrower = isCoBorrower;
        }

        saveUserAccount = (model: cls.ManageUserAccountsViewModel, ctrl) => {
            var vm = this;
            model.userAccount.saveAccount = true;
            model.loanApplicationId = vm.wrappedLoan.ref.active.loanApplicationId;

            if (model.isVerifyAccountInformationVisible) {
                vm.connectUserAccount(vm.wrappedLoan, true, true, model.userAccount.isCoBorrower);
                ctrl.confirmationPopup.close();
            } else {
                if (model.userAccount.isCoBorrower) {
                    //setup joint info for CoBorrower 
                    if (model.userAccount.username == vm.wrappedLoan.ref.active.getBorrower().userAccount.username) {
                        model.userAccount.jointAccountId = vm.wrappedLoan.ref.active.getBorrower().userAccount.userAccountId;
                    }
                    else {
                        model.userAccount.jointAccountId = null;
                    }
                    model.userAccount.firstName = vm.wrappedLoan.ref.active.getCoBorrower().firstName;
                    model.userAccount.lastName = vm.wrappedLoan.ref.active.getCoBorrower().lastName;
                }
                else {
                    model.userAccount.firstName = vm.wrappedLoan.ref.active.getBorrower().firstName;
                    model.userAccount.lastName = vm.wrappedLoan.ref.active.getBorrower().lastName;
                }
                this.$resource(this.apiPath + 'SaveUserAccount/')
                    .save(model)
                    .$promise.then((data) => {
                    vm.updateFromPage(data.manageUserAccountsList, this.wrappedLoan, vm.model.userAccount.isCoBorrower, ctrl.callback, true);

                    ctrl.confirmationPopup.close();

                },(errorMsg) => {
                        model.userAccount.usernameTaken = true;
                        console.log(errorMsg);
                    });
            }

        }

        connectUserAccount = (wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, isUpdatedBorrower: boolean, isUpdatedCoBorrower: boolean, isCoBorrower: boolean) => {
            var self = this;
            if (self.borrowerManageUserAccount && self.borrowerManageUserAccount.userAccount && isUpdatedBorrower) {
                if (!isCoBorrower)
                    wrappedLoan.ref.active.getBorrower().userAccount = self.borrowerManageUserAccount.userAccount;
                else if(!self.coBorrowerManageUserAccount && self.wrappedLoan.ref.active.getBorrower().userAccount.username != self.wrappedLoan.ref.active.getCoBorrower().userAccount.username){
                    wrappedLoan.ref.active.getCoBorrower().userAccount = self.borrowerManageUserAccount.userAccount;
                }
                if (wrappedLoan.ref.active.isPrimary) {
                    wrappedLoan.ref.otherInterviewData.interviewId = self.borrowerManageUserAccount.userAccount.interviewId;
                }
                self.wrappedLoan.ref.active.docDelivery = self.wrappedLoan.ref.active.getBorrower().userAccount.isOnlineUser ? srv.docDeliveryTypeEnum.Electronic : srv.docDeliveryTypeEnum.Mail;
            }
            if (self.coBorrowerManageUserAccount && self.coBorrowerManageUserAccount.userAccount && isUpdatedCoBorrower) {
                wrappedLoan.ref.active.getCoBorrower().userAccount = self.coBorrowerManageUserAccount.userAccount;
            }

            if (self.borrowerManageUserAccount == null || self.borrowerManageUserAccount.userAccount == null) {
                wrappedLoan.ref.active.getBorrower().userAccount.jointAccountId = null;
            }
        }

        preventPaste = (e) => {
            e.preventDefault();
        }

        cancelChanges = (ctrl: any) => {
            if (this.model && this.model.userAccount && this.model.userAccount.isActivated && this.model.originalUserAccountId != this.model.userAccount.userAccountId && this.model.isVerifyAccountInformationVisible) {
                if (this.model.userAccount.isCoBorrower) {
                    this.wrappedLoan.ref.active.getCoBorrower().userAccount.username = '';
                    this.wrappedLoan.ref.active.getCoBorrower().userAccount.isOnlineUser = false;
                    this.wrappedLoan.ref.active.getCoBorrower().userAccount.isActivated = false;
                }
                else {
                    this.wrappedLoan.ref.active.getBorrower().userAccount.username = '';
                    this.wrappedLoan.ref.active.getBorrower().userAccount.isOnlineUser = false;
                    this.wrappedLoan.ref.active.getBorrower().userAccount.isActivated = false;
                }
            }
            if (this.model) {
                this.model = null;
            }
            if (this.borrowerManageUserAccount) {
                this.borrowerManageUserAccount = null;
            }
            if (this.coBorrowerManageUserAccount) {
                this.coBorrowerManageUserAccount = null;
            }
            if (ctrl && ctrl.confirmationPopup)
                ctrl.confirmationPopup.close();
        }
    }
    //
    // @todo: Register per standards
    // 
    angular.module('loanApplication').service('manageAccountService', manageAccountService);
}

//moduleRegistration.registerService(moduleNames.loanCenter, loanCenter.manageAccountService);