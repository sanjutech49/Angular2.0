/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="fhacenter.service.ts" />
var fha;
(function (fha) {
    var controller;
    (function (controller) {
        'use strict';
        var FHACenterController = (function () {
            function FHACenterController(fhaCenterService, wrappedLoan, $state, navigationService, applicationData, enums) {
                var _this = this;
                this.fhaCenterService = fhaCenterService;
                this.wrappedLoan = wrappedLoan;
                this.$state = $state;
                this.navigationService = navigationService;
                this.applicationData = applicationData;
                this.enums = enums;
                this.realEstatePastSixtyMonths = function (value) {
                    if (!common.objects.isNullOrUndefined(value)) {
                        _this.wrappedLoan.ref.fhaScenarioViewModel.reOwnOrSoldPast60MonthsWithHudFha = common.string.toBool(value);
                        if (!_this.wrappedLoan.ref.fhaScenarioViewModel.reOwnOrSoldPast60MonthsWithHudFha) {
                            _this.resetProperty(true);
                        }
                    }
                    else {
                        return _this.wrappedLoan.ref.fhaScenarioViewModel.reOwnOrSoldPast60MonthsWithHudFha;
                    }
                };
                this.resetProperty = function (resetPropToBeSoldFlag) {
                    if (resetPropToBeSoldFlag === void 0) { resetPropToBeSoldFlag = false; }
                    if (resetPropToBeSoldFlag) {
                        _this.wrappedLoan.ref.fhaScenarioViewModel.propertyToBeSold = null;
                    }
                    _this.wrappedLoan.ref.fhaScenarioViewModel.salesPrice = 0;
                    _this.wrappedLoan.ref.fhaScenarioViewModel.originalMortgageAmount = 0;
                    _this.wrappedLoan.ref.fhaScenarioViewModel.propertyToBeSoldAddressViewModel = new srv.cls.PropertyViewModel();
                };
                this.isPropertyAdjacent = function (value) {
                    if (!common.objects.isNullOrUndefined(value)) {
                        _this.wrappedLoan.ref.fhaScenarioViewModel.isPropertyAdjacent = common.string.toBool(value);
                    }
                    else {
                        return _this.wrappedLoan.ref.fhaScenarioViewModel.isPropertyAdjacent;
                    }
                };
                this.isAdjacentVisible = function () {
                    return _this.wrappedLoan.ref.primary.OccupancyType == 2 /* InvestmentProperty */;
                };
                this.moreThenFourDwellingsOwned = function (value) {
                    if (!common.objects.isNullOrUndefined(value)) {
                        _this.wrappedLoan.ref.fhaScenarioViewModel.moreThenFourDwellingsOwned = common.string.toBool(value);
                    }
                    else {
                        return _this.wrappedLoan.ref.fhaScenarioViewModel.moreThenFourDwellingsOwned;
                    }
                };
                this.leadPaintPoisoningInfoReceived = function (value) {
                    if (!common.objects.isNullOrUndefined(value)) {
                        _this.wrappedLoan.ref.fhaScenarioViewModel.leadPaintPoisoningInfoReceived = common.string.toBool(value);
                    }
                    else {
                        return _this.wrappedLoan.ref.fhaScenarioViewModel.leadPaintPoisoningInfoReceived;
                    }
                };
                this.isPropertyToBeSoldVisible = function () {
                    return _this.wrappedLoan.ref.fhaScenarioViewModel.reOwnOrSoldPast60MonthsWithHudFha == true;
                };
                this.propertyToBeSold = function (value) {
                    if (!common.objects.isNullOrUndefined(value)) {
                        _this.wrappedLoan.ref.fhaScenarioViewModel.propertyToBeSold = common.string.toBool(value);
                        if (!_this.wrappedLoan.ref.fhaScenarioViewModel.propertyToBeSold) {
                            _this.resetProperty();
                        }
                    }
                    else {
                        return _this.wrappedLoan.ref.fhaScenarioViewModel.propertyToBeSold;
                    }
                };
                /*
                 * @desc: Gets text to be displayed based on keyword and value
                */
                this.getText = function (keyword, value) {
                    if (keyword == 'payoff')
                        value = _this.wrappedLoan.ref.isSubordinateFinancing();
                    return _this.fhaCenterService.getText(keyword, value);
                };
                /*
                 * @desc: Gets eligible FHA products and resets select box
                */
                this.getFHAProducts = function () {
                    _this.fhaCenterService.determinFHAProducts(_this.wrappedLoan.ref.loanPurposeType, _this.wrappedLoan.ref.otherInterviewData.fhaInformation.isCurrentLoanFHA, _this.wrappedLoan.ref.primary.occupancyType, !!Number(_this.wrappedLoan.ref.financialInfo.cashOut), _this.wrappedLoan.ref.isSubordinateFinancing(), _this.applicationData.lookup.fhaProducts, _this.wrappedLoan.ref.fhaScenarioViewModel.isPurchaseMoneyOrOverAYear);
                    _this.eligibleProudctsExists = lib.filter(_this.applicationData.lookup.fhaProducts, function (item) {
                        return !item.disabled;
                    }).length > 1;
                    if (lib.filter(_this.applicationData.lookup.fhaProducts, function (item) {
                        return item.value == String(_this.wrappedLoan.ref.fhaScenarioViewModel.fhaProductId) && !item.disabled;
                    }).length == 0) {
                        _this.resetSelectList();
                    }
                    return _this.applicationData.lookup.fhaProducts;
                };
                /*
                 * @desc: Gets selected FHA product
                */
                this.getSelectedFHAProduct = function () {
                    return lib.filter(_this.applicationData.lookup.fhaProducts, function (item) {
                        return item.value == _this.wrappedLoan.ref.fhaScenarioViewModel.fhaProductId;
                    })[0];
                };
                /*
                 * @desc: Event handler for drop down that enables user to navigate accors different FHA product calculators
                */
                this.selectFHAProduct = function (value) {
                    _this.fhaCenterService.selectProduct(_this.applicationData.lookup.fhaProducts, value);
                    _this.wrappedLoan.ref.fhaScenarioViewModel.fhaProductId = value;
                    _this.navigationService.navigateToFHACalculator(_this.wrappedLoan.ref.fhaScenarioViewModel.fhaProductId);
                };
                /*
                 * @desc: Calls Mega save
                */
                this.saveChanges = function () {
                    _this.navigationService.SaveAndUpdateWrappedLoan(_this.applicationData.currentUserId, _this.wrappedLoan, _this.calculateFha);
                };
                this.calculateFha = function (wrappedLoan) {
                    _this.fhaCenterService.calculateFHA(wrappedLoan.ref.fhaScenarioViewModel, wrappedLoan.ref.fhaCountyLoanLimit, wrappedLoan.ref.loanAmount).$promise.then(function (data) {
                        wrappedLoan.ref.fhaScenarioViewModel.fhaCalculatorResults = data.response;
                    });
                };
                /*
                 * @desc: Reloads current state
                */
                this.cancelChanges = function () {
                    _this.navigationService.cancelChanges(_this.wrappedLoan.ref.loanId);
                };
                /*
                 * @desc: Calculates UFMIP factor based on date
                */
                this.calculateUFMIPFactor = function () {
                    return _this.fhaCenterService.calculateUFMIPFactor(_this.wrappedLoan.ref.fhaScenarioViewModel.endorsmentDate);
                };
                /*
                 * @desc: Resets drop down list, makes default option selected one
                */
                this.resetSelectList = function () {
                    _this.wrappedLoan.ref.fhaScenarioViewModel.fhaProductId = 0;
                    lib.forEach(_this.applicationData.lookup.fhaProducts, function (item) {
                        if (item.value == String(_this.wrappedLoan.ref.fhaScenarioViewModel.fhaProductId)) {
                            item.selected = true;
                        }
                        else {
                            item.selected = false;
                        }
                    });
                    _this.navigationService.navigateToFHACalculator(_this.wrappedLoan.ref.fhaScenarioViewModel.fhaProductId);
                };
                this.isFhaProductVisible = function (item) {
                    return !item.disabled && item.value != "0"; // Default item
                };
                this.loanTypeEnum = srv.LoanPurposeTypeEnum; //makes LoanPurposeType enum public so it can be accessed from html template.
                this.fhaCenterService.addSelectOneAsOptionInLookup(this.applicationData.lookup.fhaProducts, 'Select an FHA Worksheet', '0', 1);
                navigationService.contextualType = enums.ContextualTypes.FhaCenter;
                this.wrappedLoan.ref.fhaScenarioViewModel.purchasePrice = this.wrappedLoan.ref.fhaScenarioViewModel.purchasePriceWithDocumentedImprovements = this.wrappedLoan.ref.getSubjectProperty().purchasePrice;
                this.wrappedLoan.ref.fhaScenarioViewModel.appraisalValue = fhaCenterService.setAppraisalValueFHA(this.wrappedLoan.ref.getSubjectProperty(), this.wrappedLoan.ref.loanPurposeType, this.wrappedLoan.ref.fhaScenarioViewModel.appraisalValue);
                this.getFHAProducts();
            }
            FHACenterController.$inject = ['fhaCenterService', 'wrappedLoan', '$state', 'NavigationSvc', 'applicationData', 'enums'];
            return FHACenterController;
        })();
        angular.module('fhaCenter').controller('fhaCenterController', FHACenterController);
    })(controller = fha.controller || (fha.controller = {}));
})(fha || (fha = {}));
//# sourceMappingURL=fhacenter.controller.js.map