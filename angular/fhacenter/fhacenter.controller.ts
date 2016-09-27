/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="fhacenter.service.ts" />

module fha.controller {
    'use strict';

    class FHACenterController {
        loanTypeEnum: any;
        fhaProducts: srv.ILookupItem[];
        eligibleProudctsExists: boolean;

        static $inject = ['fhaCenterService', 'wrappedLoan', '$state', 'NavigationSvc', 'applicationData', 'enums'];
        constructor(private fhaCenterService: fha.service.IFHACenterService, private wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>, private $state: angular.ui.IStateService,
            private navigationService: any, public applicationData: any, private enums: any) {
            this.loanTypeEnum = srv.LoanPurposeTypeEnum;//makes LoanPurposeType enum public so it can be accessed from html template.
            this.fhaCenterService.addSelectOneAsOptionInLookup(this.applicationData.lookup.fhaProducts, 'Select an FHA Worksheet', '0', 1);
            navigationService.contextualType = enums.ContextualTypes.FhaCenter;
            this.wrappedLoan.ref.fhaScenarioViewModel.purchasePrice = this.wrappedLoan.ref.fhaScenarioViewModel.purchasePriceWithDocumentedImprovements =  this.wrappedLoan.ref.getSubjectProperty().purchasePrice;
            this.wrappedLoan.ref.fhaScenarioViewModel.appraisalValue = fhaCenterService.setAppraisalValueFHA(this.wrappedLoan.ref.getSubjectProperty(), this.wrappedLoan.ref.loanPurposeType, this.wrappedLoan.ref.fhaScenarioViewModel.appraisalValue);

            this.getFHAProducts();
        }

        realEstatePastSixtyMonths = (value: string): boolean |void => {
            if (!common.objects.isNullOrUndefined(value)) {
                this.wrappedLoan.ref.fhaScenarioViewModel.reOwnOrSoldPast60MonthsWithHudFha = common.string.toBool(value);

                if (!this.wrappedLoan.ref.fhaScenarioViewModel.reOwnOrSoldPast60MonthsWithHudFha) {
                    this.resetProperty(true);
                }
            }
            else {
                return this.wrappedLoan.ref.fhaScenarioViewModel.reOwnOrSoldPast60MonthsWithHudFha;
            }
        }

        private resetProperty = (resetPropToBeSoldFlag: boolean = false) => {
            if (resetPropToBeSoldFlag) {
                this.wrappedLoan.ref.fhaScenarioViewModel.propertyToBeSold = null;
            }

            this.wrappedLoan.ref.fhaScenarioViewModel.salesPrice = 0;
            this.wrappedLoan.ref.fhaScenarioViewModel.originalMortgageAmount = 0;
            this.wrappedLoan.ref.fhaScenarioViewModel.propertyToBeSoldAddressViewModel = new srv.cls.PropertyViewModel();
        }

        isPropertyAdjacent = (value: string): boolean | void => {
            if (!common.objects.isNullOrUndefined(value)) {
                this.wrappedLoan.ref.fhaScenarioViewModel.isPropertyAdjacent = common.string.toBool(value);
            }
            else {
                return this.wrappedLoan.ref.fhaScenarioViewModel.isPropertyAdjacent;
            }
        }

        isAdjacentVisible = (): boolean => {
            return this.wrappedLoan.ref.primary.OccupancyType == srv.PropertyUsageTypeEnum.InvestmentProperty;
        }

        moreThenFourDwellingsOwned = (value: string): boolean | void => {
            if (!common.objects.isNullOrUndefined(value)) {
                this.wrappedLoan.ref.fhaScenarioViewModel.moreThenFourDwellingsOwned = common.string.toBool(value);
            }
            else {
                return this.wrappedLoan.ref.fhaScenarioViewModel.moreThenFourDwellingsOwned;
            }
        }

        leadPaintPoisoningInfoReceived = (value: string): boolean | void => {
            if (!common.objects.isNullOrUndefined(value)) {
                this.wrappedLoan.ref.fhaScenarioViewModel.leadPaintPoisoningInfoReceived = common.string.toBool(value);
            }
            else {
                return this.wrappedLoan.ref.fhaScenarioViewModel.leadPaintPoisoningInfoReceived;
            }
        }

        isPropertyToBeSoldVisible = (): boolean => {
            return this.wrappedLoan.ref.fhaScenarioViewModel.reOwnOrSoldPast60MonthsWithHudFha == true;
        }

        propertyToBeSold = (value: string): boolean | void => {
            if (!common.objects.isNullOrUndefined(value)) {
                this.wrappedLoan.ref.fhaScenarioViewModel.propertyToBeSold = common.string.toBool(value);

                if (!this.wrappedLoan.ref.fhaScenarioViewModel.propertyToBeSold) {
                    this.resetProperty();
                }
            }
            else {
                return this.wrappedLoan.ref.fhaScenarioViewModel.propertyToBeSold;
            }
        }

        /*
         * @desc: Gets text to be displayed based on keyword and value
        */
        getText = (keyword: string, value: any): string => {
            if (keyword == 'payoff')
                value = this.wrappedLoan.ref.isSubordinateFinancing();

            return this.fhaCenterService.getText(keyword, value);
        }

        /*
         * @desc: Gets eligible FHA products and resets select box
        */
        getFHAProducts = (): srv.ILookupItem[] =>{
            this.fhaCenterService.determinFHAProducts(this.wrappedLoan.ref.loanPurposeType, this.wrappedLoan.ref.otherInterviewData.fhaInformation.isCurrentLoanFHA, this.wrappedLoan.ref.primary.occupancyType, !!Number(this.wrappedLoan.ref.financialInfo.cashOut), this.wrappedLoan.ref.isSubordinateFinancing(), this.applicationData.lookup.fhaProducts, this.wrappedLoan.ref.fhaScenarioViewModel.isPurchaseMoneyOrOverAYear);
            this.eligibleProudctsExists = lib.filter(this.applicationData.lookup.fhaProducts,(item: srv.ILookupItem) => { return !item.disabled; }).length > 1;
            if (lib.filter(this.applicationData.lookup.fhaProducts,(item: srv.ILookupItem) => { return item.value == String(this.wrappedLoan.ref.fhaScenarioViewModel.fhaProductId) && !item.disabled; }).length == 0) {
                this.resetSelectList();
            }
            return this.applicationData.lookup.fhaProducts;
        }

        /*
         * @desc: Gets selected FHA product
        */
        getSelectedFHAProduct = (): any => {
            return lib.filter(this.applicationData.lookup.fhaProducts,(item: any) => { return item.value == this.wrappedLoan.ref.fhaScenarioViewModel.fhaProductId; })[0];
        }


        /*
         * @desc: Event handler for drop down that enables user to navigate accors different FHA product calculators
        */
        selectFHAProduct = (value: number): any => {
            this.fhaCenterService.selectProduct(this.applicationData.lookup.fhaProducts, value);
            this.wrappedLoan.ref.fhaScenarioViewModel.fhaProductId = value;
            this.navigationService.navigateToFHACalculator(this.wrappedLoan.ref.fhaScenarioViewModel.fhaProductId);
        }


        /*
         * @desc: Calls Mega save
        */
        saveChanges = (): void => {
            this.navigationService.SaveAndUpdateWrappedLoan(this.applicationData.currentUserId, this.wrappedLoan, this.calculateFha);
        }

        private calculateFha = (wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>): void => {
            this.fhaCenterService.calculateFHA(wrappedLoan.ref.fhaScenarioViewModel, wrappedLoan.ref.fhaCountyLoanLimit, wrappedLoan.ref.loanAmount).$promise.then((data) => {
                wrappedLoan.ref.fhaScenarioViewModel.fhaCalculatorResults = data.response;
            });
        }
        /*
         * @desc: Reloads current state
        */
        cancelChanges = (): void => {
            this.navigationService.cancelChanges(this.wrappedLoan.ref.loanId);
        }

        /*
         * @desc: Calculates UFMIP factor based on date
        */
        calculateUFMIPFactor = (): number => {
            return this.fhaCenterService.calculateUFMIPFactor(this.wrappedLoan.ref.fhaScenarioViewModel.endorsmentDate);
        }

        /*
         * @desc: Resets drop down list, makes default option selected one
        */
        private resetSelectList = (): void => {
            this.wrappedLoan.ref.fhaScenarioViewModel.fhaProductId = 0;
            lib.forEach(this.applicationData.lookup.fhaProducts,(item: srv.ILookupItem) => { if (item.value == String(this.wrappedLoan.ref.fhaScenarioViewModel.fhaProductId)) { item.selected = true; } else { item.selected = false; } });
            this.navigationService.navigateToFHACalculator(this.wrappedLoan.ref.fhaScenarioViewModel.fhaProductId);
        }

        isFhaProductVisible = (item: srv.ILookupItem): boolean => {
            return !item.disabled && item.value != "0"; // Default item
        }
    }
    angular.module('fhaCenter').controller('fhaCenterController', FHACenterController);
} 