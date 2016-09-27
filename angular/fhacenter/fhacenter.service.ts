/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />

module fha.service {
    'use strict';

    export interface IFHACenterService {
        getText(keyword: string, value: any): string;
        determinFHAProducts(loanPurposeType: number, isFHALoan: boolean, occupancyType: number, isCashout: boolean, isSubordinateFinancing: boolean, fhaLookup: srv.ILookupItem[], isPurchaseMOneyOrOverAYear: boolean): void;
        calculateUFMIPFactor(selectedDate: Date): number;
        calculateFHA(fhaScenario: srv.IFHAScenarioViewModel, countyLoanLimit: number, baseLoanAmount: number): ng.resource.IResource<any>;
        getLabelText(propertyOwnedLessThanOneYear: string, howLongPropertyIsOccupied: number, propertyPurchasedInLast12Months?: string);
        addSelectOneAsOptionInLookup(listToBeModified: any[], text: string, value: string, contextFlag: number): void;
        selectProduct(listToBeModified: any[], value: any): void
        setAppraisalValueFHA(subjectProperty: srv.IPropertyViewModel, loanPurpose: number, fhaAppraisalValue: number): number;
        isAppraisedValueValid: (appraisedValue: number) => boolean;
    }

    export class FHACenterService implements IFHACenterService {

        static $inject = ['$resource', 'apiRoot', 'costDetailsSvc', 'costDetailsHelpers'];
        static className = 'fhaCenterService';

        constructor(private $resource: angular.resource.IResourceService, private apiRoot: string, private costDetailsSvc: loanCenter.costDetailsSvc, private costDetailsHelpers) {
            this.apiRoot = apiRoot + 'FHACalculator';
        }

        isAppraisedValueValid = (appraisedValue: number): boolean => {
            return !common.objects.isNullOrUndefined(appraisedValue) && appraisedValue != 0
        }

        getText = (keyword: string, value: any): string => {
            switch (keyword) {
                case 'loantype':
                    return value === 1 ? 'Purchase' : 'Refinance';
                case 'occupancytype':
                    return this.getOccupancyText(value);
                case 'cashout':
                    return !!Number(value) ? 'Yes' : 'No';
                case 'payoff':
                    return !!value ? 'Yes' : 'No';
                default:
                    return !!value ? 'Yes' : 'No';
            }
        }

        determinFHAProducts = (loanPurposeType: number, isFHALoan: any, occupancyType: number, isCashout: boolean, isSubordinateFinancing: boolean, fhaLookup: srv.ILookupItem[], isPurchaseMOneyOrOverAYear: any): void =>{
            lib.forEach(fhaLookup,(item: srv.ILookupItem) => { if (!item.contextFlags) { item.disabled = true; } });
            if (loanPurposeType == srv.LoanPurposeTypeEnum.Refinance) {
                if (String(isFHALoan) == 'true') {
                    if (occupancyType == srv.PropertyUsageTypeEnum.PrimaryResidence && !isCashout) {
                        if (!isSubordinateFinancing) {
                            this.getFHAItemByValue(fhaLookup, String(srv.FHAProductsEnum.SimpleRefinance));
                        }
                    }
                    if (!isSubordinateFinancing && !isCashout) {
                        this.getFHAItemByValue(fhaLookup, String(srv.FHAProductsEnum.StreamlineRefinance));
                    }
                }
                if (occupancyType == srv.PropertyUsageTypeEnum.PrimaryResidence) {
                    this.getFHAItemByValue(fhaLookup, String(srv.FHAProductsEnum.CashOutRefinance));
                    if (String(isPurchaseMOneyOrOverAYear) === 'true') {
                        this.getFHAItemByValue(fhaLookup, String(srv.FHAProductsEnum.RateAndTermRefinance));
                    }
                }
            }
            else if (loanPurposeType == srv.LoanPurposeTypeEnum.Purchase && occupancyType == srv.PropertyUsageTypeEnum.PrimaryResidence) {
                this.getFHAItemByValue(fhaLookup, String(srv.FHAProductsEnum.Purchase));
                this.getFHAItemByValue(fhaLookup, String(srv.FHAProductsEnum.PurchaseDown));
            }
        }

        calculateUFMIPFactor = (selectedDate: Date): number => {
            if(moment(selectedDate).format('YYYY-MM-DD') <= '2009-05-31')
                return 0.01;
            return 1.75;
        }

        getLabelText = (propertyOwnedLessThanOneYear: string, howLongPropertyIsOccupied: number, propertyPurchasedInLast12Months?: string): string => {
            if (propertyOwnedLessThanOneYear == 'true' && howLongPropertyIsOccupied == 1) {
                return '(Lesser of A or B2 * 85%)';
            }
            else if (propertyOwnedLessThanOneYear == 'false' && howLongPropertyIsOccupied == 1) {
                return '(A * 85%)'
            }
            else if (propertyOwnedLessThanOneYear == 'false' && howLongPropertyIsOccupied == 2) {
                return '(A * 97.75%)'
            }
            else if (howLongPropertyIsOccupied == 1) {
                return '(A * 85%)';
            }
            else if (propertyOwnedLessThanOneYear == 'true' && howLongPropertyIsOccupied == 2  || propertyPurchasedInLast12Months == 'true') {
                return '(Lesser of A or B2 * 97.75%)';
            }
            else if (propertyPurchasedInLast12Months != 'true') {
                return '(A * 97.75%)'
            }
            return '';
        }

        private getFHAItemByValue = (lookups: srv.ILookupItem[], value: string): void => {
            lib.forEach(lookups,(item: srv.ILookupItem) => { if (item.value == value && !item.contextFlags) { item.disabled = false; } });
        }

        private getOccupancyText = (value: number): string => {
            switch (Number(value)) {
                case 1:
                    return 'Primary Residence';
                case 2:
                    return 'Investment Property';
                case 3:
                    return 'Second Vacation Home';
            }
        }

         /*
         * @desc: Call REST service for FHA calculations
        */
        calculateFHA = (fhaScenario: srv.IFHAScenarioViewModel, countyLoanLimit: number, baseLoanAmount: number): ng.resource.IResource<any> => {
            var FHACalculatorRequestViewModel = new cls.FHACalculatorRequestViewModel(
                fhaScenario,
                this.costDetailsHelpers.calculateAllowableBorrowerPaidClosingCost(),
                this.costDetailsHelpers.calculateSectionTotal(srv.CostSectionTypeEnum.Prepaids),
                this.costDetailsSvc.wrappedLoan.ref.closingCost.totals.lenderCredits,
                countyLoanLimit,
                baseLoanAmount
                )

            return this.$resource(this.apiRoot + '/CalculateFHAFields').save(FHACalculatorRequestViewModel);
        }

        /*
         * @desc: Adds default option in the drop down list
        */
        addSelectOneAsOptionInLookup = (listToBeModified: any[], text: string, value: string, contextFlag: number): void => {
            if (lib.filter(listToBeModified,(item: srv.ILookupItem) => { return item.value == value; }).length == 0) {
                var selectOne = new cls.LookupItem(text, value);
                selectOne.contextFlags = contextFlag;
                listToBeModified.push(selectOne);
            }
        }

        selectProduct = (listToBeModified: any[], value: any): void => {
            var action = (item: any) => {
                if (item.value == value)
                    item.selected = true;
                else
                    item.selected = false;
            }
            lib.forEach(listToBeModified, action);
        }

        setAppraisalValueFHA = (subjectProperty: srv.IPropertyViewModel, loanPurpose: number, fhaAppraisalValue: number): number => {
            if (!subjectProperty.appraisedValue && !fhaAppraisalValue && loanPurpose == srv.LoanPurposeTypeEnum.Refinance) {
                return subjectProperty.currentEstimatedValue;
            }
            else if (subjectProperty.appraisedValue) {
                return subjectProperty.appraisedValue;
            }

            return fhaAppraisalValue;          
        }
    }

    angular.module('fhaCenter').service('fhaCenterService', FHACenterService);
} 