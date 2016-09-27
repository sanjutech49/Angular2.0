module documents {
    export class documentsController {

        public static $inject = ['$state', 'NavigationSvc', 'enums', 'wrappedLoan'];

        documentsTabs: any;


        constructor(private $state, private NavigationSvc, private enums, private wrappedLoan) {
            this.documentsTabs = NavigationSvc.DocumentsTabs;
            NavigationSvc.contextualType = enums.ContextualTypes.Documents;
            var vm = this;
            vm.wrappedLoan = wrappedLoan;

        }

        switchTab = (state) => {
            var command;
            switch (state) {
                case 'loanCenter.loan.documents.needslist':
                    command = {
                        navigateToState: 'loanCenter.loan.documents.needslist', selectedTab: 'NeedsList'
                    };
                    break;
                case 'loanCenter.loan.documents.docvault':
                    command = {
                        navigateToState: 'loanCenter.loan.documents.docvault', selectedTab: 'DocVault'
                    };
                    break;
            }

            angular.forEach(this.NavigationSvc.DocumentsTabs, function (tab, tabName) {
                if (command.selectedTab.toLowerCase() === tabName.toLowerCase()) {
                    tab.isSelected = true;
                } else {
                    tab.isSelected = false;
                }
            });

            this.$state.go(command.navigateToState);
        }
    }

    angular.module('documents').controller('documentsController', documentsController);
}
