/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module srv {
    export interface IKeyValue {
        key: string;
        value: string;
    }
    export class ActivationCode implements srv.IKeyValue {
        key: string;
        value: string;
        constructor(key: string, value: string) {
            this.key = key;
            this.value = value;
        }
    }

}
module consumersite {
    export class ActivationCodeController {

        static className = "activationCodeController";
        public controllerAsName: string = "activationCodedCntrl";

        public static $inject = ['loan', 'loanAppPageContext'];

        codea: srv.ActivationCode;
       
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(public loan: vm.Loan, private loanAppPageContext: LoanAppPageContext, public codes: srv.ActivationCode[]) {
            this.codes = codes;
            if (this.codes == null)
                this.codes = [];

            this.codea = new srv.ActivationCode("(555) 555-5555", "VALUE");
            this.codes.push(this.codea);
            this.codea = new srv.ActivationCode("(555) 555-6666", "VALUE3");
            this.codes.push(this.codea);
            this.codea = new srv.ActivationCode("(555) 555-7777", "VALUE3");
            this.codes.push(this.codea);

            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();

        }

        public get Codes(): srv.ActivationCode[] {
            return this.codes;
        }
        public set Codes(value: srv.ActivationCode[]) {
            this.codes = value;
        }



    }
    moduleRegistration.registerController(consumersite.moduleName, ActivationCodeController);
} 