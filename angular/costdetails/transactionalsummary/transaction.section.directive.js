var loancenter;
(function (loancenter) {
    'use strict';
    var transactionSection = (function () {
        function transactionSection(TransactionalSummaryService, BroadcastSvc) {
            var _this = this;
            this.BroadcastSvc = BroadcastSvc;
            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = 'angular/costdetails/transactionalsummary/section.html';
            this.scope = {
                'sectionTitle': '@?',
                'sectionFooter': '@',
                'sectionTotal': '=',
                'wrappedLoan': '=',
                'subSection': '=',
                'sectionLetter': '@',
                'addEmptyRows': '=',
                'costController': '='
            };
            this.controller = function ($scope) {
                _this.atttachGetterForCost($scope.subSection.subSectionList, $scope);
                $scope.calculateSectionTotal = function () {
                    $scope.sectionTotal = _this.calculateTotal($scope.subSection.subSectionList);
                };
                $scope.calculateSectionTotal();
                $scope.range = function (n) {
                    n = (n > 0) ? n : 0;
                    return new Array(n);
                };
                console.log($scope.sectionLetter);
                if ($scope.sectionLetter == 'k' || $scope.sectionLetter == 'l') {
                    $scope.$watch('sectionTotal', function () {
                        BroadcastSvc.broadcastCostDetailsTotals();
                    });
                }
            };
            this.calculateTotal = function (subSectionList) {
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
                                if (typeof amount == 'number') {
                                    sum += amount;
                                }
                            }
                            else {
                                var amount = parseFloat(subSectionList[i].records[k].amount) || 0;
                                if (subSectionList[i].records[k].isRemoved != true && typeof amount == 'number') {
                                    sum += amount;
                                }
                            }
                        }
                    }
                }
                return sum;
            };
            this.atttachGetterForCost = function (subSectionList, $scope) {
                var sum = 0;
                for (var i = 0; i < subSectionList.length; i++) {
                    if (Array.isArray(subSectionList[i].records)) {
                        for (var k = 0; k < subSectionList[i].records.length; k++) {
                            if (subSectionList[i].records[k].useLoanInfoRequestKey) {
                                subSectionList[i].records[k].getAmount = this.costGetterFunction($scope, TransactionalSummaryService);
                            }
                        }
                    }
                }
                return sum;
            };
            this.costGetterFunction = function ($scope, TransactionalSummaryService) {
                return function () {
                    var _amount;
                    if (this && this.hasOwnProperty('useLoanInfoRequestKey') && this.useLoanInfoRequestKey) {
                        this.amount = _amount = TransactionalSummaryService.GetLoanInfoRequestEnumValue(this.loanInfoRequestKey, $scope.wrappedLoan, false);
                    }
                    else if (this) {
                        _amount = this.amount;
                    }
                    return _amount;
                };
            };
        }
        transactionSection.Factory = function () {
            var directive = function (TransactionalSummaryService, BroadcastSvc) {
                return new transactionSection(TransactionalSummaryService, BroadcastSvc);
            };
            directive['$inject'] = ['TransactionalSummaryService', 'BroadcastSvc'];
            return directive;
        };
        return transactionSection;
    })();
    loancenter.transactionSection = transactionSection;
    angular.module('loanCenter').directive('transactionSection', transactionSection.Factory());
})(loancenter || (loancenter = {}));
;
//# sourceMappingURL=transaction.section.directive.js.map