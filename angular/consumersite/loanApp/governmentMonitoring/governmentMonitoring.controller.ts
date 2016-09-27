/// <reference path = "../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path = "../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class GovernmentMonitoringController {

        static className = "governmentMonitoringController";

        static $inject = ['loan', 'loanAppPageContext', 'applicationData'];

        private borrower: vm.Borrower;
        private isBorrower: boolean;

        constructor(public loan: vm.Loan, private loanAppPageContext: LoanAppPageContext, private applicationData: any) {
            this.isBorrower = !this.loanAppPageContext.isCoBorrowerState;
            this.borrower = !this.isBorrower ? this.loan.loanApp.coBorrower : this.loan.loanApp.borrower;

            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
    }

    moduleRegistration.registerController(consumersite.moduleName, GovernmentMonitoringController);
} 