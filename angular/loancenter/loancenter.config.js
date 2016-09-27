(function () {
    angular.module('loanCenter').config(function ($logProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

        // Toggle debug logs.
        $logProvider.debugEnabled(true);

        $httpProvider.defaults.transformRequest = function (payload) {

            var result = JSON.stringify(payload, replacer);

            function replacer(key, value) {
                if (key == "$promise")
                    return undefined;
                if (key == "_active")
                    return undefined;
                if (key == "_primary")
                    return undefined;
                if (key == "lookup")
                    return undefined;

                if (value && typeof value === 'object') {
                    var replacement = {};
                    if (Object.prototype.toString.call(value) == "[object Array]") {
                        replacement = new Array();
                        for (var k in value)
                            if (Object.hasOwnProperty.call(value, k))
                                replacement.push(replacer(k, value[k]));

                        return replacement;
                    }
                    else {
                        for (var k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                replacement[k.replace(/^_/, '')] = value[k];
                            }
                        }
                        return replacement;
                    }
                }
                return value;
            }

            return result;
        };

        $urlRouterProvider.otherwise('/queue');
        $stateProvider
            /* Parent State for whole app*/
            .state('loanCenter', {
                'abstract': true,
                url: '/',
                views: {
                    'contextualBars': {
                        templateUrl: '/angular/contextualbar/contextualbars.html',                        
                    },
                    'contextualTitle': {
                        templateUrl: '/angular/contextualbar/contextualtitle/contextualtitle.html',
                        controller: 'contextualTitleController as contextualTitleCtrl'
                    },
                    'mainView': {
                        templateUrl: '/angular/loancenter/_blank.html'
                    },
                    'navigation': {
                        templateUrl: '/angular/navigation/navigation.html',
                        controller: 'NavCtrl as navCtrl'
                    }
                },               
                resolve: {
                    userAccountId: function (userAccountIdResolver, applicationDataService) {
                        return userAccountIdResolver(applicationDataService);
                    },
                    userAccount: function (userAccountId, applicationDataService, $log) {
                        return applicationDataService.getUserAccount(userAccountId).then(
                            function (response) {
                                return new cls.UserAccountViewModel(response.data);
                            },
                            function (error) {
                                $log.error("userAccount::getUserAccount:: Error occurred while retrieving data!");
                            });
                    },
                    applicationData: function (applicationDataResolver, applicationDataService, $stateParams, $rootScope, enums, userAccountId) {
                        return applicationDataResolver(applicationDataService, $stateParams, $rootScope, enums, userAccountId);
                    },
                    hasGuids: function (applicationDataService) {
                        return applicationDataService.getGuids(5000).then(function (response) {
                            util.IdentityGenerator.setGuids(response.data.Response);
                            return true;
                        });
                    }
                }
            })

                .state('loanCenter.queue', {
                    url: 'queue',
                    views: {
                        'queueContextual': {
                            templateUrl: '/angular/contextualbar/queue/contextualbarqueue.html',
                            controller: 'ContextualBarQueueCtrl as queueBarCtrl'
                        },
                        'queue': {
                            templateUrl: '/angular/queue/queue.html',
                            controller: 'queueController as queue'
                        },
                        'contextualBar': {
                            templateUrl: '/angular/contextualbar/contextualtitle/contextualtitle.html',
                            controller: 'contextualTitleController as contextualTitleCtrl'
                        }
                    },
                    params: {
                        queue: null,
                        queueTitle: null
                    },
                    resolve: {
                        controllerData: function (queueResolver, queueSvc, $stateParams, blockUI, userAccount, enums) {
                            return queueResolver(queueSvc, $stateParams, blockUI, userAccount, enums);
                        },
                        columnDefinition: function (queueColumnDefs, enums, $stateParams, applicationData, NavigationSvc, $state) {
                            return queueColumnDefs(enums, $stateParams, applicationData, NavigationSvc, $state);
                        }
                    }
                })
            .state('loanCenter.loan', {
                'abstract': true,
                url: 'loan?loanId',
                views: {
                    'loanMenu': {
                        templateUrl: '/angular/navigation/loanMenu.html',
                        controller: 'loanMenuController as loanMenu'
                    },
                    'loanView': {
                        templateUrl: '/angular/loancenter/_blankLoan.html'
                    },
                    'contextualBar': {
                        templateUrl: '/angular/contextualbar/contextualbar.html',
                        controller: 'ContextualBarCtrl as contextualBarCtrl'
                    },
                    'contextualBarsAdditionalDetails': {
                        templateUrl: '/angular/contextualbar/contextualbarsadditionaldetails.html',                        
                    },
                },
                params: {
                    //contextual: 'Loan Application',
                    loanId: null,
                    loanPurposeType: null,
                    differentiateId: 1 //Parameter used only for differentiating newly created loan on client that have loanId = null (this value is incremented with each new loan)
                },
                resolve: {
                    // todo: the LoanViewModel class should not have a $filer dependency
                    wrappedLoan: function (loanResolver, loanService, $filter, $stateParams, HttpUIStatusService, BroadcastSvc, LoanCalculator, applicationData, commonModalWindowFactory, modalWindowType, $modalStack, $modal, digitaldocSvc, encompassSvc, NavigationSvc, costDetailsHelpers) {
                        return loanResolver(loanService, $filter, $stateParams, HttpUIStatusService, BroadcastSvc, LoanCalculator, applicationData, commonModalWindowFactory, modalWindowType, $modalStack, $modal, digitaldocSvc, encompassSvc, NavigationSvc, costDetailsHelpers)
                    },
                    loanService: function (loanService) { return loanService; },
                    applicationData: function (applicationData) { return applicationData; },
                    modalWindowType: function (modalWindowType) { return modalWindowType; },
                    commonModalWindowFactory: function (commonModalWindowFactory) { return commonModalWindowFactory; },
                },
                onEnter: function (wrappedLoan, digitaldocSvc, encompassSvc, NavigationSvc) {
                    if (wrappedLoan.ref.active.disclosureStatusDetails.disclosureStatus == srv.DisclosureStatusEnum.RequestInProgress) {
                        NavigationSvc.exportToDigitalInProgress = true;
                        digitaldocSvc.checkLoanDisclosureStatus(wrappedLoan, wrappedLoan.ref.loanId);
                    }
                    if (wrappedLoan.ref.isImportToFNMInProgress) {
                        NavigationSvc.exportToEncompassInProgress = true;
                        encompassSvc.checkExportToEncompassProgress(wrappedLoan);
                    }
                    else {
                        NavigationSvc.exportToEncompassInProgress = false;
                    }
                },
                onExit: function (wrappedLoan, loanService, applicationData) {
                    // console.log('Leaving loanCenter with loan id = ' + (wrappedLoan.ref && wrappedLoan.ref.loanId ? wrappedLoan.ref.loanId : 'No Loan ID'));
                    if (wrappedLoan && wrappedLoan.ref && wrappedLoan.ref.controlStatus.isAcquired
                        && wrappedLoan.ref.loanId && applicationData && applicationData.currentUserId) {
                        loanService.releaseControl(applicationData.currentUserId, wrappedLoan.ref.loanId);
                    }
                },
            })
                .state('loanCenter.loan.loanScenario', {
                    url: '/loanScenario',
                    views: {
                        'loanScenario': {
                            templateUrl: '/angular/loanscenario/loanscenario.html',
                            controller: 'loanScenarioController as loanScenario'
                        }
                    },
                    params: {
                        repricing: false,
                        contextualBarTitle: false
                    },
                    resolve: {
                        controllerData: function (loanScenarioResolver, loanService, wrappedLoan, applicationData, $stateParams) {
                            return loanScenarioResolver(loanService, wrappedLoan, applicationData, $stateParams);
                        }
                    }
                })
                    .state('loanCenter.loan.loanScenario.sections', {
                        url: '/sections',
                        views: {
                            'personal': {
                                templateUrl: '/angular/loanapplication/personal/personal.html',
                                controller: 'personalController as personal'
                            },
                            'contextualBar@': {
                                templateUrl: '/angular/contextualbar/contextualbar.html',
                                controller: 'ContextualBarCtrl as contextualBarCtrl'
                            }
                        },
                        resolve: {
                            isVisible: function () {
                                return { value: false };
                            },
                            controllerData: function (personalResolver, wrappedLoan) {
                                return personalResolver(wrappedLoan);
                            }
                        }
                    })
                /*Loan Application (1003) parent state*/
                .state('loanCenter.loan.loanApplication', {
                    url: '/loanApplication',
                    views: {
                        'contextualDetailsBar': {
                            templateUrl: '/angular/contextualbar/details/contextualbardetails.html',
                            controller: 'ContextualBarDetailsCtrl as conBarCtrl'
                        },
                        'contextualBarTabs': {
                            templateUrl: '/angular/contextualbar/contextualtabs/contextualbartabs.html',
                            controller: 'ContextualBarTabsCtrl as conBarTabsCtrl'
                        },
                        'main': {
                            templateUrl: '/angular/loanapplication/loanapplication.html',
                            controller: 'LoanApplicationTabCtrl as tabCtrl'
                        }
                    }//,
                    //resolve: {
                    //    initialized: function (loanEvent, wrappedLoan) {  //rseherac: moved to ContextualBarDetailsController -> LoanCalculator.setCalculatedValues()
                    //        // todo - just for now to initialize the summary
                    //        loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.todo, {});
                    //        return true;
                    //    }
                    //}
                })
                    /*Personal tab state*/
                    .state('loanCenter.loan.loanApplication.personal', {
                        url: '/personal',
                        views: {
                            'loanApplication': {
                                templateUrl: '/angular/loanapplication/personal/personal.html',
                                controller: 'personalController as personal'
                            }
                        },
                        resolve: {
                            isVisible: function () {
                                return { value: true };
                            },
                            controllerData: function (personalResolver, wrappedLoan) {
                                return personalResolver(wrappedLoan);
                            }
                        }
                    })
                    /*Property tab state*/
                    .state('loanCenter.loan.loanApplication.property', {
                        url: '/property',
                        views: {
                            'loanApplication': {
                                templateUrl: '/angular/loanapplication/property/property.html',
                                controller: 'propertyController as property'
                            }
                        }
                    })
                    /*Assets tab state*/
                    .state('loanCenter.loan.loanApplication.assets', {
                        url: '/assets',
                        views: {
                            'loanApplication': {
                                templateUrl: '/angular/loanapplication/assets/assets.html',
                                controller: 'assetsController as assets'
                            }
                        }
                    })
                    /*Credit tab state*/
                    .state('loanCenter.loan.loanApplication.credit', {
                        url: '/credit',
                        views: {
                            'loanApplication': {
                                templateUrl: '/angular/loanapplication/credit/credit.html',
                                controller: 'creditController as creditCtrl'
                            }
                        },
                        resolve: {
                            controllerData: function (creditResolver, CreditSvc, wrappedLoan) {
                                return creditResolver(CreditSvc);
                            }
                        },
                        onEnter: function (wrappedLoan, CreditSvc) {
                            // CreditSvc.sortRealEstateItems(wrappedLoan.ref.active);
                        }
                    })
                        .state('loanCenter.loan.loanApplication.credit.details', {
                            url: '/details',
                            views: {
                                'publicRecords': {
                                    templateUrl: '/angular/loanapplication/credit/publicrecords/publicrecords.html',
                                    controller: 'publicRecordsController as publicRecords'
                                },
                                'liabilities': {
                                    templateUrl: '/angular/loanapplication/credit/liabilities/liabilities.html',
                                    controller: 'liabilitiesController as liabilities'
                                },
                                'miscExpenses': {
                                    templateUrl: '/angular/loanapplication/credit/miscellaneousexpenses/miscexpenses.html',
                                    controller: 'miscellaneousExpensesController as miscExpenses'
                                },
                                'realEstate': {
                                    templateUrl: '/angular/loanapplication/credit/realestate/realestate.html',
                                    controller: 'realEstateController as realEstate'
                                },
                                'collections': {
                                    templateUrl: '/angular/loanapplication/credit/collections/collections.html',
                                    controller: 'collectionsController as collections'
                                },
                                'runCredit': {
                                    templateUrl: '/angular/loanapplication/credit/creditrunbutton/creditrunbutton.html',
                                    controller: 'runCreditController as runCredit'
                                }
                            },
                            onExit: function ($modalStack) {
                                // Closes all modal windows that remain opened in the credit tab.
                                $modalStack.dismissAll('cancel');
                            }
                        })
                    /*Declarations tab state*/
                    .state('loanCenter.loan.loanApplication.declarations', {
                        url: '/declarations',
                        views: {
                            'loanApplication': {
                                templateUrl: '/angular/loanapplication/declarations/declarations.html',
                                controller: 'declarationsController as declarationsCtrl'
                            }
                        }
                    })
                    /*Income tab state*/
                    .state('loanCenter.loan.loanApplication.income', {
                        url: '/income',
                        views: {
                            'loanApplication': {
                                templateUrl: '/angular/loanapplication/income/income.html',
                                controller: 'incomeController as income'
                            }
                        },
                        resolve: {
                            controllerData: function (incomeResolver) {
                                return incomeResolver();
                            }
                        },
                        onEnter: function (wrappedLoan, incomeService) {
                            incomeService.sortAdditionalEmploymentInfos(wrappedLoan.ref.active);
                        }
                    })
            /*Loan Details state*/
            .state('loanCenter.loan.loanDetails', {
                url: '/loanDetails',
                views: {
                    'loanDetailsContainer': {
                        templateUrl: '/angular/loandetails/maincontainer.html',
                        controller: 'loanDetailsController as loanDetails'
                    }
                },
                params: {
                    repricing: false
                },
                resolve: {
                    controllerData: function (loanDetailsResolver, enums, $stateParams) {
                        return loanDetailsResolver(enums, $stateParams);
                    }
                }
            })
                .state('loanCenter.loan.loanDetails.sections', {
                    url: '/sections',
                    views: {
                        'housingExpensesChart': {
                            templateUrl: '/angular/loandetails/sections/housingexpenses/housingexpensesbreakdownchart.html',
                            controller: 'housingExpensesController as housingExpenses'
                        },
                        'housingExpenses': {
                            templateUrl: '/angular/loandetails/sections/housingexpenses/housingexpensesbreakdown.html',
                            controller: 'housingExpensesController as housingExpenses'
                        },
                        'sectionSeven': {
                            templateUrl: '/angular/loandetails/sections/sectionseven/sectionseven.html',
                            controller: 'sectionSevenController as sectionSeven'
                        },
                        'sectionSevenBarChart': {
                            templateUrl: '/angular/loandetails/sections/sectionseven/sectionsevenbarchart.html',
                            controller: 'sectionSevenController as sectionSeven'
                        },
                        'propertyInfo': {
                            templateUrl: '/angular/loandetails/sections/propertyinfo/propertyinfo.html',
                            controller: 'propertyInfoController as propertyInfo'
                        },
                        'propertyDetails': {
                            templateUrl: '/angular/loandetails/sections/propertyinfo/propertydetails.html',
                            controller: 'propertyInfoController as propertyInfo'
                        },
                        'propertyDetailGraph': {
                            templateUrl: '/angular/loandetails/sections/propertyinfo/propertydetailgraph.html',
                            controller: 'propertyInfoController as propertyInfo'
                        }
                    }
                })

            /*Pricing*/
            .state('loanCenter.loan.pricing', {
                url: '/pricing',
                views: {
                    'pricingContextual': {
                        templateUrl: '/angular/contextualbar/productandpricing/contextualbarproductandpricing.html',
                        controller: 'ContextualBarProductAndPricingCtrl as pricingBarCtrl'
                    },
                    'pricing': {
                        templateUrl: '/angular/pricingresults/pricingresults.html',
                        controller: 'pricingResultsController as pricingResults'
                    },
                    'contextualBar@': {
                        templateUrl: '/angular/contextualbar/contextualbar.html',
                        controller: 'ContextualBarCtrl as contextualBarCtrl'

                    }
                },
                params: {
                    repricing: false
                },
                resolve: {
                    controllerData: function (pricingResultsResolver, wrappedLoan, pricingResultsSvc, $stateParams) {
                        return pricingResultsResolver(wrappedLoan, pricingResultsSvc, $stateParams);
                    }
                }
            })
            /*Cost Details state*/
            .state('loanCenter.loan.cost', {
                url: '/cost',
                views: {
                    'contextualCostDetails': {
                        templateUrl: '/angular/contextualbar/costdetails/contextualbarcostdetails.html',
                        controller: 'ContextualBarCostDetailsCtrl as conBarCtrl'
                    },
                    'costDetails': {
                        templateUrl: '/angular/costdetails/_blank.html'
                    },
                }
            })
                .state('loanCenter.loan.cost.details', {
                    url: '/details',
                    views: {
                        'costDetails': {
                            templateUrl: '/angular/costdetails/costdetails.html',
                            controller: 'CostDetailsCtrl as costDetailsCtrl'
                        },
                        
                    },
                    params: {
                        redirectedFromLoanDetailsVaAlertModal: false
                    },
                    onEnter: function () {
                        console.log('state = loanCenter.cost.details');
                    }
                })
            .state('loanCenter.loan.cost.details.redirection', {
                views: {
                    'redirection': {
                        templateUrl: '/angular/integrations/closingcorp/redirection.html'}
                },
                params: {
                    smartGFEId: null,
                    apiKey: null,
                    token: null,
                    postUrl: null,
                    customData: null
                },
            })
              .state('loanCenter.loan.cost.transactional', {
                  url: '/transactionalDetails',
                  views: {
                      'costDetails': {
                          templateUrl: '/angular/costdetails/transactionalsummary/transactionalsummary.html',
                          controller: 'CostDetailsCtrl as costDetailsCtrl'
                      }
                  }
              })
            /*MessageCenter state*/
            .state('loanCenter.loan.messagecenter', {
                url: '/messagecenter',
                views: {
                    'messagecenter': {
                        templateUrl: '/angular/messagecenter/messagecenter.html',
                        controller: 'messagecenterController as messagecenterCtrl'
                    }
                }
            })

            /*AUS parent state*/
            .state('loanCenter.loan.aus', {
                url: '/aus',
                views: {
                    'aus': {
                        templateUrl: '/angular/aus/aus.html',
                        controller: 'ausController as ausCtrl'
                    }
                }
                ,
                params: { tab: null },
                resolve: {
                    ausResolve: function (ausResolver, $stateParams, $state, ausSvc, wrappedLoan, enums) {
                        return ausResolver($stateParams, $state, ausSvc, wrappedLoan, enums);
                    }
                }
            })
                /*DU tab state*/
                .state('loanCenter.loan.aus.du', {
                    url: '/du',
                    views: {
                        'ausDetails': {
                            templateUrl: '/angular/aus/du/du.html',
                            controller: 'duController as duCtrl'
                        }
                    },
                    resolve: {
                        du: function (duResolver, ausResolve) {
                            return duResolver(ausResolve);
                        }
                    }
                })
                /*LP tab state*/
                .state('loanCenter.loan.aus.lp', {
                    url: '/lp',
                    views: {
                        'ausDetails': {
                            templateUrl: '/angular/aus/lp/lp.html',
                            controller: 'lpController as lpCtrl'
                        }
                    },
                    resolve: {
                        lp: function (lpResolver, ausResolve) {
                            return lpResolver(ausResolve);
                        }
                    }
                })
            .state('loanCenter.loan.loanDelivery', {
                url: '/loanDelivery',
                views: {
                    'loanDelivery': {
                        templateUrl: '/angular/loanDelivery/loanDelivery.html',
                    },
                    'contextualBar@': {
                        templateUrl: '/angular/loanDelivery/contextualbar.html',
                    }
                },
            })
            .state('loanCenter.loan.appraisal', {
                url: '/appraisal',
                views: {
                    'appraisal': {
                        controller: 'AppraisalController as appraisal'
                    },
                    'contextualBar@': {
                        templateUrl: '/angular/contextualbar/contextualbar.html',
                        controller: 'ContextualBarCtrl as contextualBarCtrl'
                    }
                },
                onEnter: ["$rootScope", function ($rootScope) {
                    Appraisal.OpenAppraisalFormAsMainCommand($rootScope.SelectedLoan.LoanId);
                }],
                onExit: function ($rootScope) {
                    $rootScope.navigation = '';
                }
            })
            // Temporary solution for refreshing states in UI router
            .state('loanCenter.loan.refresh', {
                url: '/refresh',
                views: {
                    'refresh': {
                        template: '<div class="imp-loader-container">' +
                                    '<img src="../../../Content/ajax-loader.gif" alt="loader" class="imp-loader" />' +
                                   '</div>',
                        controller: function ($state, $stateParams) {
                            $state.go($stateParams.page, { 'tab': $stateParams.tab });
                        }
                    }
                },
                params: {
                    page: null,
                    tab: null
                },
            })
        
    }).run(function ($rootScope, $state) {

        //if (!$rootScope.SelectedLoan)
        //    $rootScope.SelectedLoan = {};

        //$rootScope.SelectedLoan.LoanId = 'E247E1F5-640A-4361-9591-E5CEEC4ABC65';
        //$state.go('loanCenter.init', { loanId: $rootScope.SelectedLoan.LoanId });

        $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
            console.log(error);
        });

        $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
            console.log("Contents loading.");
        });

        $rootScope.$on('$viewContentLoaded', function (event, viewConfig) {
            console.log("Contents did load.");
        });

    });
})();

