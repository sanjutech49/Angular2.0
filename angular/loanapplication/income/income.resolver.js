(function () {
    'use strict';
    angular.module('loanApplication')
        .provider('incomeResolver', incomeResolver);

    /**
    * Resolves a client side model containing flags and properties specific to the client side only.
    */
    function incomeResolver() {

        this.$get = function () {
            return resolver;
        };

        function resolver() {
            
            var service = {
                isExpanded : {
                    borrower: true,
                    coBorrower: true
                },
                showErrorContainer: false,
                showLoader: false,
                disableFields: false
            };

            return service;

        }       
    }
})();