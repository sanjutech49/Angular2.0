(function () {
    angular.module('LoanCenter').controller('PricingResultsPageController', PricingResultsPageController);
    PricingResultsPageController.$inject = ['$scope', '$rootScope', 'NavigationSvc', 'enums'];

    function PricingResultsPageController($scope, $rootScope, NavigationSvc, enums) {
        $rootScope.startItemOpen = false;
        $rootScope.startItemHover = false;
        $rootScope.navigation = 'PricingResults';

        NavigationModel = {
            ContextualType: enums.ContextualTypes.PricingResults
        };
        $scope.template = 'angular/pricingresults/pricingresults.html';
        NavigationSvc.OpenItem(NavigationModel, enums.ContextualTypes.PricingResults);
    }
})();