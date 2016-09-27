/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../ts/global/global.ts" /> 
/// <reference path="../../loancenter/loancenter.app.ts" />
var loanCenter;
(function (loanCenter) {
    'use strict';
    var manageAccountService = (function () {
        function manageAccountService(ApiRoot, modalPopoverFactory, $resource, $q, enums) {
            var _this = this;
            this.ApiRoot = ApiRoot;
            this.modalPopoverFactory = modalPopoverFactory;
            this.$resource = $resource;
            this.$q = $q;
            this.enums = enums;
            this.activeUserAccounts = null;
            this.activeUserName = null;
            //open popup
            this.openManageAccount = function (wrappedLoan, openModel, event, callback, applicationData) {
                var self = _this;
                var templateUrl = 'angular/loanapplication/manageaccount/manageaccount.html';
                _this.wrappedLoan = wrappedLoan;
                _this.applicationData = applicationData;
                _this.currentUserAccountId = applicationData.currentUserId;
                _this.usernameBeforeOpenModal = openModel.userAccount.username;
                var borrower = wrappedLoan.ref.active.getBorrower();
                _this.model = _this.coBorrowerManageUserAccount && openModel.userAccount.isCoBorrower ? angular.copy(_this.coBorrowerManageUserAccount) : _this.borrowerManageUserAccount && !openModel.userAccount.isCoBorrower ? angular.copy(_this.borrowerManageUserAccount) : angular.copy(openModel);
                _this.model.automaticallyOpen = openModel.automaticallyOpen || _this.model.automaticallyOpen;
                _this.model.originalUserAccountId = openModel.userAccount.userAccountId;
                if (borrower && borrower.userAccount) {
                    _this.model.borrowerUserAccountId = borrower.userAccount.userAccountId;
                    _this.model.borrowerUsername = borrower.userAccount.username;
                }
                self.prepareModel(_this.model);
                var ctrl = {};
                var selfCtrl = _this.accountController(_this.model, ctrl, _this.wrappedLoan, callback);
                //automaticly open popup for non existing user as online user
                if (_this.model.automaticallyOpen && !_this.model.isVerifyAccountInformationVisible && !_this.model.userAccount.isCoBorrower) {
                    _this.model.userAccount.isOnlineUser = true;
                }
                if ((_this.borrowerManageUserAccount && !_this.model.userAccount.isCoBorrower && !_this.borrowerManageUserAccount.userAccount.isOnlineUser && _this.borrowerManageUserAccount.userAccount.isActivated) || (_this.coBorrowerManageUserAccount && _this.model.userAccount.isCoBorrower && !_this.coBorrowerManageUserAccount.userAccount.isOnlineUser && _this.coBorrowerManageUserAccount.userAccount.isActivated)) {
                    _this.model.userAccount.isOnlineUser = false;
                    _this.model.automaticallyOpen = false;
                }
                var confirmationPopup = _this.modalPopoverFactory.openModalPopover(templateUrl, selfCtrl, _this.model, event);
                ctrl.confirmationPopup = confirmationPopup;
                confirmationPopup.result.then(function (data) {
                }, function () {
                    self.cancelChanges(self.model);
                });
                return confirmationPopup;
            };
            this.prepareModel = function (model) {
                var vm = _this;
                model.accountOptions = vm.applicationData.lookup.accountOptions;
                model.securityQuestions = vm.wrappedLoan.ref.lookup.securityQuestions;
                model.userAccount.currentUserAccountId = _this.currentUserAccountId;
                model.userAccount.loanId = vm.wrappedLoan.ref.loanId;
                model.userAccount.resetPassword = false;
                model.userAccount.originalUsername = _this.model.userAccount.username;
                model.userAccount.originalSecurityQuestionId = _this.model.userAccount.securityQuestionId;
                model.userAccount.originalSecurityAnswer = _this.model.userAccount.securityAnswer;
                if (model.userAccount.userAccountId == undefined) {
                    model.userAccount.userAccountId = 0;
                }
                if (model.userAccount.isActivated && (_this.model.originalUserAccountId != 0 || _this.model.originalUserAccountId != _this.model.userAccount.userAccountId)) {
                    model.userAccount.sendActivationEmail = true;
                }
                else {
                    model.userAccount.sendActivationEmail = false;
                }
            };
            this.accountController = function (model, ctrl, wrappedLoan, callback) {
                model.isJointAccount = wrappedLoan.ref.active.getBorrower().userAccount.username == wrappedLoan.ref.active.getCoBorrower().userAccount.username && wrappedLoan.ref.active.isSpouseOnTheLoan;
                model.isSeparateAccount = false;
                ctrl.IsResendActive = model.userAccount.isActivated ? true : false;
                ctrl.isBorrowerOnline = _this.wrappedLoan.ref.active.getBorrower().userAccount.isOnlineUser;
                ctrl.isDisabledActionBtn = _this.isDisabledActionBtn;
                ctrl.onEmailBlur = _this.onEmailBlur;
                ctrl.onConfirmEmailBlur = _this.onConfirmEmailBlur;
                ctrl.preventPaste = _this.preventPaste;
                ctrl.saveUserAccount = _this.saveUserAccount;
                ctrl.resetPasswordChanged = _this.resetPasswordChanged;
                ctrl.sendActivationEmailChanged = _this.sendActivationEmailChanged;
                ctrl.onAccountOptionChange = _this.onAccountOptionChange;
                ctrl.callback = callback;
                ctrl.cancelChanges = _this.cancelChanges;
                model.sendVerification = false;
                if (model.userAccount.username == _this.wrappedLoan.ref.active.getBorrower().userAccount.username) {
                    model.coBorrowerAccountOptionId = _this.enums.accountOptions.jointWithBorrower;
                    model.userAccount.isOnlineUser = ctrl.isBorrowerOnline;
                }
                else {
                    model.coBorrowerAccountOptionId = _this.enums.accountOptions.separateFromBorrower;
                    model.isSeparateAccount = true;
                    model.userAccount.isOnlineUser = ctrl.isBorrowerOnline;
                }
                ctrl.cancelButton = model.userAccount.isCoBorrower && model.coBorrowerAccountOptionId == _this.enums.accountOptions.jointWithBorrower ? 'Close' : 'Cancel';
                //security question and answer should be visible if user was created as offline through the system and we change it to the online
                model.isSecurityVisible = common.string.isNullOrWhiteSpace(model.userAccount.securityAnswer) && !model.userAccount.isOnlineUser;
                return ctrl;
            };
            this.sendActivationEmailChanged = function (model, value, event) {
                //if (model.userAccount.resetPassword) {
                //event.preventDefault();
                //return;
                //}
            };
            this.resetPasswordChanged = function (model, value, event) {
                //if (model.userAccount.isResetPasswordDisabled) {
                //    event.preventDefault();
                //    return;
                //}
            };
            //method for coBorrower
            this.onAccountOptionChange = function (model, ctrl) {
                model.isSeparateAccount = model.coBorrowerAccountOptionId == _this.enums.accountOptions.separateFromBorrower;
                if (model.isSeparateAccount) {
                    model.userAccount.username = "";
                    model.userAccount.confirmEmail = "";
                    model.userAccount.securityAnswer = "";
                    model.userAccount.securityQuestionId = 0;
                    model.userAccount.isActivated = false;
                }
                ctrl.cancelButton = model.userAccount.isCoBorrower && model.coBorrowerAccountOptionId == _this.enums.accountOptions.jointWithBorrower ? 'Close' : 'Cancel';
            };
            this.isDisabledActionBtn = function (model, ctrl) {
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
                if ((typeof model.userAccount.securityAnswer === 'undefined' || model.userAccount.securityAnswer == null || model.userAccount.securityAnswer.trim() === '') && model.userAccount.isOnlineUser) {
                    invalid = true;
                }
                if (model.coBorrowerAccountOptionId == _this.enums.accountOptions.separateFromBorrower && model.userAccount.isCoBorrower && model.userAccount.username == _this.wrappedLoan.ref.active.getBorrower().userAccount.username) {
                    invalid = true;
                }
                if (model.coBorrowerAccountOptionId == _this.enums.accountOptions.jointWithBorrower && model.userAccount.isCoBorrower && model.userAccount.username != _this.wrappedLoan.ref.active.getBorrower().userAccount.username) {
                    invalid = true;
                }
                if (model.isVerifyAccountInformationVisible && (!model.VerifyBorrowerName && model.isVerifyBorrowerNameVisible || !model.VerifyCoBorrowerName && model.isVerifyCoBorrowerNameVisible || !model.VerifySubjectPropertyAddress && model.isVerifySubjectPropertyAddressVisible || !model.VerifySecurityQuestion && model.isVerifySecurityQuestionVisible)) {
                    invalid = true;
                }
                return invalid;
            };
            this.sendVerificationMail = function (model, ctrl) {
                if (model.userAccount.username != null && model.userAccount.username.trim().toLowerCase() != model.userAccount.originalUsername.trim().toLowerCase() && model.userAccount.confirmEmail != null && model.userAccount.username.trim().toLowerCase() === model.userAccount.confirmEmail.trim().toLowerCase()) {
                    model.sendVerification = true;
                }
                else {
                    model.sendVerification = false;
                }
                model.userAccount.sendActivationEmail = !model.userAccount.isActivated;
                model.userAccount.sendVerificationEmail = model.userAccount.isActivated;
            };
            this.onConfirmEmailBlur = function (model, ctrl) {
                model.userAccount.invalidConfirm = model.userAccount.confirmEmail == null || model.userAccount.confirmEmail.trim() === '';
                if (!model.userAccount.invalidConfirm) {
                    model.userAccount.invalidConfirm = model.userAccount.username.trim().toLowerCase() !== model.userAccount.confirmEmail.trim().toLowerCase();
                }
                _this.sendVerificationMail(model, ctrl);
            };
            this.onEmailBlur = function (manageModel, ctrl) {
                var vm = _this;
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
                _this.sendVerificationMail(vm.model, ctrl);
            };
            this.existingUser = function (wrappedLoan, username, isCoBorrower, callBackFrom, callback) {
                var vm = _this;
                vm.wrappedLoan = wrappedLoan;
                vm.coBorrowerManageUserAccount = null;
                vm.borrowerManageUserAccount = null;
                if (callBackFrom == null) {
                    callBackFrom = vm.updateFromPage;
                    vm.model = new cls.ManageUserAccountsViewModel();
                    vm.model.userAccount = new cls.UserAccountViewModel();
                }
                vm.getUserAccounts(username, false).then(function (data) {
                    if (callBackFrom) {
                        callBackFrom(data, vm.wrappedLoan, isCoBorrower, callback);
                    }
                    vm.wrappedLoan = wrappedLoan;
                });
            };
            this.updateFromPage = function (manageUserAccounts, wrappedLoan, isCoBorrower, callback, connect) {
                if (connect === void 0) { connect = false; }
                var vm = _this;
                vm.setUserAcounts(manageUserAccounts, wrappedLoan, isCoBorrower);
                vm.connectUserAccount(vm.wrappedLoan, vm.borrowerManageUserAccount && (!vm.borrowerManageUserAccount.userAccount.isActivated || connect), vm.coBorrowerManageUserAccount && (!vm.coBorrowerManageUserAccount.userAccount.isActivated || connect), isCoBorrower);
                if (callback) {
                    callback();
                }
            };
            this.updateIn = function (manageUserAccounts, wrappedLoan, isCoBorrower, callback) {
                var vm = _this;
                vm.setUserAcounts(manageUserAccounts, wrappedLoan, isCoBorrower);
                var temp = isCoBorrower && vm.coBorrowerManageUserAccount ? angular.copy(vm.coBorrowerManageUserAccount) : vm.borrowerManageUserAccount ? angular.copy(vm.borrowerManageUserAccount) : vm.cretaNewManageUserAccountModel(isCoBorrower);
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
            };
            this.cretaNewManageUserAccountModel = function (isCoBorrower) {
                var result = new cls.ManageUserAccountsViewModel();
                result.userAccount = isCoBorrower ? angular.copy(_this.wrappedLoan.ref.active.getCoBorrower().userAccount) : angular.copy(_this.wrappedLoan.ref.active.getBorrower().userAccount);
                result.recentSubjectPropertyAddress = new cls.PropertyViewModel();
                result.userAccount.isOnlineUser = isCoBorrower ? _this.wrappedLoan.ref.active.getBorrower().userAccount.isOnlineUser : false;
                return result;
            };
            this.getUserAccounts = function (username, forceReload) {
                if (forceReload === void 0) { forceReload = null; }
                var vm = _this;
                var def = vm.$q.defer();
                if (vm.activeUserAccounts == null || vm.model && vm.model.userAccount && vm.model.userAccount.originalUsername != username || forceReload) {
                    vm.userAccounts.get({ username: username }).$promise.then(function (data) {
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
            };
            this.setUserAcounts = function (manageUserAccounts, wrappedLoan, isCoBorrower) {
                var vm = _this;
                if (manageUserAccounts.length == 0) {
                    vm.coBorrowerManageUserAccount = vm.borrowerManageUserAccount = null;
                }
                if (manageUserAccounts.length > 0) {
                    var coBorrowerUserAccount = wrappedLoan.ref.active.getCoBorrower().userAccount;
                    if (manageUserAccounts[0].userAccount.isCoBorrower == true && coBorrowerUserAccount.userAccountId == 0 || manageUserAccounts[0].userAccount.userAccountId == coBorrowerUserAccount.userAccountId || manageUserAccounts.length == 1 && isCoBorrower && vm.wrappedLoan.ref.active.getBorrower().userAccount.username != manageUserAccounts[0].userAccount.username || manageUserAccounts.length == 2 && manageUserAccounts[0].userAccount.userAccountId > manageUserAccounts[1].userAccount.userAccountId) {
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
                if (vm.coBorrowerManageUserAccount && vm.model.coBorrowerAccountOptionId != _this.enums.accountOptions.separateFromBorrower) {
                    if (vm.borrowerManageUserAccount) {
                        vm.borrowerManageUserAccount.userAccount.jointAccountId = vm.coBorrowerManageUserAccount.userAccount.userAccountId;
                    }
                    vm.coBorrowerManageUserAccount.userAccount.jointAccountId = vm.borrowerManageUserAccount == null ? null : vm.borrowerManageUserAccount.userAccount.userAccountId;
                    vm.coBorrowerManageUserAccount.userAccount.isCoBorrower = true;
                }
            };
            this.setBorrowerAccount = function (userAccountModel, serverModel, isCoBorrower) {
                if (userAccountModel.userAccountId == undefined || userAccountModel.userAccountId <= 0) {
                    userAccountModel = new cls.UserAccountViewModel(serverModel);
                }
                else {
                    userAccountModel.username = userAccountModel.originalUsername;
                    userAccountModel.isEmailValid = true;
                }
                userAccountModel.isOnlineUser = serverModel.isOnlineUser;
                userAccountModel.isCoBorrower = isCoBorrower;
            };
            this.saveUserAccount = function (model, ctrl) {
                var vm = _this;
                model.userAccount.saveAccount = true;
                model.loanApplicationId = vm.wrappedLoan.ref.active.loanApplicationId;
                if (model.isVerifyAccountInformationVisible) {
                    vm.connectUserAccount(vm.wrappedLoan, true, true, model.userAccount.isCoBorrower);
                    ctrl.confirmationPopup.close();
                }
                else {
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
                    _this.$resource(_this.apiPath + 'SaveUserAccount/').save(model).$promise.then(function (data) {
                        vm.updateFromPage(data.manageUserAccountsList, _this.wrappedLoan, vm.model.userAccount.isCoBorrower, ctrl.callback, true);
                        ctrl.confirmationPopup.close();
                    }, function (errorMsg) {
                        model.userAccount.usernameTaken = true;
                        console.log(errorMsg);
                    });
                }
            };
            this.connectUserAccount = function (wrappedLoan, isUpdatedBorrower, isUpdatedCoBorrower, isCoBorrower) {
                var self = _this;
                if (self.borrowerManageUserAccount && self.borrowerManageUserAccount.userAccount && isUpdatedBorrower) {
                    if (!isCoBorrower)
                        wrappedLoan.ref.active.getBorrower().userAccount = self.borrowerManageUserAccount.userAccount;
                    else if (!self.coBorrowerManageUserAccount && self.wrappedLoan.ref.active.getBorrower().userAccount.username != self.wrappedLoan.ref.active.getCoBorrower().userAccount.username) {
                        wrappedLoan.ref.active.getCoBorrower().userAccount = self.borrowerManageUserAccount.userAccount;
                    }
                    if (wrappedLoan.ref.active.isPrimary) {
                        wrappedLoan.ref.otherInterviewData.interviewId = self.borrowerManageUserAccount.userAccount.interviewId;
                    }
                    self.wrappedLoan.ref.active.docDelivery = self.wrappedLoan.ref.active.getBorrower().userAccount.isOnlineUser ? 1 /* Electronic */ : 0 /* Mail */;
                }
                if (self.coBorrowerManageUserAccount && self.coBorrowerManageUserAccount.userAccount && isUpdatedCoBorrower) {
                    wrappedLoan.ref.active.getCoBorrower().userAccount = self.coBorrowerManageUserAccount.userAccount;
                }
                if (self.borrowerManageUserAccount == null || self.borrowerManageUserAccount.userAccount == null) {
                    wrappedLoan.ref.active.getBorrower().userAccount.jointAccountId = null;
                }
            };
            this.preventPaste = function (e) {
                e.preventDefault();
            };
            this.cancelChanges = function (ctrl) {
                if (_this.model && _this.model.userAccount && _this.model.userAccount.isActivated && _this.model.originalUserAccountId != _this.model.userAccount.userAccountId && _this.model.isVerifyAccountInformationVisible) {
                    if (_this.model.userAccount.isCoBorrower) {
                        _this.wrappedLoan.ref.active.getCoBorrower().userAccount.username = '';
                        _this.wrappedLoan.ref.active.getCoBorrower().userAccount.isOnlineUser = false;
                        _this.wrappedLoan.ref.active.getCoBorrower().userAccount.isActivated = false;
                    }
                    else {
                        _this.wrappedLoan.ref.active.getBorrower().userAccount.username = '';
                        _this.wrappedLoan.ref.active.getBorrower().userAccount.isOnlineUser = false;
                        _this.wrappedLoan.ref.active.getBorrower().userAccount.isActivated = false;
                    }
                }
                if (_this.model) {
                    _this.model = null;
                }
                if (_this.borrowerManageUserAccount) {
                    _this.borrowerManageUserAccount = null;
                }
                if (_this.coBorrowerManageUserAccount) {
                    _this.coBorrowerManageUserAccount = null;
                }
                if (ctrl && ctrl.confirmationPopup)
                    ctrl.confirmationPopup.close();
            };
            var vm = this;
            vm.modalPopoverFactory = modalPopoverFactory;
            vm.apiPath = ApiRoot + 'user/';
            vm.enums = enums;
            vm.userAccounts = vm.$resource(vm.apiPath + 'UserAccounts?username=:username', {
                username: '@username'
            });
        }
        manageAccountService.className = 'ManageAccountService';
        manageAccountService.$inject = ['apiRoot', 'modalPopoverFactory', '$resource', '$q', 'enums'];
        return manageAccountService;
    })();
    loanCenter.manageAccountService = manageAccountService;
    //
    // @todo: Register per standards
    // 
    angular.module('loanApplication').service('manageAccountService', manageAccountService);
})(loanCenter || (loanCenter = {}));
//moduleRegistration.registerService(moduleNames.loanCenter, loanCenter.manageAccountService); 
//# sourceMappingURL=manageaccount.service.js.map