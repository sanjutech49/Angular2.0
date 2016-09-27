(function () {
    angular.module('LoanCenter').controller('HomePageController', HomePageController);
    HomePageController.$inject = ['$scope', '$rootScope', 'NavigationSvc', 'enums', '$routeParams'];

    function HomePageController($scope, $rootScope, NavigationSvc, enums, $routeParams) {
        //Todo:  This will get filled out once we switch to single html page app
        // Right now this is just a stub to fix the firefox redirection issue
    }
})();