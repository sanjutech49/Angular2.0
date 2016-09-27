module loancenter {
    'use strict';

    export class transactionSubSection {
        public restrict
        public templateUrl;
        public bindToController;
        public scope;
        public controller;
        public controllerAs;
        public replace;

        constructor(TransactionalSummaryService) {
            this.restrict = 'E'; 
            this.templateUrl = '/angular/costdetails/transactionalsummary/subsection.html';
            this.scope = {
                'wrappedLoan': '=',
                'subSection': '=',
                'sectionKey': '=',
                'sectionNameString': '=',
                'calculateSectionTotal': '=',
                'costController': '='
            }

            this.controller = ($scope) => {
                $scope.hover = false;
                $scope.initializeEmptyDebtCredit = () => { 
                    if ($scope.costController.closingCostsRW) {                        
                        TransactionalSummaryService.InitEmptyCreditOrDebit($scope.wrappedLoan, $scope.sectionKey, $scope.subSection.subSectionKey);
                    }
                }
                if ($scope.subSection.subSectionNameString) {
                    $scope.template = '/angular/costdetails/transactionalsummary/dynamic.subsection.html';
                }
                else {
                    this.assignCostGetter($scope, TransactionalSummaryService);
                    $scope.template = '/angular/costdetails/transactionalsummary/static.subsection.html';
                }
                $scope.save = (item) => {                     
                    TransactionalSummaryService.UpdateCreditOrDebit($scope.wrappedLoan, $scope.sectionKey, $scope.subSection.subSectionKey, item.lineNumber, item.amount, item.costName, item.costNameString, item.isDoubleEntry);
                    $scope.calculateSectionTotal();
                }
                $scope.log = (variable) => {
                    console.log(variable);
                }
                $scope.canAdd = () => { 
                    var filteredRecords: any = _.filter($scope.subSection.records, function (record: any) {
                        return record.isRemoved!=true;
                    });
                    return filteredRecords.length < $scope.subSection.limit && $scope.costController.closingCostsRW;
                }
            }

            //this.controllerAs = 'transactionSubSectionCtrl';
            //this.bindToController = true;
        }

        private assignCostGetter = ($scope, TransactionalSummaryService) => {
            for (var k = 0; k < $scope.subSection.records.length; k++) {
                $scope.subSection.records[k].getAmount = this.costGetterFunction($scope, TransactionalSummaryService);
            }
        }

        private costGetterFunction = function ($scope, TransactionalSummaryService) {
            return function () {
                if (this && this.hasOwnProperty('useLoanInfoRequestKey') && this.useLoanInfoRequestKey) {
                    return TransactionalSummaryService.GetLoanInfoRequestEnumValue(this.loanInfoRequestKey, $scope.wrappedLoan, $scope.costController);
                }
                else if (this) {
                    return this.amount
                }
            }
        }

        public static Factory() {
            var directive = (TransactionalSummaryService) => {
                return new transactionSubSection(TransactionalSummaryService);
            };

            directive['$inject'] = ['TransactionalSummaryService'];

            return directive;
        }
    }

    angular.module('loanCenter').directive('transactionSubSection', transactionSubSection.Factory());
}; 