var loancenter;
(function (loancenter) {
    'use strict';
    var TransactionalSummaryService = (function () {
        function TransactionalSummaryService($resource, apiRoot) {
            this.$resource = $resource;
            this.apiRoot = apiRoot;
            this.$inject = ['$resource', 'api'];
        }
        TransactionalSummaryService.prototype.InitEmptyCreditOrDebit = function (viewModel, sectionKey, subSectionKey, isDoubleEntry) {
            if (isDoubleEntry === void 0) { isDoubleEntry = false; }
            this.transSummaryProxy = this.$resource(this.apiRoot + 'TransactionSummaryService/InitEmptyCreditOrDebit', {}, {
                InitEmptyCreditOrDebit: { method: 'POST' }
            });
            this.transSummaryProxy.InitEmptyCreditOrDebit({}, { lineNumber: 0, sectionKey: sectionKey, subSectionKey: subSectionKey, isDoubleEntry: isDoubleEntry, viewModel: viewModel.transactionSummary }).$promise.then(function (sr) {
                viewModel.transactionSummary = sr.response.viewModel;
                console.log(sr);
            }, function (error) {
                console.log(error);
            });
        };
        TransactionalSummaryService.prototype.UpdateCreditOrDebit = function (viewModel, sectionKey, subSectionKey, lineNumber, amount, ledgerEntryName, ledgerEntryNameString, isConvertToDoubleEntry, isApportioned, startDate, endDate) {
            if (isConvertToDoubleEntry === void 0) { isConvertToDoubleEntry = false; }
            if (isApportioned === void 0) { isApportioned = false; }
            if (startDate === void 0) { startDate = ''; }
            if (endDate === void 0) { endDate = ''; }
            this.transSummaryProxy = this.$resource(this.apiRoot + 'TransactionSummaryService/UpdateCreditOrDebit', {}, {
                UpdateCreditOrDebit: { method: 'POST' }
            });
            var payload = {
                viewModel: viewModel.transactionSummary,
                sectionKey: sectionKey,
                subSectionKey: subSectionKey,
                lineNumber: lineNumber,
                ledgerEntryName: ledgerEntryName,
                ledgerEntryNameString: ledgerEntryNameString,
                amount: amount,
                isApportioned: isApportioned,
                startDate: startDate,
                endDate: endDate,
                isConvertToDoubleEntry: isConvertToDoubleEntry
            };
            this.transSummaryProxy.UpdateCreditOrDebit({}, payload).$promise.then(function (sr) {
                viewModel.transactionSummary = sr.response.viewModel;
                console.log(sr);
            }, function (error) {
                console.log(error);
            });
        };
        TransactionalSummaryService.prototype.RemoveCreditOrDebit = function (viewModel, sectionKey, subSectionKey, lineNumber, recalcCallback) {
            this.transSummaryProxy = this.$resource(this.apiRoot + 'TransactionSummaryService/RemoveCreditOrDebit', {}, {
                RemoveCreditOrDebit: { method: 'POST' }
            });
            var payload = {
                viewModel: viewModel.transactionSummary,
                sectionKey: sectionKey,
                subSectionKey: subSectionKey,
                lineNumber: lineNumber
            };
            this.transSummaryProxy.RemoveCreditOrDebit({}, payload).$promise.then(function (sr) {
                viewModel.transactionSummary = sr.response.viewModel;
                recalcCallback();
                console.log(sr);
            }, function (error) {
                recalcCallback();
                console.log(error);
            });
        };
        TransactionalSummaryService.prototype.GetLoanInfoRequestEnumValue = function (id, wrappedLoan, contextualbar) {
            var value = null;
            switch (id) {
                case 1:
                    return wrappedLoan.detailsOfTransaction.totalLoanAmount;
                case 2:
                    return wrappedLoan.getSubjectProperty().purchasePrice;
                case 3:
                    for (var i in wrappedLoan.detailsOfTransaction.otherCredits) {
                        if (wrappedLoan.detailsOfTransaction.otherCredits[i].description == 'Cash Deposits') {
                            return wrappedLoan.detailsOfTransaction.otherCredits[i].amount;
                        }
                    }
                    return 0;
                case 4:
                    if (wrappedLoan.closingCost.totals.lenderCredits && wrappedLoan.closingCost.totals.lenderCredits > 0) {
                        return wrappedLoan.closingCost.totals.closingCosts.borrowerPaidAtClosingTotal - wrappedLoan.closingCost.totals.lenderCredits;
                    }
                    else {
                        return wrappedLoan.closingCost.totals.closingCosts.borrowerPaidAtClosingTotal + wrappedLoan.closingCost.totals.lenderCredits;
                    }
                case 5:
                    return wrappedLoan.closingCost.totals.closingCosts.sellerPaidAtClosingTotal;
                default:
                    return 0;
            }
        };
        TransactionalSummaryService.prototype.calculate = function (transactionalSummaryViewModel, wrappedLoan) {
            if (!transactionalSummaryViewModel)
                return 0;
            this.atttachGetterForCost(transactionalSummaryViewModel.borrowerCredits.subSectionList, wrappedLoan);
            this.atttachGetterForCost(transactionalSummaryViewModel.borrowerDebits.subSectionList, wrappedLoan);
            var borrowerCreditsTotal = this.calculateSectionSum(transactionalSummaryViewModel.borrowerCredits.subSectionList), borrowerDebitsTotal = this.calculateSectionSum(transactionalSummaryViewModel.borrowerDebits.subSectionList);
            return borrowerCreditsTotal - borrowerDebitsTotal;
        };
        TransactionalSummaryService.prototype.calculateSectionSum = function (subSectionList) {
            var sum = 0;
            for (var i = 0; i < subSectionList.length; i++) {
                if (Array.isArray(subSectionList[i].records)) {
                    for (var k = 0; k < subSectionList[i].records.length; k++) {
                        if (subSectionList[i].records[k].useLoanInfoRequestKey) {
                            var amount = 0;
                            if (typeof subSectionList[i].records[k].getAmount == 'function') {
                                amount = parseFloat(subSectionList[i].records[k].getAmount());
                            }
                            else if (subSectionList[i].records[k].amount == 'number') {
                                amount = subSectionList[i].records[k].amount;
                            }
                            if (typeof amount == 'number')
                                sum += amount;
                        }
                        else {
                            var amount = parseFloat(subSectionList[i].records[k].amount) || 0;
                            if (subSectionList[i].records[k].isRemoved != true && typeof amount == 'number')
                                sum += amount;
                        }
                    }
                }
            }
            return sum;
        };
        TransactionalSummaryService.prototype.atttachGetterForCost = function (subSectionList, wrappedLoan) {
            for (var i = 0; i < subSectionList.length; i++) {
                if (Array.isArray(subSectionList[i].records)) {
                    for (var k = 0; k < subSectionList[i].records.length; k++) {
                        if (subSectionList[i].records[k].useLoanInfoRequestKey) {
                            subSectionList[i].records[k].getAmount = this.costGetterFunction(wrappedLoan);
                        }
                    }
                }
            }
        };
        TransactionalSummaryService.prototype.costGetterFunction = function (wrappedLoan) {
            var service = this;
            return function () {
                var _amount;
                if (this && this.hasOwnProperty('useLoanInfoRequestKey') && this.useLoanInfoRequestKey) {
                    this.amount = _amount = service.GetLoanInfoRequestEnumValue(this.loanInfoRequestKey, wrappedLoan, true);
                }
                else if (this) {
                    _amount = this.amount;
                }
                return _amount;
            };
        };
        TransactionalSummaryService.Factory = function () {
            var service = function ($resource, api) {
                return new TransactionalSummaryService($resource, api);
            };
            service['$inject'] = ['$resource', 'api'];
            return service;
        };
        return TransactionalSummaryService;
    })();
    loancenter.TransactionalSummaryService = TransactionalSummaryService;
    angular.module('loanCenter').service('TransactionalSummaryService', loancenter.TransactionalSummaryService);
})(loancenter || (loancenter = {}));
//# sourceMappingURL=transactionalsummaryservice.js.map