/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class CreditResultsController {

        public controllerAsName: string = "creditResultsCntrl";

        static className = "creditResultsController";

        public static $inject = ['loan', 'loanAppPageContext', 'applicationData'];

        private _borrower: vm.Borrower;

        private _isPropertyFreeAndClear: boolean;

        constructor(private loan: vm.Loan, private loanAppPageContext: LoanAppPageContext, private applicationData: any) {
            this._borrower = this.loan.loanApp.borrower;
            this._isPropertyFreeAndClear = false;
            //this.subjectProperty.propertyTaxExpense.monthlyAmount

            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }

        public get isCreditDataAvailable(): boolean {   
            return (!!this.loan.loanApp.borrower.ficoScore && (this.loan.loanApp.borrower.ficoScore.equifax > 0 ||
                this.loan.loanApp.borrower.ficoScore.experian > 0 ||
                this.loan.loanApp.borrower.ficoScore.transunion > 0));
        }
        public set isCreditDataAvailable(isCreditDataAvailable: boolean) {
            /*Read-Only*/
        }

        public get subjectProperty(): srv.IPropertyViewModel {
            return this.loan.getLoan().getSubjectProperty();
        }

        public get sortOrder(): string {            
            return "-amount";
        }

        public get borrowerLiens(): srv.ILiabilityViewModel[] {            
            //
            //Mock data
            //if (!this._pledgedLiabilities || this._pledgedLiabilities.length == 0) {
            //    this._pledgedLiabilities = this.getMockLiabilityViewModels();
            //}
            return this.loan.loanApp.borrower.reos;
        }

        public set borrowerLiens(borrowerLiens: srv.ILiabilityViewModel[]) {
            /*Read Only*/
        }

        public checkLienPosition = (liability: srv.ILiabilityViewModel): void => {
            if (!liability.lienPosition || liability.lienPosition == 0)
                return;
            angular.forEach(this.borrowerLiens, function (value, key) {
                if (value.liabilityInfoId !== liability.liabilityInfoId && value.lienPosition === liability.lienPosition)
                    liability.lienPosition = 0;
            });
        }

        public get isPropertyFreeAndClear(): boolean {
            if (!this.loan.isCreditInitiated)
                return false;
            else if (this.loan.isCreditSuccessful)
                return !(lib.findFirst(this.borrowerLiens, b => b.isAllocatedSubjProp));
            else if (this.isCreditDataAvailable) {
                if (this.borrowerLiens.length == 0) {
                    return true;
                }
            }
            else
                return false;           
        }

        public set isPropertyFreeAndClear(value: boolean) {
            if (value && !!this.isCreditDataAvailable) {
                angular.forEach(this.borrowerLiens, function (value, key) {
                    if (!!value.propertyId) {
                        value.lienPosition = null;
                        value.propertyId = null;
                    }
                });  
            }
        }

        private getMockLiabilityViewModels(): srv.cls.LiabilityViewModel[] {
            var liabilityViewModels = new Array<srv.cls.LiabilityViewModel>();

            var newLiabilityViewModel = new srv.cls.LiabilityViewModel();
            newLiabilityViewModel.identityKey = "1";
            newLiabilityViewModel.liabilityInfoId = "1";
            newLiabilityViewModel.amount = 10000;
            newLiabilityViewModel.calculatedMonthlyAmount = 100;
            newLiabilityViewModel.accountNumber = 'ABC123';
            newLiabilityViewModel.payoffLender = 'Big Bank';
            newLiabilityViewModel.propertyId = null;
            newLiabilityViewModel["subjectPropertyId"] = 'Property1';
            liabilityViewModels.push(newLiabilityViewModel);

            newLiabilityViewModel = new srv.cls.LiabilityViewModel();
            newLiabilityViewModel.identityKey = "2";
            newLiabilityViewModel.liabilityInfoId = "2";
            newLiabilityViewModel.amount = 20000;
            newLiabilityViewModel.calculatedMonthlyAmount = 200;
            newLiabilityViewModel.accountNumber = 'DEF456';
            newLiabilityViewModel.payoffLender = 'Really Big Bank';
            newLiabilityViewModel.propertyId = null;
            newLiabilityViewModel["subjectPropertyId"] = 'Property1';
            liabilityViewModels.push(newLiabilityViewModel);

            newLiabilityViewModel = new srv.cls.LiabilityViewModel();
            newLiabilityViewModel.identityKey = "3";
            newLiabilityViewModel.liabilityInfoId = "3";
            newLiabilityViewModel.amount = 30000;
            newLiabilityViewModel.calculatedMonthlyAmount = 300;
            newLiabilityViewModel.accountNumber = 'GHI789';
            newLiabilityViewModel.payoffLender = 'Super Big Bank';
            newLiabilityViewModel.propertyId = null;
            newLiabilityViewModel["subjectPropertyId"] = 'Property1';
            liabilityViewModels.push(newLiabilityViewModel);

            return liabilityViewModels;
        }

    }
    moduleRegistration.registerController(consumersite.moduleName, CreditResultsController);
} 