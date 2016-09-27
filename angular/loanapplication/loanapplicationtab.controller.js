(function () {
    'use strict';

    angular.module('loanCenter').controller('LoanApplicationTabCtrl', LoanApplicationTabController);

    LoanApplicationTabController.$inject = ['NavigationSvc', 'wrappedLoan', '$state', 'applicationData', '$location', '$anchorScroll', 'enums', '$timeout'];

    function LoanApplicationTabController(NavigationSvc, wrappedLoan, $state, applicationData, $location, $anchorScroll, enums, $timeout) {
        var vm = this;
        vm.wrappedLoan = wrappedLoan;
        vm.loanAppTabs = NavigationSvc.LoanAppTabs;
        vm.navigateTabs = navigateTabs;
        vm.cancelChanges = cancelChanges;
        vm.saveAll = saveAll;
        vm.NavigationSvc = NavigationSvc;
        vm.nextPreviousNavigation = nextPreviousNavigation;
        vm.isPreviousDisabled = isPreviousDisabled;
        vm.isTabSelected = isTabSelected;

        NavigationSvc.contextualType = enums.ContextualTypes.LoanApplication;

        vm.flipPurpose = flipPurpose;
        vm.canFlip = vm.wrappedLoan.ref.leadManagerId !== undefined &&
            vm.wrappedLoan.ref.leadManagerId.length > 0
            && (vm.wrappedLoan.ref.product.programName == "" ||
            vm.wrappedLoan.ref.product.programName == undefined ||
            vm.wrappedLoan.ref.product.programName == null);
        function flipPurpose() {
            wrappedLoan.ref.loanPurposeType = wrappedLoan.ref.loanPurposeType == 2 ? 1 : 2;
            saveAll();
            //$state.go('loanCenter.loan.loanDetails.sections', { 'loanId': wrappedLoan.ref.loanId, 'loanPurposeType': wrappedLoan.ref.loanPurposeType==2?1:2 }, { reload: true });
        }

        function navigateTabs(state) {
            if (!wrappedLoan.ref.active.areTabsDisabled()) {
                $state.go(state);
            }
        }

        function cancelChanges() {
            NavigationSvc.cancelChanges(wrappedLoan.ref.loanId);
        }

        //
        // @todo: Review , this is not ideal and does *not* work properly with 2-way binding , UI-Router , etc.
        //      @see: .\mml.web.loancenter\angular\loancenter\wrappedLoan.ref.resolver.js
        //
        function saveAll() {

            if (!wrappedLoan.ref.isValidForSave()) {
                $location.hash('borrowerSection');
                $anchorScroll.yOffset = 280;
                $anchorScroll();
                return;
            }

            wrappedLoan.ref.selectedAppIndex = wrappedLoan.ref.getLoanApplications().indexOf(wrappedLoan.ref.active);
             
            //$timeout added to trigger digest cycle in order to reload data on tabs
            $timeout(function () {
                NavigationSvc.SaveAndUpdateWrappedLoan(applicationData.currentUserId, wrappedLoan)
            });
        }

        function nextPreviousNavigation(direction) {
            //1 = next
            //0 = previous
            var command;
            switch ($state.current.name) {
                case 'loanCenter.loan.loanApplication.personal':
                    command = direction == 1 ? getStateAndActiveTab('loanCenter.loan.loanApplication.property', 'Property') : getStateAndActiveTab('loanCenter.loan.loanApplication.personal', 'Personal');
                    break;
                case 'loanCenter.loan.loanApplication.property':
                    command = direction == 1 ? getStateAndActiveTab('loanCenter.loan.loanApplication.assets', 'Assets') : getStateAndActiveTab('loanCenter.loan.loanApplication.personal', 'Personal');
                    break;
                case 'loanCenter.loan.loanApplication.assets':
                    command = direction == 1 ? getStateAndActiveTab('loanCenter.loan.loanApplication.credit.details', 'Credit') : getStateAndActiveTab('loanCenter.loan.loanApplication.property', 'Property');
                    break;
                case 'loanCenter.loan.loanApplication.credit.details':
                    command = direction == 1 ? getStateAndActiveTab('loanCenter.loan.loanApplication.declarations', 'Declarations') : getStateAndActiveTab('loanCenter.loan.loanApplication.assets', 'Assets');
                    break;
                case 'loanCenter.loan.loanApplication.declarations':
                    command = direction == 1 ? getStateAndActiveTab('loanCenter.loan.loanApplication.income', 'Income') : getStateAndActiveTab('loanCenter.loan.loanApplication.credit.details', 'Credit');
                    break;
                case 'loanCenter.loan.loanApplication.income':
                    if (direction == 1) {
                        if (this.wrappedLoan.ref.vaInformation.isvaLoan){
                            command = getStateAndActiveTab('loanCenter.loan.vacenter.generalinformation', 'Income')
                        }
                        else {
                            command = getStateAndActiveTab('loanCenter.loan.loanDetails.sections', 'Income')
                        }
                    }
                    else {
                        command = getStateAndActiveTab('loanCenter.loan.loanApplication.declarations', 'Declarations');
                    }
                    break;
            }

            angular.forEach(NavigationSvc.LoanAppTabs, function (tab, tabName) {
                if (command.selectedTab.toLowerCase() === tabName.toLowerCase()) {
                    tab.isSelected = true;
                } else {
                    tab.isSelected = false;
                }
            });

            $state.go(command.navigateToState);
        }

        function getStateAndActiveTab(state, tab) {
            return { navigateToState: state, selectedTab: tab };
        }

        function isPreviousDisabled() {
            return $state.current.name == 'loanCenter.loan.loanApplication.personal';
        }

        function isTabSelected(stateName) {
            return $state.current.name == stateName;
        }
    }
})();