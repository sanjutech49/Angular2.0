/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class AccountController {
        
        static className = "accountController";

        static $inject = ['loan', 'loanAppPageContext', 'applicationData'];

        private passwordOne: string;
        private passwordTwo: string;

        constructor(public loan: vm.Loan, private loanAppPageContext: LoanAppPageContext, private applicationData: any) {

            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }

        showPassword = () => {
            console.log("1 ::: " + this.passwordOne);
            console.log("2 ::: " + this.passwordTwo);
        }

    }
    moduleRegistration.registerController(consumersite.moduleName, AccountController);
} 