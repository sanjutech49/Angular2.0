(function () {
    angular.module('LoanCenter').controller('LoanScenarioPageController', LoanScenarioPageController);
    LoanScenarioPageController.$inject = ['$scope', '$rootScope', 'NavigationSvc', 'enums'];

    function LoanScenarioPageController($scope, $rootScope, NavigationSvc, enums) {
        $rootScope.startItemOpen = false;
        $rootScope.startItemHover = false;
        $rootScope.navigation = 'LoanScenario';

        NavigationModel = {
            ContextualType: enums.ContextualTypes.LoanScenario
        };
        $scope.template = 'angular/loanscenario/loanscenario.html';
        NavigationSvc.OpenItem(NavigationModel, enums.ContextualTypes.LoanScenario);
    }
})();