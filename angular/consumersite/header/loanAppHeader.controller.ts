/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class LoanAppHeaderController {

        static className = "loanAppHeaderController";
        static $inject = ['navigationService', 'loan'];

        //properties
        isMobileMenuOpen: boolean = false;

        constructor(private navigationService: UINavigationService, private loan: vm.Loan) {
        }

        public getProgress() {
            var percent = this.navigationService.getProgressPercent();
            return percent;
        }

        public getProgressRounded() {

            var percent = Math.round(this.navigationService.getProgressPercent() * 100);
            return percent;
        }

        get loanAmount() {
            if (this.loan.loanAmount != null)
                return this.loan.loanAmount;
            else
                return 0;
        }

        get loanRate() {
            if (this.loan.pricingProduct != null)
                return this.loan.pricingProduct.Rate;
            else
                return "0";
        }

        get monthlyPayment() {
            if (this.loan.pricingProduct != null)
                return this.loan.pricingProduct.MonthlyPayment;
            else
                return "0";
        }

        get cashOutAmount() {
            return this.loan.cashOutAmount;
        }

        //Click Events
        public toggleMobileMenu() {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
        }

    }
    moduleRegistration.registerController(consumersite.moduleName, LoanAppHeaderController);
} 