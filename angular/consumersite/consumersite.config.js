/// <reference path='../../Scripts/typings/ui-router/angular-ui-router.d.ts'/>
/// <reference path='providers/uiNavigation.provider.ts' />
var consumersite;
(function (consumersite) {
    angular.module(consumersite.moduleName).config(["$stateProvider", "$urlRouterProvider", 'blockUIConfig', 'uiNavigationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, blockUIConfig, uiNavigationProvider, $httpProvider) {
        //
        // @begin
        //      @see [loancenter.config.js] ; @todo: need to convert to TypeScript and consolodate
        //          $httpProvider.defaults.transformRequest = function (payload) {
        //
        $httpProvider.defaults["transformRequest"] = consumersite.json.removeFields;
        // @end
        blockUIConfig.autoBlock = false;
        $urlRouterProvider.otherwise('/home');
        $stateProvider.state('authenticate', {
            params: { token: { value: null }, nextState: { value: null } },
            url: '/authenticate?token?nextState',
            views: {
                'abstract': {
                    templateUrl: '/angular/consumersite/authentication/authentication.html',
                    controller: 'authenticateController as authCntrl'
                }
            } //,
        }).state('consumerSite', {
            'abstract': true,
            params: { token: { value: null } },
            resolve: {
                //userAccountId: (userAccountIdResolver, applicationDataService) => {
                //    return userAccountIdResolver(applicationDataService);
                //},
                userAccountId: function (userAccountIdResolver, applicationDataService) {
                    //@TODO 
                    return 82313;
                },
                userAccount: function (userAccountId, applicationDataService) {
                    return applicationDataService.getUserAccount(userAccountId).then(function (response) {
                        return new cls.UserAccountViewModel(response.data);
                    });
                },
                controllerData: function (queueResolver, queueSvc, $stateParams, blockUI, userAccount, enums) {
                    return queueResolver(queueSvc, $stateParams, blockUI, userAccount, enums);
                },
                applicationData: function (applicationDataResolver, applicationDataService, $stateParams, $rootScope, enums, userAccountId) {
                    return applicationDataResolver(applicationDataService, $stateParams, $rootScope, enums, userAccountId);
                },
                hasGuids: function (applicationDataService) {
                    return applicationDataService.getGuids(5000).then(function (response) {
                        util.IdentityGenerator.setGuids(response.data.Response);
                        return true;
                    });
                },
                loanContext: function (authenticationService, $stateParams) {
                    return $stateParams['token'] ? authenticationService.getLoanContext($stateParams['token']) : {};
                },
                loan: ([consumersite.UINavigationService.className, 'hasGuids', 'applicationData', 'loanContext', 'userAccountId', 'MegaLoanService', '$filter', function (navigationService, hasGuids, applicationData, loanContext, userAccountId, MegaLoanService, $filter) {
                    if (loanContext.loanId) {
                        return MegaLoanService.EagerLoad(loanContext.loanId, userAccountId, 'Loading Loan').then(function (loanVM) {
                            var loan = new consumersite.vm.Loan(applicationData, loanVM, $filter);
                            navigationService.setLoan(loan);
                            return loan;
                        });
                    }
                    else {
                        var loan = new consumersite.vm.Loan(applicationData);
                        navigationService.setLoan(loan);
                        return loan;
                    }
                }]),
            },
            views: {
                'abstract': {
                    template: '<div ui-view="header"><i>Header Failed to Load.</i></div><div ui-view="banner"></div><div ui-view="mainView"><i>Main View Failed to Load.</i></div>'
                }
            }
        }).state('consumerSite.home', {
            params: { loanId: { value: null } },
            url: '/home?token',
            views: {
                'mainView': {
                    templateUrl: '/angular/consumerSite/consumersite.html',
                    controller: 'consumerSiteController as conSiteCntrl'
                }
            }
        }).state('consumerSite.pricing', {
            url: '/pricing',
            views: {
                'header': {
                    template: '<h3>Pricing Header</h3>',
                },
                'mainView': {
                    templateUrl: '/angular/consumersite/pricing/pricing.html',
                    controller: 'pricingController as pricingCntrl'
                },
            }
        }).state('consumerSite.loanApp', {
            'abstract': true,
            views: {
                'header': {
                    templateUrl: '/angular/consumerSite/header/loanAppHeader.html',
                    controller: 'loanAppHeaderController as loanAppHeaderCntrl'
                },
                'banner': {
                    templateUrl: '/angular/consumerSite/banner/banner.html',
                    controller: 'bannerController as bannerCntrl',
                },
                'mainView': {
                    templateUrl: '/angular/consumerSite/loanApp/loanapp.page.html'
                },
            }
        }).state('consumerSite.myNextStep', {
            'abstract': true,
            views: {
                'header': {
                    templateUrl: '/angular/consumerSite/myNextStep/header/myNextStepHeader.html',
                    controller: 'loanAppHeaderController as loanAppHeaderCntrl'
                },
                'mainView': {
                    templateUrl: '/angular/consumerSite/myNextStep/myNextStep.page.html'
                },
            }
        }).state('consumerSite.myNextStep.myNextStepMain', {
            params: {
                token: { value: null }
            },
            url: '/myNextStepMain?token',
            views: {
                '': {
                    templateUrl: '/angular/consumerSite/myNextStep/myNextStepMain/myNextStepMain.html',
                    controller: 'myNextStepMainController as myNextStepMainCntrl'
                },
            }
        }).state('consumerSite.myNextStep.docusign', {
            params: {
                token: { value: null }
            },
            url: '/docusign?token',
            'abstract': true,
            views: {
                '': {
                    template: '<div ui-view="docusignView"></div>',
                },
            }
        }).state('consumerSite.myNextStep.docusign.instructions', {
            url: '/instructions?token',
            params: {
                token: { value: null }
            },
            views: {
                'docusignView': {
                    templateUrl: '/angular/consumerSite/myNextStep/docusign/docusign.instructions.html',
                    controller: 'docusignInstructionsController as docusignInstructionsCntrl'
                },
            }
        }).state('consumerSite.myNextStep.docusign.esigning', {
            url: '/esigning?token',
            params: {
                token: { value: null }
            },
            views: {
                'docusignView': {
                    templateUrl: '/angular/consumerSite/myNextStep/docusign/docusign.html',
                    controller: 'eSigningRoomController as eSigningRoomCntrl'
                },
            }
        }).state('consumerSite.myNextStep.appraisal', {
            url: '/appraisal?token',
            params: {
                token: { value: null }
            },
            views: {
                '': {
                    templateUrl: '/angular/consumerSite/myNextStep/appraisal/appraisal.html',
                    controller: 'appraisalController as appraisalCntrl'
                },
            }
        }).state('consumerSite.myNextStep.documentUpload', {
            url: '/documentUpload?token',
            params: {
                token: { value: null }
            },
            views: {
                '': {
                    templateUrl: '/angular/consumerSite/myNextStep/documentUpload/documentUpload.html',
                    controller: 'documentUploadController as documentUploadCntrl'
                },
            }
        });
        var loanAppStates = uiNavigationProvider.getConsumerLoanAppStates();
        for (var i = 0; i < loanAppStates.length; i++) {
            var loanAppState = loanAppStates[i];
            $stateProvider.state({
                params: { ns: { value: null }, token: { value: null } },
                name: loanAppState.stateName,
                controller: loanAppState.controllerName,
                controllerAs: loanAppState.controllerAs,
                templateUrl: loanAppState.templateUrl,
                data: { loanAppNavState: loanAppState.loanAppNavState, isCoBorrowerState: loanAppState.isCoBorrowerState },
                url: loanAppState.url + '?token&ns'
            });
        }
    }]).run(['$rootScope', '$state', 'navigationService', function ($rootScope, $state, navigationService) {
        var state = $state;
        var stateHasValue = function (state) {
            return state && state.data && state.data.loanAppNavState;
        };
        $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
            if (error == security.authentication_exception) {
                state.go('authenticate', { nextState: toState.name, token: toParams['token'] });
            }
        });
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            console.log(fromState.name + ' -> ' + toState.name);
        });
        $rootScope.$on("$stateNotFound", function (event, toState, toParams, fromState, fromParams, error) {
            console.log(error);
        });
        $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
            console.log("Contents loading.");
        });
        $rootScope.$on('$viewContentLoaded', function (event, viewConfig) {
            navigationService.onCurrentState();
        });
    }]);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=consumersite.config.js.map