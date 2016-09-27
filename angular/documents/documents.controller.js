var documents;
(function (documents) {
    var documentsController = (function () {
        function documentsController($state, NavigationSvc, enums, wrappedLoan) {
            var _this = this;
            this.$state = $state;
            this.NavigationSvc = NavigationSvc;
            this.enums = enums;
            this.wrappedLoan = wrappedLoan;
            this.switchTab = function (state) {
                var command;
                switch (state) {
                    case 'loanCenter.loan.documents.needslist':
                        command = {
                            navigateToState: 'loanCenter.loan.documents.needslist',
                            selectedTab: 'NeedsList'
                        };
                        break;
                    case 'loanCenter.loan.documents.docvault':
                        command = {
                            navigateToState: 'loanCenter.loan.documents.docvault',
                            selectedTab: 'DocVault'
                        };
                        break;
                }
                angular.forEach(_this.NavigationSvc.DocumentsTabs, function (tab, tabName) {
                    if (command.selectedTab.toLowerCase() === tabName.toLowerCase()) {
                        tab.isSelected = true;
                    }
                    else {
                        tab.isSelected = false;
                    }
                });
                _this.$state.go(command.navigateToState);
            };
            this.documentsTabs = NavigationSvc.DocumentsTabs;
            NavigationSvc.contextualType = enums.ContextualTypes.Documents;
            var vm = this;
            vm.wrappedLoan = wrappedLoan;
        }
        documentsController.$inject = ['$state', 'NavigationSvc', 'enums', 'wrappedLoan'];
        return documentsController;
    })();
    documents.documentsController = documentsController;
    angular.module('documents').controller('documentsController', documentsController);
})(documents || (documents = {}));
//# sourceMappingURL=documents.controller.js.map