var secureLinkEmail;
(function (secureLinkEmail) {
    var controller;
    (function (controller) {
        'use strict';
        var SecureLinkEmailController = (function () {
            function SecureLinkEmailController(wrappedLoan, $modalStack, loanEvent, blockUI, $log, $state, $sce, SecureLinkEmailService, applicationData) {
                var _this = this;
                this.wrappedLoan = wrappedLoan;
                this.$modalStack = $modalStack;
                this.loanEvent = loanEvent;
                this.blockUI = blockUI;
                this.$log = $log;
                this.$state = $state;
                this.$sce = $sce;
                this.SecureLinkEmailService = SecureLinkEmailService;
                this.applicationData = applicationData;
                this.secureLinkEmailTemplateArray = [];
                this.setActiveTemplate = function () {
                    var i = 0;
                    while (i < _this.secureLinkEmailTemplateArray.length) {
                        if (_this.secureLinkEmail.activeTemplate.title === _this.secureLinkEmailTemplateArray[i].title) {
                            _this.secureLinkEmail.activeTemplate.emailBody = _this.secureLinkEmailTemplateArray[i].emailBody;
                            _this.secureLinkEmail.activeTemplate.emailSubject = _this.secureLinkEmailTemplateArray[i].emailSubject;
                            break;
                        }
                        i++;
                    }
                };
                this.close = function () {
                    _this.$modalStack.dismissAll('close');
                };
                this.sendEmail = function () {
                    //this.secureLinkEmailService.sendSecureLinkEmail(this.secureLinkEmail);
                    _this.SecureLinkEmailService.SendSecureLinkEmail(_this.tempLoanId, _this.tempLoanId).then(function (result) {
                        _this.isEmailSent = result;
                    }, function (error) {
                        _this.$log.error('Error occurred while getting SecureLink Email Templates Data!', error);
                        _this.isEmailSent = false;
                    });
                    return _this.isEmailSent;
                };
                this.getSecureLinkURL = function () {
                    _this.SecureLinkEmailService.GetSecureLinkUrlToken(_this.tempLoanId, _this.tempLoanId).then(function (result) {
                        _this.secureLinkURL = result;
                    }, function (error) {
                        _this.$log.error('Error occurred while getting SecureLink Email Templates Data!', error);
                        _this.secureLinkURL = null;
                    });
                    return _this.secureLinkURL;
                };
                var user = applicationData.currentUser;
                this.secureLinkEmail = new srv.cls.SecureLinkEmailViewModel();
                //this.secureLinkEmailTemplateArray = new srv.cls.SecureLinkEmailTemplateViewModel();
                this.secureLinkEmail.toEmail = wrappedLoan.ref.active.getBorrower().userAccount.username;
                //this.secureLinkEmail.ccEmail = wrappedLoan.ref.active.getBorrower().userAccount.username;
                this.secureLinkEmail.fromEmail = user.username;
                //this.tempLoanId = 'E2DE27CC-AFB4-4298-AE33-741458D5EE4A';
                //
                // SecureLinkEmailService.GetSecureLinkEmailTemplates(wrappedLoan.ref.loanId, wrappedLoan.ref.active.loanApplicationId).then(result => {
                //
                var sleml = new srv.cls.SecureLinkEmailViewModel();
                sleml.loanId = wrappedLoan.ref.loanId;
                sleml.loanApplicationId = wrappedLoan.ref.active.loanApplicationId;
                SecureLinkEmailService.GetSecureLinkEmailTemplates(sleml).then(function (result) {
                    _this.secureLinkEmailTemplateArray = result;
                }, function (error) {
                    _this.$log.error('Error occurred while getting SecureLink Email Templates Data!', error);
                });
            }
            Object.defineProperty(SecureLinkEmailController.prototype, "toEmail", {
                get: function () {
                    return this.secureLinkEmail.toEmail;
                },
                set: function (toEmail) {
                    this.secureLinkEmail.toEmail = toEmail;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SecureLinkEmailController.prototype, "ccEmail", {
                get: function () {
                    return this.secureLinkEmail.ccEmail;
                },
                set: function (ccEmail) {
                    this.secureLinkEmail.ccEmail = ccEmail;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SecureLinkEmailController.prototype, "fromEmail", {
                get: function () {
                    return this.secureLinkEmail.fromEmail;
                },
                set: function (fromEmail) {
                    this.secureLinkEmail.fromEmail = fromEmail;
                },
                enumerable: true,
                configurable: true
            });
            SecureLinkEmailController.className = 'secureLinkEmailController';
            SecureLinkEmailController.$inject = ['wrappedLoan', '$modalStack', 'loanEvent', 'blockUI', '$log', '$state', '$sce', 'SecureLinkEmailAlternativeService', 'applicationData'];
            return SecureLinkEmailController;
        })();
        angular.module('secureLinkEmail').controller('secureLinkEmailController', SecureLinkEmailController);
    })(controller = secureLinkEmail.controller || (secureLinkEmail.controller = {}));
})(secureLinkEmail || (secureLinkEmail = {}));
//# sourceMappingURL=securelinkemail.controller.js.map