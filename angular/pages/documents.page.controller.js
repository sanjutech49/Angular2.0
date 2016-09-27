(function () {
    angular.module('LoanCenter').controller('DocumentsPageController', DocumentsPageController);
    DocumentsPageController.$inject = ['$scope', '$rootScope', 'NavigationSvc', 'enums'];

    function DocumentsPageController($scope, $rootScope, NavigationSvc, enums) {
        $rootScope.loanItemOpen = false;
        $rootScope.loanItemHover = false;
        $rootScope.userAccountId = $('#hdnLoggedUserAccountId').val();
        NavigationModel = {
            ContextualType: enums.ContextualTypes.Documents
        };
        $rootScope.navigation = "Documents";
        $scope.template = 'angular/documents/documents.html';
        NavigationSvc.OpenItem(NavigationModel, enums.ContextualTypes.Documents);
    }
})();