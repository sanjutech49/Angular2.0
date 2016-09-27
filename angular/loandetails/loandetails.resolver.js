(function () {
    'use strict';
    angular.module('loanDetails')
        .provider('loanDetailsResolver', loanDetailsResolver);

    /**
    * Resolves a client side model containing flags and properties specific to the client side only.
    */
    function loanDetailsResolver() {

        this.$get = function () {
            return resolver;
        };

        function resolver(enums, $stateParams) {

            var service = {
                getLockColor: getLockColor,
                getLockExpirationText: getLockExpirationText,
                productInfoHeight: false,
                repricing: false
            };

            service.repricing = $stateParams['repricing'];

            /**
            * @desc Gets the lock color based on the expiration days.
            */
            function getLockColor() {
                // TODO: Move implementation from TitleRowViewModelBuilder
                return enums.iconColors.active;
            }

            /**
            * @desc Builds the lock expiration description text indicating when the lock expires or expired.
            */
            function getLockExpirationText() {
                // TODO: Move implementation from TitleRowViewModelBuilder
                return "Expired";
            }

            return service;
        }
    }
})();