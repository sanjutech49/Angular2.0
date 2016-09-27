
(function () {
    'use strict';

    angular.module('loanCenter').controller('loanMenuController', loanMenuController);

    loanMenuController.$inject = ['$scope', '$state', '$rootScope', '$modal', '$modalStack', 'NavigationSvc', 'BroadcastSvc', 'enums', 'applicationData', 'wrappedLoan', 'importFnmSvc', 'modalWindowType', 'commonModalWindowFactory', 'digitaldocSvc', 'encompassSvc'];

    function loanMenuController($scope, $state, $rootScope, $modal, $modalStack, NavigationSvc, BroadcastSvc, enums, applicationData, wrappedLoan, importFnmSvc, modalWindowType, commonModalWindowFactory, digitaldocSvc, encompassSvc) {
        var vm = this;

        var loanLoaded = isLoanLoaded();
        var loanApplicationDateSet = isLoanApplicationDateSet();        
        var loanClosed = isLoanClosed();
        var intentToProceedDateSet = isIntentToProceedDateSet();
        var bypass = false;
        var onChangeEntered = false;

        vm.loanMenuItems = {
            prospect: {
                isEnabled: loanLoaded
            },
            personalTab: {
                isEnabled: loanLoaded
            },
            propertyTab: {
                isEnabled: loanLoaded
            },
            assetsTab: {
                isEnabled: loanLoaded
            },
            creditTab: {
                isEnabled: loanLoaded
            },
            declarationsTab: {
                isEnabled: loanLoaded
            },
            incomeTab: {
                isEnabled: loanLoaded
            },
            loanDetails: {
                isEnabled: loanLoaded
            },
            loanAssignments: {
                isEnabled: loanLoaded
            },
            preApproval: {
                isEnabled: hasPrivilege('Issue PreApproval Letter'),
                isVisible: isLoanPurposeType(srv.LoanType.Purchase)
            },
            documents: {
                isEnabled: loanLoaded
            },
            borrowerNeedsList: {
                isEnabled: loanLoaded
            },
            loanParticipants: {
                isEnabled: loanLoaded
            },
            viewInBorrowerSite: {
                isEnabled: loanLoaded
            },
            copyLoan: {
                isEnabled: loanLoaded 
            },
            borrowerActivities: {
                isEnabled: false && hasPrivilege('Access to Activities')  //Remove false when functionality is completed
            },
            aus: {
                isEnabled: isAusEnabled
            },
            stipsConditions: {
                isEnabled: hasPrivilege('Conditions - View Tab')
            },
            complianceCenter: {
                isEnabled: loanLoaded
            },
            documentLibrary: {
                isEnabled: false && loanLoaded //Remove false when functionality is completed
            },
            disclosures: {
                isEnabled: false && loanLoaded //Remove false when functionality is completed
            },
            closingCosts: {
                isEnabled: loanLoaded && (hasPrivilege(enums.privileges.ClosingCostsR) || hasPrivilege(enums.privileges.ClosingCostsRW))
            },
            loanDelivery: {
                isEnabled: false && loanApplicationDateSet //Remove false when functionality is completed
            },
            titleAndEscrow: {
                isEnabled: false && intentToProceedDateSet //Remove false when functionality is completed
            },
            veritax: {
                isEnabled: false && intentToProceedDateSet //Remove false when functionality is completed
            },
            appraisal: {
                isEnabled: true
            },
            credit: {
                isEnabled: false
            },
            complianceEase: {
                isEnabled: true
            },
            dataVerify: {
                isEnabled: false
            },
            uldd: {
                isEnabled: false
            },
            lqa: {
                isEnabled: false
            },
            earlyCheck: {
                isEnabled: false
            },
            lockingAndAdjustments: {
                isEnabled: loanLoaded
            },
            pooling: {
                isEnabled: false && loanClosed
            },
            antiSteeringOptions: {
                isEnabled: isProspectSaved
            },
            adverseLoan: {
                isEnabled: isProspectSaved
            }
        };

        function isAusEnabled() {
            return !!wrappedLoan && !!wrappedLoan.ref &&
                hasPrivilege('AUS - View tab') &&
                 wrappedLoan.ref.allLoanAppsCompleted();
        }

        function isProspectSaved() {
            return wrappedLoan.ref.isNewProspectSaved;
        }

        vm.applicationData = applicationData;
        vm.wrappedLoan = wrappedLoan;

        vm.tabNames = enums.LoanApplicationTabs;
        vm.documentTabNames = enums.DocumentsTabs;
        vm.loanAppTabs = NavigationSvc.LoanAppTabs;
        vm.areSixPiecesAcquiredForAllLoanApplications = NavigationSvc.areSixPiecesAcquiredForAllLoanApplications;
        vm.toggleFhaCenterSection = toggleFhaCenterSection;
        vm.loanMenuOnMouseOver = loanMenuOnMouseOver;
        vm.getMenuLabelText = getMenuLabelText;
        vm.mortgageType = null;
        vm.openLink = openLink;
        vm.selectedLoanId = null;
        vm.enums = enums;
        vm.isWholesaleUser = applicationData.currentUser.isWholesale;
        vm.conciergeUrl = vm.applicationData.configuration.conciergeHome + '?LOFirstVisit=False&isEmbeddedInLoanCenter=0';
        vm.loanCenter3Url = vm.applicationData.configuration.loanCenterHome + '?v=3';
        vm.loanCenter2Url = vm.applicationData.configuration.loanCenterHome
        vm.sysAdminUrl = vm.applicationData.configuration.systemAdmin + '?LOFirstVisit=False&isEmbeddedInLoanCenter=0'
        vm.createNewLoanApplication = createNewLoanApplication;
        vm.openLoanApplication = openLoanApplication;
        vm.openDocuments = openDocuments;
        vm.importFnmFile = importFnmFile;
        vm.openAntiSteeringModal = openAntiSteeringModal;
        vm.openAdverseModal = openAdverseModal;
        vm.navigateToFHACalculator = navigateToFHACalculator;
        vm.navigateToVACalculator = navigateToVACalculator;
        vm.navigateToNetTangibleBenefit = navigateToNetTangibleBenefit;
        vm.navigateToVACalculator = navigateToVACalculator;

        $scope.startItemOpen = false;
        $scope.startItemHover = false;
        $scope.loanItemOpen = false;
        $scope.loanItemHover = false;
        vm.workbenchItemOpen = false;
        $scope.contactsItemOpen = false;
        $scope.toolsItemOpen = false;
        $scope.reportsItemOpen = false;
        $scope.favoritesItemOpen = false;
        $scope.settingsItemOpen = false;
        $rootScope.userAccountId = vm.applicationData.currentUser.userAccountId;
        RealodPage();

        function getMenuLabelText(key) {
            return NavigationSvc.getMenuLabelText(key, vm.isWholesaleUser);
        }

        function openLink(linkName, state) {
            $scope.loanItemOpen = false;
            $scope.loanItemHover = false;
            $modalStack.dismissAll('cancel');

            NavigationSvc.openLink(linkName, state, vm.wrappedLoan, vm.applicationData);
        }

        function navigateToFHACalculator() {
            NavigationSvc.navigateToFHACalculator(vm.wrappedLoan.ref.fhaScenarioViewModel.fhaProductId);
        }

        function navigateToVACalculator() {
            NavigationSvc.navigateToVACalculator();
        }

        function navigateToNetTangibleBenefit() {
            if (wrappedLoan.ref.loanPurposeType == srv.LoanPurposeTypeEnum.Refinance)
            NavigationSvc.navigateToNetTangibleBenefit();
        }

        function navigateToVACalculator() {
            NavigationSvc.navigateToVACalculator();
        }

        function loanMenuOnMouseOver() {
            toggleFhaCenterSection();
        }

        function toggleFhaCenterSection() {
            vm.mortgageType = (
                wrappedLoan &&
                wrappedLoan.ref &&
                wrappedLoan.ref.financialInfo &&
                window.location.hash != '#/' && // because wrapped loan stays alwys active after entering loan, because of that we are checking the location so the section should not be visible on home 
                window.location.hash != '#/queue') ? wrappedLoan.ref.financialInfo.mortgageType : null;
        }

        $rootScope.$on('$stateChangeStart',
          function (event, toState, toParams, fromState, fromParams) {
              if (bypass) {
                  NavigationSvc.stateChangeStarted.value = true;
                  return;
              }
                  
              if (((fromParams.loanId != toParams.loanId && !toParams.loanId) || fromParams.loanPurposeType != toParams.loanPurposeType || fromParams.differentiateId != toParams.differentiateId) && !onChangeEntered) {
                  onChangeEntered = true;
                  event.preventDefault();
                  var message = "";
                  if (wrappedLoan.ref.primary.getBorrower().firstName.trim() && !!wrappedLoan.ref.primary.getBorrower().lastName.trim()) {
                      message = wrappedLoan.ref.primary.getBorrower().lastName + ', ' + wrappedLoan.ref.primary.getBorrower().firstName
                  }

                  commonModalWindowFactory.open({ type: modalWindowType.unload, message: message, ctrl: { doNotSaveTheLoan: doNotSaveTheLoan, saveTheLoan: saveTheLoan, closeTheModal: closeTheModal } });
              }
              else {
                  NavigationSvc.stateChangeStarted.value = true;
              }

              function closeTheModal() {
                  bypass = false;
                  onChangeEntered = false;
                  commonModalWindowFactory.close('close');
              }

              function saveTheLoan() {
                  bypass = true;
                  commonModalWindowFactory.close('close');

                  if (wrappedLoan.ref.isValidForSave()) {
                      NavigationSvc.SaveAndUpdateWrappedLoan(applicationData.currentUserId, wrappedLoan, function (wrappedLoan) {
                          encompassSvc.cancelTimer();
                          digitaldocSvc.cancelTimer();
                          $state.go(toState, toParams);
                      },
                    function (error) {
                        bypass = false;
                        onChangeEntered = false;
                        commonModalWindowFactory.open({ type: modalWindowType.error, message: 'Error while saving loan' });
                        $log.error(error);

                    });
                  }
                  else {
                      bypass = false;
                      onChangeEntered = false;
                  }
              }

              function doNotSaveTheLoan() {
                  bypass = true;
                  commonModalWindowFactory.close('close');
                  encompassSvc.cancelTimer();
                  digitaldocSvc.cancelTimer();
                  $state.go(toState, toParams);
              }

          });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            NavigationSvc.stateChangeStarted.value = false;
        });

        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
            NavigationSvc.stateChangeStarted.value = false;
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            NavigationSvc.stateChangeStarted.value = false;
        });

        $scope.openProspect = function (stateName) {

            $rootScope.startItemOpen = false;
            $rootScope.startItemHover = false;
            $rootScope.navigation = 'LoanScenario';


            $state.go(stateName, { loanId: $rootScope.SelectedLoan.LoanId, loanPurposeType: null, repricing: true });
        }

        function openLoanApplication(stateName, newLoanApplication, loanPurposeType) {
            $scope.loanItemOpen = false;
            $scope.loanItemHover = false;
            $modalStack.dismissAll('cancel');

            NavigationSvc.openLoanApplication(stateName, newLoanApplication, loanPurposeType);

        }

        function openDocuments(selectedTab, stateName) {
            $modalStack.dismissAll('cancel');

            NavigationSvc.openDocuments(selectedTab, stateName);

        }

        $scope.openConciergeEmbeddedCommand = function (action) {
            $scope.loanItemOpen = false;
            $scope.loanItemHover = false;
            $modalStack.dismissAll('cancel');
            var loanId = $scope.selectedLoanId;
            var queueName = $scope.queueName;
            var prospectId = $scope.prospectId;
            var userAccountId = vm.wrappedLoan.ref.primary.getBorrower().userAccount.userAccountId;

            switch (action) {
                case "AssignLoanInfo":
                    AssignLoanInfo.AssignLoanInfoLoad(loanId);
                    break;
                case "Activities":
                    ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageActivities, currentQueue, loanId, prospectId);
                    break;
                case "Alerts":
                    ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageAlerts, currentQueue, loanId, prospectId);
                    break;
                case "Appraisal":
                    Appraisal.OpenAppraisalFormCommand(loanId, prospectId);
                    break;
                case "Credit":
                    ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageCredit, currentQueue, loanId, prospectId);
                    break;
                case "Disclosures":
                    if (currentQueue == WorkQueueTypes.MailRoom) {
                        MailRoomGrid.MailRoomOpenDisclosures(loanId, documentId, userAccountId);
                    }
                    else
                        ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageDisclosures, currentQueue, loanId, prospectId);
                    break;
                case "Documents":
                    ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageDocuments, currentQueue, loanId, '');
                    break;
                case "ManageLoan":
                    ConciergeCommandEmbedded.OpenConciergeEmbeddedSubCommand(WorkQueueCommands.ManageLoan, currentQueue, loanId, prospectId, 1);
                    break;
                case "Escrow":
                    ManageFees.ManageFeesLoad(loanId, prospectId);
                    break;
                case "ManageProspects":
                    ManageProspects.ManageProspectsLoad(loanId, prospectId, true);
                    break;
                case "LoanDetails":
                    $("#detailsSection").hide();
                    $("#detailsSection").html("");
                    LoanDetails.LoanDetailsCommand(currentQueue, loanId, prospectId);
                    break;
                case "LoanServices":
                    LoanServices.LoanServicesLoad(loanId, true);
                    break;
                case "ViewInBorrower":
                    ViewInBorrower(loanId, userAccountId);
                    break;
                case "FileManagement":
                    ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.FileManagement, currentQueue, loanId, prospectId);
                    break;
                case "disabled":
                    return false;
                    break;
                default:
                    break;
            }
        }

        $scope.$on("LoanChanged", function (event, args) {

            var loanId = args.wrappedLoan.ref.loanId;

            var selectedLoan = {
                LoanId: (loanId == undefined || loanId == null) ? null : loanId.trim(),
                UserAccountId: args.applicationData.currentUser.userAccountId,
                //RetrieveSelectedQueueName is from old Loan center
                QueueName: '',
                ApplicationStep: ''
            };
            $rootScope.SelectedLoan = selectedLoan;
            $rootScope.selectedLoanId = loanId;
            //$rootScope.ContextualType = enums.ContextualTypes.None;
            $scope.queueName = selectedLoan.QueueName;
            $scope.prospectId = ""
            NavigationSvc.SetNavigationLinks(selectedLoan.LoanId);
            vm.selectedLoanId = loanId;
            BroadcastSvc.broadcastCotextualBar();
            return selectedLoan;
        });

        function RealodPage() {

            switch (window.location.hash) {
                case '#/':
                    $rootScope.navigation = '';
                    break;
                case '#/cost/details':
                    $rootScope.navigation = 'CostDetails';
                    break;
                case '#/loanApplication/personal':
                    $rootScope.navigation = 'personal';
                    break;
                case '#/lockingandpricingadj':
                    $rootScope.navigation = 'lockingandpricingadj';
                    break;
                case '#/compliancecenter':
                    $rootScope.navigation = 'ComplianceCenter';
                    break;
                case '#/cost/pricing':
                    $rootScope.navigation = 'ProductAndPricing';
                    break;
                case '#/queue':
                    $rootScope.navigation = 'Queue';
                    break;
                default:
                    $rootScope.navigation = '';
                    break;
            }

        }

        function importFnmFile(loanExists, emptyLoanOnCancel, loanPurposeType) {
            importFnmSvc.openImportLoanModal(applicationData, loanExists, emptyLoanOnCancel, loanPurposeType);
        }

        function createNewLoanApplication(loanExists, emptyLoanOnCancel, loanPurposeType) {
            if (applicationData.currentUser.isWholesale)
                importFnmFile(loanExists, emptyLoanOnCancel, loanPurposeType);
            else
                openLoanApplication('loanCenter.loan.loanApplication.personal', true, loanPurposeType)
        }


        function isLoanLoaded() {
            if (wrappedLoan && wrappedLoan.ref)
                return true;
            return false;
        }

        function isLoanNumber() {
            return loanLoaded && wrappedLoan.ref.loanNumber && wrappedLoan.ref.loanNumber.trim() != '' && wrappedLoan.ref.loanNumber.trim().toLower() != 'pending';
        }

        function isLoanPurposeType(loanPurposeType) {
            return loanLoaded && wrappedLoan.ref.loanPurposeType == loanPurposeType;
        }

        function isLoanApplicationDateSet() {
            return loanLoaded && wrappedLoan.ref.sixPiecesAcquiredForAllLoanApplications;
        }

        function isIntentToProceedDateSet() {
            return loanLoaded && wrappedLoan.ref.isIntentToProceedDateSet();
        }

        function isLoanClosed() {
            return loanLoaded && wrappedLoan.ref.currentMilestone == srv.milestoneStatus.funded;
        }

        function hasPrivilege(priviledge) {
            return applicationData.currentUser.hasPrivilege(priviledge);
        }

        function openAntiSteeringModal() {
            NavigationSvc.openAntiSteeringModal(vm.wrappedLoan.ref.financialInfo.amortizationType, vm.wrappedLoan.ref.antiSteeringOptions, vm.wrappedLoan.ref.areLoanAntiSteeringOptionsCompleted, null);
        }

        function updateDisclosureStatusToNotNeeded(loanApplication) {
            if (!loanApplication.disclosureStatusDetails){
                loanApplication.disclosureStatusDetails = new srv.cls.DisclosureStatusDetailsViewModel();
            }
            loanApplication.disclosureStatusDetails.disclosureStatus = srv.DisclosureStatusEnum.NotNeeded;
            loanApplication.disclosureStatusDetails.disclosureStatusText = "Not Needed";
            loanApplication.disclosureStatusDetails.disclosureStatusReasons = [];
            loanApplication.alertPanelVisible = false;
    }

        function adverseDone(adverseReason) {
            wrappedLoan.ref.adverseReason.reason = adverseReason.reason;
            wrappedLoan.ref.adverseReason.reasonType = adverseReason.reasonType;
            wrappedLoan.ref.currentMilestone = enums.milestoneStatus.adverse;
            lib.forEach(vm.wrappedLoan.ref.getLoanApplications(), function (la) {
                    updateDisclosureStatusToNotNeeded(la);
            });
            $modalStack.dismissAll("close");
            NavigationSvc.SaveAndUpdateWrappedLoan(applicationData.currentUserId, wrappedLoan);
        }

        function openAdverseModal() {
            var modalInstance = $modal.open({
                templateUrl: 'angular/navigation/adverse/adversemodalwindow.html',
                backdrop: 'static',
                windowClass: 'imp-center-modal imp-adverse-modal',
                controller: 'adverseController',
                controllerAs: 'adverseCtrl',
                resolve: {
                    model: function () {
                        return {
                            adverseReason: wrappedLoan.ref.adverseReason
                        };
                    },
                    callBackDone: function () {
                        return adverseDone;
                    },
                    wrappedLoan: function () {
                        return wrappedLoan;
                    },
                    applicationData: function () {
                        return applicationData;
                    }
                }
            });
        }      
    }
})();


