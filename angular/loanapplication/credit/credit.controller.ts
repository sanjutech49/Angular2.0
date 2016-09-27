/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/generated/enums.ts" />
/// <reference path="../../ts/lib/referenceWrapper.ts" />
/// <reference path="../../ts/lib/genericUtil.ts" />
/// <reference path="../../ts/lib/common.util.ts" />
/// <reference path="../../ts/extendedViewModels/extendedViewModels.ts" />
/// <reference path="../../ts/extendedViewModels/loan.extendedViewModel.ts" />
/// <reference path="../../loanevents/loanEvents.service.ts" />

module credit {

    class CreditController {

        static $inject = ['$scope', '$modal', '$resource', '$controller', 'modalPopoverFactory', 'simpleModalWindowFactory',
            'CreditHelpers', 'NavigationSvc', '$q', '$interval', 'CreditSvc', 'wrappedLoan', 'applicationData', 'controllerData', 'enums', 'CreditStateService'];

        showLoader = true;
        showErrorContainer = false;
        runCreditItemOpen = false;
        SavingDataInProgress = false;
        disableFields = false;
        modalWindowDependecy;
        debtAccountOwnershipTypes;

        constructor(private $scope, private $modal, private $resource, private $controller, private modalPopoverFactory,
            private simpleModalWindowFactory,
            private CreditHelpers, private NavigationSvc, private $q, private $interval,
            private CreditSvc, public wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, private applicationData,
            private controllerData, private enums, private CreditStateService: credit.CreditStateService) {
            
            // @todo use TypeScript inheritance
            //extend controller
            angular.extend(this, $controller('DocumentCtrl', { $scope: this }));

            // modalWindowDependency so it can be accessed from SaveCreditTab in helper
            // note: depedency injection for modalWindowFactory in CreditHelper can't be resolved in Save function, so it's a workaround
            this.modalWindowDependecy = this.simpleModalWindowFactory;

            this.showLoader = false;
            this.showErrorContainer = false;
            this.disableFields = false;

            this.debtAccountOwnershipTypes = CreditStateService.debtAccountOwnershipTypes;

            //this.GetCreditReportStatus();

            this.wrappedLoan.ref.active.credit.disableReRunCreditButton = this.disableReRunCreditButton();
        }

        public showCollections = (): boolean => {
            return this.CreditStateService.showCollections();
        }

        public showPublicRecords = (): boolean => {
            return this.CreditStateService.showPublicRecords();
        }

        get totalLiabilities(): number {
            var app: cls.LoanApplicationViewModel = <cls.LoanApplicationViewModel>this.wrappedLoan.ref.active;

            var tot = 0;

            var totLiabilities = app.getLiabilitesBalanceTotal();
            tot += totLiabilities;

            var totReo = this.CreditStateService.summateTotalREOBalance();
            tot += totReo;

            var totCollections = app.getCollectionsTotalUnpaidBalance();
            tot += totCollections;

            return tot;
        }

        // public records aren't included in any calculation
        get totalPaymentAmount(): number {
            var app: cls.LoanApplicationViewModel = <cls.LoanApplicationViewModel>this.wrappedLoan.ref.active;

            var tot = 0;

            var totReoPayments = this.CreditStateService.summateTotalREOPayment();
            tot += totReoPayments;

            var totLiabilitiesPayments = app.getLiabilitesPaymentTotal();
            tot += totLiabilitiesPayments;

            var totCollectionsPayments = app.getCollectionsTotalPayment();
            tot += totCollectionsPayments;

            var totMiscExpensesPayments = app.getMiscExpensesTotal();
            tot += totMiscExpensesPayments;

            return tot;
        }

        get totalNetWorth(): number {
            var app: cls.LoanApplicationViewModel = <cls.LoanApplicationViewModel>this.wrappedLoan.ref.active;

            var tot = 0;

            var totAssets = app.getTotalAssetsAmount();
            tot += totAssets;

            var totReo = app.getReoEstimatedValueTotal;
            tot += totReo;

            var totLiabilities = this.totalLiabilities;
            tot -= totLiabilities;

            return tot;
        }

        public displayCreditScores = () => {

            return !!this.wrappedLoan.ref.active.credit &&
                !!this.wrappedLoan.ref.active.credit.creditExceptionsResolved &&
                !!this.wrappedLoan.ref.active.getBorrower().ficoScore;
        }

        public displayCreditReportMessage = (creditViewModel: srv.ICreditViewModel): boolean => {

            return creditViewModel.creditStatus != this.enums.creditReportStatus.retrieving &&
                !common.string.isNullOrWhiteSpace(creditViewModel.creditReportMessage) &&
                creditViewModel.creditStatus != this.enums.creditReportStatus.undefined;
        }

        public toggleGrid = (isCollapsed) => {
            this.controllerData.isCollapsed.liabilities =
            this.controllerData.isCollapsed.realEstate =
            this.controllerData.isCollapsed.collections =
            this.controllerData.isCollapsed.miscExpenses =
            this.controllerData.isCollapsed.publicRecords = isCollapsed;
        }

        // @todo - move the below functions into another module where they belong
        borrowerMainInfoExists = (user) => {

            return this.isDataFilledIn(user.firstName) && this.isDataFilledIn(user.lastName) &&
                this.isDataFilledIn(user.ssn) && user.ssn != "0" &&
                this.isDataFilledIn(user.confirmSsn) && user.confirmSsn != "0" &&
                user.ssn == user.confirmSsn &&
                this.isDataFilledIn(user.dateOfBirth) && this.isDateOfBirthValid(user.dateOfBirth);
        }

        isDataFilledIn = (data): boolean => {
            return data != null && data != undefined && data.length != 0;
        }

        isDateOfBirthValid = (date) => {

            if (!date)
                return true;

            var minAdultsAge = 18;
            var dateRegEx = new RegExp("^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](17|18|19|20|21|22)?[0-9]{2})*$");

            return (dateRegEx.test(date) && (this.getAge(new Date(date)) >= minAdultsAge));
        }

        getAge = (birth) => {
            var b = moment(birth);
            var age = moment().diff(b, 'years')

            return age;
        }

        // end of @todo 

        disableReRunCreditButton = () => {
            // @todo-cl::PROPERTY-ADDRESS
            return !this.borrowerMainInfoExists(this.wrappedLoan.ref.active.getBorrower()) ||
                (this.wrappedLoan.ref.active.isSpouseOnTheLoan && !this.borrowerMainInfoExists(this.wrappedLoan.ref.active.getCoBorrower())) || this.wrappedLoan.ref.active.isCreditRunning;
        }

        /**
        * Format FICO score, if it is 0 then return N/A
        */
        formatFICOScore = (value: any): string => {
            return this.CreditSvc.formatFICOScore(value);
        }

        //public GetCreditReportStatus = () => {

        //    // don't blindly check a loan application that has not yet been saved
        //    //if (lib.IdIsNullOrDefault(this.wrappedLoan.ref.active.loanApplicationId)) {
        //    //    this.wrappedLoan.ref.active.credit = new cls.CreditViewModel();
        //    //    this.wrappedLoan.ref.active.credit.creditStatus = this.enums.creditReportStatus.undefined;

        //    //} else {
        //    //    this.CreditSvc.CreditServices.GetCreditStatusData({ loanId: this.wrappedLoan.ref.active.loanApplicationId, accountId: this.applicationData.currentUserId })
        //    //        .$promise.then((creditViewModel: srv.ICreditViewModel) => {

        //    //        this.wrappedLoan.ref.active.credit = creditViewModel;
        //    //        this.wrappedLoan.ref.active.credit.disableReRunCreditButton = this.disableReRunCreditButton();
        //    //        this.wrappedLoan.ref.active.credit.creditReportMessageVisible = this.displayCreditReportMessage(creditViewModel);


        //    //    },(error) => {
        //    //            console.log("Error:" + JSON.stringify(error));

        //    //        });
        //    //}
        //}
    }

    angular.module('loanApplication').controller('creditController', CreditController);
}
