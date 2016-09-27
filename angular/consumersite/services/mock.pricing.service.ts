module consumersite {
    export class MockPricingService {

        static className = 'mockPricingService';
        public static $inject = [];
        private results: consumersite.vm.PricingRowViewModel[] = [
            { productId: '1', LoanAmortizationTerm: '30', AmortizationType: 'Fixed',     AdjustmentPeriod: '', TitleYears: '30', Rate: '4.000', APR: '4.176', MonthlyPayment: '3610', TotalCost: '6617' , isLowCost: false, isTopPick: false, isLowRateARM: false, isPayoffQuickly: false, isLowFixed: false, isNoCost: false, compare: false, LoanOptionType: '1' },
            { productId: '2', LoanAmortizationTerm: '30', AmortizationType: 'Fixed FHA', AdjustmentPeriod: '', TitleYears: '30', Rate: '4.750', APR: '4.918', MonthlyPayment: '3910', TotalCost: '11617', isLowCost: false, isTopPick: false, isLowRateARM: false, isPayoffQuickly: false, isLowFixed: false, isNoCost: false, compare: false, LoanOptionType: '1' },
            { productId: '3', LoanAmortizationTerm: '15', AmortizationType: 'Fixed',     AdjustmentPeriod: '', TitleYears: '30', Rate: '3.500', APR: '3.752', MonthlyPayment: '5610', TotalCost: '6617' , isLowCost: false, isTopPick: false, isLowRateARM: false, isPayoffQuickly: false, isLowFixed: false, isNoCost: false, compare: false, LoanOptionType: '1' },
            { productId: '4', LoanAmortizationTerm: '30', AmortizationType: 'ARM',       AdjustmentPeriod: '5', TitleYears: '5', Rate: '4.375', APR: '4.591', MonthlyPayment: '5710', TotalCost: '11617', isLowCost: false, isTopPick: false, isLowRateARM: false, isPayoffQuickly: false, isLowFixed: false, isNoCost: false, compare: false, LoanOptionType: '1' },
            { productId: '5', LoanAmortizationTerm: '30', AmortizationType: 'ARM',       AdjustmentPeriod: '3', TitleYears: '3', Rate: '2.750', APR: '3.220', MonthlyPayment: '3010', TotalCost: '8617' , isLowCost: true , isTopPick: true , isLowRateARM: true , isPayoffQuickly: false, isLowFixed: false, isNoCost: false, compare: false, LoanOptionType: '1' },
        ];



        private loanScenario: any;
        private _loan: vm.Loan;

        constructor() { }

        getProducts = (loan: vm.Loan): ng.IPromise<consumersite.vm.PricingRowViewModel[]> | consumersite.vm.PricingRowViewModel[] => {
            return this.results;
        }



    }
    moduleRegistration.registerService(consumersite.moduleName, MockPricingService);
}
