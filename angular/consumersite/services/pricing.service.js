var consumersite;
(function (consumersite) {
    var PricingService = (function () {
        function PricingService($resource, apiRoot) {
            var _this = this;
            this.$resource = $resource;
            this.apiRoot = apiRoot;
            this.getProducts = function (loanViewModel) {
                return _this.loanScenarios.shopForRates({ currentUserId: 82313, sixPieces: false }, loanViewModel);
            };
            var pricingResultsApiPath = this.apiRoot + 'PricingResults/';
            this.loanScenarios = this.$resource(pricingResultsApiPath + 'GetPricingResultsWithLoanOptions', {}, {
                shopForRates: {
                    method: 'POST',
                    url: pricingResultsApiPath + 'GetPricingResultsWithLoanOptions',
                    params: { currentUserId: '@currentUserId', sixPieces: '@sixPieces', loanViewModel: '@loanViewModel' }
                }
            });
        }
        PricingService.className = 'pricingService';
        PricingService.$inject = ['$resource', 'apiRoot'];
        return PricingService;
    })();
    consumersite.PricingService = PricingService;
    moduleRegistration.registerService(consumersite.moduleName, PricingService);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=pricing.service.js.map