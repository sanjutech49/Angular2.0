(function () {
    'use strict';

    angular.module('loanApplication')
    .constant('propertyConstant', {
        PURCHASE: {
            LABELS: {
                PRICE: 'Purchase Price',
                PAYMENT: 'Down Payment',
                SOURCE: 'Down Payment Source'
            }
        },
        REFINANCE: {
            LABELS: {
                PRICE: 'Estimated Value',
                PAYMENT: 'Original Purchase Price',
                SOURCE: 'Original Purchase Date'
            }
        }
    });
})();
