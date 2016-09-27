var preapprovalletters;
(function (preapprovalletters) {
    var preapprovallettersPreviewModalController = (function () {
        function preapprovallettersPreviewModalController(enums, NavigationSvc, $filter, $state, simpleModalWindowFactory, $modal, wrappedLoan, sendToUsers, applicationData, personalUtilities, preapprovalLoanTerms, $modalInstance, preapprovallettersService, templateId, commonModalWindowFactory, modalWindowType) {
            var _this = this;
            this.enums = enums;
            this.NavigationSvc = NavigationSvc;
            this.$filter = $filter;
            this.$state = $state;
            this.simpleModalWindowFactory = simpleModalWindowFactory;
            this.$modal = $modal;
            this.wrappedLoan = wrappedLoan;
            this.$modalInstance = $modalInstance;
            this.preapprovallettersService = preapprovallettersService;
            this.commonModalWindowFactory = commonModalWindowFactory;
            this.modalWindowType = modalWindowType;
            this.getDateTime = function () {
                return new Date();
            };
            this.close = function () {
                _this.$modalInstance.dismiss('cancel');
            };
            this.send = function () {
                var palViewModel = new srv.cls.SentPreApprovalLetterHistoryViewModel();
                palViewModel.loanId = _this.wrappedLoan.ref.loanId;
                palViewModel.distributeToBorrower = _.some(_this.sendToUsers.borrowers, function (borrower) { return borrower.isSelected == true; });
                palViewModel.distributeToBuyersAgent = _this.sendToUsers.buyersAgent.isSelected;
                palViewModel.distributeToSellersAgent = _this.sendToUsers.sellersAgent.isSelected;
                palViewModel.letterLoanAmount = _this.preapprovalLoanTerms[0]; // loan amount
                palViewModel.letterPurchasePrice = _this.preapprovalLoanTerms[1]; // purchase price
                palViewModel.expirationDate = _this.preapprovalLoanTerms[2]; // expiration date
                palViewModel.propertyId = _this.wrappedLoan.ref.getSubjectProperty().propertyId;
                palViewModel.letterTemplateId = _this.templateId;
                palViewModel.brandThemeName = _this.applicationData.companyProfile.companyTheme;
                palViewModel.brandDisplayName = _this.applicationData.companyProfile.companyName;
                var listSelectedBorrowersForDistribution = _.where(_this.sendToUsers.borrowers, function (x) { return x.isSelected == true; });
                palViewModel.selectedBorrowersForDistribution = _.map(listSelectedBorrowersForDistribution, function (x) { return x.id; });
                palViewModel.userAccountId = _this.applicationData.currentUserId;
                _this.$modalInstance.dismiss('close');
                _this.commonModalWindowFactory.open({ type: _this.modalWindowType.loader, message: 'Sending preapproval letter' });
                _this.NavigationSvc.SaveAndUpdateWrappedLoan(_this.applicationData.currentUser.userAccountId, _this.wrappedLoan, function (wrappedLoan) {
                    _this.preapprovallettersService.send(palViewModel).then(function (response) {
                        _this.commonModalWindowFactory.close('close');
                        _this.wrappedLoan.ref.sentPreApprovalLetterHistories.push(response.data);
                        _this.wrappedLoan.ref.currentMilestone = 4 /* preApproved */;
                    }, function (error) {
                        _this.commonModalWindowFactory.close('close');
                        _this.commonModalWindowFactory.open({ type: _this.modalWindowType.error, message: 'Error while sending preapproval letter' });
                    });
                }, function (error) {
                    _this.commonModalWindowFactory.close('close');
                }, null, false);
            };
            // this.wrappedLoan = wrappedLoan;
            this.sendToUsers = sendToUsers;
            this.applicationData = applicationData;
            this.preapprovalLoanTerms = preapprovalLoanTerms;
            this.borrowerCoBorrowerName = personalUtilities.getBorrowerAndCoBorrowerNames(this.wrappedLoan.ref.active.getBorrower(), this.wrappedLoan.ref.active.getCoBorrower(), this.wrappedLoan.ref.active.isSpouseOnTheLoan, this.wrappedLoan.ref.active.isSpouseOnTheTitle, this.wrappedLoan.ref.active.titleInfo.nameOfPartner);
            this.cityStateZip = this.wrappedLoan.ref.active.getBorrower().getMailingAddress().cityName + " " + this.wrappedLoan.ref.active.getBorrower().getMailingAddress().stateName, this.wrappedLoan.ref.active.getBorrower().getMailingAddress().zipCode;
            this.occupancyType = _.findWhere(this.wrappedLoan.ref.lookup.occupancyTypeList, { value: this.wrappedLoan.ref.active.occupancyType.toString() });
            this.propertyType = _.findWhere(this.wrappedLoan.ref.lookup.subjectPropertyTypes, { value: this.wrappedLoan.ref.getSubjectProperty().propertyType });
            this.templateId = templateId;
            this.concierge = _.find(this.applicationData.companyEmployees.userAccounts, function (employee) { return _this.wrappedLoan.ref.conciergeId == employee.userAccountId; });
            if (this.concierge != null && this.concierge.phones != null && this.concierge.phones.length > 0) {
                var conciergePhoneWork = _.find(this.concierge.phones, function (p) { return p.type == "2"; }); // phone number type, work
                if (conciergePhoneWork != null)
                    this.conciergePhone = conciergePhoneWork.number;
                else {
                    var conciergePhoneCell = _.find(this.concierge.phones, function (p) { return p.type == "1"; }); // phone number type, cell
                    if (conciergePhoneCell != null)
                        this.conciergePhone = conciergePhoneCell.number;
                }
            }
        }
        preapprovallettersPreviewModalController.$inject = ['enums', 'NavigationSvc', '$filter', '$state', 'simpleModalWindowFactory', '$modal', 'wrappedLoan', 'sendToUsers', 'applicationData', 'personalUtilities', 'preapprovalLoanTerms', '$modalInstance', 'preapprovallettersService', 'templateId', 'commonModalWindowFactory', 'modalWindowType'];
        return preapprovallettersPreviewModalController;
    })();
    preapprovalletters.preapprovallettersPreviewModalController = preapprovallettersPreviewModalController;
    angular.module('preapprovalletters').controller('preapprovallettersPreviewModalController', preapprovallettersPreviewModalController);
})(preapprovalletters || (preapprovalletters = {}));
//# sourceMappingURL=preapprovalletters.preview.modal.controller.js.map