/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var sendEmailReportController = (function () {
        function sendEmailReportController($modalInstance, loan, applicationData, $http, BroadcastSvc, pricingResultsSvc, NavigationSvc) {
            //this.BroadcastSvc,
            //this.pricingResultsSvc,
            //this.NavigationSvc
            var _this = this;
            this.$modalInstance = $modalInstance;
            this.loan = loan;
            this.applicationData = applicationData;
            this.$http = $http;
            this.BroadcastSvc = BroadcastSvc;
            this.pricingResultsSvc = pricingResultsSvc;
            this.NavigationSvc = NavigationSvc;
            this.controllerAsName = "sendEmailReportCntrl";
            this.secureLinkEmailTemplateArray = [];
            this.vm = this;
            this.saveLoanAndSendUserSelectedProductCategories = function () {
                //if (!vm.isEmailValid)
                //    return;
                //if (sendEmail)
                //    vm.userSelectedProductCategoriesVM.sendEmail = sendEmail;
                _this.loan.loanApp.borrower.firstName = _this.firstName;
                _this.loan.loanApp.borrower.lastName = _this.lastName;
                if (_this.emailAddress)
                    _this.applicationData.currentUser.username = _this.emailAddress;
                var userSelectedProductCategoriesVM = new srv.cls.UserSelectedProductCategoriesViewModel();
                userSelectedProductCategoriesVM.firstName = _this.loan.loanApp.borrower.firstName;
                userSelectedProductCategoriesVM.lastName = _this.loan.loanApp.borrower.lastName;
                userSelectedProductCategoriesVM.email = _this.applicationData.currentUser.username;
                userSelectedProductCategoriesVM.borrowerUserAccountId = _this.applicationData.currentUser.userAccountId;
                _this.saveAndSendUserSelectedProductCategories(userSelectedProductCategoriesVM);
                //  this.NavigationSvc.SaveAndUpdateWrappedLoan(this.applicationData.currentUser.userAccountId, this.loan, function () { this.saveAndSendUserSelectedProductCategories(userSelectedProductCategoriesVM) });
            };
            this.saveAndSendUserSelectedProductCategories = function (viewModel) {
                viewModel.loanId = _this.loan.getLoan().loanId;
                _this.pricingResultsSvc.SaveAndSendUserSelectedProductCategories(viewModel).then(function (result) {
                    if (result.data)
                        // commonModalWindowFactory.close('close');
                        this.close();
                }, function (error) {
                    //commonModalWindowFactory.open({ type: modalWindowType.error, message: 'An error occured during saving and sending Comparison PDF.' });
                    console.log("Error:" + JSON.stringify(error));
                });
                //  this.BroadcastSvc.broadcastRepopulatePricingResults(); 
            };
            this.close = function () {
                _this.$modalInstance.dismiss('cancel');
            };
            this.clickCancelSendReportClick = function () {
                _this.close();
            };
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
            this.sendEmail = function () {
                _this.saveLoanAndSendUserSelectedProductCategories();
                return true;
                //this.secureLinkEmail.toEmail = this.emailAddress;
                //this.tempLoanId = this.loan.getLoan().loanId;
                //this.SecureLinkEmailService.SendSecureLinkEmail(this.tempLoanId, this.tempLoanId).then(result => {
                //    this.isEmailSent = result;
                //},
                //    error => {
                //        console.log('Error occurred while getting SecureLink Email Templates Data!', error);
                //        this.isEmailSent = false;
                //    });
                //return this.isEmailSent;
            };
        }
        Object.defineProperty(sendEmailReportController.prototype, "toEmail", {
            get: function () {
                return this.secureLinkEmail.toEmail;
            },
            set: function (toEmail) {
                this.secureLinkEmail.toEmail = toEmail;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(sendEmailReportController.prototype, "ccEmail", {
            get: function () {
                return this.secureLinkEmail.ccEmail;
            },
            set: function (ccEmail) {
                this.secureLinkEmail.ccEmail = ccEmail;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(sendEmailReportController.prototype, "fromEmail", {
            get: function () {
                return this.secureLinkEmail.fromEmail;
            },
            set: function (fromEmail) {
                this.secureLinkEmail.fromEmail = fromEmail;
            },
            enumerable: true,
            configurable: true
        });
        sendEmailReportController.className = "sendEmailReportController";
        sendEmailReportController.$inject = ['$http', '$controller', 'loan', 'applicationData', 'BroadcastSvc', 'pricingResultsSvc', 'NavigationSvc'];
        return sendEmailReportController;
    })();
    consumersite.sendEmailReportController = sendEmailReportController;
    moduleRegistration.registerController(consumersite.moduleName, sendEmailReportController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=sendEmailReport.controller.js.map