(function () {
    'use strict';

    angular.module('loanCenter').factory('NavigationSvc', NavigationSvc);

    NavigationSvc.$inject = ['$http', '$q', '$resource', '$rootScope', 'apiRoot', 'BroadcastSvc', 'enums', '$state', '$stateParams', '$filter', 'simpleModalWindowFactory', 'HttpUIStatusService', 'costDetailsHelpers', 'loanEvent', 'navigationConstant', '$modal', 'queueSvc', '$timeout'];

    // todo - encapsulate this thing...
    function NavigationSvc($http, $q, $resource, $rootScope, ApiRoot, BroadcastSvc, enums, $state, $stateParams, $filter, simpleModalWindowFactory, HttpUIStatusService, costDetailsHelpers, loanEvent, navigationConstant, $modal, queueSvc, $timeout) {

        var LoanAppTabs = {
            Personal: {
                isSelected: false,
                isDisabled: false
            },
            Property: {
                isSelected: false,
                isDisabled: false
            },
            Assets: {
                isSelected: false,
                isDisabled: false
            },
            Credit: {
                isSelected: false,
                isDisabled: false
            },
            Declarations: {
                isSelected: false,
                isDisabled: false
            },
            Income: {
                isSelected: false,
                isDisabled: false
            },
            all: {
                isDisabled: false
            }
        };

        var DocumentsTabs = {
            NeedsList: {
                isSelected: false
            },
            DocVault: {
                isSelected: false
            }
        };
        var IsBorrowerCreated = false;
        var contextualType;
        var navigation;

        var areSixPiecesAcquiredForAllLoanApplications = {
            value: false
        };

        var stateChangeStarted = {
            value: false
        };
        var lastRepricing = {
            timestamp: 0
        };
        var checkLoanDisclosureStatusTimer = {};
        var checkLoanDisclosureStatusTimeoutTimer = {};
        var exportToDigitalInProgress = false;
        var exportToEncompassInProgress = false;
        var checkExportToEncompassProgressTimer = {};
        var checkExportToEncompassProgressTimeoutTimer = {};
        var checkComplianceCheckStatusTimer = {};

        var service = {
            IsBorrowerCreated: IsBorrowerCreated,
            LoanAppTabs: LoanAppTabs,
            DocumentsTabs: DocumentsTabs,
            SelectLoanFromQueue: SelectLoanFromQueue,
            SelectLoanFromQueueNEW: SelectLoanFromQueueNEW,
            PrepareLoanFromQueueNEW: PrepareLoanFromQueueNEW,
            SetNavigationLinks: SetNavigationLinks,
            contextualType: contextualType,
            SaveAndUpdateWrappedLoan: SaveAndUpdateWrappedLoan,
            //SaveLoanData: SaveLoanData,
            //SaveLoanDataHttp: SaveLoanDataHttp,
            areSixPiecesAcquiredForAllLoanApplications: areSixPiecesAcquiredForAllLoanApplications,
            setPersonalAsActiveAndRedirect: setPersonalAsActiveAndRedirect,
            getMenuLabelText: getMenuLabelText,
            ClearCreditData: ClearCreditData,
            openLoanApplication: openLoanApplication,
            openDocuments: openDocuments,
            openLink: openLink,
            navigation: navigation,
            openProspect: openProspect,
            openAntiSteeringModal: openAntiSteeringModal,
            stateChangeStarted: stateChangeStarted,
            openFirstLoanInMailRoomQueue: openFirstLoanInMailRoomQueue,
            navigateToFHACalculator: navigateToFHACalculator,
            cancelChanges: cancelChanges,
            setBodyPosition: setBodyPosition,
            navigateToVACalculator: navigateToVACalculator,
            checkLoanDisclosureStatusTimer: checkLoanDisclosureStatusTimer,
            checkLoanDisclosureStatusTimeoutTimer: checkLoanDisclosureStatusTimeoutTimer,
            exportToDigitalInProgress: exportToDigitalInProgress,
            exportToEncompassInProgress: exportToEncompassInProgress,
            checkExportToEncompassProgressTimer: checkExportToEncompassProgressTimer,
            checkExportToEncompassProgressTimeoutTimer: checkExportToEncompassProgressTimeoutTimer,
            navigateToNetTangibleBenefit: navigateToNetTangibleBenefit,
            lastRepricing: lastRepricing,
            checkComplianceCheckStatusTimer: checkComplianceCheckStatusTimer
        }
        return service;



        // Services
        var LoanApiPath = ApiRoot + "LoanEx/";
        var SaveLoanData = $resource(LoanApiPath + 'MegaSave', { viewModel: '@viewModel' });

        function SaveAndUpdateWrappedLoan(userAccountId, wrappedLoan, happyPath, errorPath, message, displayStatus) {

            wrappedLoan.ref.prepareSave();
            
            var megaLoanSave = $resource(ApiRoot + "LoanEx/" + 'MegaSave', { viewModel: '@viewModel', userAccountId: '@userAccountId' });
            var displayMessage = message ? message : 'Saving Loan...';
            HttpUIStatusService.save(displayMessage, function (happyPath, unhappyPath) {
                return megaLoanSave.save({ userAccountId: userAccountId }, wrappedLoan.ref).$promise.then(happyPath, unhappyPath);
            }, function (savedLoan) {
                    savedLoan.selectedAppIndex = wrappedLoan.ref.selectedAppIndex;
                    wrappedLoan.ref = new cls.LoanViewModel(savedLoan, $filter, savedLoan.isWholesaleUser);
                    costDetailsHelpers.initializeCostService(wrappedLoan);
                    costDetailsHelpers.getCostDetailsData();

                    if (angular.element(document.getElementById('divMainNavBar')).scope() != undefined)
                        angular.element(document.getElementById('divMainNavBar')).scope().updateValuesOnRowChangeNEW(wrappedLoan.ref.loanId);
                        $rootScope.SelectedLoan.LoanId = wrappedLoan.ref.loanId;
                // Recalculate everything upon saving and re-loading loan:
                loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.todo, {});
                if (happyPath)
                    happyPath(wrappedLoan);
                return wrappedLoan;
            }, errorPath, displayStatus);
        }

        function setBodyPosition()
        {
            $timeout(function () {

                var bodyContainer = document.getElementById("impBodyContainer");

                if (bodyContainer)
                {
                    bodyContainer.style.top = $('#contextualBody').outerHeight(true) + 40 + "px";
                }

                //set top position of fixed header on products if products sections is rendered
                var productsHeader = document.getElementById("productsHeader");

                if ( productsHeader )
                {
                    productsHeader.style.top = $('#contextualBody').outerHeight(true) + 40 + "px";
                }
                
            });
        }

        function cancelChanges(loanId) {
            $state.go($state.current, {'loanId': loanId}, {reload: true});
        }

        function ClearCreditData(wrappedLoan) {
            wrappedLoan.ref.active.getBorrower().Liabilities = _.filter(wrappedLoan.ref.active.getBorrower().Liabilities, function (liability) {
                return liability.isNewRow || liability.isUserEntry;
            });
            wrappedLoan.ref.active.getBorrower().publicRecords = [];
            if (wrappedLoan.ref.active.isSpouseOnTheLoan) {
                wrappedLoan.ref.active.getCoBorrower().Liabilities = _.filter(wrappedLoan.ref.active.getCoBorrower().Liabilities, function (liability) {
                    return liability.isNewRow || liability.isUserEntry;
                });
                wrappedLoan.ref.active.getCoBorrower().publicRecords = [];
            }
        }

        function SelectLoanFromQueue(userAccountId) {
            var oldGridPlaceholderDiv = document.getElementById('oldGridPlaceholder');
            oldGridPlaceholderDiv.removeAttribute("style");

            var selectedRow = document.getElementsByClassName('tablelistselected')[0];

            var selectedLoan = {
                LoanId: selectedRow == undefined ? '' : angular.element(selectedRow.getElementsByClassName('loanid')[0]).text().trim(),
                UserAccountId: userAccountId,
                //RetrieveSelectedQueueName is from old Loan center
                QueueName: RetrieveSelectedQueueName(),
                ApplicationStep: selectedRow == undefined ? '' : angular.element(selectedRow.getElementsByClassName('applicationStep')[0]).text().trim()
            };
            $rootScope.SelectedLoan = selectedLoan;
            contextualType = enums.ContextualTypes.None;
            
            return selectedLoan;
        }

        function SelectLoanFromQueueNEW(loanId, userAccountId) {
            var selectedLoan = {
                LoanId: (loanId == undefined || loanId == null) ? '' : loanId.trim(),
                UserAccountId: userAccountId,
                //RetrieveSelectedQueueName is from old Loan center
                QueueName: '',
                ApplicationStep: ''
            };
            $rootScope.SelectedLoan = selectedLoan;
            contextualType = enums.ContextualTypes.None;
            
            return selectedLoan;
        }

        function PrepareLoanFromQueueNEW(loanId, userAccountId) {
            var selectedLoan = {
                LoanId: (loanId == undefined || loanId == null) ? '' : loanId.trim(),
                UserAccountId: userAccountId,
                QueueName: '',
                ApplicationStep: ''
            };
            $rootScope.SelectedLoan = selectedLoan;
            return selectedLoan;
        }

        function SetNavigationLinks(loanId) {

            if ($rootScope.SelectedLoan.QueueName === 'Prospects') {
                if (loanId == null || loanId.trim() === '')
                    return;

                var isBorrowerCreatedPath = ApiRoot + 'personal/IsBorrowerCreated/';

                $http.get(isBorrowerCreatedPath, { params: { loanId: loanId } })
                    .success(function (data, status, headers, config) {
                        IsBorrowerCreated = data;

                        SetValuesForTabs(!IsBorrowerCreated);
                    })
                    .error(function (data, status, headers, config) {
                        console.log(data);
                    });

            } else {
                //enable links for tabs                     
                SetValuesForTabs(false);
            }
        }

        function SetValuesForTabs(isDisabled) {
            angular.forEach(LoanAppTabs, function (tab, tabName) {
                if (enums.LoanApplicationTabs.Personal.toLowerCase() !== tabName.toLowerCase()) {
                    tab.isDisabled = isDisabled;
                }
            });
        }


        function setPersonalAsActiveAndRedirect(callReload, loanId) {
            angular.forEach(LoanAppTabs, function (tab, tabName) {
                if (tabName.toLowerCase() === 'personal') {
                    tab.isSelected = true;
                } else {
                    tab.isSelected = false;
                }
            });

            // @todo - reloading should not be done here
            if (callReload)
                $state.go('loanCenter.loan.loanApplication.personal', { 'loanId': loanId }, { reload: callReload });
            else
                $state.go('loanCenter.loan.loanApplication.personal');
        }

        function getMenuLabelText(key, isWholesaleUser) {
            if (isWholesaleUser)
                return getTextByKey(key, navigationConstant.WHOLESALE.LABELS);
            else
                return getTextByKey(key, navigationConstant.ORDINARY.LABELS);
        }

        function getTextByKey(key, labels) {
            for (var b in labels) {
                if (b.toString() == key.toString())
                    return labels[b];
            }
        }

        function openDocuments(selectedTab, stateName) {
            $rootScope.navigation = 'Documents';

            angular.forEach(DocumentsTabs, function (tab, tabName) {
                if (selectedTab.toLowerCase() === tabName.toLowerCase()) {
                    tab.isSelected = true;
                } else {
                    tab.isSelected = false;
                }
            });

            $state.go(stateName);
        }


        function openLoanApplication (stateName, newApplication, loanPurposeType) {
            if (!common.string.isNullOrWhiteSpace(stateName)) {
                if (newApplication) {
                    $state.go(stateName, { loanId: null, loanPurposeType: loanPurposeType, differentiateId: $stateParams.differentiateId ? $stateParams.differentiateId + 1 : 1 }, { reload: true });
                }
                else {
                    $state.go(stateName, { loanId: $stateParams.loanId });
                }
            }
        }

        function openProspect() {
            $state.go('loanCenter.loan.loanScenario.sections', { loanId: null, loanPurposeType: null, differentiateId: $stateParams.differentiateId ? $stateParams.differentiateId + 1 : 1, repricing: false }, { reload: true })
        }

        function openLink(linkName, state, wrappedLoan, applicationData) {
            switch (linkName) {
                case 'CostDetails':
                    navigation = 'CostDetails';
                    break;
                case 'Conditions':
                    navigation = 'StipsAndConditions';
                    break;
                case 'lockingandpricingadj':
                    navigation = 'lockingandpricingadj';
                    break;
                case 'PreApprovalLetters':
                    navigation = 'PreApprovalLetters';
                    break;
                case 'Queue':
                    navigation = 'Queue';
                    break;
                case 'Aus':
                    navigation = 'AUS';
                    break;
                case 'LoanScenario':
                    if ($stateParams)
                        $stateParams.loanId = null;
                    navigation = 'LoanScenario';
                    break;
                case 'LoanDetails':
                   navigation = 'LoanDetails';
                    break;
                case 'ComplianceEase':
                    navigation = 'ComplianceEase';
                    break;
                case 'MessageCenter':
                    navigation = 'MessageCenter';
                    break;
                case 'Mailroom':
                    navigation = 'Mailroom';
                    break;
                case 'NetTangibleBenefit':
                    navigation = 'NetTangibleBenefit';
                    break;
                case 'Integrations':
                    navigation = 'Integrations';
                    break;
                case 'LoanParticipants':
                    var modalInstance = $modal.open({
                        templateUrl: 'angular/loanparticipants/loanparticipants.html',
                        backdrop: 'static',
                        windowClass: 'imp-modal flyout imp-modal-agents-parties',
                        controller: 'LoanParticipantsModal',
                        controllerAs: 'modalCtrl',
                        resolve: {
                            wrappedLoan: function () {
                                return wrappedLoan;
                            },
                            applicationData: function () {
                                return applicationData;
                            }
                        }
                    });
                    break;
                case 'DocumentLibrary':
                    var modalInstance = $modal.open({
                        templateUrl: 'angular/documentlibrary/documentlibrary.html',
                        backdrop: 'static',
                        windowClass: 'imp-reference-modal documentlibrary-modal',
                        //controller: 'DocumentLibraryModal',
                        //controllerAs: 'modalCtrl',
                    });
                    break;
                case 'Assignments':
                    var modalInstance = $modal.open({
                        templateUrl: 'angular/assignments/assignments.html',
                        backdrop: 'static',
                        windowClass: 'imp-reference-modal assignments-modal',
                        controller: 'AssignmentsController',
                        controllerAs: 'assignmentsCtrl',
                        resolve: {
                            wrappedLoan: function () {
                                return wrappedLoan;
                            },
                            applicationData: function () {
                                return applicationData;
                            }
                        }
                    });
                    break;
                case 'ComplianceCenter':
                    navigation = 'ComplianceCenter';
                    break;
                case 'Appraisal':
                    navigation = 'Appraisal';
                    break;
                case 'CopyLoan':
                    var modalInstance = $modal.open({
                        templateUrl: 'angular/copyloan/copyloan.html',
                        backdrop: 'static',
                        windowClass: 'imp-reference-modal copyloan-modal',
                        controller: 'copyLoanController',
                        controllerAs: 'copyLoan',
                        resolve: {
                            wrappedLoan: function () {
                                return wrappedLoan;
                            },
                            applicationData: function () {
                                return applicationData;
                            }
                        }
                    });
                    break;
                case 'SecureLinkEmail':
                    var modalInstance = $modal.open({
                        templateUrl: 'angular/securelinkemail/securelinkemail.html',
                        backdrop: 'static',
                        windowClass: 'imp-reference-modal copyloan-modal',
                        controller: 'secureLinkEmailController',
                        controllerAs: 'secureLinkEmailCtrl',
                        resolve: {
                            wrappedLoan: function () {
                                return wrappedLoan;
                            },
                            applicationData: function () {
                                return applicationData;
                            }
                        }
                    });
                    break;
            }

            if (state)
                $state.go(state);
        }

        function openAntiSteeringModal(amortizationType, antiSteeringOptions, areLoanAntiSteeringOptionsCompleted, submitForApprovalAction) {
            var modalInstance = $modal.open({
                templateUrl: 'angular/navigation/antisteering/antisteeringmodawindow.html',
                backdrop: 'static',
                windowClass: 'imp-center-modal confirmation-modal steering-modal-widowclass',
                controller: 'antiSteeringController',
                controllerAs: 'antiSteeringCtrl',
                resolve: {
                    amortizationType: function () {
                        return amortizationType;
                    },
                    antiSteeringOptions: function () {
                        return antiSteeringOptions;
                    },
                    optionsCompletedCallBack: function () {
                        return areLoanAntiSteeringOptionsCompleted;
                    },
                    submitForApprovalCallBack: function () {
                        return submitForApprovalAction;
                    },
                }
            });
        }

        function openFirstLoanInMailRoomQueue(userAccountId) {
            queueSvc.queue().get({ currentUserId: userAccountId, queue: enums.myListQueue.mailRoom }).$promise.then(function (data) {
                var firstLoan = data.list[0];
                var loanId = firstLoan.loanId;
                var parentLoanId = firstLoan.parentLoanId;
                var disclosureDueDate = firstLoan.disclosureDueDate._i;

                $state.go('loanCenter.workbench.mailroom', { 'loanId': loanId, 'parentLoanId': parentLoanId, 'disclosureDueDate': disclosureDueDate }, { reload: true });
            },
            function (error) {
                console.log(error);
            });
        }

        function navigateToFHACalculator(value) {
            switch (Number(value)) {
                case srv.FHAProductsEnum.StreamlineRefinance:
                    $state.go('loanCenter.loan.fhacenter.streamlinerefinance');
                    break;
                case srv.FHAProductsEnum.SimpleRefinance:
                    $state.go('loanCenter.loan.fhacenter.simplerefinance');
                    break;
                case srv.FHAProductsEnum.RateAndTermRefinance:
                    $state.go('loanCenter.loan.fhacenter.rateandtermrefinance');
                    break;
                case srv.FHAProductsEnum.CashOutRefinance:
                    $state.go('loanCenter.loan.fhacenter.cashoutrefinance');
                    break;
                case srv.FHAProductsEnum.Purchase:
                    $state.go('loanCenter.loan.fhacenter.purchase');
                    break;
                case srv.FHAProductsEnum.PurchaseDown:
                    $state.go('loanCenter.loan.fhacenter.purchasedown');
                    break;
                default:
                    $state.go('loanCenter.loan.fhacenter');
                    break;
            }
        }

        function navigateToNetTangibleBenefit() {
            $state.go('loanCenter.loan.nettangible.details');
        }

        function navigateToVACalculator(value) {
            switch (Number(value)) {
                case srv.VACalculatorsEnum.VAGeneralInformation:
                    $state.go('loanCenter.loan.vacenter.generalinformation');
                    break;
                case srv.VACalculatorsEnum.IRRLMax:
                    $state.go('loanCenter.loan.vacenter.irrlmax');
                    break;
                case srv.VACalculatorsEnum.IRRLQMCertification:
                    $state.go('loanCenter.loan.vacenter.irrlqmcertification');
                    break;
                default:
                    $state.go('loanCenter.loan.vacenter.generalinformation');
                    break;
            }
        }            
    }
})();