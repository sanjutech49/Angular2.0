module consumersite {

    export class PricingService {

        static className = 'pricingService';

        public static $inject = ['$resource', 'apiRoot'];

        private loanScenarios;

        constructor(private $resource: ng.resource.IResourceService, private apiRoot: string) {     
            var pricingResultsApiPath = this.apiRoot + 'PricingResults/';

            this.loanScenarios = this.$resource(pricingResultsApiPath + 'GetPricingResultsWithLoanOptions', { }, {
                shopForRates: {
                    method: 'POST',
                    url: pricingResultsApiPath + 'GetPricingResultsWithLoanOptions',
                    params: { currentUserId: '@currentUserId', sixPieces: '@sixPieces', loanViewModel: '@loanViewModel' }
                }
            });
       
        }

        

        getProducts = (loanViewModel: cls.LoanViewModel): any => {
            return this.loanScenarios.shopForRates({ currentUserId: 82313, sixPieces: false }, loanViewModel);  
        }
    }
    moduleRegistration.registerService(consumersite.moduleName, PricingService);
}
