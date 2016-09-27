var loancenter;
(function (loancenter) {
    'use strict';
    var transactionSubSection = (function () {
        function transactionSubSection(TransactionalSummaryService) {
            var _this = this;
            this.assignCostGetter = function ($scope, TransactionalSummaryService) {
                for (var k = 0; k < $scope.subSection.records.length; k++) {
                    $scope.subSection.records[k].getAmount = _this.costGetterFunction($scope, TransactionalSummaryService);
                }
            };
            this.costGetterFunction = function ($scope, TransactionalSummaryService) {
                return function () {
                    if (this && this.hasOwnProperty('useLoanInfoRequestKey') && this.useLoanInfoRequestKey) {
                        return TransactionalSummaryService.GetLoanInfoRequestEnumValue(this.loanInfoRequestKey, $scope.wrappedLoan, $scope.costController);
                    }
                    else if (this) {
                        return this.amount;
                    }
                };
            };
            this.restrict = 'E';
            this.templateUrl = '/angular/costdetails/transactionalsummary/subsection.html';
            this.scope = {
                'wrappedLoan': '=',
                'subSection': '=',
                'sectionKey': '=',
                'sectionNameString': '=',
                'calculateSectionTotal': '=',
                'costController': '='
            };
            this.controller = function ($scope) {
                $scope.hover = false;
                $scope.initializeEmptyDebtCredit = function () {
                    if ($scope.costController.closingCostsRW) {
                        TransactionalSummaryService.InitEmptyCreditOrDebit($scope.wrappedLoan, $scope.sectionKey, $scope.subSection.subSectionKey);
                    }
                };
                if ($scope.subSection.subSectionNameString) {
                    $scope.template = '/angular/costdetails/transactionalsummary/dynamic.subsection.html';
                }
                else {
                    _this.assignCostGetter($scope, TransactionalSummaryService);
                    $scope.template = '/angular/costdetails/transactionalsummary/static.subsection.html';
                }
                $scope.save = function (item) {
                    TransactionalSummaryService.UpdateCreditOrDebit($scope.wrappedLoan, $scope.sectionKey, $scope.subSection.subSectionKey, item.lineNumber, item.amount, item.costName, item.costNameString, item.isDoubleEntry);
                    $scope.calculateSectionTotal();
                };
                $scope.log = function (variable) {
                    console.log(variable);
                };
                $scope.canAdd = function () {
                    var filteredRecords = _.filter($scope.subSection.records, function (record) {
                        return record.isRemoved != true;
                    });
                    return filteredRecords.length < $scope.subSection.limit && $scope.costController.closingCostsRW;
                };
            };
            //this.controllerAs = 'transactionSubSectionCtrl';
            //this.bindToController = true;
        }
        transactionSubSection.Factory = function () {
            var directive = function (TransactionalSummaryService) {
                return new transactionSubSection(TransactionalSummaryService);
            };
            directive['$inject'] = ['TransactionalSummaryService'];
            return directive;
        };
        return transactionSubSection;
    })();
    loancenter.transactionSubSection = transactionSubSection;
    angular.module('loanCenter').directive('transactionSubSection', transactionSubSection.Factory());
})(loancenter || (loancenter = {}));
;
//# sourceMappingURL=transaction.subsection.directive.js.map