/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class OtherIncomeController {

        private otherIncomeActive: vm.OtherIncome;
        private ownerTypeLookup: vm.ILookupEntry<srv.OwnerTypeEnum>[];

        static className = "otherIncomeController";

        public static $inject = ['loan', 'loanAppPageContext', 'applicationData'];

        constructor(public loan: vm.Loan, private loanAppPageContext: LoanAppPageContext, private applicationData: any) {
            this.populateOwnerTypeLookup();

            //Other Income array is empty, add one for the user to begin the page.
            if (this.loan.loanApp.otherIncomes.length == 0) {
                this.addOtherIncome();
            }
            else { // select the last one
                this.otherIncomeActive = this.loan.loanApp.otherIncomes[this.loan.loanApp.otherIncomes.length - 1];
            }

            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }

        addOtherIncome = (): void => {
            this.otherIncomeActive = this.loan.loanApp.addOtherIncome();
        }

        populateOwnerTypeLookup = () => {
            this.ownerTypeLookup = [];

            this.ownerTypeLookup.push({ value: srv.OwnerTypeEnum.Borrower, text: this.loan.loanApp.borrower.fullName });

            if (this.loan.loanApp.hasCoBorrower) {
                this.ownerTypeLookup.push({ value: srv.OwnerTypeEnum.CoBorrower, text: this.loan.loanApp.coBorrower.fullName });
            }

            this.ownerTypeLookup.push({ value: srv.OwnerTypeEnum.Joint, text: "Joint" });
        }

        getOwnerTypeLookups = (): ng.IPromise<vm.ILookupEntry<srv.OwnerTypeEnum>[]> | vm.ILookupEntry<srv.OwnerTypeEnum>[] => {
            return this.ownerTypeLookup;
        }

    }
    moduleRegistration.registerController(moduleName, OtherIncomeController);
}


   