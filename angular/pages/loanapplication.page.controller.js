(function () {
    angular.module('LoanCenter').controller('LoanApplicationPageController', LoanApplicationPageController);
    LoanApplicationPageController.$inject = ['$scope', '$rootScope', 'NavigationSvc', 'enums', '$routeParams'];

    function LoanApplicationPageController($scope, $rootScope, NavigationSvc, enums, $routeParams) {
        $rootScope.loanItemOpen = false;
        $rootScope.loanItemHover = false;
        //Todo: need to add selectedTab variable passed in via url
        $rootScope.navigation = 'LoanApplication';
        $rootScope.selectedTab = $routeParams.tab;
        $scope.template = 'angular/loanapplication/loanapplication.html';
        NavigationModel = {
            ContextualType: enums.ContextualTypes.LoanApplication
        };
        angular.forEach(NavigationSvc.LoanAppTabs, function (tab, tabName) {
            if ($routeParams.tab.toLowerCase() === tabName.toLowerCase()) {
                tab.isSelected = true;
            } else {
                tab.isSelected = false;
            }
        });

        NavigationSvc.OpenItem(NavigationModel, enums.ContextualTypes.LoanApplication);
    }
})();