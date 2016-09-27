/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../ts/extendedViewModels/extendedViewModels.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var credit;
(function (credit) {
    var CreditPoll = (function () {
        function CreditPoll(interval, timeout) {
            var _this = this;
            this.interval = interval;
            this.timeout = timeout;
            this._counter = 0;
            this.increment = function () {
                _this._counter++;
            };
            this.hasTimedOut = function () {
                var b = (_this.counter * _this.interval) > _this.timeout;
                return b;
            };
        }
        Object.defineProperty(CreditPoll.prototype, "counter", {
            get: function () {
                return this._counter;
            },
            set: function (counter) {
                /*Read Only*/
            },
            enumerable: true,
            configurable: true
        });
        //
        // @todo-cc: get app data for credit polling timeOut
        //var timeOut = 180;
        //
        // if (this.counter * 5 > timeOut && this.wrappedLoan.ref.active.isCreditRunning == true) {
        CreditPoll.CreditPollDefaults = function () {
            // @todo-cc: get app data for credit polling timeOut
            return new CreditPoll(5, 180);
        };
        return CreditPoll;
    })();
    credit.CreditPoll = CreditPoll;
    var CreditSvcRqst = (function () {
        function CreditSvcRqst(loanApplicationId, userAccountId) {
            this.loanApplicationId = loanApplicationId;
            this.userAccountId = userAccountId;
        }
        return CreditSvcRqst;
    })();
    credit.CreditSvcRqst = CreditSvcRqst;
    var RunCreditRqst = (function (_super) {
        __extends(RunCreditRqst, _super);
        function RunCreditRqst(loanApplicationId, userAccountId, isReRunReport, paidOffFreeAndClear, borrowerId) {
            _super.call(this, loanApplicationId, userAccountId);
            this.isReRunReport = isReRunReport;
            this.paidOffFreeAndClear = paidOffFreeAndClear;
            this.borrowerId = borrowerId;
            this.borrowerId = this.borrowerId || lib.getEmptyGuid();
        }
        return RunCreditRqst;
    })(CreditSvcRqst);
    credit.RunCreditRqst = RunCreditRqst;
    var GetCreditStatusRqst = (function (_super) {
        __extends(GetCreditStatusRqst, _super);
        function GetCreditStatusRqst(runCreditRqst) {
            _super.call(this, runCreditRqst.loanApplicationId, runCreditRqst.userAccountId);
        }
        return GetCreditStatusRqst;
    })(CreditSvcRqst);
    credit.GetCreditStatusRqst = GetCreditStatusRqst;
    var CreditSvcExt = (function () {
        /* @end CreditSvc */
        function CreditSvcExt($resource, apiRoot, $interval, enums, creditSvc) {
            var _this = this;
            this.$resource = $resource;
            this.$interval = $interval;
            this.enums = enums;
            this.creditSvc = creditSvc;
            /**
            * @todo-cc: API is less than ideal , consolodate request , cls.LoanViewModel , consumerSite.vm.Loan , etc.
            */
            this.runCredit = function (rqst, clsLoanViewModel, shouldCancel, success, failure) {
                _this.creditSvc.CreditServices.RunCredit(rqst).$promise.then(function (creditViewModel) {
                    if (!creditViewModel.creditDataAvailable) {
                        var rqstStatus = new GetCreditStatusRqst(rqst);
                        var timer = _this.$interval(function () {
                            // @hack to manage userAccountId/accountId
                            var rqstStatus2 = { loanApplicationId: rqstStatus.loanApplicationId, accountId: rqstStatus.userAccountId };
                            _this.creditSvc.CreditServices.GetCreditStatus(rqstStatus2).$promise.then(function (creditDataWithBorrowers) {
                                if (creditDataWithBorrowers.creditViewModel.creditDataAvailable) {
                                    _this.$interval.cancel(timer);
                                    _this.runCreditSuccess(clsLoanViewModel, rqst.loanApplicationId, creditDataWithBorrowers, success);
                                }
                                else if (shouldCancel()) {
                                    _this.$interval.cancel(timer);
                                }
                            }, function (error) {
                                _this.$interval.cancel(timer);
                                _this.runCreditErr(error, failure);
                            });
                        }, 5000);
                    }
                    else {
                        _this.runCreditErr(null, failure);
                    }
                }, function (error) { return _this.runCreditErr(error, failure); });
            };
            this.runCreditSuccess = function (loan, loanApplicationId, creditDataWithBorrowers, success) {
                //
                _this.updateCredit(loan, creditDataWithBorrowers, loanApplicationId);
                //
                success(creditDataWithBorrowers);
            };
            this.runCreditErr = function (error, failure) {
                //
                // @todo: internal housekeeping ?
                //
                failure(error);
            };
            this.updateCredit = function (loan, creditDataWithBorrowers, loanApplicationId) {
                // var loan = <cls.LoanViewModel>this.wrappedLoan.ref;
                loan.financialInfo.ficoScore = creditDataWithBorrowers.loanDecisionScore;
                var loanApplication = loan.getLoanApplication(loanApplicationId);
                if (loanApplication) {
                    loanApplication.isCreditRunning = false;
                    loanApplication.credit = new cls.CreditViewModel(creditDataWithBorrowers.creditViewModel);
                    loanApplication.credit.creditReportMessageVisible = _this.getCreditReportMessageVisiblity(creditDataWithBorrowers.creditViewModel);
                    _this.updatedBorrower(loan, creditDataWithBorrowers.borrower, loanApplication.getBorrower());
                    if (loanApplication.isSpouseOnTheLoan) {
                        _this.updatedBorrower(loan, creditDataWithBorrowers.coBorrower, loanApplication.getCoBorrower());
                    }
                }
            };
            // @todo-cl::BOROWER-ADDRESS ; @see [BorrowerWithCreditViewModel]
            this.updatedBorrower = function (loan, updatedBorrower, existingBorrower) {
                existingBorrower.ficoScore = updatedBorrower.ficoScore;
                // @todo-cc: Implement Map::Remvove() function
                existingBorrower.getLiabilities().forEach(function (o) {
                    o.isRemoved = true;
                });
                updatedBorrower.liabilities.forEach(function (liability) {
                    if (liability.isPledged && liability.property && liability.property.isSubjectProperty) {
                        liability.borrowerDebtCommentId = 2 /* PayoffAtClose */;
                    }
                    existingBorrower.addLiability(new cls.LiabilityViewModel(loan.getTransactionInfoRef(), liability, updatedBorrower.fullName));
                });
                try {
                    existingBorrower.publicRecords = lib.createClassArray(cls.PublicRecordViewModel, updatedBorrower.publicRecords);
                }
                catch (e) {
                }
            };
            this.getCreditReportMessageVisiblity = function (creditViewModel) {
                return creditViewModel.creditStatus != _this.enums.creditReportStatus.retrieving && creditViewModel.creditReportMessage != null && creditViewModel.creditReportMessage != "" && creditViewModel.creditStatus != _this.enums.creditReportStatus.undefined;
            };
        }
        CreditSvcExt.className = 'CreditSvcExt';
        CreditSvcExt.$inject = ['$resource', 'apiRoot', '$interval', 'enums', 'CreditSvc'];
        return CreditSvcExt;
    })();
    credit.CreditSvcExt = CreditSvcExt;
    /* @todo: Create Credit Module */
    angular.module('util').service(CreditSvcExt.className, CreditSvcExt);
})(credit || (credit = {}));
//# sourceMappingURL=creditext.service.js.map