/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
var fha;
(function (fha) {
    var service;
    (function (service) {
        'use strict';
        var FHACenterService = (function () {
            function FHACenterService($resource, apiRoot, costDetailsSvc, costDetailsHelpers) {
                var _this = this;
                this.$resource = $resource;
                this.apiRoot = apiRoot;
                this.costDetailsSvc = costDetailsSvc;
                this.costDetailsHelpers = costDetailsHelpers;
                this.isAppraisedValueValid = function (appraisedValue) {
                    return !common.objects.isNullOrUndefined(appraisedValue) && appraisedValue != 0;
                };
                this.getText = function (keyword, value) {
                    switch (keyword) {
                        case 'loantype':
                            return value === 1 ? 'Purchase' : 'Refinance';
                        case 'occupancytype':
                            return _this.getOccupancyText(value);
                        case 'cashout':
                            return !!Number(value) ? 'Yes' : 'No';
                        case 'payoff':
                            return !!value ? 'Yes' : 'No';
                        default:
                            return !!value ? 'Yes' : 'No';
                    }
                };
                this.determinFHAProducts = function (loanPurposeType, isFHALoan, occupancyType, isCashout, isSubordinateFinancing, fhaLookup, isPurchaseMOneyOrOverAYear) {
                    lib.forEach(fhaLookup, function (item) {
                        if (!item.contextFlags) {
                            item.disabled = true;
                        }
                    });
                    if (loanPurposeType == 2 /* Refinance */) {
                        if (String(isFHALoan) == 'true') {
                            if (occupancyType == 1 /* PrimaryResidence */ && !isCashout) {
                                if (!isSubordinateFinancing) {
                                    _this.getFHAItemByValue(fhaLookup, String(3 /* SimpleRefinance */));
                                }
                            }
                            if (!isSubordinateFinancing && !isCashout) {
                                _this.getFHAItemByValue(fhaLookup, String(1 /* StreamlineRefinance */));
                            }
                        }
                        if (occupancyType == 1 /* PrimaryResidence */) {
                            _this.getFHAItemByValue(fhaLookup, String(4 /* CashOutRefinance */));
                            if (String(isPurchaseMOneyOrOverAYear) === 'true') {
                                _this.getFHAItemByValue(fhaLookup, String(2 /* RateAndTermRefinance */));
                            }
                        }
                    }
                    else if (loanPurposeType == 1 /* Purchase */ && occupancyType == 1 /* PrimaryResidence */) {
                        _this.getFHAItemByValue(fhaLookup, String(5 /* Purchase */));
                        _this.getFHAItemByValue(fhaLookup, String(6 /* PurchaseDown */));
                    }
                };
                this.calculateUFMIPFactor = function (selectedDate) {
                    if (moment(selectedDate).format('YYYY-MM-DD') <= '2009-05-31')
                        return 0.01;
                    return 1.75;
                };
                this.getLabelText = function (propertyOwnedLessThanOneYear, howLongPropertyIsOccupied, propertyPurchasedInLast12Months) {
                    if (propertyOwnedLessThanOneYear == 'true' && howLongPropertyIsOccupied == 1) {
                        return '(Lesser of A or B2 * 85%)';
                    }
                    else if (propertyOwnedLessThanOneYear == 'false' && howLongPropertyIsOccupied == 1) {
                        return '(A * 85%)';
                    }
                    else if (propertyOwnedLessThanOneYear == 'false' && howLongPropertyIsOccupied == 2) {
                        return '(A * 97.75%)';
                    }
                    else if (howLongPropertyIsOccupied == 1) {
                        return '(A * 85%)';
                    }
                    else if (propertyOwnedLessThanOneYear == 'true' && howLongPropertyIsOccupied == 2 || propertyPurchasedInLast12Months == 'true') {
                        return '(Lesser of A or B2 * 97.75%)';
                    }
                    else if (propertyPurchasedInLast12Months != 'true') {
                        return '(A * 97.75%)';
                    }
                    return '';
                };
                this.getFHAItemByValue = function (lookups, value) {
                    lib.forEach(lookups, function (item) {
                        if (item.value == value && !item.contextFlags) {
                            item.disabled = false;
                        }
                    });
                };
                this.getOccupancyText = function (value) {
                    switch (Number(value)) {
                        case 1:
                            return 'Primary Residence';
                        case 2:
                            return 'Investment Property';
                        case 3:
                            return 'Second Vacation Home';
                    }
                };
                /*
                * @desc: Call REST service for FHA calculations
               */
                this.calculateFHA = function (fhaScenario, countyLoanLimit, baseLoanAmount) {
                    var FHACalculatorRequestViewModel = new cls.FHACalculatorRequestViewModel(fhaScenario, _this.costDetailsHelpers.calculateAllowableBorrowerPaidClosingCost(), _this.costDetailsHelpers.calculateSectionTotal(5 /* Prepaids */), _this.costDetailsSvc.wrappedLoan.ref.closingCost.totals.lenderCredits, countyLoanLimit, baseLoanAmount);
                    return _this.$resource(_this.apiRoot + '/CalculateFHAFields').save(FHACalculatorRequestViewModel);
                };
                /*
                 * @desc: Adds default option in the drop down list
                */
                this.addSelectOneAsOptionInLookup = function (listToBeModified, text, value, contextFlag) {
                    if (lib.filter(listToBeModified, function (item) {
                        return item.value == value;
                    }).length == 0) {
                        var selectOne = new cls.LookupItem(text, value);
                        selectOne.contextFlags = contextFlag;
                        listToBeModified.push(selectOne);
                    }
                };
                this.selectProduct = function (listToBeModified, value) {
                    var action = function (item) {
                        if (item.value == value)
                            item.selected = true;
                        else
                            item.selected = false;
                    };
                    lib.forEach(listToBeModified, action);
                };
                this.setAppraisalValueFHA = function (subjectProperty, loanPurpose, fhaAppraisalValue) {
                    if (!subjectProperty.appraisedValue && !fhaAppraisalValue && loanPurpose == 2 /* Refinance */) {
                        return subjectProperty.currentEstimatedValue;
                    }
                    else if (subjectProperty.appraisedValue) {
                        return subjectProperty.appraisedValue;
                    }
                    return fhaAppraisalValue;
                };
                this.apiRoot = apiRoot + 'FHACalculator';
            }
            FHACenterService.$inject = ['$resource', 'apiRoot', 'costDetailsSvc', 'costDetailsHelpers'];
            FHACenterService.className = 'fhaCenterService';
            return FHACenterService;
        })();
        service.FHACenterService = FHACenterService;
        angular.module('fhaCenter').service('fhaCenterService', FHACenterService);
    })(service = fha.service || (fha.service = {}));
})(fha || (fha = {}));
//# sourceMappingURL=fhacenter.service.js.map