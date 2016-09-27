/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/generated/viewModels.ts" />
/// <reference path="../../../ts/generated/enums.ts" />
/// <reference path="../../../ts/lib/referenceWrapper.ts" />
/// <reference path="../../../ts/lib/genericUtil.ts" />
/// <reference path="../../../ts/extendedViewModels/extendedViewModels.ts" />
/// <reference path="../../../ts/extendedViewModels/loan.extendedViewModel.ts" />
/// <reference path="../../../loanevents/loanEvents.service.ts" />
/// <reference path="../../../common/credit/creditext.service.ts" />
var credit;
(function (credit) {
    /**
    * @todo
    *       consolodate with CreditSvc && CreditSvcExt
    */
    var CallCreditController = (function () {
        function CallCreditController($scope, $q, $interval, wrappedLoan, CreditHelpers, modalPopoverFactory, CreditSvc, controllerData, $state, applicationData, NavigationSvc, BroadcastSvc, enums, loanEvent, CreditStateService, $timeout, creditSvcExt) {
            var _this = this;
            this.$scope = $scope;
            this.$q = $q;
            this.$interval = $interval;
            this.wrappedLoan = wrappedLoan;
            this.CreditHelpers = CreditHelpers;
            this.modalPopoverFactory = modalPopoverFactory;
            this.CreditSvc = CreditSvc;
            this.controllerData = controllerData;
            this.$state = $state;
            this.applicationData = applicationData;
            this.NavigationSvc = NavigationSvc;
            this.BroadcastSvc = BroadcastSvc;
            this.enums = enums;
            this.loanEvent = loanEvent;
            this.CreditStateService = CreditStateService;
            this.$timeout = $timeout;
            this.creditSvcExt = creditSvcExt;
            //
            // runningCreditCall = false;
            //
            this._runningCreditCall = false;
            this.runCreditButtonActions = [];
            this.counter = 0;
            this.activeLoanApplication = function () {
                if (!!_this.activeLoanApplicationId) {
                    return _this.wrappedLoan.ref.getLoanApplication(_this.activeLoanApplicationId);
                }
                else {
                    return null;
                }
            };
            this.saveAndCheckCreditStatus = function (active, userAccountId, borrowerId, isReRun) {
                // Loan applications cannot be deleted at this time , ergo ordinal is reliable
                var adx = _this.wrappedLoan.ref.selectedAppIndex = _this.wrappedLoan.ref.getLoanApplications().indexOf(active);
                _this.NavigationSvc.SaveAndUpdateWrappedLoan(_this.applicationData.currentUserId, _this.wrappedLoan, function (wrappedLoanCb) {
                    var activeCb = wrappedLoanCb.ref.getLoanApplications()[adx];
                    var loanWithoutPricing = !_this.wrappedLoan.ref.financialInfo.noteRate;
                    var paidOffFreeAndClear = _this.wrappedLoan.ref.loanPurposeType == 2 /* Refinance */ && !_this.wrappedLoan.ref.otherInterviewData.firstMortgage && !loanWithoutPricing;
                    _this.activeLoanApplicationId = activeCb.loanApplicationId;
                    _this.CreditStateService.setBorrowerDebtAccountOwnershipTypes(activeCb);
                    _this.saveAndRunCreditVx(_this.activeLoanApplicationId, userAccountId, paidOffFreeAndClear, borrowerId, isReRun);
                }, function (error) {
                    console.log(error);
                }, 'Saving Loan and Running Credit...');
            };
            this.disableRunCreditButton = function () {
                return _this.runningCreditCall || _this.wrappedLoan.ref.active.credit.disableReRunCreditButton || _this.wrappedLoan.ref.disableRunCreditButton();
            };
            this.initializeRunButton = function () {
                _this.runCreditButtonActions = _this.CreditHelpers.getRunCreditItems(_this.wrappedLoan.ref.active.getBorrower(), _this.wrappedLoan.ref.active.getCoBorrower(), _this.wrappedLoan.ref.active.isSpouseOnTheLoan);
                _this.selectedRunCreditAction = _this.runCreditButtonActions[0];
            };
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
            this.updateCredit = function (creditDataWithBorrowers, loanApplicationId) {
                var loan = _this.wrappedLoan.ref;
                loan.financialInfo.ficoScore = creditDataWithBorrowers.loanDecisionScore;
                var loanApplication = loan.getLoanApplication(loanApplicationId);
                if (loanApplication) {
                    loanApplication.isCreditRunning = false;
                    loanApplication.credit = new cls.CreditViewModel(creditDataWithBorrowers.creditViewModel);
                    loanApplication.credit.creditReportMessageVisible = _this.creditSvcExt.getCreditReportMessageVisiblity(creditDataWithBorrowers.creditViewModel);
                    _this.creditSvcExt.updatedBorrower(_this.wrappedLoan.ref, creditDataWithBorrowers.borrower, loanApplication.getBorrower());
                    if (loanApplication.isSpouseOnTheLoan) {
                        _this.creditSvcExt.updatedBorrower(_this.wrappedLoan.ref, creditDataWithBorrowers.coBorrower, loanApplication.getCoBorrower());
                    }
                    // only update the credit page if the loanApplication is the active one 
                    if (loanApplication == _this.wrappedLoan.ref.active) {
                        _this.CreditStateService.updateCredit(_this.wrappedLoan);
                        _this.initializeRunButton();
                        _this.loanEvent.broadcastPropertyChangedEvent(30 /* todo */, {});
                    }
                    //update document info for credit report, borr-coborr switch scenario
                    lib.forEach(loanApplication.documents, function (doc) {
                        if (doc.documentCategoryId == 26) {
                            doc.documentId = creditDataWithBorrowers.creditViewModel.creditReportId;
                            doc.borrowerId = creditDataWithBorrowers.borrower.borrowerId;
                        }
                    });
                    _this.BroadcastSvc.broadcastCotextualBar();
                }
            };
            this.useCreditSvcExt = true;
            this.saveAndRunCredit = function (loanApplicationId, userAccountId, paidOffFreeAndClear, borrowerId, isReRun) {
                if (_this.useCreditSvcExt) {
                    _this.saveAndRunCreditEx(loanApplicationId, userAccountId, paidOffFreeAndClear, borrowerId, isReRun);
                }
                else {
                    _this.saveAndRunCreditVx(loanApplicationId, userAccountId, paidOffFreeAndClear, borrowerId, isReRun);
                }
            };
            this.saveAndRunCreditEx = function (loanApplicationId, userAccountId, paidOffFreeAndClear, borrowerId, isReRun) {
                // setup
                _this.runningCreditCall = true;
                _this.counter = 1;
                var isReRunReport = !!_this.wrappedLoan.ref.active.credit.creditFileStoreItemId;
                if (isReRun) {
                    isReRunReport = true;
                }
                var rqst = new credit.RunCreditRqst(loanApplicationId, userAccountId, isReRunReport, paidOffFreeAndClear, borrowerId);
                // invoke
                _this.creditSvcExt.runCredit(rqst, _this.wrappedLoan.ref, _this.runCreditShouldCancel, _this.runCreditSuccess, _this.runCreditFailure);
            };
            this.runCreditShouldCancel = function () {
                var timeOut = 180; // @todo-cc: get app data for credit polling timeOut
                if ((_this.counter * 5) > timeOut && _this.runningCreditCall) {
                    _this.runCreditComplete(false, null, null);
                    return true;
                }
                else {
                    _this.counter++;
                    return false;
                }
            };
            this.runCreditSuccess = function (creditDataWithBorrowers) {
                _this.runCreditComplete(true, creditDataWithBorrowers);
            };
            this.runCreditFailure = function (error) {
                _this.runCreditComplete(false, null, error);
            };
            this.runCreditComplete = function (isSuccess, creditDataWithBorrowers, error) {
                _this.runningCreditCall = false;
                if (isSuccess) {
                    // only update the credit page if the loanApplication is the active one 
                    var loanApplication = _this.activeLoanApplication();
                    if (loanApplication == _this.wrappedLoan.ref.active) {
                        _this.CreditStateService.updateCredit(_this.wrappedLoan);
                        _this.initializeRunButton();
                        _this.loanEvent.broadcastPropertyChangedEvent(30 /* todo */, {});
                    }
                    // broadcast
                    _this.BroadcastSvc.broadcastCotextualBar();
                }
                else {
                    _this.displayErrorMessage(_this.activeLoanApplicationId);
                }
            };
            this.saveAndRunCreditVx = function (loanApplicationId, userAccountId, paidOffFreeAndClear, borrowerId, isReRun) {
                // @todo-cc: get app data for credit polling timeOut
                var timeOut = 180;
                _this.counter = 1;
                _this.runningCreditCall = true;
                var isReRunReport = !!_this.wrappedLoan.ref.active.credit.creditFileStoreItemId;
                if (isReRun) {
                    isReRunReport = true;
                }
                _this.CreditSvc.CreditServices.RunCredit({ loanApplicationId: loanApplicationId, userAccountId: userAccountId, isReRunReport: isReRunReport, paidOffFreeAndClear: paidOffFreeAndClear, borrowerId: borrowerId }).$promise.then(function (creditViewModel) {
                    if (!creditViewModel.creditDataAvailable) {
                        var timer = _this.$interval(function () {
                            _this.CreditSvc.CreditServices.GetCreditStatus({ loanApplicationId: loanApplicationId, accountId: userAccountId }).$promise.then(function (creditDataWithBorrowers) {
                                if (creditDataWithBorrowers.creditViewModel.creditDataAvailable) {
                                    _this.$interval.cancel(timer);
                                    _this.runningCreditCall = false;
                                    _this.updateCredit(creditDataWithBorrowers, loanApplicationId);
                                }
                                if (_this.counter * 5 > timeOut && _this.wrappedLoan.ref.active.isCreditRunning == true) {
                                    _this.$interval.cancel(timer);
                                    _this.runningCreditCall = false;
                                    _this.displayErrorMessage(loanApplicationId);
                                }
                                _this.counter++;
                            }, function (error) {
                                _this.$interval.cancel(timer);
                                _this.runningCreditCall = false;
                                _this.displayErrorMessage(loanApplicationId);
                            });
                        }, 5000);
                    }
                    else {
                        _this.runningCreditCall = false;
                        _this.displayErrorMessage(loanApplicationId);
                    }
                }, function (error) {
                    _this.runningCreditCall = false;
                    _this.displayErrorMessage(loanApplicationId);
                });
            };
            this.setRunCreditAction = function (item) {
                _this.selectedRunCreditAction = item;
                return _this.selectedRunCreditAction;
            };
            this.showRunCreditActionInfo = function (event) {
                var borrowerOrCoborrowerId = lib.getEmptyGuid();
                var isReRun = false;
                if (_this.selectedRunCreditAction.id == 1) {
                    borrowerOrCoborrowerId = _this.selectedRunCreditAction.borrowerId;
                    isReRun = !!_this.wrappedLoan.ref.active.credit.creditFileStoreItemId;
                }
                if (_this.selectedRunCreditAction.id == 2) {
                    borrowerOrCoborrowerId = _this.selectedRunCreditAction.coborrowerId;
                    isReRun = !!_this.wrappedLoan.ref.active.credit.creditFileStoreItemId;
                }
                var creditRequest = function () { return _this.saveAndCheckCreditStatus(_this.wrappedLoan.ref.active, _this.applicationData.currentUserId, borrowerOrCoborrowerId, isReRun); };
                if (_this.selectedRunCreditAction.id == 1 || _this.selectedRunCreditAction.id == 2) {
                    var confirmationPopup = _this.modalPopoverFactory.openModalPopover('angular/loanapplication/credit/creditrunconfirmcontrol.html', {}, _this.selectedRunCreditAction, event);
                    confirmationPopup.result.then(function () {
                        // if only running the borrower or coborrower, there is no more spouse on the loan
                        _this.wrappedLoan.ref.active.isSpouseOnTheLoan = false;
                        // if only coBorrower is selected, switch the position of the borrower and coborrower (this will happen on save)
                        if (_this.selectedRunCreditAction.id == 1) {
                            _this.wrappedLoan.ref.active.switchCoBorrowerToBorrower = true;
                            _this.wrappedLoan.ref.active.getBorrower().isActive = false;
                        }
                        else {
                            _this.wrappedLoan.ref.active.getCoBorrower().isActive = false;
                        }
                        creditRequest();
                    });
                }
                else {
                    creditRequest();
                }
            };
            this.getAuthorizationMessage = function () {
                var borrowerAndCoborrower;
                borrowerAndCoborrower = _this.wrappedLoan.ref.active.getBorrower().fullName + (_this.wrappedLoan.ref.active.isSpouseOnTheLoan ? ", " + _this.wrappedLoan.ref.active.getCoBorrower().fullName : "");
                return { message: "I / We (" + borrowerAndCoborrower + ") authorize lender or its designated representatives to obtain a credit report from the national credit reporting agencies in connection with my/our home loan application." };
            };
            this.runCreditClicked = function (event) {
                if (!_this.wrappedLoan.ref.active.isRunCreditAuthorized) {
                    var confirmationPopup = _this.modalPopoverFactory.openModalPopover('angular/loanapplication/credit/creditrunbutton/authorizationpopup.html', {}, _this.getAuthorizationMessage(), event);
                    confirmationPopup.result.then(function () {
                        _this.wrappedLoan.ref.active.isRunCreditAuthorized = true;
                        var self = _this;
                        _this.$timeout(function () {
                            self.showRunCreditActionInfo(event);
                        }, 700);
                    });
                }
                else {
                    _this.showRunCreditActionInfo(event);
                }
            };
            this.CreditStateService.updateCredit(wrappedLoan);
            this.initializeRunButton();
        }
        Object.defineProperty(CallCreditController.prototype, "runningCreditCall", {
            get: function () {
                var activeApp = this.activeLoanApplication();
                if (!!activeApp) {
                    this._runningCreditCall = activeApp.isCreditRunning;
                }
                return this._runningCreditCall;
            },
            set: function (runningCreditCall) {
                var activeApp = this.activeLoanApplication();
                if (!!activeApp) {
                    activeApp.isCreditRunning = runningCreditCall;
                }
                this._runningCreditCall = runningCreditCall;
            },
            enumerable: true,
            configurable: true
        });
        CallCreditController.prototype.displayErrorMessage = function (loanApplicationId) {
            var loan = this.wrappedLoan.ref;
            var loanApplication = loan.getLoanApplication(loanApplicationId);
            if (loanApplication && this.wrappedLoan.ref && loanApplication == this.wrappedLoan.ref.active) {
                loanApplication.isCreditRunning = false;
                if (!loanApplication.credit)
                    loanApplication.credit = new cls.CreditViewModel();
                loanApplication.credit.creditReportMessage = 'We were unable to get a credit report at this time. Please try again later.';
                loanApplication.credit.creditReportMessageVisible = true;
            }
        };
        CallCreditController.$inject = ['$scope', '$q', '$interval', 'wrappedLoan', 'CreditHelpers', 'modalPopoverFactory', 'CreditSvc', 'controllerData', '$state', 'applicationData', 'NavigationSvc', 'BroadcastSvc', 'enums', 'loanEvent', 'CreditStateService', '$timeout', 'CreditSvcExt'];
        CallCreditController.className = 'runCreditController';
        return CallCreditController;
    })();
    credit.CallCreditController = CallCreditController;
    angular.module('loanApplication').controller('runCreditController', CallCreditController);
})(credit || (credit = {}));
//# sourceMappingURL=creditrunbtn.controller.js.map