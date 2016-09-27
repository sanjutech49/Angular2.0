(function () {
    'use strict';
    angular.module('loanCenter')
        .service('loanService', ['$resource', 'apiRoot', '$filter', '$http', '$log', loanService]);

    function loanService($resource, apiRoot, $filter, $http, $log) {
        var loanApiPath = apiRoot + 'loan/';
        var loanExApiPath = apiRoot + 'LoanEx/';

        //var megaLoanServices = {
        //    eagerLoad: function (loanId, userAccountId) {
        //        return $http.get(apiRoot + 'MegaLoanService/EagerLoad', { loanID: loanId, userAccountID: 1 });
        //    },
        //    save: function (loan, userAccountId) {
        //        return $http.post(apiRoot + 'MegaLoanService/Save', loan, { params: {userAccountId: 1}});
        //    }
        //};

        var liablityServices = $resource(apiRoot + 'LiabilityService/', {
            applyCommentLiability : {  method: 'POST', params: { debtViewModel: 'debtViewModel', accountId: 'accountId' } },
            applyCommentCollection: { method: 'POST', params: { debtViewModel: 'debtViewModel', userAccountId: 'userAccountId' } },
            applyCommentPublicRecord: { method: 'POST', params: { publicRecordViewModel: 'publicRecordViewModel', userAccountId: 'userAccountId' } },
            createLiabilityRecords: { method: 'POST', params: { debtAccountOwnershipType: 'debtAccountOwnershipType', borrowerId : 'borrowerId', secondaryBorrowerId : 'secondaryBorrowerId' } },
            convertLiabilityOwnership: { method: 'POST', params: { debtVm : 'debtVm' } },
            applyCommentReo: { method: 'POST', params: { pledgedAssetVm : 'pledgedAssetVm' } }
        });

        var newCreditServices = $resource(apiRoot + 'MegaLoanService/', {
            reRunCreditReport: { method: 'GET', params: { loanId: 'loanId', userAccountId: 'accountId', reRunCredit: 'reRunCredit', borrowerId: 'borrowerId' } }
        });

        var releasingServices = $resource(loanExApiPath, {}, { releaseControlAndAcquireLock: { method: 'GET', params: { loanId: 'loanId', userAccountId: 'userAccountId', lockOwnerId: 'lockOwnerId' } } });

        var wrappedLoan = {};

        var service = {
            loan: loan,
            loanEx: loanEx,
            releaseControl: releaseControl,
            getActiveLoanApplication: getActiveLoanApplication,
            getPrimaryLoan: getPrimaryLoan,
            //megaLoanServices: megaLoanServices,
            liablityServices: liablityServices,
            newCreditServices: newCreditServices,
            wrappedLoan: wrappedLoan,
            lazyLoad: lazyLoad,
            releasingServices: releasingServices
        };

        return service;

        function loan() {
            return $resource(loanApiPath);
        }

        function loanEx() {
            return $resource(loanExApiPath);
        }

        function releaseControl(userAccountId, loanId) {
            loanEx().get({ loanId: loanId, userAccountId: userAccountId }).$promise.then(function (o) {
                console.log("releaseControl(" + userAccountId + ", " + loanId + ") SUCCESS:" + o.lockOwnerUserName);
            }, function (o) {
                console.log("releaseControl(" + userAccountId + ", " + loanId + ") FAIL:" + o.lockOwnerUserName);
            });
        }

        function lazyLoad(controller, loanId, userAccountId) {
            var url = apiRoot + controller + '/';

            var httpGet = $http({
                url: url,
                method: "GET",
                params: { loanId: loanId, userAccountId: userAccountId }
            });
            return httpGet;
        }

        function getActiveLoanApplication(loan) {
            return $filter('filter')(loan.getLoanApplications(), { loanApplicationId: loan.loanId }, true)[0];
        }

        function getPrimaryLoan(loan) {
            return $filter('filter')(loan.getLoanApplications(), { isPrimary: true }, true)[0];
        }
    }
})();