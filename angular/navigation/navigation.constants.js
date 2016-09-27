(function () {
    'use strict';

    angular.module('loanCenter')
    .constant('navigationConstant', {
        WHOLESALE: {
            LABELS: {
                CLOSED_LOANS: 'Closed',
                CANCELLED_LOANS: 'Cancelled',
                INCOMPLETE: 'Incomplete',
                PREAPPROVAL: 'PreApproved',
                QUEUE: 'My Pipeline'
            }
        },
        ORDINARY: {
            LABELS: {
                CLOSED_LOANS: 'Closed Loans',
                CANCELLED_LOANS: 'Cancelled Loans',
                INCOMPLETE: 'Incomplete',
                PREAPPROVAL: 'PreApproval',
                QUEUE: 'My Pipeline'
            }
        }
    });
})();