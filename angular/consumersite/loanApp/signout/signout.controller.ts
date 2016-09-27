/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class SignoutController {

        public controllerAsName: string = "signoutCntrl";
        phone: string;
        static className = "signoutController";

        public static $inject = ['loan', 'loanAppPageContext'];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(public loan: vm.Loan, private loanAppPageContext: LoanAppPageContext) {
            this.phone = "(800)-555-1212";

            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }

    }
    moduleRegistration.registerController(consumersite.moduleName, SignoutController);
} 