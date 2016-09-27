/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class AlertPreferencesController {

        public controllerAsName: string = "alertPrefCntrl";
        static className = "alertPreferencesController";

        //public static $inject = ['wrappedLoan'];
        public static $inject = ['loan', 'loanAppPageContext'];

        _alertEmails: string[];
        _alertMobiles: string[];
        _enableEmailAlerts: boolean;
        _enableMobileAlerts: boolean;

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        //constructor(wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>) {
       

        constructor(public loan: vm.Loan, private loanAppPageContext: LoanAppPageContext) {
            if (!angular.isDefined(this._alertEmails)) {
                this._alertEmails = [];
            }
            if (!angular.isDefined(this._alertMobiles)) {
                this._alertMobiles = [];
            }
                this._alertEmails.push("test1@abc.com");
                this._alertEmails.push("test2@abc.com");
                this._alertEmails.push("test3@abc.com");
           
            
          
                this._alertMobiles.push("800-555-1212");
                this._alertMobiles.push("800-555-1213");
                this._alertMobiles.push("800-555-1214");
           

            this._enableEmailAlerts = true;
            this._enableMobileAlerts = true;

            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        

        get enableEmailAlerts(): boolean {
            return this._enableEmailAlerts;
        }
        set enableEmailAlerts(value: boolean ){
            this._enableEmailAlerts=value;
        }
        public get alertEmails(): string[] {
            return this._alertEmails
        }
        public set alertEmails(value: string[]) {
            this._alertEmails = value;
        }

        
        get enableMobileAlerts(): boolean {
            return this._enableMobileAlerts;
        }
        set enableMobileAlerts(value: boolean) {
            this._enableMobileAlerts = value;
        }
        public get alertMobiles(): string[] {
            return this._alertMobiles
        }
        public set alertMobiles(value: string[]) {
            this._alertMobiles = value;
        }

    }
    moduleRegistration.registerController(consumersite.moduleName, AlertPreferencesController);
} 