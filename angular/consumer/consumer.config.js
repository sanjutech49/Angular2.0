/// <reference path='../../Scripts/typings/ui-router/angular-ui-router.d.ts'/>
/// <reference path="consumer.service.ts" />
var docusign;
(function (docusign) {
    var config = (function () {
        function config($stateProvider, $urlRouterProvider) {
            this.$stateProvider = $stateProvider;
            this.$urlRouterProvider = $urlRouterProvider;
            this.init();
        }
        config.prototype.init = function () {
            this.$urlRouterProvider.otherwise('/authenticate');
            this.$stateProvider.state("authenticate", {
                url: '^/authenticate',
                views: {
                    '': {
                        templateUrl: '/angular/consumer/authentication/authentication.html',
                        controller: 'AuthenticationController as authCtrl'
                    }
                },
                params: {
                    previousState: {}
                }
            });
            this.$stateProvider.state("docusign", {
                abstract: true,
                url: '/',
                views: {
                    'navigationBar': {
                        templateUrl: '/angular/consumer/docusign/navigation/consumernavbar.html',
                        controller: 'ConsumerNavBarController as navBarCtrl'
                    },
                    '': {
                        template: '<div ui-view="mainView" class="view-body"></div>'
                    }
                },
                resolve: {
                    authenticationContext: function (docusignSVC, $q) {
                        var authenticationContext = docusignSVC.getAuthenticationContext();
                        return authenticationContext;
                    },
                    loanViewModel: function (docusignSVC, $q) {
                        docusignSVC.log('resolving loanViewModel');
                        var authenticationContext = docusignSVC.getAuthenticationContext();
                        if (authenticationContext != null) {
                            //var loanId = authenticationContext.loanId;
                            //var userAccountId = docusignSVC.getUserAccountId();
                            return docusignSVC.loadLoanViewModel();
                        }
                        else {
                            var q = $q.defer();
                            q.reject('AUTHENTICATION_ERROR');
                            return q.promise;
                        }
                    }
                }
            });
            this.$stateProvider.state("docusign.esign", {
                abstract: true,
                url: '^/esign',
                views: {
                    'mainView': {
                        template: '<div ui-view class="view-body"></div>'
                    }
                }
            });
            this.$stateProvider.state("docusign.esign.instructions", {
                parent: 'docusign.esign',
                url: '^/esignInstructions',
                views: {
                    '': {
                        templateUrl: '/angular/consumer/docusign/esigning/instructions/esigningInstructions.html',
                        controller: 'EInstructionController as eInstrCtrl'
                    }
                }
            });
            this.$stateProvider.state("docusign.esign.signing", {
                parent: 'docusign.esign',
                url: '^/esignSigning',
                views: {
                    '': {
                        templateUrl: '/angular/consumer/docusign/esigning/esigningroom/eSigningRoom.html',
                        controller: 'ESigningRoomController as eSigningRoomCtrl'
                    }
                }
            });
            this.$stateProvider.state("docusign.appraisal", {
                url: '^/appraisal',
                views: {
                    'mainView': {
                        templateUrl: '/angular/consumer/docusign/appraisal/appraisal.html',
                        controller: 'AppraisalController as appraisalCtrl'
                    }
                }
            });
            this.$stateProvider.state("docusign.docupload", {
                url: '^/upload',
                views: {
                    'mainView': {
                        templateUrl: '/angular/consumer/docusign/docupload/docupload.html',
                        controller: 'DocUploadController as docUpCtrl'
                    }
                }
            });
            this.$stateProvider.state("docusign.settings", {
                url: '^/econsentsettings',
                views: {
                    'mainView': {
                        templateUrl: '/angular/consumer/docusign/econsentsettings/econsentsettings.html',
                        controller: 'EConsentSettingsController as settingsCtrl'
                    }
                },
                params: { previousState: {} }
            });
        };
        return config;
    })();
    docusign.config = config;
})(docusign || (docusign = {}));
var app = angular.module('docusign').config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    return new docusign.config($stateProvider, $urlRouterProvider);
}]);
app.run(["$rootScope", "$state", "docusignSVC", function ($rootScope, $state, docusignSVC) {
    $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
        if (error == 'AUTHENTICATION_ERROR') {
            $state.go('authenticate', { 'previousState': toState });
        }
        else {
            docusignSVC.log(error, 'error');
        }
    });
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams, error) {
        var previousStateName = fromState.name;
        var stateName = toState.name;
        docusignSVC.log(previousStateName + ' > ' + stateName);
        //If we are navigating to any other page, then first load the 
        //if (stateName !== "authenticate") {
        //    var authenticationContext = docusignSVC.getAuthenticationContext();
        //    if (authenticationContext != null) {
        //        var loanId = authenticationContext.loanId;
        //        var userAccountId = docusignSVC.getUserAccountId(authenticationContext);
        //        docusignSVC.loadLoanViewModel(loanId, userAccountId).then(function () {
        //            if (docusignSVC.haveAllBorrowersEConsented() === false && stateName !== 'docusign.esign.instructions') {
        //                $state.go('docusign.esign.instructions');
        //                event.preventDefault(); //REMEMBER THIS LINE! OTHERWISE IT DOESN'T CHANGE PAGES.
        //            }
        //        });
        //    } else {
        //        $state.go('authenticate');
        //        event.preventDefault(); //REMEMBER THIS LINE! OTHERWISE IT DOESN'T CHANGE PAGES.
        //    }
        //} 
    });
}]);
//# sourceMappingURL=consumer.config.js.map