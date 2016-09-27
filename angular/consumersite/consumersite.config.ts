/// <reference path='../../Scripts/typings/ui-router/angular-ui-router.d.ts'/>
/// <reference path='providers/uiNavigation.provider.ts' />

module consumersite {

    angular.module(moduleName).config(["$stateProvider", "$urlRouterProvider", 'blockUIConfig', 'uiNavigationProvider', '$httpProvider',
        ($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider, blockUIConfig, uiNavigationProvider: navigation.UINavigationProvider,
            $httpProvider: ng.IHttpProvider) => {

            //
            // @begin
            //      @see [loancenter.config.js] ; @todo: need to convert to TypeScript and consolodate
            //          $httpProvider.defaults.transformRequest = function (payload) {
            //

            $httpProvider.defaults["transformRequest"] = json.removeFields;

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
                }//,
                //resolve: {
                //    loanContext: (authenticationService: security.AuthenticationService, $stateParams) => {
                //        return authenticationService.getLoanContext($stateParams['token']);
                //    }
                //} 

            }).state('consumerSite', {
                'abstract': true,
                params: { token: { value: null } },
                resolve: { // todo - returning 0 right now, need to get back valid userAccountId
                    //userAccountId: (userAccountIdResolver, applicationDataService) => {
                    //    return userAccountIdResolver(applicationDataService);
                    //},
                    userAccountId: (userAccountIdResolver, applicationDataService) => {
                        //@TODO 
                        return 82313;
                    },
                    userAccount: (userAccountId, applicationDataService) => {
                        return applicationDataService.getUserAccount(userAccountId).then(
                            response => {
                                return new cls.UserAccountViewModel(response.data);
                            })
                    },
                    controllerData: (queueResolver, queueSvc, $stateParams, blockUI, userAccount, enums) => {
                        return queueResolver(queueSvc, $stateParams, blockUI, userAccount, enums);
                    },
                    applicationData: (applicationDataResolver, applicationDataService, $stateParams, $rootScope, enums, userAccountId) => {
                        return applicationDataResolver(applicationDataService, $stateParams, $rootScope, enums, userAccountId);
                    },
                    hasGuids: (applicationDataService) => { // not a big fan of the hasGuids implementation (and I wrote it)
                        return applicationDataService.getGuids(5000).then(response => {
                            util.IdentityGenerator.setGuids(response.data.Response);
                            return true;
                        });
                    },
                    loanContext: (authenticationService: security.AuthenticationService, $stateParams): any => {
                        return $stateParams['token'] ? authenticationService.getLoanContext($stateParams['token']) : {};
                    },
                    loan: ([UINavigationService.className, 'hasGuids', 'applicationData', 'loanContext', 'userAccountId', 'MegaLoanService', '$filter',
                        (navigationService: UINavigationService, hasGuids, applicationData, loanContext,
                            userAccountId, MegaLoanService: srv.MegaLoanService, $filter): ng.IPromise<vm.Loan> | vm.Loan => {
                            if (loanContext.loanId) {
                                return MegaLoanService.EagerLoad(loanContext.loanId, userAccountId, 'Loading Loan').then(loanVM => {
                                    var loan = new vm.Loan(applicationData, loanVM, $filter);
                                    navigationService.setLoan(loan);
                                    return loan;
                                });
                            } else {
                                var loan = new vm.Loan(applicationData);
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
            })

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
        }]).run(['$rootScope', '$state', 'navigationService', ($rootScope, $state: ng.ui.IStateService, navigationService: UINavigationService) => {

            var state = $state;

            var stateHasValue = (state: ng.ui.IState) => {
                return state && state.data && state.data.loanAppNavState;
            }

            $rootScope.$on("$stateChangeError", (event, toState, toParams, fromState, fromParams, error) => {
                if (error == security.authentication_exception) {
                    state.go('authenticate', { nextState: toState.name, token: toParams['token'] });
                }
            });

            $rootScope.$on("$stateChangeStart", (event, toState, toParams, fromState, fromParams) => {
                console.log(fromState.name + ' -> ' + toState.name);
            });

            $rootScope.$on("$stateNotFound", (event, toState, toParams, fromState, fromParams, error) => {
                console.log(error);
            });

            $rootScope.$on('$viewContentLoading', (event, viewConfig) => {
                console.log("Contents loading.");
            });

            $rootScope.$on('$viewContentLoaded', (event, viewConfig) => {
                navigationService.onCurrentState();
            });
        }]);
}