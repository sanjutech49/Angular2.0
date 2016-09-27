(function () {
    angular.module('LoanCenter').controller('LoanDetailsPageController', LoanDetailsPageController);
    LoanDetailsPageController.$inject = ['$scope', '$rootScope', 'NavigationSvc', 'enums'];

    function LoanDetailsPageController($scope, $rootScope, NavigationSvc, enums) {
        $rootScope.loanItemOpen = false;
        $rootScope.loanItemHover = false;
        $rootScope.navigation = 'LoanDetails';
        $scope.template = 'angular/loandetails/maincontainer.html';
        NavigationModel = {
            ContextualType: enums.ContextualTypes.LoanDetails
        };

        NavigationSvc.OpenItem(NavigationModel, enums.ContextualTypes.LoanDetails);

    }
})();