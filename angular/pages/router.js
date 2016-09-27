(function () {
    angular.module('LoanCenter').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        console.log($routeProvider);
        $routeProvider
            .when('/aus', {
                templateUrl: 'angular/pages/viewtype1.template.html',
                controller: 'AusPageController'
            })
            .when('/cost-details/:tab', {
                templateUrl: 'angular/pages/viewtype2.template.html',
                controller: 'CostDetailsPageController'
            })
            .when('/documents', {
                templateUrl: 'angular/pages/viewtype2.template.html',
                controller: 'DocumentsPageController'
            })
            .when('/loan-application/:tab', {
                templateUrl: 'angular/pages/viewtype1.template.html',
                controller: 'LoanApplicationPageController'
            })
            .when('/loan-details', {
                templateUrl: 'angular/pages/viewtype2.template.html',
                controller: 'LoanDetailsPageController'
            })
            .when('/loan-scenario', {
                templateUrl: 'angular/pages/viewtype2.template.html',
                controller: 'LoanScenarioPageController'
            })
            .when('/pricing-results', {
                templateUrl: 'angular/pages/viewtype2.template.html',
                controller: 'PricingResultsPageController'
            })
            .otherwise({
                redirectTo: "/"
            });
       

        //TODO: need to see what affects this has on the app.
        // use the HTML5 History API
        $locationProvider.html5Mode(false);
        //$locationProvider.html5Mode(true).hashPrefix('!');
        
    }]);
})()