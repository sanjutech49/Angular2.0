
module consumersite {

    export class LoanAppPageContext {

        static $inject = ['$window', '$state'];
        static className = 'loanAppPageContext';

        constructor(private $window: ng.IWindowService, private $state: ng.ui.IStateService) {
        }

        get loanAppNavigationState(): navigation.loanAppNavigationState {
            return this.getData().loanAppNavState;
        }

        get isCoBorrowerState(): boolean {
            return this.getData().isCoBorrowerState;
        }

        private getData = (): any => {
            return this.$state.current.data;
        }

        public scrollToTop = (): void => {
            this.$window.scrollTo(0, 65);
        }
    }

    moduleRegistration.registerService(moduleName, LoanAppPageContext);
} 