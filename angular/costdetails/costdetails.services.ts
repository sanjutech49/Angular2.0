/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="../../scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../ts/generated/viewModels.ts" />
/// <reference path="../ts/generated/viewModelClasses.ts" />
/// <reference path="../ts/extendedViewModels/extendedViewModels.ts" />

module loanCenter {
    'use strict';

    export class CostDetailsData {
        public loanCosts = [];
        public otherCosts = [];
        public groupedLoanCosts: any;
        public groupedOtherCosts: any;
        public lenderCreditsCosts = [];
        public usedLoanCostTypes = [];
        public usedOtherCostTypes = [];
        public payOffSectionItems = [];
        public creditPayoffItemsCount: number;

        constructor() {
        }
    }

    export class costDetailsSvc {

        static className = 'costDetailsSvc';
        static $inject = ['$q', '$resource', 'apiRoot'];

        constructor(private $q, private $resource, private apiRoot) {
            this.costDetailsData = new CostDetailsData();
            this.initializeSelectedToleranceItems();
        }

        private costDetailsApiPath = this.apiRoot + 'CostDetails/';

        public wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>;
        public applicationData: any;

        public costDetailsData: CostDetailsData;
        public toleranceGroupsData: any = {};
        public toleranceLineItemsData: any = {};
        public activeToleranceData: any = {};
        public activeToleranceGroupId;
        public selectedToleranceGroupId;
        public selectedToleranceItems: any = {};
        public initializeItemizedPropertyTaxes = this.$resource(this.costDetailsApiPath + 'InitializeItemizedPropertyTaxes', { method: 'GET', isArray: true, params: { costId: 'costId' } });

        getToleranceGroups = (): any => {
            var def = this.$q.defer();
            var service = this;
            this.toleranceGroupsData = this.wrappedLoan.ref.closingCost.disclosuresDetailsViewModel;

            angular.forEach(service.toleranceGroupsData, function (group) {
                group.costs = service.groupCostsByTolerance(group.costs);
            });

            this.calculateAggregates(this.toleranceGroupsData);

            def.resolve(this.toleranceGroupsData);

            return def.promise;
        };

        getToleranceLineItems = (toleranceGroupId): any => {
            var def = this.$q.defer();
            var service = this;
            this.selectedToleranceGroupId = toleranceGroupId;

            angular.forEach(service.toleranceGroupsData, function (group) {
                if (group.disclosureDetailsId == service.selectedToleranceGroupId) {
                    service.toleranceLineItemsData = group;
                }
            });

            this.setSelectedToleranceCosts(this.toleranceLineItemsData);
            def.resolve(this.toleranceLineItemsData);

            return def.promise;
        };

        getActiveToleranceGroup = (): any => {
            var def = this.$q.defer();
            var activeToleranceData = {};
            var activeGroupExists = false;
            var service = this;
            service.getToleranceGroups().then(function (data) {
                service.toleranceGroupsData = data;
                angular.forEach(service.toleranceGroupsData, function (group) {
                    if (group.active) {
                        activeGroupExists = true;
                        service.activeToleranceGroupId = group.disclosureDetailsId;
                        service.activeToleranceData = activeToleranceData = group;
                    }
                });

                if (activeGroupExists) {
                    service.setSelectedToleranceCosts(activeToleranceData);
                }
                else {
                    service.initializeSelectedToleranceItems();
                    service.activeToleranceData = activeToleranceData = {};
                    service.activeToleranceGroupId = -1;
                }

                def.resolve(activeToleranceData);
            },
                function (errorMsg) {
                    def.reject(errorMsg);
                });

            return def.promise;
        }

        updateActiveToleranceTotals = (): any => {
            var def = this.$q.defer();

            if (this.activeToleranceData == undefined || this.activeToleranceData.costs == undefined)
                return def.promise;

            this.activeToleranceData.costs = this.groupCostsByTolerance(this.activeToleranceData.costs);
            this.calculateAggregates([this.activeToleranceData]);

            def.resolve(this.activeToleranceData);
            return def.promise;
        }

        initializeSelectedToleranceItems = (): any => {
            this.selectedToleranceItems = {
                zeroTolerance: {
                    costs: [], disclosedTotal: 0, currentTotal: 0, changeDollar: 0, changePercent: 0, amountToCure: 0
                },
                tenPercentTolerance: {
                    costs: [], disclosedTotal: 0, currentTotal: 0, changeDollar: 0, changePercent: 0, amountToCure: 0
                },
                unlimitedTolerance: {
                    costs: [], disclosedTotal: 0, currentTotal: 0, changeDollar: 0, changePercent: 0, amountToCure: 0
                }
            };
        }

        groupCostsByTolerance = (toleranceCosts): any => {
            if (toleranceCosts == undefined)
                return;

            var allCurrentCosts = this.wrappedLoan.ref.closingCost.costs;
            var service = this;

            angular.forEach(allCurrentCosts, function (cost) {
                if (cost.isRemoved || cost.hudLineNumber == 204 || cost.hudLineNumber == 8020 || (cost.hudLineNumber == 802 && cost.amount < 0))
                    return true;

                var costExistsInToleranceCostsList = false;
                var costCopy: any = angular.copy(cost);
                costCopy.totalAmountForTolerance = cost.borrowerPaid.atClosing + cost.borrowerPaid.beforeClosing + cost.otherPaid.atClosing + cost.otherPaid.beforeClosing;
                costCopy.disclosedTotalAmountForTolerance = 0;

                // Update DisclosedTotalAmountForTolerance
                angular.forEach(toleranceCosts, function (toleranceCost) {
                    var subHUDLineNumberEmpty = ((toleranceCost.subHUDLineNumber == null && cost.subHUDLineNumber == null) || (toleranceCost.subHUDLineNumber == '' && cost.subHUDLineNumber == ''));
                    if ((toleranceCost.hudLineNumber == cost.hudLineNumber) && (subHUDLineNumberEmpty || (toleranceCost.subHUDLineNumber == cost.subHUDLineNumber))) {
                        costExistsInToleranceCostsList = true;
                        toleranceCost.disclosedTotalAmountForTolerance = toleranceCost.amount;
                        toleranceCost.totalAmountForTolerance = costCopy.totalAmountForTolerance;
                        toleranceCost.toleranceLevel = cost.toleranceLevel;
                    }
                });

                // Add missing costs from current cost list to tolerance costs
                if (!costExistsInToleranceCostsList)
                    toleranceCosts.push(costCopy);
            });

            // Hide zero costs from UI
            var filteredList = toleranceCosts.filter(function (toleranceCost) {
                return (!service.isCostAmountEmpty(toleranceCost) && (toleranceCost.hudLineNumber != 204) && (toleranceCost.hudLineNumber != 8020) && ((toleranceCost.hudLineNumber == 802 && toleranceCost.amount > 0) || (toleranceCost.hudLineNumber != 802)));
            });

            return filteredList;
        }

        isCostAmountEmpty = (cost): any => {
            return ((cost.disclosedTotalAmountForTolerance == null && cost.totalAmountForTolerance == null) || (cost.disclosedTotalAmountForTolerance == 0 && cost.totalAmountForTolerance == 0));
        }

        setSelectedToleranceCosts = (toleranceGroup): any => {
            if (toleranceGroup == undefined || toleranceGroup.costs == undefined) {
                this.initializeSelectedToleranceItems();
                return;
            }

            this.selectedToleranceItems = toleranceGroup;
            if (this.selectedToleranceItems.zeroTolerance != undefined)
                this.selectedToleranceItems.zeroTolerance.costs = this.getToleranceLevelCosts(toleranceGroup.costs, 0);
            if (this.selectedToleranceItems.tenPercentTolerance != undefined)
                this.selectedToleranceItems.tenPercentTolerance.costs = this.getToleranceLevelCosts(toleranceGroup.costs, 10);
            if (this.selectedToleranceItems.unlimitedTolerance != undefined)
                this.selectedToleranceItems.unlimitedTolerance.costs = this.getToleranceLevelCosts(toleranceGroup.costs, null);
        }

        getToleranceLevelCosts = (costs, toleranceLevel): any => {
            var filteredCosts = [];
            angular.forEach(costs, function (cost) {
                if (!cost.isRemoved && cost.toleranceLevel == toleranceLevel) {
                    filteredCosts.push(cost);
                }
            });

            return filteredCosts;
        }

        calculateAggregates = (toleranceGroups): any => {
            var service = this;
            angular.forEach(toleranceGroups, function (toleranceObj) {
                var groupedCostsByTolerance = _.groupBy(toleranceObj.costs, 'toleranceLevel');

                toleranceObj.zeroTolerance = { disclosedTotal: 0, currentTotal: 0, changeDollar: 0, changePercent: 0, amountToCure: 0 };
                toleranceObj.tenPercentTolerance = { disclosedTotal: 0, currentTotal: 0, changeDollar: 0, changePercent: 0, amountToCure: 0 };
                toleranceObj.unlimitedTolerance = { disclosedTotal: 0, currentTotal: 0, changeDollar: 0, changePercent: 0, amountToCure: 0 };

                angular.forEach(groupedCostsByTolerance, function (costs, toleranceLevel) {
                    angular.forEach(costs, function (cost: any) {
                        if (toleranceLevel == "0") {
                            toleranceObj.zeroTolerance.disclosedTotal += parseFloat(cost.disclosedTotalAmountForTolerance);
                            toleranceObj.zeroTolerance.currentTotal += parseFloat(cost.totalAmountForTolerance);
                        }
                        else if (toleranceLevel == "10") {
                            toleranceObj.tenPercentTolerance.disclosedTotal += parseFloat(cost.disclosedTotalAmountForTolerance);
                            toleranceObj.tenPercentTolerance.currentTotal += parseFloat(cost.totalAmountForTolerance);
                        }
                        else {
                            toleranceObj.unlimitedTolerance.disclosedTotal += parseFloat(cost.disclosedTotalAmountForTolerance);
                            toleranceObj.unlimitedTolerance.currentTotal += parseFloat(cost.totalAmountForTolerance);
                        }
                    });
                });

                service.calculateToleranceTotals(toleranceObj.zeroTolerance);
                service.calculateToleranceTotals(toleranceObj.tenPercentTolerance);

                toleranceObj.zeroTolerance.amountToCure = (toleranceObj.zeroTolerance.changeDollar < 0) ? 0 : toleranceObj.zeroTolerance.changeDollar;
                toleranceObj.tenPercentTolerance.amountToCure = (toleranceObj.tenPercentTolerance.changePercent < 10 || toleranceObj.tenPercentTolerance.changePercent == 10 || toleranceObj.tenPercentTolerance.changePercent < 0) ? 0 : toleranceObj.tenPercentTolerance.changeDollar - (toleranceObj.tenPercentTolerance.disclosedTotal * 0.1);
                toleranceObj.unlimitedTolerance.amountToCure = toleranceObj.zeroTolerance.amountToCure + toleranceObj.tenPercentTolerance.amountToCure;
            });
        }

        calculateToleranceTotals = (section): any => {
            section.changeDollar = section.currentTotal - section.disclosedTotal;
            section.changePercent = (section.disclosedTotal > 0) ? Math.round(((section.changeDollar / section.disclosedTotal) * 100) * 100) / 100 : 0;
        }

        getBorrowerTotal = (): number => {
            if (!this.wrappedLoan.ref.closingCost || !this.wrappedLoan.ref.closingCost.totals || !this.wrappedLoan.ref.closingCost.totals.closingCosts)
                return 0;

            return this.wrappedLoan.ref.closingCost.totals.closingCosts.borrowerTotal;
        }

        totalClosingCostsWithoutG = (): number => {
            var borrowerTotal = this.getBorrowerTotal();

            // section name should be a const
            var sectionGTotal = lib.summate(this.costDetailsData.groupedOtherCosts['G. INITIAL ESCOW PAYMENT AT CLOSING'],
                (p: any) => p.borrowerPaid.atClosing != 0,(c: any) => c.borrowerPaid.atClosing);

            return borrowerTotal - sectionGTotal;
        }
    }

    angular.module('loanCenter').service(costDetailsSvc.className, costDetailsSvc);
}