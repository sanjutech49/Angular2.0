
(function () {
    'use strict';

    angular.module('loanCenter').controller('NavCtrl', NavigationController);

    NavigationController.$inject = ['$scope', '$state', '$stateParams', '$rootScope', '$modal', '$modalStack', 'NavigationSvc', 'BroadcastSvc', 'enums', 'applicationData', 'importFnmSvc', 'commonModalWindowFactory', 'modalWindowType', 'loanService', 'ContextualBarSvc', '$timeout', 'queueSvc', 'modalPopoverFactory'];

    function NavigationController($scope, $state, $stateParams, $rootScope, $modal, $modalStack, NavigationSvc, BroadcastSvc, enums, applicationData, importFnmSvc, commonModalWindowFactory, modalWindowType, loanService, ContextualBarSvc, $timeout, queueSvc, modalPopoverFactory) {
        var vm = this;

       
        vm.applicationData = applicationData;

        vm.modalPopoverFactory = modalPopoverFactory;
        vm.tabNames = enums.LoanApplicationTabs;
        vm.areSixPiecesAcquiredForAllLoanApplications = NavigationSvc.areSixPiecesAcquiredForAllLoanApplications;
        vm.affordabilityUrl = affordabilityUrl;
        vm.getMenuLabelText = getMenuLabelText;
        vm.mortgageType = null;
        vm.selectedLoanId = null;
        vm.enums = enums;
        vm.assignmentsEnabled = null;
        vm.isWholesaleUser = applicationData.currentUser.isWholesale;
        vm.conciergeUrl = vm.applicationData.configuration.conciergeHome + '?LOFirstVisit=False&isEmbeddedInLoanCenter=0';
        vm.loanCenter3Url = vm.applicationData.configuration.loanCenterHome + '?v=3';
        vm.loanCenter2Url = vm.applicationData.configuration.loanCenterHome
        vm.sysAdminUrl = vm.applicationData.configuration.systemAdmin + '?LOFirstVisit=False&isEmbeddedInLoanCenter=0'
        vm.createNewLoanApplication = createNewLoanApplication;
        vm.importFnmFile = importFnmFile;
        vm.openLink = openLink;
        vm.redirect = redirect;
        vm.openProspect = openProspect;
        vm.showReadOnlyMode = showReadOnlyMode;
        vm.showCheckOutPopup = showCheckOutPopup;
        vm.getCheckOutMessage = getCheckOutMessage;
        vm.checkoutPopupContent = checkoutPopupContent;
        vm.openFirstLoanFromMailList = openFirstLoanFromMailList;
        vm.NavigationSvc = NavigationSvc;
        vm.releaseLockedLoan = releaseLockedLoan;

        vm.numberOfListUserSees = numberOfListsUserSees();

        $scope.startItemOpen = false;
        $scope.startItemHover = false;
        vm.workbenchItemOpen = false;
        $scope.contactsItemOpen = false;
        $scope.toolsItemOpen = false;
        $scope.reportsItemOpen = false;
        $scope.favoritesItemOpen = false;
        $scope.settingsItemOpen = false;
        $rootScope.userAccountId = vm.applicationData.currentUser.userAccountId;

        angular.element(document).ready(function () {
            vm.showCheckOutPopup();
        });

        //This function is used for calculating SCC width of "LIST" menu, it is NOT for selecting which list is going to show
        function numberOfListsUserSees() {
            var number = 0;

            if (applicationData.currentUser.hasPrivilege(enums.privileges.ViewStandardList))
                number++;
            if (applicationData.currentUser.hasPrivilege(enums.privileges.ViewAppraisalLists))
                number++;
            if (applicationData.currentUser.hasPrivilege(enums.privileges.ViewDisclosuresList))
                number++;
            
            //This is defaulted by design number represents times of width for <div> it MUST be at least one
            if (number <= 0)
                number = 1;

            switch(number)
            {
                case 1:
                    number = "small";
                    break;
                case 2:
                    number = "medium";
                    break;
                case 3:
                    number = "wide";
                    break;
            }

            return number;
        }

        function openFirstLoanFromMailList() {
            NavigationSvc.openFirstLoanInMailRoomQueue(vm.applicationData.currentUser.userAccountId);
        }
        function getMenuLabelText(key) {
            return NavigationSvc.getMenuLabelText(key, vm.isWholesaleUser);
        }
       
        function openLoanApplication (stateName, newApplication, loanPurposeType) {
            $scope.startItemOpen = false;
            $scope.startItemHover = false;
            $modalStack.dismissAll('cancel');

            NavigationSvc.openLoanApplication(stateName, newApplication, loanPurposeType);
        }


        $scope.updateValuesOnRowChange = function () {
            SetValueForLoan();
        }

        $scope.updateValuesOnRowChangeNEW = function (loanId) {
            SetValueForLoanNEW(loanId);
        }

        $scope.prepareLoanOnRowSelect = function (loanId) {
            var SelectedLoan = NavigationSvc.PrepareLoanFromQueueNEW(loanId, vm.applicationData.currentUser.userAccountId);

            $rootScope.selectedLoanId = SelectedLoan.LoanId;
            $scope.queueName = SelectedLoan.QueueName;
            $scope.prospectId = ""
            NavigationSvc.SetNavigationLinks(SelectedLoan.LoanId);
            vm.selectedLoanId = SelectedLoan.LoanId;
        };

        //$scope.openConciergeEmbeddedCommand = function (action) {
        //    $scope.loanItemOpen = false;
        //    $scope.loanItemHover = false;
        //    $modalStack.dismissAll('cancel');
        //    var loanId = $scope.selectedLoanId;
        //    var queueName = $scope.queueName;
        //    var prospectId = $scope.prospectId;
        //    var userAccountId = $('.tablelistselected').find('.userAccountId').text().trim();

        //    switch (action) {
        //        case "AssignLoanInfo":
        //            AssignLoanInfo.AssignLoanInfoLoad(loanId);
        //            break;
        //        case "Activities":
        //            ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageActivities, currentQueue, loanId, prospectId);
        //            break;
        //        case "Alerts":
        //            ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageAlerts, currentQueue, loanId, prospectId);
        //            break;
        //        case "Appraisal":
        //            Appraisal.OpenAppraisalFormCommand(loanId, prospectId);
        //            break;
        //        case "Credit":
        //            ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageCredit, currentQueue, loanId, prospectId);
        //            break;
        //        case "Disclosures":
        //            if (currentQueue == WorkQueueTypes.MailRoom) {
        //                MailRoomGrid.MailRoomOpenDisclosures(loanId, documentId, userAccountId);
        //            }
        //            else
        //                ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageDisclosures, currentQueue, loanId, prospectId);
        //            break;
        //        case "Documents":
        //            ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageDocuments, currentQueue, loanId, '');
        //            break;
        //        case "ManageLoan":
        //            ConciergeCommandEmbedded.OpenConciergeEmbeddedSubCommand(WorkQueueCommands.ManageLoan, currentQueue, loanId, prospectId, 1);
        //            break;
        //        case "Escrow":
        //            ManageFees.ManageFeesLoad(loanId, prospectId);
        //            break;
        //        case "ManageProspects":
        //            ManageProspects.ManageProspectsLoad(loanId, prospectId, true);
        //            break;
        //        case "LoanDetails":
        //            $("#detailsSection").hide();
        //            $("#detailsSection").html("");
        //            LoanDetails.LoanDetailsCommand(currentQueue, loanId, prospectId);
        //            break;
        //        case "LoanServices":
        //            LoanServices.LoanServicesLoad(loanId, true);
        //            break;
        //        case "ViewInBorrower":
        //            ViewInBorrower(loanId, userAccountId);
        //            break;
        //        case "FileManagement":
        //            ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.FileManagement, currentQueue, loanId, prospectId);
        //            break;
        //        case "disabled":
        //            return false;
        //            break;
        //        default:
        //            break;
        //    }
        //}

        $scope.logout = function (url, borrowerUrl) {

            // Logout borrower
            window.open(borrowerUrl, "_blank", "width=200,height=110,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no");

            $.ajax({
                type: 'POST',
                url: url,
                success: function (data) {
                    window.location = data;
                }
            });
        }

        $scope.mainSearch = function (value) {
            if (value) {
                Search.SearchDataHelper(false, value);
                //$state.go('loanCenter.nav');
            }
            $rootScope.navigation = '';
            $rootScope.ContextualType = '';
        };

        $scope.sysAdminSearch = function (value) {
            if (value)
                SystemAdmin.Search(undefined, value);
        };

        $scope.mainClear = function () {
            Search.SearchDataHelper(true, "");
            //$state.go('loanCenter.nav');
        };

        $scope.sysAdminClear = function () {
            SystemAdmin.Search(undefined, '');
        };

       

        function SetValueForLoan() {
            var SelectedLoan = NavigationSvc.SelectLoanFromQueue();

            $rootScope.selectedLoanId = SelectedLoan.LoanId;
            $scope.queueName = SelectedLoan.QueueName;
            $scope.prospectId = $('.tablelistselected').find('.prospectid').text().trim();
            NavigationSvc.SetNavigationLinks(SelectedLoan.LoanId);
            vm.selectedLoanId = SelectedLoan.LoanId;
            //$state.go("loanCenter", {}, { reload: true });
        }

        function SetValueForLoanNEW(loanId) {
            var SelectedLoan = NavigationSvc.SelectLoanFromQueueNEW(loanId, vm.applicationData.currentUser.userAccountId);

            $rootScope.selectedLoanId = SelectedLoan.LoanId;
            $scope.queueName = SelectedLoan.QueueName;
            $scope.prospectId = ""
            NavigationSvc.SetNavigationLinks(SelectedLoan.LoanId);
            vm.selectedLoanId = SelectedLoan.LoanId;
        }

        function affordabilityUrl() {
            var url = applicationData.configuration.borrowerSiteUrl.concat("/Affordability/");
            
            window.open(url, '_blank');
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

        function openProspect() {
            openLink('LoanScenario');
            NavigationSvc.openProspect();
        }

        function openLink(linkName, state) {
            $scope.startItemOpen = false;
            $scope.startItemHover = false;
            $modalStack.dismissAll('cancel');

            NavigationSvc.openLink(linkName, state);
        }

        function signOut(url, signoutUrl){
            window.open(url, "_blank", "width=200,height=110,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no");

            $.ajax({
                type: 'POST',
                url: signoutUrl,
                success: function (data) {
                    window.location = data;
                }
            });
        }

        function handleRedirection(url, signoutUrl) {
            $modalStack.dismissAll('close');
            if (signoutUrl)
                signOut(url, signoutUrl);
            else
                window.open(url, '_self');
        }

        function redirect(url, signoutUrl) {
            if ($rootScope.selectedLoanId && window.location.hash.indexOf('loan') > -1) {
                var message = "";
                if (loanService.wrappedLoan.ref.primary.getBorrower().firstName.trim() && !!loanService.wrappedLoan.ref.primary.getBorrower().lastName.trim()){
                    message = loanService.wrappedLoan.ref.primary.getBorrower().lastName + ', ' + loanService.wrappedLoan.ref.primary.getBorrower().firstName
                }

                commonModalWindowFactory.open({
                    type: modalWindowType.unload, message: message, ctrl: {
                        doNotSaveTheLoan: doNotSaveTheLoan, saveTheLoan: saveTheLoan, closeTheModal: closeTheModal
            }
            });
            }
            else {
                handleRedirection(url, signoutUrl);
            }
            
            function closeTheModal() {
                $modalStack.dismissAll('close');
            }

            function saveTheLoan() {
                commonModalWindowFactory.close('close');

                if (loanService.wrappedLoan.ref.isValidForSave()) {
                    NavigationSvc.SaveAndUpdateWrappedLoan(applicationData.currentUserId, loanService.wrappedLoan, function (wrappedLoan) {
                        handleRedirection(url, signoutUrl);
                    },
                  function (error) {
                      commonModalWindowFactory.open({ type: modalWindowType.error, message: 'Error while saving loan' });
                      $log.error(error);
                  });
                }
                else {

                    NavigationSvc.openLoanApplication('loanCenter.loan.loanApplication.personal');
                }
            }

            function doNotSaveTheLoan() {
                handleRedirection(url, signoutUrl);
            }
        }

        function showReadOnlyMode() {
            return loanService.wrappedLoan && loanService.wrappedLoan.ref && loanService.wrappedLoan.ref.controlStatus && !loanService.wrappedLoan.ref.controlStatus.isAcquired && ContextualBarSvc.getContextualType() != enums.ContextualTypes.Queue;
        }

        function getCheckOutMessage() {
            if (loanService.wrappedLoan && loanService.wrappedLoan.ref && loanService.wrappedLoan.ref.controlStatus) 
                return " - Checked out to " + loanService.wrappedLoan.ref.controlStatus.lockOwnerUserName;
            return "";
        }

        function showCheckOutPopup() {
            if (vm.showReadOnlyMode()) {
                $timeout(function () {
                    var element = document.getElementById('divLoanCheckOutTooltip');
                    element.click();
                }, 100);
            }
        }

        function checkoutPopupContent(event) {
            if (vm.showReadOnlyMode()) {
                var checkoutPopup = this.modalPopoverFactory.openModalPopover('angular/navigation/checkoutpopup.html',
                    {},
                    {
                        message: this.getCheckOutMessage(),
                        hasPrivilege: vm.applicationData.currentUser.hasPrivilege('Release a Loan in Read Only Mode')
                    }, event, { zindex: 10800, position: 'fixed' });

                checkoutPopup.result.then(function () {
                    vm.releaseLockedLoan();
                });
            }
        }

        function releaseLockedLoan() {
            loanService.releasingServices.
                releaseControlAndAcquireLock({ loanId: loanService.wrappedLoan.ref.loanId, userAccountId: vm.applicationData.currentUser.userAccountId, lockOwnerId: loanService.wrappedLoan.ref.controlStatus.lockOwnerId }).
                $promise.then(
                function (data) {
                    loanService.wrappedLoan.ref.controlStatus = data;
                },
                function (error) {
                    console.log("releaseControl(" + vm.applicationData.currentUser.userAccountId + ", " + loanService.wrappedLoan.ref.loanId + ") FAIL:" + error.lockOwnerUserName);
                });
        }

    }
})();


