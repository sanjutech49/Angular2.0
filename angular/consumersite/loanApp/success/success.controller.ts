/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />

module consumersite {

    export class SuccessController {

        public controllerAsName: string = "successCntrl";

        static className = "successController";

        public static $inject = ['loan', 'loanAppPageContext'];

        private _borrower: vm.Borrower;

        private _coBorrower: vm.Borrower;

        public IncomeTypeSelected: number = 1;

        constructor(private loan: vm.Loan, private loanAppPageContext: LoanAppPageContext) {
            this._borrower = this.loan.loanApp.borrower;
            this._coBorrower = this.loan.loanApp.coBorrower;

            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }

        public get BorrowerFullName(): string {
            return this._borrower.fullName;
        }

        public get BorrowerFICOScores(): srv.IFicoScoreViewModel {
            var ficoScores = this.loan.loanApp.borrower.ficoScore;
            return ficoScores;
        }        

        public get CoBorrowerFullName(): string {
            return this._coBorrower.fullName;
        }

        public get CoBorrowerFICOScores(): srv.IFicoScoreViewModel {
            var ficoScores = this.loan.loanApp.coBorrower.ficoScore;
            return ficoScores;
        } 

        public BelongsToVals = [
            { id: 1, name: 'Borrower' },
            { id: 2, name: 'CoBorrower' }
        ];
        public BelongsToSelected: number = 1;

        public IncomeTypeVals = [
            { id: 1, name: 'Social Security' },
            { id: 2, name: 'Alimony' },
            { id: 3, name: 'Child Support' },
            { id: 4, name: 'Other' }
        ];

        public Scores = [
            { ScoreName: 'Experian', BorrowerScore: 755, CoBorrowerScore: 700 },
            { ScoreName: 'Equifax', BorrowerScore: 590, CoBorrowerScore: 500 },
            { ScoreName: 'TransUnion', BorrowerScore: 726, CoBorrowerScore: 350 }
        ] ;

        
    }
    moduleRegistration.registerController(moduleName, SuccessController);
}








//module consumersite {

//    export class SuccessController  {

//        static className = "successController";
//        public static $inject = ['loan', 'loanAppPageContext'];

//        borrower: vm.Borrower;
//        isBorrower: boolean;
//        employmentType: string;
//        isCurrentEmployer: boolean;

//        public Scores = [
//            { ScoreName: 'Experian', BorrowerScore: 755, CoBorrowerScore: 700 },
//            { ScoreName: 'Equifax', BorrowerScore: 590, CoBorrowerScore: 500 },
//            { ScoreName: 'TransUnion', BorrowerScore: 726, CoBorrowerScore: 350 }
//        ] ;

//        //public ScoreNames = ['Experian', 'Equifax', 'TransUnion'];

//        //public borrowerScores = [            
//        //        755,
//        //        590,
//        //        726            
//        //];
//        //public coBorrowerScores = [ 700, 500,350 ];

//        //constructor(public loan: vm.Loan, private loanAppPageContext: LoanAppPageContext) {
//        //    this.isBorrower = !this.loanAppPageContext.isCoBorrowerState;
//        //    this.borrower = !this.isBorrower ? this.loan.loanApp.coBorrower : this.loan.loanApp.borrower;
           
         
//        //}



//        //get hasCoBorrower() {
//        //    return this.loan.loanApp.hasCoBorrower;
//        //}
//        //set hasCoBorrower(hasCoBorrower: boolean) {
//        //    this.loan.loanApp.hasCoBorrower = hasCoBorrower;
//        //}

//    }
//    moduleRegistration.registerController(consumersite.moduleName, SuccessController);
//}    