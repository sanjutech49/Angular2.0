
(function () {
    'use strict';
    angular.module('loanApplication')
        .provider('creditResolver', creditResolver);

    /**
    * Resolves a client side model containing flags and properties specific to the client side only.
    */
    function creditResolver() {
        this.$get = function () {
            return resolver;
        };

        function resolver(creditService) {

            var creditService = creditService;
            
            
            var services = {
                common: {
                    disableFields: false
                },
                liabilities: {
                    flags: {
                        isDisableFields: false,
                        isCollapsed: false
                    }
                },
                isCollapsed: {
                    liabilities: false,
                    realEstate: false,
                    collections: false,
                    miscExpenses: false,
                    publicRecords: false
                }
            }

            return services;
        }
    }
})();