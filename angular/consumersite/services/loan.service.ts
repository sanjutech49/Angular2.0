/// <reference path="../viewModels/loan.viewModel.ts" />
/// <reference path="../../common/credit/creditext.service.ts" />
 
module consumersite {

    export class ConsumerLoanService {

        private megaLoanLoadResource: ng.resource.IResourceClass<ng.resource.IResource<any>>;
        private megaLoanSaveResource: ng.resource.IResourceClass<ng.resource.IResource<any>>;
        private static userAccountId = 82313/*dev@meandmyloan.com*/; /*@todo:userAccountId for Consumer Site*/

        static $inject = ['$resource', 'apiRoot', '$log', 'CreditSvcExt'];
        static className = 'consumerLoanService';
        counter = 0;

        constructor(private $resource: ng.resource.IResourceService, private apiRoot: string, private $log: ng.ILogService, private creditSvcExt: credit.CreditSvcExt) {
            this.megaLoanSaveResource = this.$resource(this.apiRoot + "LoanEx/" + "MegaSave", { viewModel: '@viewModel', userAccountId: '@userAccountId' });
            this.megaLoanLoadResource = this.$resource(this.apiRoot + "loan/");
        }

        loadLoan = (loanId: string, happyPath: (loan) => void, unHappyPath:(err) => void) => {
            this.megaLoanLoadResource.get({ loanId: loanId, userAccountId: ConsumerLoanService.userAccountId }).$promise.then(happyPath, unHappyPath);
        }

        loadLoanII = (loanId: string): any => {
            return this.megaLoanLoadResource.get({ loanId: loanId, userAccountId: ConsumerLoanService.userAccountId });
        }

        prepareLoanViewModelForSubmit = (loan: vm.Loan) => {
            //
            // @todo:
            //      Refine object model usage for PropertyViewModel
            //

            // Loan
            var loanViewModel = loan.getLoan();
            var property = loanViewModel.getSubjectProperty();
            if (!!property && !property.propertyType) {
                var propertyVm = <cls.PropertyViewModel>property;
                propertyVm.PropertyType = "1"/*SingleFamily*/; // @todo: USE ENUM
            }
            loanViewModel.prepareSave();

            return loanViewModel;
        }

        /**
        * @todo-cc:
        *       Refactor for proper "Post Processing" notion that this should be , function names in particular
        *       Pre-Save state tuple should be implemented (remove credit specific flags)
        *       Save processing pipeline in API required , current implementation is not perfectly thread-safe , but is working fine in practical sense
        *
        */

        private static saveRqstDx = 0;
        
        private static isSaving = false;

        saveLoan = (loan: vm.Loan) => {
            
            var rqstDx = ++ConsumerLoanService.saveRqstDx;

            if (ConsumerLoanService.isSaving) {
                this.$log.log("saveLoan SKIP @"+rqstDx.toString());
                return;
            }
            else {
                ConsumerLoanService.isSaving = true;
                this.$log.log("saveLoan SAVE @" + rqstDx.toString());
            }

            //
            // In LC: 
            //
            // [wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>]
            // var megaLoanSave = $resource(ApiRoot + "LoanEx/" + 'MegaSave', { viewModel: '@viewModel', userAccountId: '@userAccountId' });
            // return megaLoanSave.save({ userAccountId: userAccountId }, wrappedLoan.ref).$promise.then(happyPath, unhappyPath);
            //

            //
            // @todo-cc: Pre-Save state tuple should be implemented (remove credit specific flags)
            var canRunCredit = loan.canRunCredit();

            //
            var loanViewModel = this.prepareLoanViewModelForSubmit(loan);
            var rslt = this.megaLoanSaveResource.save({ userAccountId: ConsumerLoanService.userAccountId }, loanViewModel).$promise.then(
                (data) => this.megaLoanSaveComplete(rqstDx, loan, () => this.megaLoanSaveSuccess(loan, canRunCredit, data)),
                (err) => this.megaLoanSaveComplete(rqstDx, loan, () => this.megaLoanSaveFail(err))
            );
        }

        private megaLoanSaveComplete(saveRqstDx: number, loan: vm.Loan, cb: () => void) {
            ConsumerLoanService.isSaving = false;

            try {
                cb();
            }
            catch (e) {
                this.$log.error(e.toString())
            }

            //
            // submit next request if exists
            //
            if (saveRqstDx < ConsumerLoanService.saveRqstDx) {
                // it is OK to pass in same [loan] , it is reference to the same one
                this.saveLoan(loan);
            }
        }

        private megaLoanSaveSuccess(loan: vm.Loan, canRunCredit: boolean, data: any) {
            //
            this.$log.log('loan saved successfully');

            //
            // run credit every time , it will check
            //
            this.runCredit(loan, canRunCredit);
        }

        private megaLoanSaveFail(err?: any) {
            this.$log.error('loan failed to save')
        }

        private runCredit(loan: vm.Loan, canRunCredit: boolean): void {
            // Run only if we have enough data
            if (!canRunCredit) {
                return;
            }

            // Run only once
            if (loan.isCreditInitiated()) {
                return;
            }

            //
            this.runCreditImpl(loan);
        }

        private runCreditImpl(loan: vm.Loan): void {
            // setup
            var loanApp = loan.getLoan().getLoanApplications()[0];
            var loanApplicationId = loanApp.loanApplicationId;
            var borrowerId = null; // For Remove Borrower/CoBorrower , not used on consumer site
            var userAccountId = ConsumerLoanService.userAccountId; // @todo: this.applicationData.currentUserId;
            var isReRunReport = false; // not used on consumer site ; (@see !!loan.getLoan().getLoanApplications()[0].credit.creditFileStoreItemId)
            var paidOffFreeAndClear = false; // not clear if this is useful on consumer site
            var rqst = new credit.RunCreditRqst(loanApplicationId, userAccountId.toString(), isReRunReport, paidOffFreeAndClear, borrowerId);

            //
            var cp = credit.CreditPoll.CreditPollDefaults(); 
            this.creditSvcExt.runCredit(rqst, loan.getLoan(), () => this.runCreditShouldCancel(loan, cp), (data) => this.runCreditComplete(loan, true, data), (err) => this.runCreditComplete(loan, false, err));

            //
            loan.creditStatusCd = vm.CreditStatusEnum.InProgress;
        }

        private runCreditShouldCancel(loan: vm.Loan, cp: credit.CreditPoll): boolean {
            cp.increment();
            var shouldCancel = cp.hasTimedOut();
            return shouldCancel;
        }

        private runCreditComplete = (loan: vm.Loan, isSuccess: boolean, creditDataWithBorrowers: any, error?: any) => {
            if (isSuccess) {
                //
                loan.creditStatusCd = vm.CreditStatusEnum.CompletedSuccess;

                //
                // this.updateCredit(creditDataWithBorrowers, this.activeLoanApplicationId);
            }
            else {
                //
                loan.creditStatusCd = vm.CreditStatusEnum.CompletedError;

                //
                // this.displayErrorMessage(this.activeLoanApplicationId);
                this.$log.error('RunCredit Fail');
            }
        }

    }
    moduleRegistration.registerService(consumersite.moduleName, ConsumerLoanService);
}