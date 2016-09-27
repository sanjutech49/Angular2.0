(function () {
    angular.module('LoanCenter').controller('AusPageController', AusPageController);
    AusPageController.$inject = ['$scope', '$rootScope', 'NavigationSvc', 'enums'];

    function AusPageController($scope, $rootScope, NavigationSvc, enums) {
        $rootScope.loanItemOpen = false;
        $rootScope.loanItemHover = false;
        $rootScope.userAccountId = $('#hdnLoggedUserAccountId').val();
        NavigationModel = {
            ContextualType: enums.ContextualTypes.Aus
        };
        $rootScope.navigation = "AUS";
        $scope.template = 'angular/aus/aus.html';
        NavigationSvc.OpenItem(NavigationModel, enums.ContextualTypes.Aus);
    }
})();