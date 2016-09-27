var loancenter;
(function (loancenter) {
    'use strict';
    angular.module('loanCenter').directive('impTransactionsSummary', ['TransactionalSummaryService', '$timeout', 'BroadcastSvc', function (TransactionalSummaryService, $timeout, BroadcastSvc) {
        return {
            restrict: 'E',
            templateUrl: 'angular/costdetails/transactionalsummary/transactions.html',
            bindToController: true,
            scope: {
                'wrappedLoan': '=',
                'borrowerDataK': '=',
                'borrowerDataL': '=',
                'sellerDataM': '=',
                'sellerDataN': '=',
                'costController': '='
            },
            controller: function ($scope) {
                console.log($scope.transactionsCtrl.wrappedLoan);
                function countRows(subSectionList) {
                    var sum = 0;
                    if (angular.isUndefined(subSectionList)) {
                        return sum;
                    }
                    for (var i = 0; i < subSectionList.length; i++) {
                        if (Array.isArray(subSectionList[i].records)) {
                            sum += subSectionList[i].records.length;
                        }
                    }
                    return sum;
                }
                $scope.transactionsCtrl.kCount = countRows($scope.transactionsCtrl.borrowerDataK.subSectionList);
                $scope.transactionsCtrl.lCount = countRows($scope.transactionsCtrl.borrowerDataL.subSectionList);
                $scope.transactionsCtrl.mCount = countRows($scope.transactionsCtrl.sellerDataM.subSectionList);
                $scope.transactionsCtrl.nCount = countRows($scope.transactionsCtrl.sellerDataN.subSectionList);
            },
            controllerAs: 'transactionsCtrl'
        };
    }]);
})(loancenter || (loancenter = {}));
;
//# sourceMappingURL=transactions.directive.js.map