(function () {

    angular.module('LoanCenter').controller('ComplianceEasePageController', ComplianceEasePageController);
    ComplianceEasePageController.$inject = ['$scope', '$rootScope', 'NavigationSvc', 'enums'];

    function ComplianceEasePageController($scope, $rootScope, NavigationSvc, enums) {
        $rootScope.loanItemOpen = false;
        $rootScope.loanItemHover = false;
        $rootScope.navigation = 'ComplianceEase';
        $scope.template = 'angular/ComplianceEase/complianceease.html';
        NavigationModel = {
            ContextualType: enums.ContextualTypes.ComplianceEase
        };

        NavigationSvc.OpenItem(NavigationModel, enums.ContextualTypes.ComplianceEase);

    }
})();

