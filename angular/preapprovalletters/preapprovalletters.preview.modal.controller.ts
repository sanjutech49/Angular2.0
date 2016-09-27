module preapprovalletters {

    export class preapprovallettersPreviewModalController {

        sendToUsers;
        //wrappedLoan;
        applicationData;
        preapprovalLoanTerms;
        templateId;

        borrowerCoBorrowerName;
        cityStateZip;
        occupancyType;
        propertyType;

        concierge;
        conciergePhone;
        companyCityStateZip;

        public static $inject = ['enums', 'NavigationSvc', '$filter', '$state',
            'simpleModalWindowFactory', '$modal', 'wrappedLoan', 'sendToUsers',
            'applicationData', 'personalUtilities', 'preapprovalLoanTerms', '$modalInstance',
            'preapprovallettersService', 'templateId', 'commonModalWindowFactory', 'modalWindowType'];

        constructor(public enums, private NavigationSvc, private $filter, private $state,
            private simpleModalWindowFactory, protected $modal, public wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, sendToUsers,
            applicationData, personalUtilities, preapprovalLoanTerms, private $modalInstance,
            private preapprovallettersService, templateId, private commonModalWindowFactory, private modalWindowType) {
            // this.wrappedLoan = wrappedLoan;
            this.sendToUsers = sendToUsers;
            this.applicationData = applicationData;
            this.preapprovalLoanTerms = preapprovalLoanTerms;

            this.borrowerCoBorrowerName = personalUtilities.getBorrowerAndCoBorrowerNames(this.wrappedLoan.ref.active.getBorrower(), this.wrappedLoan.ref.active.getCoBorrower(), this.wrappedLoan.ref.active.isSpouseOnTheLoan, this.wrappedLoan.ref.active.isSpouseOnTheTitle, this.wrappedLoan.ref.active.titleInfo.nameOfPartner);
            this.cityStateZip = this.wrappedLoan.ref.active.getBorrower().getMailingAddress().cityName + " " + this.wrappedLoan.ref.active.getBorrower().getMailingAddress().stateName, this.wrappedLoan.ref.active.getBorrower().getMailingAddress().zipCode;
            this.occupancyType = _.findWhere(this.wrappedLoan.ref.lookup.occupancyTypeList, { value: this.wrappedLoan.ref.active.occupancyType.toString() });
            this.propertyType = _.findWhere(this.wrappedLoan.ref.lookup.subjectPropertyTypes, { value: this.wrappedLoan.ref.getSubjectProperty().propertyType });
            this.templateId = templateId;

            this.concierge = _.find(this.applicationData.companyEmployees.userAccounts,(employee: any) => this.wrappedLoan.ref.conciergeId == employee.userAccountId);

            if (this.concierge != null && this.concierge.phones != null && this.concierge.phones.length > 0) {
                var conciergePhoneWork = _.find(this.concierge.phones,(p: any) => p.type == "2"); // phone number type, work

                if (conciergePhoneWork != null)
                    this.conciergePhone = conciergePhoneWork.number;
                else {
                    var conciergePhoneCell = _.find(this.concierge.phones,(p: any) => p.type == "1"); // phone number type, cell

                    if (conciergePhoneCell != null)
                        this.conciergePhone = conciergePhoneCell.number;
                }
            }
        }

        getDateTime = function () {
            return new Date();
        }

        close = (): void => {
            this.$modalInstance.dismiss('cancel');
        }

        send = (): void => {
            var palViewModel = new srv.cls.SentPreApprovalLetterHistoryViewModel();
            palViewModel.loanId = this.wrappedLoan.ref.loanId;
            palViewModel.distributeToBorrower = _.some(this.sendToUsers.borrowers,(borrower: any) => borrower.isSelected == true);
            palViewModel.distributeToBuyersAgent = this.sendToUsers.buyersAgent.isSelected;
            palViewModel.distributeToSellersAgent = this.sendToUsers.sellersAgent.isSelected;
            palViewModel.letterLoanAmount = this.preapprovalLoanTerms[0]; // loan amount
            palViewModel.letterPurchasePrice = this.preapprovalLoanTerms[1]; // purchase price
            palViewModel.expirationDate = this.preapprovalLoanTerms[2]; // expiration date
            palViewModel.propertyId = this.wrappedLoan.ref.getSubjectProperty().propertyId;
            palViewModel.letterTemplateId = this.templateId;
            palViewModel.brandThemeName = this.applicationData.companyProfile.companyTheme;
            palViewModel.brandDisplayName = this.applicationData.companyProfile.companyName;
            var listSelectedBorrowersForDistribution = _.where(this.sendToUsers.borrowers,(x: any) => x.isSelected == true);
            palViewModel.selectedBorrowersForDistribution = _.map(listSelectedBorrowersForDistribution,(x: any) => x.id);
            palViewModel.userAccountId = this.applicationData.currentUserId;

            this.$modalInstance.dismiss('close');
            this.commonModalWindowFactory.open({ type: this.modalWindowType.loader, message: 'Sending preapproval letter' });

            this.NavigationSvc.SaveAndUpdateWrappedLoan(this.applicationData.currentUser.userAccountId, this.wrappedLoan, wrappedLoan => {
                this.preapprovallettersService.send(palViewModel).then(response  => {
                    this.commonModalWindowFactory.close('close');
                    this.wrappedLoan.ref.sentPreApprovalLetterHistories.push(response.data);
                    this.wrappedLoan.ref.currentMilestone = srv.milestoneStatus.preApproved;
                }, error => {
                        this.commonModalWindowFactory.close('close');
                        this.commonModalWindowFactory.open({ type: this.modalWindowType.error, message: 'Error while sending preapproval letter' });
                    });
            }, error => {
                    this.commonModalWindowFactory.close('close');
                }, null, false);
        }
    }

    angular.module('preapprovalletters').controller('preapprovallettersPreviewModalController', preapprovallettersPreviewModalController);
}
