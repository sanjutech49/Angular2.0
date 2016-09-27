/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class CreditController {
        
        public controllerAsName: string = "creditCntrl";
        static className = "creditController";
        public static $inject = ['loan', 'loanAppPageContext'];

        private _isBorrower: boolean;
        private _borrower: vm.Borrower;
        private _coBorrower: vm.Borrower;
        private _authorizeCreditReport: boolean;
        
        constructor(public loan: vm.Loan, private loanAppPageContext: LoanAppPageContext) {
            this._isBorrower = !this.loanAppPageContext.isCoBorrowerState;
            this._borrower =  this.loan.loanApp.borrower;
            this._coBorrower = this.loan.loanApp.coBorrower;

            //Scroll so just the loanAppNavbarIsVisible
            //loanAppPageContext.scrollToTop();
        }

        printMe = () => {
            console.log(this._borrower.dateOfBirth);
        }

        hasCoBorrower = () => {
            return this.loan.loanApp.hasCoBorrower;
        }

        public get BorrowerFullName(): string {
            return this._borrower.fullName;
        }

        public get BorrowerSSN(): string {
            return this._borrower.ssn;
        }

        public set BorrowerSSN(value: string) {
            this._borrower.ssn=value;
        }

        public get SSNValidation(): string {            
            if (this._borrower.ssn !== this._coBorrower.ssn)
                return 'invalid mismatch';
            else
                return '';
        }

        public get BorrowerDOB(): string {
            return this._borrower.dateOfBirth;
        }

        public set BorrowerDOB(value: string) {
            this._borrower.dateOfBirth = value;
        }

        public get Borrower(): vm.Borrower {
            return this._borrower;
        }

        public set Borrower(value: vm.Borrower) {
            this._borrower = value;
        }

        public get CoBorrowerFullName(): string {
            return this._coBorrower.fullName;
        }

        public get CoBorrowerSSN(): string {
            return this._coBorrower.ssn;
        }

        public set CoBorrowerSSN(value: string) {
            this._coBorrower.ssn = value;
        }

        public get CoBorrowerDOB(): string {
            return this._coBorrower.dateOfBirth;
        }

        public set CoBorrowerDOB(value: string) {
            this._coBorrower.dateOfBirth = value;
        }

        public get CoBorrower(): vm.Borrower {
            return this._coBorrower;
        }

        public set CoBorrower(value: vm.Borrower) {
            this._coBorrower = value;
        }
        
        public get AuthorizeCreditReport(): boolean {
            return this._authorizeCreditReport;
        }

        public set AuthorizeCreditReport(value: boolean) {
            this._authorizeCreditReport = value;
        }
    }
    moduleRegistration.registerController(consumersite.moduleName, CreditController);
} 