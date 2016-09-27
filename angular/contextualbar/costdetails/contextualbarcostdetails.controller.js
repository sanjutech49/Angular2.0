(function () {
    'use strict';

    angular.module('loanCenter').controller('ContextualBarCostDetailsCtrl', contextualBarCostDetailsController);

    contextualBarCostDetailsController.$inject = ['$scope', '$location', 'anchorSmoothScroll', '$modal', 'enums', 'wrappedLoan', 'costDetailsSvc', '$q', '$rootScope', 'TransactionalSummaryService'];

    function contextualBarCostDetailsController($scope, $location, anchorSmoothScroll, $modal, enums, wrappedLoan, costDetailsSvc, $q, $rootScope, TransactionalSummaryService) {

        var vm = this;
        vm.enums = enums;
        vm.wrappedLoan = wrappedLoan;
        vm.totals = {};
        vm.zeroPercentTolerance = 0;
        vm.tenPercentTolerance = 0;

        vm.toggleAutomatedFees = function () {
            vm.wrappedLoan.ref.smartGFEEnabled = !vm.wrappedLoan.ref.smartGFEEnabled;
        }

        vm.scrollTo = function (id) {
            var old = $location.hash();
            $location.hash(id);
            //Pass the html id along with the offset for space taken up by nav and contextual bars
            anchorSmoothScroll(id, 169);
            $location.hash(old);
        }

        vm.getColorCode = function (value, threshHold) {
            return (parseFloat(value) > parseFloat(threshHold)) ? 'alert-red' : 'primary-green';
        }

        $scope.$on('CostDetailsLoaded', function (event) {
            vm.totals = costDetailsSvc.wrappedLoan.ref.closingCost.totals;
            if (costDetailsSvc.activeToleranceData && costDetailsSvc.activeToleranceData.zeroTolerance)
                vm.zeroPercentTolerance = costDetailsSvc.activeToleranceData.zeroTolerance.changePercent;
            if (costDetailsSvc.activeToleranceData && costDetailsSvc.activeToleranceData.tenPercentTolerance)
                vm.tenPercentTolerance = costDetailsSvc.activeToleranceData.tenPercentTolerance.changePercent;

            vm.totalFromBorrower = TransactionalSummaryService.calculate(wrappedLoan.ref.transactionSummary, wrappedLoan.ref);
        });

        $scope.$on('CostDetailsTotalsUpdated', function (event) {
            vm.totals = costDetailsSvc.wrappedLoan.ref.closingCost.totals;
            vm.totalFromBorrower = TransactionalSummaryService.calculate(wrappedLoan.ref.transactionSummary, wrappedLoan.ref);

            costDetailsSvc.updateActiveToleranceTotals().then(function (data) {
                vm.zeroPercentTolerance = data.zeroTolerance == undefined ? 0 : data.zeroTolerance.changePercent;
                vm.tenPercentTolerance = data.tenPercentTolerance == undefined ? 0 : data.tenPercentTolerance.changePercent;
            },
            function (errorMsg) {
                console.log("Error:" + JSON.stringify(errorMsg));
            });
        });

        vm.toleranceModal = function () {
            var modalInstance = $modal.open({
                templateUrl: 'angular/contextualbar/costdetails/tolerancemodal.html',
                controller: 'toleranceModalController',
                controllerAs: 'toleranceModalCtrl',
                backdrop: 'static',
                windowClass: 'imp-modal flyout imp-model-tolerance-modal',
                resolve: {
                    costDetailsSvc: function () {
                        return costDetailsSvc;
                    },
                    $q: function () {
                        return $q;
                    },
                    $rootScope: function () {
                        return $rootScope;
                    },
                    $scope: function () {
                        return $scope;
                    }
                }
            });
        }
    }
})();