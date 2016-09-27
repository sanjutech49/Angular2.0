/// <reference path="../viewModels/loan.viewModel.ts" />
/// <reference path="../../common/credit/creditext.service.ts" />
var consumersite;
(function (consumersite) {
    var ConsumerLoanService = (function () {
        function ConsumerLoanService($resource, apiRoot, $log, creditSvcExt) {
            var _this = this;
            this.$resource = $resource;
            this.apiRoot = apiRoot;
            this.$log = $log;
            this.creditSvcExt = creditSvcExt;
            this.counter = 0;
            this.loadLoan = function (loanId, happyPath, unHappyPath) {
                _this.megaLoanLoadResource.get({ loanId: loanId, userAccountId: ConsumerLoanService.userAccountId }).$promise.then(happyPath, unHappyPath);
            };
            this.loadLoanII = function (loanId) {
                return _this.megaLoanLoadResource.get({ loanId: loanId, userAccountId: ConsumerLoanService.userAccountId });
            };
            this.prepareLoanViewModelForSubmit = function (loan) {
                //
                // @todo:
                //      Refine object model usage for PropertyViewModel
                //
                // Loan
                var loanViewModel = loan.getLoan();
                var property = loanViewModel.getSubjectProperty();
                if (!!property && !property.propertyType) {
                    var propertyVm = property;
                    propertyVm.PropertyType = "1"; // @todo: USE ENUM
                }
                loanViewModel.prepareSave();
                return loanViewModel;
            };
            this.saveLoan = function (loan) {
                var rqstDx = ++ConsumerLoanService.saveRqstDx;
                if (ConsumerLoanService.isSaving) {
                    _this.$log.log("saveLoan SKIP @" + rqstDx.toString());
                    return;
                }
                else {
                    ConsumerLoanService.isSaving = true;
                    _this.$log.log("saveLoan SAVE @" + rqstDx.toString());
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
                var loanViewModel = _this.prepareLoanViewModelForSubmit(loan);
                var rslt = _this.megaLoanSaveResource.save({ userAccountId: ConsumerLoanService.userAccountId }, loanViewModel).$promise.then(function (data) { return _this.megaLoanSaveComplete(rqstDx, loan, function () { return _this.megaLoanSaveSuccess(loan, canRunCredit, data); }); }, function (err) { return _this.megaLoanSaveComplete(rqstDx, loan, function () { return _this.megaLoanSaveFail(err); }); });
            };
            this.runCreditComplete = function (loan, isSuccess, creditDataWithBorrowers, error) {
                if (isSuccess) {
                    //
                    loan.creditStatusCd = 3 /* CompletedSuccess */;
                }
                else {
                    //
                    loan.creditStatusCd = 4 /* CompletedError */;
                    //
                    // this.displayErrorMessage(this.activeLoanApplicationId);
                    _this.$log.error('RunCredit Fail');
                }
            };
            this.megaLoanSaveResource = this.$resource(this.apiRoot + "LoanEx/" + "MegaSave", { viewModel: '@viewModel', userAccountId: '@userAccountId' });
            this.megaLoanLoadResource = this.$resource(this.apiRoot + "loan/");
        }
        ConsumerLoanService.prototype.megaLoanSaveComplete = function (saveRqstDx, loan, cb) {
            ConsumerLoanService.isSaving = false;
            try {
                cb();
            }
            catch (e) {
                this.$log.error(e.toString());
            }
            //
            // submit next request if exists
            //
            if (saveRqstDx < ConsumerLoanService.saveRqstDx) {
                // it is OK to pass in same [loan] , it is reference to the same one
                this.saveLoan(loan);
            }
        };
        ConsumerLoanService.prototype.megaLoanSaveSuccess = function (loan, canRunCredit, data) {
            //
            this.$log.log('loan saved successfully');
            //
            // run credit every time , it will check
            //
            this.runCredit(loan, canRunCredit);
        };
        ConsumerLoanService.prototype.megaLoanSaveFail = function (err) {
            this.$log.error('loan failed to save');
        };
        ConsumerLoanService.prototype.runCredit = function (loan, canRunCredit) {
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
        };
        ConsumerLoanService.prototype.runCreditImpl = function (loan) {
            var _this = this;
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
            this.creditSvcExt.runCredit(rqst, loan.getLoan(), function () { return _this.runCreditShouldCancel(loan, cp); }, function (data) { return _this.runCreditComplete(loan, true, data); }, function (err) { return _this.runCreditComplete(loan, false, err); });
            //
            loan.creditStatusCd = 2 /* InProgress */;
        };
        ConsumerLoanService.prototype.runCreditShouldCancel = function (loan, cp) {
            cp.increment();
            var shouldCancel = cp.hasTimedOut();
            return shouldCancel;
        };
        ConsumerLoanService.userAccountId = 82313; /*@todo:userAccountId for Consumer Site*/
        ConsumerLoanService.$inject = ['$resource', 'apiRoot', '$log', 'CreditSvcExt'];
        ConsumerLoanService.className = 'consumerLoanService';
        /**
        * @todo-cc:
        *       Refactor for proper "Post Processing" notion that this should be , function names in particular
        *       Pre-Save state tuple should be implemented (remove credit specific flags)
        *       Save processing pipeline in API required , current implementation is not perfectly thread-safe , but is working fine in practical sense
        *
        */
        ConsumerLoanService.saveRqstDx = 0;
        ConsumerLoanService.isSaving = false;
        return ConsumerLoanService;
    })();
    consumersite.ConsumerLoanService = ConsumerLoanService;
    moduleRegistration.registerService(consumersite.moduleName, ConsumerLoanService);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=loan.service.js.map