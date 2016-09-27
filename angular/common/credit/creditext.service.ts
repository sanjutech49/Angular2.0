/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../ts/extendedViewModels/extendedViewModels.ts" />

module credit {

    export class CreditPoll {

        //
        // @todo-cc: get app data for credit polling timeOut
        //var timeOut = 180;
        //
        // if (this.counter * 5 > timeOut && this.wrappedLoan.ref.active.isCreditRunning == true) {

        static CreditPollDefaults = (): CreditPoll => {
            // @todo-cc: get app data for credit polling timeOut
            return new CreditPoll(5, 180);
        }

        constructor(public interval: number, public timeout: number) {
        }

        private _counter = 0;
        get counter(): number {
            return this._counter;
        }
        set counter(counter: number) {
            /*Read Only*/
        }

        increment = () => {
            this._counter++;
        }

        hasTimedOut = ():boolean => {
            var b = (this.counter * this.interval) > this.timeout;
            return b;
        }
    }

    export class CreditSvcRqst {
        constructor(public loanApplicationId: string, public userAccountId: string) {
        }
    }

    export class RunCreditRqst extends CreditSvcRqst {
        constructor(loanApplicationId: string, userAccountId: string, public isReRunReport: boolean, public paidOffFreeAndClear: boolean, public borrowerId: string) {
            super(loanApplicationId, userAccountId);
            this.borrowerId = this.borrowerId || lib.getEmptyGuid();
        }
    }

    export class GetCreditStatusRqst extends CreditSvcRqst {
        constructor(runCreditRqst: RunCreditRqst) {
            super(runCreditRqst.loanApplicationId, runCreditRqst.userAccountId);
        }
    }

    export class CreditSvcExt {
        static className = 'CreditSvcExt';
        static $inject = ['$resource', 'apiRoot', '$interval', 'enums', 'CreditSvc'];

        /* @begin CreditSvc -- @todo: Create Credit Module */
        private CreditApiPath: string;
        /* @end CreditSvc */

        constructor(private $resource: any, apiRoot: string, private $interval: ng.ITimeoutService, private enums: any, private creditSvc:any) {

        }

        /**
        * @todo-cc: API is less than ideal , consolodate request , cls.LoanViewModel , consumerSite.vm.Loan , etc.
        */
        runCredit = (rqst: RunCreditRqst, clsLoanViewModel: cls.LoanViewModel, shouldCancel: () => boolean, success: (creditDataWithBorrowers: any) => void, failure: (error: any) => void) => {

            this.creditSvc.CreditServices.RunCredit(rqst).$promise.then((creditViewModel) => {
                if (!creditViewModel.creditDataAvailable) {
                    var rqstStatus = new GetCreditStatusRqst(rqst);
                    var timer = this.$interval(() => {
                        
                        // @hack to manage userAccountId/accountId
                        var rqstStatus2 = { loanApplicationId: rqstStatus.loanApplicationId, accountId: rqstStatus.userAccountId };

                        this.creditSvc.CreditServices.GetCreditStatus(rqstStatus2).$promise.then((creditDataWithBorrowers) => {
                            if (creditDataWithBorrowers.creditViewModel.creditDataAvailable) {
                                this.$interval.cancel(timer);
                                this.runCreditSuccess(clsLoanViewModel, rqst.loanApplicationId, creditDataWithBorrowers, success);
                            }
                            else if (shouldCancel()) {
                                this.$interval.cancel(timer);
                            }
                        }, (error) => {
                            this.$interval.cancel(timer);
                            this.runCreditErr(error, failure);
                        });
                    }, 5000);
                }
                else {
                    this.runCreditErr(null, failure)
                }
            }, (error) => this.runCreditErr(error, failure));
        }

        private runCreditSuccess = (loan: cls.LoanViewModel, loanApplicationId:string, creditDataWithBorrowers: any, success: (creditDataWithBorrowers: any) => void) => {
            //
            this.updateCredit(loan, creditDataWithBorrowers, loanApplicationId);

            //
            success(creditDataWithBorrowers);
        }

        private runCreditErr = (error: any, failure: (error: any) => void) => {
            //
            // @todo: internal housekeeping ?

            //
            failure(error);
        }

        public updateCredit = (loan: cls.LoanViewModel, creditDataWithBorrowers, loanApplicationId:string) => {

            // var loan = <cls.LoanViewModel>this.wrappedLoan.ref;
            loan.financialInfo.ficoScore = creditDataWithBorrowers.loanDecisionScore;

            var loanApplication = loan.getLoanApplication(loanApplicationId);

            if (loanApplication) {

                loanApplication.isCreditRunning = false;

                loanApplication.credit = new cls.CreditViewModel(creditDataWithBorrowers.creditViewModel);
                loanApplication.credit.creditReportMessageVisible = this.getCreditReportMessageVisiblity(creditDataWithBorrowers.creditViewModel);

                this.updatedBorrower(loan, creditDataWithBorrowers.borrower, loanApplication.getBorrower());

                if (loanApplication.isSpouseOnTheLoan) {
                    this.updatedBorrower(loan, creditDataWithBorrowers.coBorrower, loanApplication.getCoBorrower());
                }

                
            }
        }

        // @todo-cl::BOROWER-ADDRESS ; @see [BorrowerWithCreditViewModel]
        public updatedBorrower = (loan: cls.LoanViewModel, updatedBorrower: any, existingBorrower: srv.IBorrowerViewModel) => {

            existingBorrower.ficoScore = updatedBorrower.ficoScore;

            // @todo-cc: Implement Map::Remvove() function
            existingBorrower.getLiabilities().forEach(o => { o.isRemoved = true; });
            updatedBorrower.liabilities.forEach(liability => {
                if (liability.isPledged && liability.property && liability.property.isSubjectProperty) {
                    liability.borrowerDebtCommentId = srv.PledgedAssetCommentTypeEnum.PayoffAtClose;
                }
                existingBorrower.addLiability(new cls.LiabilityViewModel(loan.getTransactionInfoRef(), liability, updatedBorrower.fullName));
            });

            // @todo-cc: <script src="~/angular/ts/lib/genericUtil.ts"></script> NOT WORKING (Uncaught SyntaxError: Unexpected identifier) ???
            try {
                existingBorrower.publicRecords = lib.createClassArray(cls.PublicRecordViewModel, updatedBorrower.publicRecords);
            }
            catch (e) {
                // not needed in consumer site
                // this.$log.error('Missing dependency for [lib.createClassArray()] in [~/angular/ts/lib/genericUtil.ts]')
            }
        }

        public getCreditReportMessageVisiblity = (creditViewModel: srv.ICreditViewModel): boolean => {

            return creditViewModel.creditStatus != this.enums.creditReportStatus.retrieving &&
                creditViewModel.creditReportMessage != null &&
                creditViewModel.creditReportMessage != "" &&
                creditViewModel.creditStatus != this.enums.creditReportStatus.undefined;
        }
    }

    /* @todo: Create Credit Module */
    angular.module('util').service(CreditSvcExt.className, CreditSvcExt);
}
