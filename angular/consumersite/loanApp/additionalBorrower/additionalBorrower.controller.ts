/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class AdditionalBorrowerController {

        static className = "additionalBorrowerController";

        static $inject = ['loan', 'loanAppPageContext', 'applicationData'];

        private _firstName: string;
        private _lastName: string;
        private _email: string;
        private _phone: string;
        private _phoneType: number;
      

        get firstName(): string {
            return this._firstName;
        }
        set firstName(firstName: string) {
            this._firstName = firstName;
        }

        
        get lastName(): string {
            return this._lastName;
        }
        set lastName(lastName: string) {
            this._lastName = lastName;
        }

        
        get email(): string {
            return this._email;
        }
        set email(email: string) {
            this._email = email;
        }

       
        get phone(): string {
            return this._phone;
        }
        set phone(phone: string) {
            this._phone = phone;
        }

        
        get phoneType(): number {
            return this._phoneType;
        }
        set phoneType(phoneType: number) {
            this._phoneType = phoneType;
        }

      

        constructor(public loan: vm.Loan, private loanAppPageContext: LoanAppPageContext, private applicationData: any) {
               

            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        
        get phoneTypeOptions(): any[] {
            return this.applicationData.lookup.phoneNumberTypes;
        }

        

     

    }
    moduleRegistration.registerController(consumersite.moduleName, AdditionalBorrowerController);
} 