/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="../vacenter.service.ts" />
module va.controller {
    class GeneralInformationController {
        static $inject = ['wrappedLoan', 'loanScenarioSvc', 'applicationData'];

        listOfBorrowers: srv.ICollection<srv.IBorrowerViewModel>;

        constructor(public wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>, private loanScenarioService: any, public applicationData: any) {
            this.getListOfBorrowers();
            if (!this.wrappedLoan.ref.vaInformation.veteranInformationForId)
                this.wrappedLoan.ref.vaInformation.veteranInformationForId = wrappedLoan.ref.primary.getBorrower().borrowerId;
        }

        /*
         * @desc: Event handler for Subject Property Checkbox change
        */
        onCurrentLoanOnSubjectPropertyChange = (): void => {
            this.loanScenarioService.currentLoanOnSubjectPropertyChange(this.wrappedLoan.ref.vaInformation);
        }

        /*
         * @desc: Event handler for VA used in the past Checkbox change
        */
        onIsVaUsedInPastChange = (): void  => {
            this.loanScenarioService.isVaUsedInPastChange(this.wrappedLoan.ref.vaInformation);
        }

        /*
         * @desc: Gets list of borrowers to be used in drop down
        */
        private getListOfBorrowers = (): void => {
            this.listOfBorrowers = []
            lib.forEach(this.wrappedLoan.ref.getLoanApplications(),(item: srv.ILoanApplicationViewModel) => {
                this.listOfBorrowers.push(item.getBorrower());
                if (item.isSpouseOnTheLoan)
                    this.listOfBorrowers.push(item.getCoBorrower());
            });
        }

        /*
         *@desc Checks if current loan is purchase loan
        */
        get isPurchase(): boolean {
            return this.wrappedLoan.ref.loanPurposeType == srv.LoanPurposeTypeEnum.Purchase;
        }
    }
    angular.module('vaCenter').controller('generalInformationController', GeneralInformationController);
}