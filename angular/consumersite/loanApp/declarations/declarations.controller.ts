/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />


module consumersite {

    export class DeclarationsController {

        static className = "declarationsController";

        static $inject = ['loan', 'loanAppPageContext', 'applicationData'];

        constructor(public loan: vm.Loan, private loanAppPageContext: LoanAppPageContext, private applicationData: any) {

            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
    }
    moduleRegistration.registerController(consumersite.moduleName, DeclarationsController);
} 