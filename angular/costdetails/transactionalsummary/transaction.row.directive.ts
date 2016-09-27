/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />

module loancenter {
    'use strict';

    export class transactionRow {
        public restrict
        public templateUrl;
        public bindToController;
        public scope;
        public controller;
        public controllerAs;
        public replace;
        public $scope;
        public link;
        public show;
        public template;
        public setTemplate;
        public editExisting;  
        public datePattern;
        public initialize;
        private setType;
        private findEntryDataDictionary;
        private config:any;
        private fillInBlanksForOthers;


        constructor($http, $templateCache, $compile, $parse, TransactionalSummaryService) {
            this.restrict = 'E';
            this.templateUrl = '/angular/costdetails/transactionalsummary/transaction.row.html'

            this.scope = {
                'mode': '@',
                'item': '=',
                'recalulate': '=',
                'viewModel': '=',
                'sectionKey': '=',
                'subSectionKey': '=',
                'dictionary': '=',
                'costController': '='
            }

            this.controller = ($scope) => {

                var vm = this;                
                this.initialize($scope); 

                $scope.setTemplate = (mode) => {
                    if (mode == 'edit') {
                        this.config = this.findEntryDataDictionary($scope.item.costName, $scope.dictionary);
                        this.setType($scope);
                        this.editExisting($scope);
                        $scope.mode = 'view';
                    }
                    else if (mode == 'view') {
                        this.config = this.findEntryDataDictionary($scope.item.costName, $scope.dictionary);
                        this.setType($scope);
                        $scope.mode = 'edit';
                    }
                    this.setTemplate($scope);
                    $scope.recalulate();
                };
                
                
                $scope.save = () => {
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
                }

                $scope.remove = () => {
                    TransactionalSummaryService.RemoveCreditOrDebit($scope.viewModel, $scope.sectionKey, $scope.subSectionKey, $scope.item.lineNumber, $scope.recalulate);
                }

                $scope.change = () => {                  
                    this.config = this.findEntryDataDictionary($scope.item.costName, $scope.dictionary);
                    if ($scope.item.costName != 18 && $scope.item.costName != 24) {
                        $scope.item.costNameString = this.config.ledgerEntryNameString
                    }
                    else {
                        $scope.item.costNameString = '';
                    }
                    this.setType($scope);
                    this.editExisting($scope);
                    this.setTemplate($scope);
                    if (!angular.isUndefined(this.config) && this.config.isDoubleEntry != $scope.item.isDoubleEntry) {
                        $scope.item.isDoubleEntry = this.config.isDoubleEntry;
                        $scope.save();
                    } 
                } 
            }

            this.setTemplate = ($scope) => {
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
            }

            this.editExisting = ($scope) => {
                $scope.item.hasValue = true;
            }
             
            this.initialize = ($scope) => {
                this.fillInBlanksForOthers($scope.dictionary);
                this.config = this.findEntryDataDictionary($scope.item.costName, $scope.dictionary);
                this.setType($scope);
                this.setTemplate($scope);
            }

            this.setType = ($scope) => {
                if (this.config)
                    $scope.type = this.config.acceptsDateRange ? 'date-cost-item' : 'cost-item';
                else
                    $scope.type = 'cost-item'
            }

            this.findEntryDataDictionary = (id, dicitonary) => {
                for (var key in dicitonary) {
                    if (dicitonary[key].ledgerEntryName == id)
                        return dicitonary[key];
                }
                return false;
            }

            //Need to Find a work around on this
            this.fillInBlanksForOthers = (dicitonary) => {
                var strings = { 18: 'Other', 24: 'Other (Double)' };
                for (var key in strings) {
                    var entry = this.findEntryDataDictionary(key, dicitonary);
                    if (entry)
                        entry.ledgerEntryNameString = strings[key];
                }
            }
                
            //this.controllerAs = 'transactionRowCtrl';
            //this.bindToController = true;
            this.replace = true;
        }

        public static Factory() {
            var directive = ($http, $templateCache, $compile, $parse, TransactionalSummaryService) => {
                return new transactionRow($http, $templateCache, $compile, $parse, TransactionalSummaryService);
            };

            directive['$inject'] = ['$http', '$templateCache', '$compile', '$parse', 'TransactionalSummaryService'];

            return directive;
        }

    }


    angular.module('loanCenter').directive('transactionRow', transactionRow.Factory());
};