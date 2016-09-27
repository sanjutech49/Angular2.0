(function () {
    angular.module('LoanCenter').controller('CostDetailsPageController', CostDetailsPageController);
    CostDetailsPageController.$inject = ['$scope', '$rootScope', 'NavigationSvc', 'enums', '$routeParams'];

    function CostDetailsPageController($scope, $rootScope, NavigationSvc, enums, $routeParams) {
        $rootScope.loanItemOpen = false;
        $rootScope.loanItemHover = false;
        //This is kinda of evil.  We really shouldn't use rootScope anywhere but we need
        //to do some template refacotring in order to use the controller's scope.
        $rootScope.closingCosts = { activeTab: $routeParams.tab }
        $scope.activeTab = $routeParams.tab;

        //TODO: Need to add else template string
        $scope.template = ($scope.activeTab == 'closing-costs') ? 'angular/costdetails/costdetails.html' : '/angular/costdetails/transactionalsummary/transactionalsummary.html';

        $rootScope.userAccountId = $('#hdnLoggedUserAccountId').val();
        NavigationModel = {
            ContextualType: enums.ContextualTypes.CostDetails
        };
        $rootScope.navigation = 'CostDetails';
        NavigationSvc.OpenItem(NavigationModel, enums.ContextualTypes.CostDetails);
    }
})();