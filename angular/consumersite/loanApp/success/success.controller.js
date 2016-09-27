/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
var consumersite;
(function (consumersite) {
    var SuccessController = (function () {
        function SuccessController(loan, loanAppPageContext) {
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.controllerAsName = "successCntrl";
            this.IncomeTypeSelected = 1;
            this.BelongsToVals = [
                { id: 1, name: 'Borrower' },
                { id: 2, name: 'CoBorrower' }
            ];
            this.BelongsToSelected = 1;
            this.IncomeTypeVals = [
                { id: 1, name: 'Social Security' },
                { id: 2, name: 'Alimony' },
                { id: 3, name: 'Child Support' },
                { id: 4, name: 'Other' }
            ];
            this.Scores = [
                { ScoreName: 'Experian', BorrowerScore: 755, CoBorrowerScore: 700 },
                { ScoreName: 'Equifax', BorrowerScore: 590, CoBorrowerScore: 500 },
                { ScoreName: 'TransUnion', BorrowerScore: 726, CoBorrowerScore: 350 }
            ];
            this._borrower = this.loan.loanApp.borrower;
            this._coBorrower = this.loan.loanApp.coBorrower;
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        Object.defineProperty(SuccessController.prototype, "BorrowerFullName", {
            get: function () {
                return this._borrower.fullName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SuccessController.prototype, "BorrowerFICOScores", {
            get: function () {
                var ficoScores = this.loan.loanApp.borrower.ficoScore;
                return ficoScores;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SuccessController.prototype, "CoBorrowerFullName", {
            get: function () {
                return this._coBorrower.fullName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SuccessController.prototype, "CoBorrowerFICOScores", {
            get: function () {
                var ficoScores = this.loan.loanApp.coBorrower.ficoScore;
                return ficoScores;
            },
            enumerable: true,
            configurable: true
        });
        SuccessController.className = "successController";
        SuccessController.$inject = ['loan', 'loanAppPageContext'];
        return SuccessController;
    })();
    consumersite.SuccessController = SuccessController;
    moduleRegistration.registerController(consumersite.moduleName, SuccessController);
})(consumersite || (consumersite = {}));
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
//# sourceMappingURL=success.controller.js.map