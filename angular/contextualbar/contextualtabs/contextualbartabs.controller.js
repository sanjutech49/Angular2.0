(function () {
    'use strict';

    angular.module('contextualBar').controller('ContextualBarTabsCtrl', ContextualBarTabsCtrl);
    
    ContextualBarTabsCtrl.$inject = ['$rootScope', 'ContextualBarSvc', 'enums', 'wrappedLoan', 'NavigationSvc', '$state', 'personalUtilities', '$modal', 'applicationData', 'importFnmSvc', '$timeout'];

    function ContextualBarTabsCtrl($rootScope, ContextualBarSvc, enums, wrappedLoan, NavigationSvc, $state, personalUtilities, $modal, applicationData, importFnmSvc, $timeout) {

        var vm = this;
        vm.wrappedLoan = wrappedLoan;
        vm.applicationData = applicationData;

        //functions
        vm.addLoanApplications = addLoanApplications;
        vm.slideContextualBar = slideContextualBar;
        vm.switchLoanApp = switchLoanApp;
        vm.createNewLoanApplication = createNewLoanApplication;
        vm.toggleIsContextualBarCollapsed = toggleIsContextualBarCollapsed;

        function addLoanApplications() {

            wrappedLoan.ref.addLoanApplication(new cls.LoanApplicationViewModel(vm.wrappedLoan.ref.getTransactionInfoRef(), null));
            wrappedLoan.ref.areSixPiecesAcquiredForAllLoanApplications();

            var tabs = document.getElementsByClassName("imp-contextual-bar-tabs");
            var tabslength = 0;
            var arrows = document.getElementsByClassName("imp-contextual-arrows");
            for (var i = 0; i < tabs.length; i++) {
                tabslength += tabs[i].offsetWidth;    
            }

            if (tabslength > 800) {
                for (var i = 0; i < arrows.length; i++) {
                    arrows[i].style.display = "block";
                }
            }

            NavigationSvc.setPersonalAsActiveAndRedirect(false, wrappedLoan.ref.loanId);
        }

        function slideContextualBar(left) {
            
            var element = document.getElementsByTagName("contextual-tabs")[0];
            var currentPosition = parseInt(element.style.marginLeft.split("px")[0]);

            if (left && element.style.marginLeft != "0px")
                element.style.marginLeft = currentPosition + 50 + "px";
            else if (!left)
                element.style.marginLeft = currentPosition - 50 + "px";
        }

        function switchLoanApp(loanapp) {
            wrappedLoan.ref.switchActiveLoanApplication(loanapp);
            NavigationSvc.setPersonalAsActiveAndRedirect(false, wrappedLoan.ref.loanId);
        }


        function createNewLoanApplication() {
            importFnmSvc.openImportLoanModal(applicationData, true);
        }

        function toggleIsContextualBarCollapsed() {
            wrappedLoan.ref.isContextualBarCollapsed = !wrappedLoan.ref.isContextualBarCollapsed;

            NavigationSvc.setBodyPosition();        
        }
    }
})();