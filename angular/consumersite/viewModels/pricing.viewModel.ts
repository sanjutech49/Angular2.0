
module consumersite.vm {

    export interface IDropDownItemViewModel {
        val: number;
        text: string;
    }

    //export interface IPriceSearchViewModel {
    //    downpayment: number;
    //    loanPurpose: IDropDownItemViewModel[];
    //    loadPurposeSelected: number;
    //    zipCode: string;
    //    existingFirstMortgage: number;
    //    cashOut: number;
    //    estimatedPropValue: number;
    //    creditScores: IDropDownItemViewModel[];
    //    creditScoreSelected: number;
    //}

    //export enum PricingState {
    //    None = 0,
    //    AdvancedSearch = 1,
    //    AllOptions=2
    //}
    export interface IPricingRowViewModel {
        productId: string;
        LoanAmortizationTerm: string;
        AmortizationType: string;
        AdjustmentPeriod: string;
        TitleYears: string;
        Rate: string;
        APR: string;
        MonthlyPayment: string;
        TotalCost: string;
        LoanOptionType: string;
        compare: boolean; //ui
        isLowCost: boolean; //mapped
        isTopPick: boolean;  //calc
        isLowRateARM: boolean; //calc
        isPayoffQuickly: boolean; //calc
        isLowFixed: boolean; //calc
        isNoCost: boolean; //mapped  
    }

    export class PricingRowViewModel implements IPricingRowViewModel {
        productId: string;
        LoanAmortizationTerm: string;
        AmortizationType: string;
        AdjustmentPeriod: string;
        TitleYears: string;
        Rate: string;
        APR: string;
        MonthlyPayment: string;
        TotalCost: string;
        LoanOptionType: string;
        compare: boolean; //ui

        constructor() {
            this.productId = "";
            this.LoanAmortizationTerm = "";
            this.AmortizationType = "";
            this.AdjustmentPeriod = "";
            this.TitleYears = "";
            this.Rate = "";
            this.APR = "";
            this.MonthlyPayment = "";
            this.TotalCost = "";
            this.LoanOptionType = "";
            this.compare = false; //ui
        }

        get isLowCost(): boolean {
            return this.LoanOptionType == "3" || this.LoanOptionType == "13" || this.LoanOptionType == "14";
            //LowUpfrontCost = 3,
            //LowUpfrontCostTopPick = 13,
            //LowUpfrontCostAlternativeTopPick = 14,
        }
        set isLowCost(value: boolean) {
            //readonly
        }

        get isTopPick(): boolean {
            return this.LoanOptionType == "10" || this.LoanOptionType == "11"
                || this.LoanOptionType == "13" || this.LoanOptionType == "14"
                || this.LoanOptionType == "14"
                || this.LoanOptionType == "9" || this.LoanOptionType == "15"
                || this.LoanOptionType == "19";
            //LowRateArmsTopPick = 10,
            //LowFixedRateTopPick = 11,
            //LowUpfrontCostTopPick = 13
            //LowUpfrontCostAlternativeTopPick = 14
            //   PayoffHomeQuicklyTopPick = 9,
            //  PayoffHomeQuicklyLowerCostTopPick = 15,
            //   PayoffHomeQuicklyNoCostTopPick = 16,
            
        }
        set isTopPick(value: boolean) {
            //readonly
        }

        get isLowRateARM(): boolean {
            return ( this.LoanOptionType == "6" || this.LoanOptionType == "10");
            //LowRateArms = 6,
            //LowRateArmsTopPick = 10,
        }
        set isLowRateARM(value: boolean) {
            //readonly
        }

        get isPayoffQuickly(): boolean {
            return (this.LoanOptionType == "5" || this.LoanOptionType == "9" || this.LoanOptionType == "15" || this.LoanOptionType == "16");
            //PayoffHomeQuickly = 5,
            //   PayoffHomeQuicklyTopPick = 9,
            //  PayoffHomeQuicklyLowerCostTopPick = 15,
            //   PayoffHomeQuicklyNoCostTopPick = 16,
        }
        set isPayoffQuickly(value: boolean) {
            //readonly
        }
        get isLowFixed(): boolean {
            return (this.LoanOptionType == "1" || this.LoanOptionType == "11"); 
            //LowFixedRates = 1,
            //LowFixedRateTopPick = 11,
        }
        set isLowFixed(value: boolean) {
            //readonly
        }
        get isNoCost(): boolean {
            return (this.LoanOptionType == "2" || this.LoanOptionType == "8");
            //NoCost = 2,
            //NoCostTopPick = 8,
        }
        set isNoCost(value: boolean) {
            //readonly
        }

    }  


    export class PricingFilterViewModel {
        show30Fixed: boolean;
        show25Fixed: boolean;
        show20Fixed: boolean;
        show15Fixed: boolean;
        show10Fixed: boolean;
        show10ARM: boolean;
        show7ARM: boolean;
        show5ARM: boolean;
        show3ARM: boolean;
        sortField: string;
        sortDirection: string;
        maxInterest: string;
        maxPayment: string;
        maxCost: string;
    }

   
    //export class PricingViewModel {

    //    private getProperty: () => PricingViewModel;

    //    constructor(property: PricingViewModel) {
    //        this.getProperty = () => property;
    //    }

    //    get priceSearch() {
    //        return this.getProperty().priceSearch;
    //    }
    //    set priceSearch(priceSearch: PriceSearchViewModel) {
    //        this.getProperty().priceSearch = priceSearch;
    //    }

    //    get loanApp() {
    //        return this.getProperty().loanApp;
    //    }
    //    set loanApp(loanApp: cls.LoanApplicationViewModel) {
    //        this.getProperty().loanApp = loanApp;
    //    }

    //}

    //export interface IPricingAdvancedSearchViewModel {
    //    getRatesClicked: boolean;
    //}
}
