/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="../../scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../ts/generated/viewModels.ts" />
/// <reference path="../ts/generated/viewModelClasses.ts" />
/// <reference path="../ts/extendedViewModels/extendedViewModels.ts" />
var loanCenter;
(function (loanCenter) {
    'use strict';
    var CostDetailsData = (function () {
        function CostDetailsData() {
            this.loanCosts = [];
            this.otherCosts = [];
            this.lenderCreditsCosts = [];
            this.usedLoanCostTypes = [];
            this.usedOtherCostTypes = [];
            this.payOffSectionItems = [];
        }
        return CostDetailsData;
    })();
    loanCenter.CostDetailsData = CostDetailsData;
    var costDetailsSvc = (function () {
        function costDetailsSvc($q, $resource, apiRoot) {
            var _this = this;
            this.$q = $q;
            this.$resource = $resource;
            this.apiRoot = apiRoot;
            this.costDetailsApiPath = this.apiRoot + 'CostDetails/';
            this.toleranceGroupsData = {};
            this.toleranceLineItemsData = {};
            this.activeToleranceData = {};
            this.selectedToleranceItems = {};
            this.initializeItemizedPropertyTaxes = this.$resource(this.costDetailsApiPath + 'InitializeItemizedPropertyTaxes', { method: 'GET', isArray: true, params: { costId: 'costId' } });
            this.getToleranceGroups = function () {
                var def = _this.$q.defer();
                var service = _this;
                _this.toleranceGroupsData = _this.wrappedLoan.ref.closingCost.disclosuresDetailsViewModel;
                angular.forEach(service.toleranceGroupsData, function (group) {
                    group.costs = service.groupCostsByTolerance(group.costs);
                });
                _this.calculateAggregates(_this.toleranceGroupsData);
                def.resolve(_this.toleranceGroupsData);
                return def.promise;
            };
            this.getToleranceLineItems = function (toleranceGroupId) {
                var def = _this.$q.defer();
                var service = _this;
                _this.selectedToleranceGroupId = toleranceGroupId;
                angular.forEach(service.toleranceGroupsData, function (group) {
                    if (group.disclosureDetailsId == service.selectedToleranceGroupId) {
                        service.toleranceLineItemsData = group;
                    }
                });
                _this.setSelectedToleranceCosts(_this.toleranceLineItemsData);
                def.resolve(_this.toleranceLineItemsData);
                return def.promise;
            };
            this.getActiveToleranceGroup = function () {
                var def = _this.$q.defer();
                var activeToleranceData = {};
                var activeGroupExists = false;
                var service = _this;
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
                }, function (errorMsg) {
                    def.reject(errorMsg);
                });
                return def.promise;
            };
            this.updateActiveToleranceTotals = function () {
                var def = _this.$q.defer();
                if (_this.activeToleranceData == undefined || _this.activeToleranceData.costs == undefined)
                    return def.promise;
                _this.activeToleranceData.costs = _this.groupCostsByTolerance(_this.activeToleranceData.costs);
                _this.calculateAggregates([_this.activeToleranceData]);
                def.resolve(_this.activeToleranceData);
                return def.promise;
            };
            this.initializeSelectedToleranceItems = function () {
                _this.selectedToleranceItems = {
                    zeroTolerance: {
                        costs: [],
                        disclosedTotal: 0,
                        currentTotal: 0,
                        changeDollar: 0,
                        changePercent: 0,
                        amountToCure: 0
                    },
                    tenPercentTolerance: {
                        costs: [],
                        disclosedTotal: 0,
                        currentTotal: 0,
                        changeDollar: 0,
                        changePercent: 0,
                        amountToCure: 0
                    },
                    unlimitedTolerance: {
                        costs: [],
                        disclosedTotal: 0,
                        currentTotal: 0,
                        changeDollar: 0,
                        changePercent: 0,
                        amountToCure: 0
                    }
                };
            };
            this.groupCostsByTolerance = function (toleranceCosts) {
                if (toleranceCosts == undefined)
                    return;
                var allCurrentCosts = _this.wrappedLoan.ref.closingCost.costs;
                var service = _this;
                angular.forEach(allCurrentCosts, function (cost) {
                    if (cost.isRemoved || cost.hudLineNumber == 204 || cost.hudLineNumber == 8020 || (cost.hudLineNumber == 802 && cost.amount < 0))
                        return true;
                    var costExistsInToleranceCostsList = false;
                    var costCopy = angular.copy(cost);
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
            };
            this.isCostAmountEmpty = function (cost) {
                return ((cost.disclosedTotalAmountForTolerance == null && cost.totalAmountForTolerance == null) || (cost.disclosedTotalAmountForTolerance == 0 && cost.totalAmountForTolerance == 0));
            };
            this.setSelectedToleranceCosts = function (toleranceGroup) {
                if (toleranceGroup == undefined || toleranceGroup.costs == undefined) {
                    _this.initializeSelectedToleranceItems();
                    return;
                }
                _this.selectedToleranceItems = toleranceGroup;
                if (_this.selectedToleranceItems.zeroTolerance != undefined)
                    _this.selectedToleranceItems.zeroTolerance.costs = _this.getToleranceLevelCosts(toleranceGroup.costs, 0);
                if (_this.selectedToleranceItems.tenPercentTolerance != undefined)
                    _this.selectedToleranceItems.tenPercentTolerance.costs = _this.getToleranceLevelCosts(toleranceGroup.costs, 10);
                if (_this.selectedToleranceItems.unlimitedTolerance != undefined)
                    _this.selectedToleranceItems.unlimitedTolerance.costs = _this.getToleranceLevelCosts(toleranceGroup.costs, null);
            };
            this.getToleranceLevelCosts = function (costs, toleranceLevel) {
                var filteredCosts = [];
                angular.forEach(costs, function (cost) {
                    if (!cost.isRemoved && cost.toleranceLevel == toleranceLevel) {
                        filteredCosts.push(cost);
                    }
                });
                return filteredCosts;
            };
            this.calculateAggregates = function (toleranceGroups) {
                var service = _this;
                angular.forEach(toleranceGroups, function (toleranceObj) {
                    var groupedCostsByTolerance = _.groupBy(toleranceObj.costs, 'toleranceLevel');
                    toleranceObj.zeroTolerance = { disclosedTotal: 0, currentTotal: 0, changeDollar: 0, changePercent: 0, amountToCure: 0 };
                    toleranceObj.tenPercentTolerance = { disclosedTotal: 0, currentTotal: 0, changeDollar: 0, changePercent: 0, amountToCure: 0 };
                    toleranceObj.unlimitedTolerance = { disclosedTotal: 0, currentTotal: 0, changeDollar: 0, changePercent: 0, amountToCure: 0 };
                    angular.forEach(groupedCostsByTolerance, function (costs, toleranceLevel) {
                        angular.forEach(costs, function (cost) {
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
            };
            this.calculateToleranceTotals = function (section) {
                section.changeDollar = section.currentTotal - section.disclosedTotal;
                section.changePercent = (section.disclosedTotal > 0) ? Math.round(((section.changeDollar / section.disclosedTotal) * 100) * 100) / 100 : 0;
            };
            this.getBorrowerTotal = function () {
                if (!_this.wrappedLoan.ref.closingCost || !_this.wrappedLoan.ref.closingCost.totals || !_this.wrappedLoan.ref.closingCost.totals.closingCosts)
                    return 0;
                return _this.wrappedLoan.ref.closingCost.totals.closingCosts.borrowerTotal;
            };
            this.totalClosingCostsWithoutG = function () {
                var borrowerTotal = _this.getBorrowerTotal();
                // section name should be a const
                var sectionGTotal = lib.summate(_this.costDetailsData.groupedOtherCosts['G. INITIAL ESCOW PAYMENT AT CLOSING'], function (p) { return p.borrowerPaid.atClosing != 0; }, function (c) { return c.borrowerPaid.atClosing; });
                return borrowerTotal - sectionGTotal;
            };
            this.costDetailsData = new CostDetailsData();
            this.initializeSelectedToleranceItems();
        }
        costDetailsSvc.className = 'costDetailsSvc';
        costDetailsSvc.$inject = ['$q', '$resource', 'apiRoot'];
        return costDetailsSvc;
    })();
    loanCenter.costDetailsSvc = costDetailsSvc;
    angular.module('loanCenter').service(costDetailsSvc.className, costDetailsSvc);
})(loanCenter || (loanCenter = {}));
//# sourceMappingURL=costdetails.services.js.map