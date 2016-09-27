/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path='../../providers/uiNavigation.provider.ts' />

module consumersite {

    export class MyNextStepMainController {
        
        //myNextStepMainCntrl

        public pageLoader: navigation.INavigationState[];

        static className = 'myNextStepMainController';

        public static $inject = ['$state', 'uiNavigation', 'loan', 'loanAppPageContext', 'navigationService'];

        constructor(
            private $state: ng.ui.IStateService,
            private uiNavigation: () => navigation.INavigationState[],
            private loan: vm.Loan,
            private loanAppPageContext: LoanAppPageContext,
            private navigationService: consumersite.UINavigationService) {

            this.pageLoader = uiNavigation();

            //@TODO: DEV: Temporary to allow the UI not to throw errors if a pricing product hasn't been selected in development.  
            if (this.loan.pricingProduct == null) {
                console.log("MyNextStepMainController::: Pricing Null");
                this.loan.pricingProduct = new consumersite.vm.PricingRowViewModel();
            }

            this.loanAppPageContext.scrollToTop();
        }


        //My Loan Status
        get street(): string {
            return this.loan.property.streetName;
        }

        get formattedAddress(): string {
            if (angular.isDefined(this.city) && angular.isDefined(this.state) && angular.isDefined(this.zipCode)) {
                return this.city + ", " + this.state + " " + this.zipCode;;
            }

            return null;
        }

        get city(): string {
            return this.loan.property.cityName;
        }

        get state(): string {
            return this.loan.property.stateName;
        }

        get zipCode(): string {
            return this.loan.property.zipCode;
        }

        get loanNumber(): string {
            return this.loan.loanNumber;
        }

        get interestRate(): string {
            return this.loan.pricingProduct.Rate;
        }

        get apr(): string {
            return this.loan.pricingProduct.APR;
        }

        get loanAmount(): number {
            return this.loan.loanAmount;
        }

        get downPayment(): number {
            return this.loan.downPaymentAmount;
        }

        get payment(): string {
            return this.loan.pricingProduct.MonthlyPayment;
        }

        //My Action Items
        getLoanReviewLink = () => {
            return this.navigationService.getSummaryLink();
        }

        getDisclosuresLink = () => {
            return "";
        }

        canNavigateDisclosures = (): boolean => {
            return false;
        }

        getAppraisalLink = () => {
            return "";
        }

        canNavigateAppraisal = (): boolean => {
            return false;
        }

        getDocUploadLink = () => {
            return "";
        }

        canNavigateDocUpload = (): boolean => {
            return false;
        }

        getDocReviewLink = () => {
            return "";
        }

        canNavigateDocReview = () => {
            return false;
        }

        //Percentage
        getProgress = (): number => {
            return 0.25;
        }

        //My Contacts



    }
    moduleRegistration.registerController(moduleName, MyNextStepMainController);
} 