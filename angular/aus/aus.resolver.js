(function () {
    'use strict';

    angular.module('aus')
        .provider('ausResolver', ausResolver);

    function ausResolver() {
        this.$get = function () {
            return resolver;
        };

        function resolver($stateParams, $state, ausSvc, wrappedLoan, enums) {


            var ausObject = ausSvc.services.get({ loanId: wrappedLoan.ref.loanId }).$promise.then(
                    function (aus) {

                        wrappedLoan.ref.aus = aus;

                        if ($stateParams.tab != undefined && $stateParams.tab != null)
                            aus.selectedTab = $stateParams.tab;

                        aus.duEnabled = _.some(wrappedLoan.ref.product.loanAusTypes, function (ausType) { return ausType == enums.AusType.DU.toString() });
                        aus.lpEnabled = _.some(wrappedLoan.ref.product.loanAusTypes, function (ausType) { return ausType == enums.AusType.LP.toString() });

                        return aus;
                    });

            return ausObject;
        }
    }
})();