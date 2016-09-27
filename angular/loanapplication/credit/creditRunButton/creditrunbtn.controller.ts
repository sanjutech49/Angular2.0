/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/generated/viewModels.ts" />
/// <reference path="../../../ts/generated/enums.ts" />
/// <reference path="../../../ts/lib/referenceWrapper.ts" />
/// <reference path="../../../ts/lib/genericUtil.ts" />
/// <reference path="../../../ts/extendedViewModels/extendedViewModels.ts" />
/// <reference path="../../../ts/extendedViewModels/loan.extendedViewModel.ts" />
/// <reference path="../../../loanevents/loanEvents.service.ts" />
/// <reference path="../../../common/credit/creditext.service.ts" />

module credit {

    /**
    * @todo
    *       consolodate with CreditSvc && CreditSvcExt
    */

    export class CallCreditController {

        static $inject = ['$scope', '$q', '$interval', 'wrappedLoan', 'CreditHelpers', 'modalPopoverFactory', 'CreditSvc', 'controllerData', '$state',
            'applicationData', 'NavigationSvc', 'BroadcastSvc', 'enums', 'loanEvent', 'CreditStateService', '$timeout', 'CreditSvcExt'];
        static className = 'runCreditController';

        //
        // runningCreditCall = false;

        //
        private _runningCreditCall = false;
        get runningCreditCall(): boolean {
            var activeApp = this.activeLoanApplication();
            if (!!activeApp) {
                this._runningCreditCall = activeApp.isCreditRunning;
            }
            return this._runningCreditCall;
        }
        set runningCreditCall(runningCreditCall: boolean) {
            var activeApp = this.activeLoanApplication();
            if (!!activeApp) {
                activeApp.isCreditRunning = runningCreditCall;
            }
            this._runningCreditCall = runningCreditCall;
        }

        runCreditButtonActions = [];

        selectedRunCreditAction;

        counter = 0;

        private activeLoanApplicationId: string;

        private activeLoanApplication = (): cls.LoanApplicationViewModel => {
            if (!!this.activeLoanApplicationId) {
                return this.wrappedLoan.ref.getLoanApplication(this.activeLoanApplicationId);
            }
            else {
                return null;
            }
        }

        constructor(private $scope, private $q, private $interval: ng.ITimeoutService, public wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, private CreditHelpers, private modalPopoverFactory,
            private CreditSvc, private controllerData, private $state, private applicationData, private NavigationSvc, private BroadcastSvc,
            private enums, private loanEvent: events.LoanEventService, private CreditStateService: credit.CreditStateService, private $timeout,
            private creditSvcExt: CreditSvcExt) {

            this.CreditStateService.updateCredit(wrappedLoan);
            this.initializeRunButton();
        }

        public saveAndCheckCreditStatus = (active: srv.ILoanApplicationViewModel, userAccountId: number, borrowerId: string, isReRun: boolean) => {
            // Loan applications cannot be deleted at this time , ergo ordinal is reliable
            var adx = this.wrappedLoan.ref.selectedAppIndex = this.wrappedLoan.ref.getLoanApplications().indexOf(active);
            this.NavigationSvc.SaveAndUpdateWrappedLoan(this.applicationData.currentUserId, this.wrappedLoan, (wrappedLoanCb) => {
                var activeCb = wrappedLoanCb.ref.getLoanApplications()[adx];
                var loanWithoutPricing: boolean = !this.wrappedLoan.ref.financialInfo.noteRate;
                var paidOffFreeAndClear: boolean = this.wrappedLoan.ref.loanPurposeType == srv.LoanPurposeTypeEnum.Refinance && !this.wrappedLoan.ref.otherInterviewData.firstMortgage && !loanWithoutPricing;

                this.activeLoanApplicationId = activeCb.loanApplicationId;
                this.CreditStateService.setBorrowerDebtAccountOwnershipTypes(activeCb);
                this.saveAndRunCreditVx(this.activeLoanApplicationId, userAccountId, paidOffFreeAndClear, borrowerId, isReRun);
            }, (error) => {
                    console.log(error);
                }, 'Saving Loan and Running Credit...');
        }

        public disableRunCreditButton = () => {
            return this.runningCreditCall || this.wrappedLoan.ref.active.credit.disableReRunCreditButton || this.wrappedLoan.ref.disableRunCreditButton();
        }

        private initializeRunButton = () => {

            this.runCreditButtonActions = this.CreditHelpers.getRunCreditItems(this.wrappedLoan.ref.active.getBorrower(), this.wrappedLoan.ref.active.getCoBorrower(), this.wrappedLoan.ref.active.isSpouseOnTheLoan);
            this.selectedRunCreditAction = this.runCreditButtonActions[0];
        }

        //// @todo-cl::BOROWER-ADDRESS ; @see [BorrowerWithCreditViewModel]
        //private updatedBorrower = (updatedBorrower: any, existingBorrower: srv.IBorrowerViewModel) => {

        //    existingBorrower.ficoScore = updatedBorrower.ficoScore;

        //    // @todo-cc: Implement Map::Remvove() function
        //    existingBorrower.getLiabilities().forEach(o => { o.isRemoved = true; });
        //    updatedBorrower.liabilities.forEach(liability => {
        //        if (liability.isPledged && liability.property && liability.property.isSubjectProperty) {
        //            liability.borrowerDebtCommentId = srv.PledgedAssetCommentTypeEnum.PayoffAtClose;
        //        }
        //        existingBorrower.addLiability(new cls.LiabilityViewModel(this.wrappedLoan.ref.getTransactionInfoRef(), liability, updatedBorrower.fullName));
        //    });

        //    existingBorrower.publicRecords = lib.createClassArray(cls.PublicRecordViewModel, updatedBorrower.publicRecords);
        //}
 
        //private getCreditReportMessageVisiblity = (creditViewModel: srv.ICreditViewModel): boolean => {

        //    return creditViewModel.creditStatus != this.enums.creditReportStatus.retrieving &&
        //        creditViewModel.creditReportMessage != null &&
        //        creditViewModel.creditReportMessage != "" &&
        //        creditViewModel.creditStatus != this.enums.creditReportStatus.undefined;
        //}

        // @todo: replace with CreditSvcExt
        private updateCredit = (creditDataWithBorrowers, loanApplicationId) => {

            var loan = <cls.LoanViewModel>this.wrappedLoan.ref;
            loan.financialInfo.ficoScore = creditDataWithBorrowers.loanDecisionScore;

            var loanApplication = loan.getLoanApplication(loanApplicationId);

            if (loanApplication) {

                loanApplication.isCreditRunning = false;

                loanApplication.credit = new cls.CreditViewModel(creditDataWithBorrowers.creditViewModel);
                loanApplication.credit.creditReportMessageVisible = this.creditSvcExt.getCreditReportMessageVisiblity(creditDataWithBorrowers.creditViewModel);

                this.creditSvcExt.updatedBorrower(this.wrappedLoan.ref, creditDataWithBorrowers.borrower, loanApplication.getBorrower());

                if (loanApplication.isSpouseOnTheLoan) {
                    this.creditSvcExt.updatedBorrower(this.wrappedLoan.ref, creditDataWithBorrowers.coBorrower, loanApplication.getCoBorrower());
                }

                // only update the credit page if the loanApplication is the active one 
                if (loanApplication == this.wrappedLoan.ref.active) {
                    this.CreditStateService.updateCredit(this.wrappedLoan);
                    this.initializeRunButton();
                    this.loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.todo, {});
                }

                //update document info for credit report, borr-coborr switch scenario
                lib.forEach(loanApplication.documents,(doc: srv.IDocumentsViewModel) => {
                    if (doc.documentCategoryId == 26) { // 26 - credit report
                        doc.documentId = creditDataWithBorrowers.creditViewModel.creditReportId;
                        doc.borrowerId = creditDataWithBorrowers.borrower.borrowerId;
                    }
                });


                this.BroadcastSvc.broadcastCotextualBar();
            }
        }

        private displayErrorMessage(loanApplicationId: string) {
            var loan = <cls.LoanViewModel>this.wrappedLoan.ref;
            var loanApplication = loan.getLoanApplication(loanApplicationId);

            if (loanApplication && this.wrappedLoan.ref && loanApplication == this.wrappedLoan.ref.active) {
                loanApplication.isCreditRunning = false;
                if (!loanApplication.credit)
                    loanApplication.credit = new cls.CreditViewModel();
                loanApplication.credit.creditReportMessage = 'We were unable to get a credit report at this time. Please try again later.';
                loanApplication.credit.creditReportMessageVisible = true;
            }
        }

        useCreditSvcExt = true;

        public saveAndRunCredit = (loanApplicationId, userAccountId, paidOffFreeAndClear, borrowerId, isReRun: boolean) => {
            if (this.useCreditSvcExt) {
                this.saveAndRunCreditEx(loanApplicationId, userAccountId, paidOffFreeAndClear, borrowerId, isReRun);
            }
            else {
                this.saveAndRunCreditVx(loanApplicationId, userAccountId, paidOffFreeAndClear, borrowerId, isReRun);
            }
        }

        public saveAndRunCreditEx = (loanApplicationId, userAccountId, paidOffFreeAndClear, borrowerId, isReRun: boolean) => {
            // setup
            this.runningCreditCall = true;
            this.counter = 1;
            var isReRunReport = !!this.wrappedLoan.ref.active.credit.creditFileStoreItemId;
            if (isReRun) {
                isReRunReport = true;
            }
            var rqst = new credit.RunCreditRqst(loanApplicationId, userAccountId, isReRunReport, paidOffFreeAndClear, borrowerId);

            // invoke
            this.creditSvcExt.runCredit(rqst, this.wrappedLoan.ref, this.runCreditShouldCancel, this.runCreditSuccess, this.runCreditFailure);
        }

        private runCreditShouldCancel = (): boolean => {

            var timeOut = 180; // @todo-cc: get app data for credit polling timeOut

            if ((this.counter * 5) > timeOut && this.runningCreditCall) {
                this.runCreditComplete(false, null, null);
                return true;
            }
            else {
                this.counter++;
                return false;
            }
        }

        private runCreditSuccess = (creditDataWithBorrowers: any) => {
            this.runCreditComplete(true, creditDataWithBorrowers);
        }

        private runCreditFailure = (error?: any) => {
            this.runCreditComplete(false, null, error);
        }

        private runCreditComplete = (isSuccess: boolean, creditDataWithBorrowers: any, error?: any) => {

            this.runningCreditCall = false;

            if (isSuccess) {
                // only update the credit page if the loanApplication is the active one 
                var loanApplication = this.activeLoanApplication();
                if (loanApplication == this.wrappedLoan.ref.active) {
                    this.CreditStateService.updateCredit(this.wrappedLoan);
                    this.initializeRunButton();
                    this.loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.todo, {});
                }

                // broadcast
                this.BroadcastSvc.broadcastCotextualBar();
            }
            else {
                this.displayErrorMessage(this.activeLoanApplicationId);
            }
        }

        public saveAndRunCreditVx = (loanApplicationId, userAccountId, paidOffFreeAndClear, borrowerId, isReRun: boolean) => {
            // @todo-cc: get app data for credit polling timeOut
            var timeOut = 180;
            this.counter = 1;
            this.runningCreditCall = true;
            var isReRunReport = !!this.wrappedLoan.ref.active.credit.creditFileStoreItemId;
            if (isReRun) {
                isReRunReport = true;
            }           

            this.CreditSvc.CreditServices.RunCredit({ loanApplicationId: loanApplicationId, userAccountId: userAccountId, isReRunReport: isReRunReport, paidOffFreeAndClear: paidOffFreeAndClear, borrowerId: borrowerId }).$promise
                .then((creditViewModel) => {
                if (!creditViewModel.creditDataAvailable) {

                    var timer = this.$interval(() => {

                        this.CreditSvc.CreditServices.GetCreditStatus({ loanApplicationId: loanApplicationId, accountId: userAccountId }).$promise
                            .then(creditDataWithBorrowers => {
                            if (creditDataWithBorrowers.creditViewModel.creditDataAvailable) {

                                this.$interval.cancel(timer);
                                this.runningCreditCall = false;
                                this.updateCredit(creditDataWithBorrowers, loanApplicationId);
                            }
                            if (this.counter * 5 > timeOut && this.wrappedLoan.ref.active.isCreditRunning == true) {
                                this.$interval.cancel(timer);
                                this.runningCreditCall = false;
                                this.displayErrorMessage(loanApplicationId);
                            }
                            this.counter++;
                        },
                            (error) => {
                                this.$interval.cancel(timer);
                                this.runningCreditCall = false;
                                this.displayErrorMessage(loanApplicationId);

                            });

                    }, 5000);
                }
                else {
                    this.runningCreditCall = false;
                    this.displayErrorMessage(loanApplicationId);
                }
            },(error) => { // error callback with reason
                    this.runningCreditCall = false;
                    this.displayErrorMessage(loanApplicationId);

                });
        }

        public setRunCreditAction = (item) => {
            this.selectedRunCreditAction = item;
            return this.selectedRunCreditAction;
        }

        public showRunCreditActionInfo = (event) => {
            var borrowerOrCoborrowerId = lib.getEmptyGuid();
            var isReRun: boolean = false;
            if (this.selectedRunCreditAction.id == 1) {
                borrowerOrCoborrowerId = this.selectedRunCreditAction.borrowerId;
                isReRun = !!this.wrappedLoan.ref.active.credit.creditFileStoreItemId;
            }
            if (this.selectedRunCreditAction.id == 2) {
                borrowerOrCoborrowerId = this.selectedRunCreditAction.coborrowerId;
                isReRun = !!this.wrappedLoan.ref.active.credit.creditFileStoreItemId;
            }

            var creditRequest = () => this.saveAndCheckCreditStatus(this.wrappedLoan.ref.active, this.applicationData.currentUserId, borrowerOrCoborrowerId, isReRun);

            if (this.selectedRunCreditAction.id == 1 || this.selectedRunCreditAction.id == 2) {

                var confirmationPopup = this.modalPopoverFactory.openModalPopover('angular/loanapplication/credit/creditrunconfirmcontrol.html', {}, this.selectedRunCreditAction, event);
                confirmationPopup.result.then(() => {

                    // if only running the borrower or coborrower, there is no more spouse on the loan
                    this.wrappedLoan.ref.active.isSpouseOnTheLoan = false;

                    // if only coBorrower is selected, switch the position of the borrower and coborrower (this will happen on save)
                    if (this.selectedRunCreditAction.id == 1) {
                        this.wrappedLoan.ref.active.switchCoBorrowerToBorrower = true;
                        this.wrappedLoan.ref.active.getBorrower().isActive = false;
                    }
                    else {
                        this.wrappedLoan.ref.active.getCoBorrower().isActive = false;
                    }

                    creditRequest();
                });
            }
            else {
                creditRequest();
            }
        }

        public getAuthorizationMessage = (): any => {
            var borrowerAndCoborrower: string;
            borrowerAndCoborrower = this.wrappedLoan.ref.active.getBorrower().fullName + (this.wrappedLoan.ref.active.isSpouseOnTheLoan ? ", " + this.wrappedLoan.ref.active.getCoBorrower().fullName : "");
            return { message: "I / We (" + borrowerAndCoborrower + ") authorize lender or its designated representatives to obtain a credit report from the national credit reporting agencies in connection with my/our home loan application." };
        }


        public runCreditClicked = (event): void => {
            if (!this.wrappedLoan.ref.active.isRunCreditAuthorized) {
                var confirmationPopup = this.modalPopoverFactory.openModalPopover('angular/loanapplication/credit/creditrunbutton/authorizationpopup.html', {}, this.getAuthorizationMessage(), event);
                confirmationPopup.result.then(() => {
                    this.wrappedLoan.ref.active.isRunCreditAuthorized = true;
                    var self = this;
                    this.$timeout(function () {
                        self.showRunCreditActionInfo(event);
                    }, 700);
                });
            }
            else {
                this.showRunCreditActionInfo(event);
            }
        }
     }

    angular.module('loanApplication').controller('runCreditController', CallCreditController);
}
