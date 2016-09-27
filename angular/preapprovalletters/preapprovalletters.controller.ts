module preapprovalletters {

    // todo - rewrite this class to the TypeScript standards implemented by the document and is used throughout the entire application. 'vm' is not required and needs to be removed.
    export class preapprovallettersController {


        static className = "preapprovallettersController";

        navigationSvc: any;
        filter: any;
        state: any;
        selectedNames: string = "Select One or More";


        sendToUsers: { borrowers: any[]; buyersAgent: any; sellersAgent: any } = { borrowers: [], buyersAgent: null, sellersAgent: null };
        preapprovalLoanTerms: any;
        templateId: any;
        letterPurchasePrice: number;
        letterLoanAmount: number;
        issueDate: string;
        subjectPropertyAddress: string;

        creditReportDate: Date;
        letterExpirationDate: Date = new Date();
        letterExpirationDateEntered: any;
        letterExpirationDateMessage: string;
        letterExpirationDateValidated: boolean = true;
        showExpirationDateDisclaimer: boolean = false;

        purchasePriceValidated: boolean = true;
        showPurchasePriceDisclaimer: boolean = false;

        loanAmountlValidated: boolean = true;
        showLoanAmountDisclaimer: boolean = false;

        expirationDateValidated: boolean = true;

        public static $inject = ['wrappedLoan', 'enums', 'NavigationSvc', '$filter', '$state', '$controller', '$modal',
            'modalPopoverFactory', 'applicationData'];

        constructor(private wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, public enums, private NavigationSvc, private $filter, private $state,
            private $controller, private $modal, private modalPopoverFactory, private applicationData) {

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

        ruleFunctionExpirationDate = (expirationDateEntered: any) => {
            return false;
        }

        getCurrentDate = () => {
            return this.$filter('date')(new Date(), "MM/dd/yy");
        }

        showSendToSection = (event, model) => {

            var ctrl = {
                getSendToNames: this.getSendToNames,
                selectedNames: this.selectedNames
            };

            var sendToSection = this.modalPopoverFactory.openModalPopover('angular/preapprovalletters/sendtosection.html', ctrl, this.sendToUsers, event, {
                verticalPopupPositionPerHeight: 0.03, horisontalPopupPositionPerWidth: 0.5, refExtModelAndCtrl: true, className: 'tooltip-arrow-display-non'
            });

        }

        getSendToNames = () => {
            this.selectedNames = '';
            for (var i = 0; i < this.sendToUsers.borrowers.length; i++) {
                if (this.sendToUsers.borrowers[i].isSelected)
                    this.selectedNames = this.selectedNames.concat(this.sendToUsers.borrowers[i].fullname, ", ");
            }
            if (this.sendToUsers.buyersAgent.isSelected)
                this.selectedNames = this.selectedNames.concat(this.sendToUsers.buyersAgent.fullname, ", ");
            if (this.sendToUsers.sellersAgent.isSelected)
                this.selectedNames = this.selectedNames.concat(this.sendToUsers.sellersAgent.fullname, ", ");

            this.selectedNames = this.selectedNames.slice(0, -1);

            this.selectedNames = this.selectedNames.substring(0, this.selectedNames.length - 1)

            if (this.selectedNames == '')
                this.selectedNames = "Select One or More";
        }

        getBorrowers = () => {
            var borrowers: any[] = [];

            if (this.wrappedLoan.ref.getLoanApplications()) {
                for (var i = 0; i < this.wrappedLoan.ref.getLoanApplications().length; i++) {
                    borrowers.push({ fullname: this.wrappedLoan.ref.getLoanApplications()[i].getBorrower().getFullName(), email: this.wrappedLoan.ref.getLoanApplications()[i].getBorrower().userAccount.username, id: this.wrappedLoan.ref.getLoanApplications()[i].loanApplicationId, isSelected: false });
                }
            }
            return borrowers;
        }

        getBuyersAgent = () => {
            if (this.wrappedLoan.ref.buyersAgentContact) {
                var firstname = this.wrappedLoan.ref.buyersAgentContact.firstname ? this.wrappedLoan.ref.buyersAgentContact.firstname + " " : "";
                var lastname = this.wrappedLoan.ref.buyersAgentContact.lastname ? this.wrappedLoan.ref.buyersAgentContact.lastname : "";
                var email = this.wrappedLoan.ref.buyersAgentContact.email ? this.wrappedLoan.ref.buyersAgentContact.email : "";

                return { fullname: firstname + lastname, email: email, isSelected: false };

            }
        }

        getSellersAgent = () => {
            if (this.wrappedLoan.ref.sellersAgentContact) {
                var firstname = this.wrappedLoan.ref.sellersAgentContact.firstname ? this.wrappedLoan.ref.sellersAgentContact.firstname + " " : "";
                var lastname = this.wrappedLoan.ref.sellersAgentContact.lastname ? this.wrappedLoan.ref.sellersAgentContact.lastname : "";
                var email = this.wrappedLoan.ref.sellersAgentContact.email ? this.wrappedLoan.ref.sellersAgentContact.email : "";

                return { fullname: firstname + lastname, email: email, isSelected: false };

            }
        }

        getSentToUsersHistory = (preApprovalLetterHistory: any) => {
            var sentToUserNames = '';

            if (preApprovalLetterHistory.distributeToBorrower) {
                var splittedLoanIds = preApprovalLetterHistory.borrowersForDistribution.split("|");

                for (var i = 0; i < this.wrappedLoan.ref.getLoanApplications().length; i++) {
                    if (splittedLoanIds.indexOf(this.wrappedLoan.ref.getLoanApplications()[i].loanApplicationId) > -1)
                        sentToUserNames = sentToUserNames.concat(this.wrappedLoan.ref.getLoanApplications()[i].getBorrower().getFullName(), ", ");
                }
            }

            if (preApprovalLetterHistory.distributeToBuyersAgent)
                sentToUserNames = sentToUserNames.concat(this.getBuyersAgent().fullname, ", ");

            if (preApprovalLetterHistory.distributeToSellersAgent)
                sentToUserNames = sentToUserNames.concat(this.getSellersAgent().fullname, ", ");

            sentToUserNames = sentToUserNames.slice(0, -1);
            sentToUserNames = sentToUserNames.substring(0, sentToUserNames.length - 1);

            return sentToUserNames;

        }

        getTemplateById = (id: number) => {
            var template = _.find(this.applicationData.preApprovalLetterTemplates,(template: any) => { return template.id == id });

            if (template)
                return template;
        }

        isLetterExpired = (expirationDate: any) => {
            var today = new Date();
            var expirationdate = new Date(expirationDate);

            if (today > expirationdate)
                return true;
            else
                return false;
        }

        setDefaultExpirationDate = () => {
            if (!_.some(this.wrappedLoan.ref.getLoanApplications(), function (loanApp: any) { return (!loanApp.credit.creditReportDate || loanApp.credit.creditReportDate.toString() == "0001-01-01T00:00:00"); })) {
                this.creditReportDate = new Date(this.wrappedLoan.ref.active.credit.creditReportDate.toString());
                this.letterExpirationDate = new Date(this.creditReportDate.toDateString());
                this.letterExpirationDate.setDate(this.creditReportDate.getDate() + 89);
                if (this.validateCreditReportDate()) {
                    this.letterExpirationDateEntered = this.$filter('date')(this.letterExpirationDate, "MM/dd/yy");
                    this.letterExpirationDateMessage = 'Date cannot exceed ' + this.letterExpirationDateEntered;
                }
            }
        }

        validateCreditReportDate = () => {
            var allowedMinCreditReportDate = new Date();
            allowedMinCreditReportDate.setDate(allowedMinCreditReportDate.getDate() - 75);

            if (!(this.creditReportDate instanceof Date) || this.creditReportDate < allowedMinCreditReportDate)
                return false;
            else
                return true;
        }

        validateData = () => {
            return (this.templateId && this.purchasePriceValidated && this.loanAmountlValidated && this.validateCreditReportDate() && this.selectedNames != "Select One or More")
        }

        validateExpirationDate = (model: any) => {
            if (new Date(model.preapprovallettersCtrl.letterExpirationDateEntered) > model.preapprovallettersCtrl.letterExpirationDate) //|| new Date(this.letterExpirationDateEntered) < new Date(this.issueDate)
                model.preapprovallettersCtrl.expirationDateValidated = false;
            else
                model.preapprovallettersCtrl.expirationDateValidated = true;
        }

        onPurchasePriceBlur = () => {
            this.purchasePriceValidated = true;
            this.showPurchasePriceDisclaimer = false;

            if (this.letterPurchasePrice > this.wrappedLoan.ref.getSubjectProperty().purchasePrice)
                this.purchasePriceValidated = false;
        }

        onPurchasePriceFocus = () => {
            if (this.letterPurchasePrice > this.wrappedLoan.ref.getSubjectProperty().purchasePrice)
                this.showPurchasePriceDisclaimer = true;
        }

        onLoanAmountBlur = () => {
            this.loanAmountlValidated = true;
            this.showLoanAmountDisclaimer = false;

            if (this.letterLoanAmount > this.wrappedLoan.ref.loanAmount)
                this.loanAmountlValidated = false;
        }

        onLoanAmountFocus = () => {
            if (this.letterLoanAmount > this.wrappedLoan.ref.loanAmount)
                this.showLoanAmountDisclaimer = true;
        }

        openPreview = (wrappedLoan, sendToUsers, applicationData, letterLoanAmount, letterPurchasePrice, letterExpirationDate, templateId) => { // try to refactor parameter list
            this.$modal.open({
                templateUrl: 'angular/preapprovalletters/preapprovalletters.preview.modal.html',
                controller: 'preapprovallettersPreviewModalController',
                controllerAs: 'palCtrl',
                backdrop: 'static',
                resolve: {
                    sendToUsers: () => sendToUsers,
                    wrappedLoan: () => wrappedLoan,
                    applicationData: () => applicationData,
                    preapprovalLoanTerms: () => [letterLoanAmount, letterPurchasePrice, letterExpirationDate],
                    templateId: () => templateId
                }
            });
        }
    }

    angular.module('preapprovalletters').controller('preapprovallettersController', preapprovallettersController);
}
