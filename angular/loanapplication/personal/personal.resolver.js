
(function () {
    'use strict';
    angular.module('loanApplication')
        .provider('personalResolver', personalResolver);

    function personalResolver() {
        this.$get = function () {
            return resolver;
        };

        function resolver(wrappedLoan) {

            var service = {              

                isEmailFieldDisabled: {
                    borrower: wrappedLoan.ref.active && wrappedLoan.ref.active.getBorrower().userAccount.username && wrappedLoan.ref.active.getBorrower().userAccount.isOnlineUser && wrappedLoan.ref.active.getBorrower().userAccount.username.trim() !== '',
                    coBorrower: wrappedLoan.ref.active && wrappedLoan.ref.active.isSpouseOnTheLoan && wrappedLoan.ref.active && wrappedLoan.ref.active.getCoBorrower().userAccount.username && wrappedLoan.ref.active.getCoBorrower().userAccount.isOnlineUser && wrappedLoan.ref.active.getCoBorrower().userAccount.username.trim() !== ''
                },
                flags: {
                    showEmailDisclaimerSameAsBorrower: function () { return wrappedLoan.ref.active && wrappedLoan.ref.active.getBorrower().userAccount.username && wrappedLoan.ref.active.getCoBorrower().userAccount.username && wrappedLoan.ref.active.getBorrower().username != '' && wrappedLoan.ref.active.getCoBorrower().userAccount.username != '' && wrappedLoan.ref.active.getCoBorrower().userAccount.username == wrappedLoan.ref.active.getBorrower().userAccount.username },
                    showEmailDisclaimerDifferentThanBorrower: function () { return wrappedLoan.ref.active && wrappedLoan.ref.active.getBorrower().userAccount.username && wrappedLoan.ref.active.getCoBorrower().userAccount.username && wrappedLoan.ref.active.getCoBorrower().username != '' && wrappedLoan.ref.active.getCoBorrower().userAccount.username != wrappedLoan.ref.active.getBorrower().userAccount.username }
                }             
            };

            return service;
        }
    }
})();





