(function () {
    'use strict';

    angular.module('contextualBar').controller('ContextualBarCtrl', ContextualBarController);

    ContextualBarController.$inject = ['$rootScope', '$scope', 'ContextualBarSvc', 'NavigationSvc', 'enums', 'wrappedLoan', '$log', 'applicationData', '$modal', 'loanDetailsSvc', 'comparisonSvc', '$timeout', '$filter', 'commonCalculatorSvc'];

    function ContextualBarController($rootScope, $scope, ContextualBarSvc, NavigationSvc, enums, wrappedLoan, $log, applicationData, $modal, loanDetailsSvc, comparisonSvc, $timeout, $filter, commonCalculatorSvc) {

        var vm = this;
        vm.enums = enums;
        vm.wrappedLoan = wrappedLoan;
        vm.applicationData = applicationData;
        vm.loanDetailsSvc = loanDetailsSvc;
        vm.milestoneStatuses = getMilestoneStatuses();
        vm.leadStatuses = applicationData.lookup.leadStatuses;
        vm.loanStatus = loanStatus;
        vm.leadStatus = "";
        vm.loanStatusDropdownOpened = false;
        vm.leadStatusDropdownOpened = false;
        vm.alertExpanded = false;
        var modalOpened = false;
        var modalInstance = {};
        var manualDTI = 0;       

        vm.contextualTypes = applicationData.lookup.contextualTypes;
        vm.hasModifyMilestonePrivilege = hasModifyMilestonePrivilege;
        vm.changeLoanStatusDropdownOpened = changeLoanStatusDropdownOpened;
        vm.handleDocumentClick = handleDocumentClick;
        document.onclick = vm.handleDocumentClick;
        vm.dropdownStatusChanged = dropdownStatusChanged;
        vm.toggleComparisonModal = toggleComparisonModal;
        vm.getContextualName = getContextualName;
        vm.getContextualType = getContextualType;
        vm.getDTI = getDTI;
        vm.isApplicationDateVisible = isApplicationDateVisible;
        vm.onAppliationDateBlur = onAppliationDateBlur;
        vm.isLoanNumberVisible = isLoanNumberVisible;
        vm.loanApplicationsForStatuses;
        vm.getLowestMiddleFicoScore = getLowestMiddleFicoScore;
        vm.isManualSelection = isManualSelection;

        vm.toggleIsAlertExpanded = toggleIsAlertExpanded;    
        
        // TODO: Temporary watch function for loan status processing. Move it somewhere else, as this is overkill.
        $scope.$watch(function () { return wrappedLoan.ref.areSixPiecesAcquiredForAllLoanApplications(); });

        function toggleIsAlertExpanded() {
            vm.alertExpanded = !vm.alertExpanded

            NavigationSvc.setBodyPosition();
        }

        function loanStatus(currentMilestoneVal) {
            var currentMilestone = _.find(vm.milestoneStatuses, function (milestoneStatus) {
                return milestoneStatus.value == currentMilestoneVal;
        });
        if (currentMilestone) {
                return currentMilestone.text;
            }
        }

        var currentLeadStatus = _.find(vm.leadStatuses, function (leadStatus) {
            return leadStatus.value == wrappedLoan.ref.leadStatus;
        });
        if (currentLeadStatus) {
            vm.leadStatus = currentLeadStatus.text;
        }

        vm.moreThanFourReasons = moreThanFourReasons;
        vm.alertPanelVisible = alertPanelVisible;
        vm.getComplianceDate = getComplianceDate;
        vm.temporaryComplianceDate = "";
        vm.temporaryAutoDiscloseTime = "";
        vm.currentLoanStateName = "";
        vm.initializeComplianceDate = initializeComplianceDate;
        vm.getComplianceDateCallInProgress = false;
        vm.areDisclosuresCreatedForAnyLoanApplication = false;
        vm.originalApplicationDate = vm.wrappedLoan.ref.applicationDate;

        // Initialize data
        vm.initializeComplianceDate();

        function getContextualName() {
            return ContextualBarSvc.getContextualName(applicationData, ContextualBarSvc.getContextualType());
        }

        function getContextualType() {
            return ContextualBarSvc.getContextualType();
        }
        function getMilestoneStatuses() {
            var Flag_RetailChannel = 1; // 0001
            var Flag_WholesaleChannel = 2; // 0010

            var currentContext = Flag_RetailChannel;

            //returns list of one element
            var userChannel = _.filter(applicationData.companyProfile.channels, function (channel) {
                return channel.channelId == wrappedLoan.ref.channelId;
            });
            
            if (userChannel && userChannel.length == 1 && userChannel[0].isWholesale) {
                currentContext = Flag_WholesaleChannel;
            }

            var milestoneStatuses = _.filter(applicationData.lookup.milestonestatuses, function (milestonestatus) {
                return milestonestatus.contextFlags & currentContext;
                });

                lib.forEach(milestoneStatuses, function (e) { 
                if (vm.wrappedLoan.ref.isMilestoneStatusManual && e.value == vm.wrappedLoan.ref.currentMilestone) {
                        e.selected = true;
                    }
                else {
                    e.selected = false;
                }
                })

            return milestoneStatuses;
        }
        function isManualSelection(milestoneStatus) {
            return vm.wrappedLoan.ref.isMilestoneStatusManual && vm.wrappedLoan.ref.currentMilestone == milestoneStatus;
        }

        function moreThanFourReasons() {
            return vm.wrappedLoan.ref.active.disclosureStatusDetails && vm.wrappedLoan.ref.active.disclosureStatusDetails.disclosureStatusReasons && vm.wrappedLoan.ref.active.disclosureStatusDetails.disclosureStatusReasons.length > 4;
        }

        function alertPanelVisible() {
            var allLoanAplications = vm.wrappedLoan.ref.getLoanApplications();
            vm.areDisclosuresCreatedForAnyLoanApplication = allLoanAplications.filter(
                function (item) {
                    return item.disclosureStatusDetails && item.disclosureStatusDetails.disclosureStatus == srv.DisclosureStatusEnum.DisclosuresCreated
                }).length > 0;

            vm.loanApplicationsForStatuses = allLoanAplications.filter(function (item) { return alertPanelVisibleStatuses(item); });

            updateDisclosureStatusMessages(vm.loanApplicationsForStatuses);
            vm.wrappedLoan.ref.active.alertPanelVisible = vm.selectedContextualType != vm.enums.ContextualTypes.Queue &&
                (alertPanelVisibleStatuses(vm.wrappedLoan.ref.active) || vm.areDisclosuresCreatedForAnyLoanApplication);

            return vm.wrappedLoan.ref.active.alertPanelVisible;
        }

        function alertPanelVisibleStatuses(loanApp) {
            return loanApp.disclosureStatusDetails && (loanApp.disclosureStatusDetails.disclosureStatus == srv.DisclosureStatusEnum.InitialDisclosureRequired
                   || loanApp.disclosureStatusDetails.disclosureStatus == srv.DisclosureStatusEnum.ReDisclosureRequired
                   || loanApp.disclosureStatusDetails.disclosureStatus == srv.DisclosureStatusEnum.RequestInProgress
                   || loanApp.disclosureStatusDetails.disclosureStatus == srv.DisclosureStatusEnum.DisclosuresCreated);
        }

        function initializeComplianceDate() {
            if (vm.selectedContextualType != vm.enums.ContextualTypes.Queue) {
                vm.getComplianceDateCallInProgress = true;

                var appDate = vm.wrappedLoan.ref.applicationDate;
                if (!vm.wrappedLoan.ref.applicationDate || moment('0001-01-01').diff(moment(vm.wrappedLoan.ref.applicationDate)) == 0)
                    appDate = new Date();

                vm.loanDetailsSvc.getComplianceDate.getComplianceDate({ appDate: appDate, stateName: vm.wrappedLoan.ref.getSubjectProperty().stateName }).$promise.then(
                function (data) {
                    vm.currentLoanStateName = vm.wrappedLoan.ref.getSubjectProperty().stateName;
                    if (data && data.complianceDate) {
                        vm.temporaryComplianceDate = (moment(data.complianceDate)).format('MM/DD/YY');
                        vm.temporaryAutoDiscloseTime = (moment(data.autoDiscloseTime)).format('hh:mm A');
                    }

                    vm.getComplianceDateCallInProgress = false;
                },
                function (errorMsg) {
                    vm.currentLoanStateName = "";
                    vm.getComplianceDateCallInProgress = false;
                    $log.error(errorMsg);
                });
            }
        }

        function getComplianceDate() {
            // If date wasn't initialized or if the subject property state changed, initialize due date
            if (!vm.getComplianceDateCallInProgress && vm.wrappedLoan.ref.active && vm.wrappedLoan.ref.active.alertPanelVisible && !!vm.wrappedLoan.ref.getSubjectProperty().stateName
                && (!vm.temporaryComplianceDate || vm.currentLoanStateName != vm.wrappedLoan.ref.getSubjectProperty().stateName)) {
                vm.currentLoanStateName = vm.wrappedLoan.ref.getSubjectProperty().stateName;
                vm.initializeComplianceDate();
            }

            return vm.temporaryComplianceDate;
        }

        function hasModifyMilestonePrivilege() {
            return !!_.find(applicationData.currentUser.privileges, function (userPrivilege) {
                return userPrivilege.category && userPrivilege.category == 88;
            });
        }
        function changeLoanStatusDropdownOpened() {
            if (hasModifyMilestonePrivilege()) {
                vm.loanStatusDropdownOpened = !vm.loanStatusDropdownOpened;
            }
        }
        function handleDocumentClick() {
            if (vm.loanStatusDropdownOpened && hasModifyMilestonePrivilege()) {
                vm.loanStatusDropdownOpened = !vm.loanStatusDropdownOpened;
            }
        }
        
        function dropdownStatusChanged(status, statusType)
        {
            switch(statusType)
            {
                case vm.enums.contextualBarDropDownTypes.milestoneStatus:
                    if (wrappedLoan.ref.isMilestoneStatusManual && wrappedLoan.ref.currentMilestone == status.value) {
                        wrappedLoan.ref.isMilestoneStatusManual = false;
                        status.selected = false;
                        wrappedLoan.ref.currentMilestone = wrappedLoan.ref.originalMilestoneStatus;
                    }
                    else {
                        wrappedLoan.ref.isMilestoneStatusManual = true;
                        lib.forEach(vm.milestoneStatuses, function (e) { e.selected = false;})
                        status.selected = true;
                        wrappedLoan.ref.currentMilestone = status.value;
                    }                    
                    loanStatus(wrappedLoan.ref.currentMilestone);
                    break;
                case vm.enums.contextualBarDropDownTypes.leadStatus:
                    vm.leadStatus = status.text;
                    wrappedLoan.ref.leadStatus = status.value;
                    break;
            }
        }      
        
        function toggleComparisonModal() {
            if (!modalOpened) {
                modalOpened = true;
                modalInstance = $modal.open({
                    templateUrl: 'angular/contextualbar/comparisonpdf/comparisonreportmodal.html',
                    controller: 'comparisonPDFController',
                    controllerAs: 'comparisonPDF',
                    windowClass: 'comparison-modal-window .modal-dialog',
                    backdropClass: 'comparison-modal-backdrop',
                    resolve: {
                        loan: function () {
                            return vm.wrappedLoan;
                        },
                        applicationData: function(){
                            return vm.applicationData;
                        },
                        comparison: function () {
                            return comparisonSvc.comparisonServices.getComparisonHistory({ loanId: vm.wrappedLoan.ref.loanId, userAccountId: vm.applicationData.currentUser.userAccountId }).$promise.then(
                                function (data) {
                                    return data;
                                },
                                function (error) {
                                    $log.error('Failure loading Comparison history details', error);
                                });
                        }
                    }
                });
            } else {
                modalInstance.dismiss('cancel');
        }
            modalInstance.result.then(function () {             
            }, function () {
                modalOpened = false;
            });
        }

        function getDTI() {
            if (!manualDTI || (manualDTI != wrappedLoan.ref.financialInfo.dti && wrappedLoan.ref.financialInfo.dti))
                manualDTI = wrappedLoan.ref.financialInfo.dti;

            wrappedLoan.ref.financialInfo.dti = wrappedLoan.ref.financialInfo.dti ? wrappedLoan.ref.financialInfo.dti : manualDTI;
            return wrappedLoan.ref.financialInfo.dti
        }

        function onAppliationDateBlur() {
            if (!vm.wrappedLoan.ref.applicationDate)
                $timeout(function () {
                    vm.wrappedLoan.ref.applicationDate = vm.originalApplicationDate;
                }, 200);
        }

        function isApplicationDateVisible() {
            var originalApplicationDateEmpty = !vm.originalApplicationDate || vm.originalApplicationDate == '0001-01-01T00:00:00';
            var applicationDateEmpty = !vm.wrappedLoan.ref.applicationDate || vm.wrappedLoan.ref.applicationDate == '0001-01-01T00:00:00';
            if (originalApplicationDateEmpty && !applicationDateEmpty) {
                vm.originalApplicationDate = vm.wrappedLoan.ref.applicationDate;
                originalApplicationDateEmpty = applicationDateEmpty;
            }

            return !originalApplicationDateEmpty;
        }
        function isLoanNumberVisible() {
            return vm.wrappedLoan.ref.shouldLoanNumberBeVisible();
        }

        function updateDisclosureStatusMessages(loanApps) {
            for (var i = 0; i < loanApps.length; i++) {
                setDisclosureStatusMessage(loanApps[i]);
                loanApps[i].setDisclosureStatusTitle();
            }
        }

        function setDisclosureStatusMessage(loanApp) {
            var areDisclosuresCreated = loanApp.disclosureStatusDetails.disclosureStatus && 
                loanApp.disclosureStatusDetails.disclosureStatus == srv.DisclosureStatusEnum.DisclosuresCreated;

            if (areDisclosuresCreated && loanApp.docDelivery == srv.docDeliveryTypeEnum.Mail) {
                loanApp.disclosureStatusDetails.disclosureStatusDetailsMessageBody = "waiting to be Mailed for " + loanApp.getBorrower().getFullName() +
                    (loanApp.isSpouseOnTheLoan ? ", " + loanApp.getCoBorrower().getFullName() : "") + ".";
            }
            else if (areDisclosuresCreated && loanApp.docDelivery == srv.docDeliveryTypeEnum.Electronic &&
                     loanApp.getBorrower().eConsent.consentStatus == srv.ConsentStatusEnum.None) {
                
                loanApp.disclosureStatusDetails.disclosureStatusDetailsMessageBody = loanApp.getBorrower().getFullName() + " must eConsent or the Disclosure Package will be mailed on " + $filter('date')(vm.getComplianceDate(), 'MM/dd/yyyy') + " at " + vm.temporaryAutoDiscloseTime + " PST";
            }
            else {
                loanApp.disclosureStatusDetails.disclosureStatusDetailsMessageBody = "will be created and sent on " + $filter('date')(vm.getComplianceDate(), 'MM/dd/yyyy') + " at " + vm.temporaryAutoDiscloseTime + ".";
            }
        }

        function getLowestMiddleFicoScore() {
            var midFicoScore = commonCalculatorSvc.GetLowestMiddleFicoScore(vm.wrappedLoan, vm.applicationData);

            return midFicoScore;
        }
    }
})();