/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
var loancenter;
(function (loancenter) {
    'use strict';
    var transactionRow = (function () {
        function transactionRow($http, $templateCache, $compile, $parse, TransactionalSummaryService) {
            var _this = this;
            this.restrict = 'E';
            this.templateUrl = '/angular/costdetails/transactionalsummary/transaction.row.html';
            this.scope = {
                'mode': '@',
                'item': '=',
                'recalulate': '=',
                'viewModel': '=',
                'sectionKey': '=',
                'subSectionKey': '=',
                'dictionary': '=',
                'costController': '='
            };
            this.controller = function ($scope) {
                var vm = _this;
                _this.initialize($scope);
                $scope.setTemplate = function (mode) {
                    if (mode == 'edit') {
                        _this.config = _this.findEntryDataDictionary($scope.item.costName, $scope.dictionary);
                        _this.setType($scope);
                        _this.editExisting($scope);
                        $scope.mode = 'view';
                    }
                    else if (mode == 'view') {
                        _this.config = _this.findEntryDataDictionary($scope.item.costName, $scope.dictionary);
                        _this.setType($scope);
                        $scope.mode = 'edit';
                    }
                    _this.setTemplate($scope);
                    $scope.recalulate();
                };
                $scope.save = function () {
                    //Temp need to switch out when data dictionary is in place.
                    //Need to add isConvertToDoubleEntry flag to function call
                    if ($scope.type == 'cost-item') {
                        TransactionalSummaryService.UpdateCreditOrDebit($scope.viewModel, $scope.sectionKey, $scope.subSectionKey, $scope.item.lineNumber, $scope.item.amount, $scope.item.costName, $scope.item.costNameString, $scope.item.isDoubleEntry);
                        $scope.setTemplate($scope.mode);
                    }
                    else if ('date-cost-item') {
                        $scope.item.from = $scope.item.startDate;
                        $scope.item.to = $scope.item.endDate;
                        TransactionalSummaryService.UpdateCreditOrDebit($scope.viewModel, $scope.sectionKey, $scope.subSectionKey, $scope.item.lineNumber, $scope.item.amount, $scope.item.costName, $scope.item.costNameString, $scope.item.isDoubleEntry, true, $scope.item.from, $scope.item.to);
                        $scope.setTemplate($scope.mode);
                    }
                };
                $scope.remove = function () {
                    TransactionalSummaryService.RemoveCreditOrDebit($scope.viewModel, $scope.sectionKey, $scope.subSectionKey, $scope.item.lineNumber, $scope.recalulate);
                };
                $scope.change = function () {
                    _this.config = _this.findEntryDataDictionary($scope.item.costName, $scope.dictionary);
                    if ($scope.item.costName != 18 && $scope.item.costName != 24) {
                        $scope.item.costNameString = _this.config.ledgerEntryNameString;
                    }
                    else {
                        $scope.item.costNameString = '';
                    }
                    _this.setType($scope);
                    _this.editExisting($scope);
                    _this.setTemplate($scope);
                    if (!angular.isUndefined(_this.config) && _this.config.isDoubleEntry != $scope.item.isDoubleEntry) {
                        $scope.item.isDoubleEntry = _this.config.isDoubleEntry;
                        $scope.save();
                    }
                };
            };
            this.setTemplate = function ($scope) {
                if ($scope.type == 'date-cost-item' && $scope.mode == 'edit') {
                    $scope.template = '/angular/costdetails/transactionalsummary/row.datecostitem.edit.html';
                }
                if ($scope.type == 'date-cost-item' && $scope.mode == 'view') {
                    $scope.template = '/angular/costdetails/transactionalsummary/row.datecostitem.html';
                    if (!$scope.item.startDate && !$scope.item.endDate) {
                        $scope.item.startDate = $scope.item.from;
                        $scope.item.endDate = $scope.item.to;
                    }
                }
                if ($scope.type == 'cost-item' && $scope.mode == 'edit') {
                    $scope.template = '/angular/costdetails/transactionalsummary/row.costitem.edit.html';
                }
                if ($scope.type == 'cost-item' && $scope.mode == 'view') {
                    $scope.template = '/angular/costdetails/transactionalsummary/row.costitem.html';
                }
            };
            this.editExisting = function ($scope) {
                $scope.item.hasValue = true;
            };
            this.initialize = function ($scope) {
                _this.fillInBlanksForOthers($scope.dictionary);
                _this.config = _this.findEntryDataDictionary($scope.item.costName, $scope.dictionary);
                _this.setType($scope);
                _this.setTemplate($scope);
            };
            this.setType = function ($scope) {
                if (_this.config)
                    $scope.type = _this.config.acceptsDateRange ? 'date-cost-item' : 'cost-item';
                else
                    $scope.type = 'cost-item';
            };
            this.findEntryDataDictionary = function (id, dicitonary) {
                for (var key in dicitonary) {
                    if (dicitonary[key].ledgerEntryName == id)
                        return dicitonary[key];
                }
                return false;
            };
            //Need to Find a work around on this
            this.fillInBlanksForOthers = function (dicitonary) {
                var strings = { 18: 'Other', 24: 'Other (Double)' };
                for (var key in strings) {
                    var entry = _this.findEntryDataDictionary(key, dicitonary);
                    if (entry)
                        entry.ledgerEntryNameString = strings[key];
                }
            };
            //this.controllerAs = 'transactionRowCtrl';
            //this.bindToController = true;
            this.replace = true;
        }
        transactionRow.Factory = function () {
            var directive = function ($http, $templateCache, $compile, $parse, TransactionalSummaryService) {
                return new transactionRow($http, $templateCache, $compile, $parse, TransactionalSummaryService);
            };
            directive['$inject'] = ['$http', '$templateCache', '$compile', '$parse', 'TransactionalSummaryService'];
            return directive;
        };
        return transactionRow;
    })();
    loancenter.transactionRow = transactionRow;
    angular.module('loanCenter').directive('transactionRow', transactionRow.Factory());
})(loancenter || (loancenter = {}));
;
//# sourceMappingURL=transaction.row.directive.js.map