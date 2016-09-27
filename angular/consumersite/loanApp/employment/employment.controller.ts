/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />


module consumersite {
    export class EmploymentController {
        static className = "employmentController";
        public static $inject = ['loan', 'loanAppPageContext', 'applicationData', 'navigationService'];

        borrower: vm.Borrower;

        get employmentType(): srv.EmploymentTypeEnum {
            return this.employmentActive.employmentType;
        }
        set employmentType(employmentType: srv.EmploymentTypeEnum) {
            this.employmentActive.employmentType = employmentType;
        }

        employmentActive: vm.Employment;

        //is Borrower or CoBorrower
        isBorrower: boolean;

        //is this the current employment page or previous employment page
        isCurrentEmployer: boolean;

        constructor(public loan: vm.Loan, private loanAppPageContext: LoanAppPageContext, private applicationData: any, private navigationService: consumersite.UINavigationService) {
            this.isBorrower = !this.loanAppPageContext.isCoBorrowerState;
            this.borrower = !this.isBorrower ? this.loan.loanApp.coBorrower : this.loan.loanApp.borrower;
            this.isCurrentEmployer = loanAppPageContext.loanAppNavigationState == navigation.loanAppNavigationState.borrowerEmployment ||
                loanAppPageContext.loanAppNavigationState == navigation.loanAppNavigationState.coBorrowerEmployment;

            if (this.borrower.employments.length == 0 || !this.isCurrentEmployer) {
                this.addEmploymentImpl(!this.isCurrentEmployer, false);
            }
            else { // select the last one
                this.employmentActive = this.borrower.employments[this.borrower.employments.length - 1];
            }

            if (!this.employmentType) {
                this.employmentType = srv.EmploymentTypeEnum.SalariedEmployee;
            }

            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }

        get currentStartingDate(): Date {
            return this.employmentActive.startingDate;
        }
        set currentStartingDate(startDate: Date) {
            
            this.borrower.needPreviousEmployment = this.isPreviousEmploymentRequired(startDate);
            this.employmentActive.startingDate = startDate;
        }

        private isPreviousEmploymentRequired = (startDate: Date): boolean => {
            if (this.isCurrentEmployer && this.borrower.employments.length == 1) {

                var today = moment(new Date());
                var yearsEmployed = today.diff(moment(startDate), 'years');
                return yearsEmployed < 2;
            }
            return false;
        }

       
        addEmployment = () => {
            this.addEmploymentImpl(!this.isCurrentEmployer, true);
        }

        private addEmploymentImpl = (isPrevious: boolean, isAdditional: boolean): void => {
            var edx = this.borrower.addEmployment(isPrevious, isAdditional);
            this.employmentActive = this.borrower.employments[edx - 1];
        }

        isSalaryOrSelfEmployed = (): boolean => {
            return true;
            //return (this.employmentType == srv.EmploymentTypeEnum.SalariedEmployee) || (this.employmentType == srv.EmploymentTypeEnum.SelfEmployed);
        }

        isActiveMilitaryDuty = (): boolean => {
            return this.employmentType == srv.EmploymentTypeEnum.ActiveMilitaryDuty;
        }

        isRetired = (): boolean => {
            return this.employmentType == srv.EmploymentTypeEnum.Retired;
        }

        isOtherOrUnemployed = (): boolean => {
            return this.employmentType == srv.EmploymentTypeEnum.OtherOrUnemployed;
        }
    }
    moduleRegistration.registerController(consumersite.moduleName, EmploymentController);
}   