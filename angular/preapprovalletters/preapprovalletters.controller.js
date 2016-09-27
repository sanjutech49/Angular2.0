var preapprovalletters;
(function (preapprovalletters) {
    // todo - rewrite this class to the TypeScript standards implemented by the document and is used throughout the entire application. 'vm' is not required and needs to be removed.
    var preapprovallettersController = (function () {
        function preapprovallettersController(wrappedLoan, enums, NavigationSvc, $filter, $state, $controller, $modal, modalPopoverFactory, applicationData) {
            var _this = this;
            this.wrappedLoan = wrappedLoan;
            this.enums = enums;
            this.NavigationSvc = NavigationSvc;
            this.$filter = $filter;
            this.$state = $state;
            this.$controller = $controller;
            this.$modal = $modal;
            this.modalPopoverFactory = modalPopoverFactory;
            this.applicationData = applicationData;
            this.selectedNames = "Select One or More";
            this.sendToUsers = { borrowers: [], buyersAgent: null, sellersAgent: null };
            this.letterExpirationDate = new Date();
            this.letterExpirationDateValidated = true;
            this.showExpirationDateDisclaimer = false;
            this.purchasePriceValidated = true;
            this.showPurchasePriceDisclaimer = false;
            this.loanAmountlValidated = true;
            this.showLoanAmountDisclaimer = false;
            this.expirationDateValidated = true;
            this.ruleFunctionExpirationDate = function (expirationDateEntered) {
                return false;
            };
            this.getCurrentDate = function () {
                return _this.$filter('date')(new Date(), "MM/dd/yy");
            };
            this.showSendToSection = function (event, model) {
                var ctrl = {
                    getSendToNames: _this.getSendToNames,
                    selectedNames: _this.selectedNames
                };
                var sendToSection = _this.modalPopoverFactory.openModalPopover('angular/preapprovalletters/sendtosection.html', ctrl, _this.sendToUsers, event, {
                    verticalPopupPositionPerHeight: 0.03,
                    horisontalPopupPositionPerWidth: 0.5,
                    refExtModelAndCtrl: true,
                    className: 'tooltip-arrow-display-non'
                });
            };
            this.getSendToNames = function () {
                _this.selectedNames = '';
                for (var i = 0; i < _this.sendToUsers.borrowers.length; i++) {
                    if (_this.sendToUsers.borrowers[i].isSelected)
                        _this.selectedNames = _this.selectedNames.concat(_this.sendToUsers.borrowers[i].fullname, ", ");
                }
                if (_this.sendToUsers.buyersAgent.isSelected)
                    _this.selectedNames = _this.selectedNames.concat(_this.sendToUsers.buyersAgent.fullname, ", ");
                if (_this.sendToUsers.sellersAgent.isSelected)
                    _this.selectedNames = _this.selectedNames.concat(_this.sendToUsers.sellersAgent.fullname, ", ");
                _this.selectedNames = _this.selectedNames.slice(0, -1);
                _this.selectedNames = _this.selectedNames.substring(0, _this.selectedNames.length - 1);
                if (_this.selectedNames == '')
                    _this.selectedNames = "Select One or More";
            };
            this.getBorrowers = function () {
                var borrowers = [];
                if (_this.wrappedLoan.ref.getLoanApplications()) {
                    for (var i = 0; i < _this.wrappedLoan.ref.getLoanApplications().length; i++) {
                        borrowers.push({ fullname: _this.wrappedLoan.ref.getLoanApplications()[i].getBorrower().getFullName(), email: _this.wrappedLoan.ref.getLoanApplications()[i].getBorrower().userAccount.username, id: _this.wrappedLoan.ref.getLoanApplications()[i].loanApplicationId, isSelected: false });
                    }
                }
                return borrowers;
            };
            this.getBuyersAgent = function () {
                if (_this.wrappedLoan.ref.buyersAgentContact) {
                    var firstname = _this.wrappedLoan.ref.buyersAgentContact.firstname ? _this.wrappedLoan.ref.buyersAgentContact.firstname + " " : "";
                    var lastname = _this.wrappedLoan.ref.buyersAgentContact.lastname ? _this.wrappedLoan.ref.buyersAgentContact.lastname : "";
                    var email = _this.wrappedLoan.ref.buyersAgentContact.email ? _this.wrappedLoan.ref.buyersAgentContact.email : "";
                    return { fullname: firstname + lastname, email: email, isSelected: false };
                }
            };
            this.getSellersAgent = function () {
                if (_this.wrappedLoan.ref.sellersAgentContact) {
                    var firstname = _this.wrappedLoan.ref.sellersAgentContact.firstname ? _this.wrappedLoan.ref.sellersAgentContact.firstname + " " : "";
                    var lastname = _this.wrappedLoan.ref.sellersAgentContact.lastname ? _this.wrappedLoan.ref.sellersAgentContact.lastname : "";
                    var email = _this.wrappedLoan.ref.sellersAgentContact.email ? _this.wrappedLoan.ref.sellersAgentContact.email : "";
                    return { fullname: firstname + lastname, email: email, isSelected: false };
                }
            };
            this.getSentToUsersHistory = function (preApprovalLetterHistory) {
                var sentToUserNames = '';
                if (preApprovalLetterHistory.distributeToBorrower) {
                    var splittedLoanIds = preApprovalLetterHistory.borrowersForDistribution.split("|");
                    for (var i = 0; i < _this.wrappedLoan.ref.getLoanApplications().length; i++) {
                        if (splittedLoanIds.indexOf(_this.wrappedLoan.ref.getLoanApplications()[i].loanApplicationId) > -1)
                            sentToUserNames = sentToUserNames.concat(_this.wrappedLoan.ref.getLoanApplications()[i].getBorrower().getFullName(), ", ");
                    }
                }
                if (preApprovalLetterHistory.distributeToBuyersAgent)
                    sentToUserNames = sentToUserNames.concat(_this.getBuyersAgent().fullname, ", ");
                if (preApprovalLetterHistory.distributeToSellersAgent)
                    sentToUserNames = sentToUserNames.concat(_this.getSellersAgent().fullname, ", ");
                sentToUserNames = sentToUserNames.slice(0, -1);
                sentToUserNames = sentToUserNames.substring(0, sentToUserNames.length - 1);
                return sentToUserNames;
            };
            this.getTemplateById = function (id) {
                var template = _.find(_this.applicationData.preApprovalLetterTemplates, function (template) {
                    return template.id == id;
                });
                if (template)
                    return template;
            };
            this.isLetterExpired = function (expirationDate) {
                var today = new Date();
                var expirationdate = new Date(expirationDate);
                if (today > expirationdate)
                    return true;
                else
                    return false;
            };
            this.setDefaultExpirationDate = function () {
                if (!_.some(_this.wrappedLoan.ref.getLoanApplications(), function (loanApp) {
                    return (!loanApp.credit.creditReportDate || loanApp.credit.creditReportDate.toString() == "0001-01-01T00:00:00");
                })) {
                    _this.creditReportDate = new Date(_this.wrappedLoan.ref.active.credit.creditReportDate.toString());
                    _this.letterExpirationDate = new Date(_this.creditReportDate.toDateString());
                    _this.letterExpirationDate.setDate(_this.creditReportDate.getDate() + 89);
                    if (_this.validateCreditReportDate()) {
                        _this.letterExpirationDateEntered = _this.$filter('date')(_this.letterExpirationDate, "MM/dd/yy");
                        _this.letterExpirationDateMessage = 'Date cannot exceed ' + _this.letterExpirationDateEntered;
                    }
                }
            };
            this.validateCreditReportDate = function () {
                var allowedMinCreditReportDate = new Date();
                allowedMinCreditReportDate.setDate(allowedMinCreditReportDate.getDate() - 75);
                if (!(_this.creditReportDate instanceof Date) || _this.creditReportDate < allowedMinCreditReportDate)
                    return false;
                else
                    return true;
            };
            this.validateData = function () {
                return (_this.templateId && _this.purchasePriceValidated && _this.loanAmountlValidated && _this.validateCreditReportDate() && _this.selectedNames != "Select One or More");
            };
            this.validateExpirationDate = function (model) {
                if (new Date(model.preapprovallettersCtrl.letterExpirationDateEntered) > model.preapprovallettersCtrl.letterExpirationDate)
                    model.preapprovallettersCtrl.expirationDateValidated = false;
                else
                    model.preapprovallettersCtrl.expirationDateValidated = true;
            };
            this.onPurchasePriceBlur = function () {
                _this.purchasePriceValidated = true;
                _this.showPurchasePriceDisclaimer = false;
                if (_this.letterPurchasePrice > _this.wrappedLoan.ref.getSubjectProperty().purchasePrice)
                    _this.purchasePriceValidated = false;
            };
            this.onPurchasePriceFocus = function () {
                if (_this.letterPurchasePrice > _this.wrappedLoan.ref.getSubjectProperty().purchasePrice)
                    _this.showPurchasePriceDisclaimer = true;
            };
            this.onLoanAmountBlur = function () {
                _this.loanAmountlValidated = true;
                _this.showLoanAmountDisclaimer = false;
                if (_this.letterLoanAmount > _this.wrappedLoan.ref.loanAmount)
                    _this.loanAmountlValidated = false;
            };
            this.onLoanAmountFocus = function () {
                if (_this.letterLoanAmount > _this.wrappedLoan.ref.loanAmount)
                    _this.showLoanAmountDisclaimer = true;
            };
            this.openPreview = function (wrappedLoan, sendToUsers, applicationData, letterLoanAmount, letterPurchasePrice, letterExpirationDate, templateId) {
                _this.$modal.open({
                    templateUrl: 'angular/preapprovalletters/preapprovalletters.preview.modal.html',
                    controller: 'preapprovallettersPreviewModalController',
                    controllerAs: 'palCtrl',
                    backdrop: 'static',
                    resolve: {
                        sendToUsers: function () { return sendToUsers; },
                        wrappedLoan: function () { return wrappedLoan; },
                        applicationData: function () { return applicationData; },
                        preapprovalLoanTerms: function () { return [letterLoanAmount, letterPurchasePrice, letterExpirationDate]; },
                        templateId: function () { return templateId; }
                    }
                });
            };
            angular.extend(this, $controller('DocumentCtrl', { $scope: this }));
            this.sendToUsers.borrowers = this.getBorrowers();
            this.sendToUsers.buyersAgent = this.getBuyersAgent();
            this.sendToUsers.sellersAgent = this.getSellersAgent();
            this.setDefaultExpirationDate();
            this.templateId = 0;
            this.letterPurchasePrice = 0;
            this.letterLoanAmount = 0;
            this.issueDate = this.getCurrentDate();
            // this.subjectPropertyAddress = this.wrappedLoan.ref.getSubjectProperty().getSubjectPropertyAddressString;
            this.subjectPropertyAddress = this.wrappedLoan.ref.getSubjectProperty().fullAddressString;
            this.letterLoanAmount = this.wrappedLoan.ref.loanAmount;
            this.letterPurchasePrice = this.wrappedLoan.ref.getSubjectProperty().purchasePrice;
            NavigationSvc.contextualType = enums.ContextualTypes.PreApprovalLetters;
        }
        preapprovallettersController.className = "preapprovallettersController";
        preapprovallettersController.$inject = ['wrappedLoan', 'enums', 'NavigationSvc', '$filter', '$state', '$controller', '$modal', 'modalPopoverFactory', 'applicationData'];
        return preapprovallettersController;
    })();
    preapprovalletters.preapprovallettersController = preapprovallettersController;
    angular.module('preapprovalletters').controller('preapprovallettersController', preapprovallettersController);
})(preapprovalletters || (preapprovalletters = {}));
//# sourceMappingURL=preapprovalletters.controller.js.map