

module consumersite {

    export class UINavigationService {

        private currNavStateIndex = 0;
        private nextDestNavStateIndex = -1;
        private highestIndex = 0;
        private backQueue: number[] = [];
        private consumerLoanAppStates: navigation.INavigationState[];
        private loan: vm.Loan;

        private borrowerStateName = "";
        private coBorrowerStateName = "";
        private borrowerEmploymentStateName = "";
        private coBorrowerEmploymentStateName = "";
        private borrowerAddressStateName = "";
        private coBorrowerAddressStateName = "";
        private borrowerGovernmentMonitoringStateName = "";
        private coBorrowerGovernmentMonitoringStateName = "";
        private propertyStateName = "";
        private otherIncomeStateName = "";
        private assetsStateName = "";
        private financialStateName = "";
        private summaryStateName = "";
        private additionalBorrowerStateName = "";
        private creditStateName = "";
        private successStateName = "";
        private declarationsStateName = "";

        static $inject = ['uiNavigation', '$state', 'consumerLoanService']; // 'consumerCreditService'];
        static className = 'navigationService';

        constructor(private uiNavigation: () => navigation.INavigationState[], private $state: ng.ui.IStateService, private consumerLoanService: ConsumerLoanService) { // , private consumerCreditService: IConsumerCreditService) {

            this.consumerLoanAppStates = uiNavigation();
            this.borrowerStateName = lib.findFirst(this.consumerLoanAppStates, cs => cs.loanAppNavState == navigation.loanAppNavigationState.borrowerPersonalInfo).stateName;
            this.coBorrowerStateName = lib.findFirst(this.consumerLoanAppStates, cs => cs.loanAppNavState == navigation.loanAppNavigationState.coBorrowerPersonalInfo).stateName;
            this.borrowerAddressStateName = lib.findFirst(this.consumerLoanAppStates, cs => cs.loanAppNavState == navigation.loanAppNavigationState.borrowerAddressInfo).stateName;
            this.coBorrowerAddressStateName = lib.findFirst(this.consumerLoanAppStates, cs => cs.loanAppNavState == navigation.loanAppNavigationState.coBorrowerAddressInfo).stateName;
            this.borrowerEmploymentStateName = lib.findFirst(this.consumerLoanAppStates, cs => cs.loanAppNavState == navigation.loanAppNavigationState.borrowerEmployment).stateName;
            this.coBorrowerEmploymentStateName = lib.findFirst(this.consumerLoanAppStates, cs => cs.loanAppNavState == navigation.loanAppNavigationState.coBorrowerEmployment).stateName;
            this.borrowerGovernmentMonitoringStateName = lib.findFirst(this.consumerLoanAppStates, cs => cs.loanAppNavState == navigation.loanAppNavigationState.borrowerGovernmentMonitoring).stateName;
            this.coBorrowerGovernmentMonitoringStateName = lib.findFirst(this.consumerLoanAppStates, cs => cs.loanAppNavState == navigation.loanAppNavigationState.coBorrowerGovernmentMonitoring).stateName;
            this.declarationsStateName = lib.findFirst(this.consumerLoanAppStates, cs => cs.loanAppNavState == navigation.loanAppNavigationState.declarations).stateName;
            this.otherIncomeStateName = lib.findFirst(this.consumerLoanAppStates, cs => cs.loanAppNavState == navigation.loanAppNavigationState.otherIncome).stateName;
            this.propertyStateName = lib.findFirst(this.consumerLoanAppStates, cs => cs.loanAppNavState == navigation.loanAppNavigationState.propertyInfo).stateName;
            this.financialStateName = lib.findFirst(this.consumerLoanAppStates, cs => cs.loanAppNavState == navigation.loanAppNavigationState.borrowerEmployment).stateName;
            this.summaryStateName = lib.findFirst(this.consumerLoanAppStates, cs => cs.loanAppNavState == navigation.loanAppNavigationState.summary).stateName;
            this.additionalBorrowerStateName = lib.findFirst(this.consumerLoanAppStates, cs => cs.loanAppNavState == navigation.loanAppNavigationState.additionalBorrower).stateName;
            this.creditStateName = lib.findFirst(this.consumerLoanAppStates, cs => cs.loanAppNavState == navigation.loanAppNavigationState.credit).stateName;
            this.successStateName = lib.findFirst(this.consumerLoanAppStates, cs => cs.loanAppNavState == navigation.loanAppNavigationState.success).stateName;
            this.assetsStateName = lib.findFirst(this.consumerLoanAppStates, cs => cs.loanAppNavState == navigation.loanAppNavigationState.assets).stateName;
        }

        setLoan = (loan: vm.Loan) => {
            this.loan = loan;
        }

        // this call is made when the state change is by StateName
        onCurrentState = () => {

            if (this.$state.current && this.$state.current.data && this.$state.current.data.loanAppNavState) {

                var loanAppState = this.$state.current.data.loanAppNavState;

                if (this.consumerLoanAppStates[this.currNavStateIndex].loanAppNavState != loanAppState) {
                    this.backQueue.push(this.currNavStateIndex);
                    this.currNavStateIndex = lib.findIndex(this.consumerLoanAppStates, cs => cs.loanAppNavState == loanAppState, this.currNavStateIndex);
                    this.nextDestNavStateIndex = (this.$state.params && this.$state.params['ns']) ? lib.findIndex(this.consumerLoanAppStates, cs => cs.loanAppNavState == +this.$state.params['ns']) : -1;
                }
            }
        }

        getProgressPercent = () => {

            var percent = 0.0;

            switch (this.getProgress()) {
                case navigation.loanAppNavigationState.borrowerPersonalInfo:
                case navigation.loanAppNavigationState.coBorrowerPersonalInfo:
                    percent = 0.05;
                    break;
                case navigation.loanAppNavigationState.propertyInfo:
                case navigation.loanAppNavigationState.borrowerAddressInfo:
                case navigation.loanAppNavigationState.coBorrowerAddressInfo:
                    percent = 0.18;
                    break;
                case navigation.loanAppNavigationState.borrowerEmployment:
                case navigation.loanAppNavigationState.borrowerPreviousEmployment:
                case navigation.loanAppNavigationState.coBorrowerEmployment:
                case navigation.loanAppNavigationState.coBorrowerPreviousEmployment:
                    percent = 0.37;
                    break;
                case navigation.loanAppNavigationState.otherIncome:
                    percent = 0.54;
                    break;
                case navigation.loanAppNavigationState.assets:
                    percent = 0.65;
                    break;
                case navigation.loanAppNavigationState.borrowerGovernmentMonitoring:
                case navigation.loanAppNavigationState.coBorrowerGovernmentMonitoring:
                case navigation.loanAppNavigationState.declarations:
                case navigation.loanAppNavigationState.summary:
                    percent = 0.79;
                    break;
                case navigation.loanAppNavigationState.additionalBorrower:
                case navigation.loanAppNavigationState.credit:
                case navigation.loanAppNavigationState.account:
                case navigation.loanAppNavigationState.creditResults:
                case navigation.loanAppNavigationState.eConsent:
                case navigation.loanAppNavigationState.alertPreferences:
                case navigation.loanAppNavigationState.activationCode:
                case navigation.loanAppNavigationState.signout:
                    percent = 0.92;
                    break;
                case navigation.loanAppNavigationState.success:
                    percent = 1.0;
                    break;
                default:
                    console.log('getProgressPercent(): value ' + this.getProgress() + ' not handled');
            }
            return percent;
        }

        get currentState(): navigation.loanAppNavigationState {

            return this.currNavStateIndex >= 0 ? this.consumerLoanAppStates[this.currNavStateIndex].loanAppNavState : navigation.loanAppNavigationState.undefined;
        }

        hasReachedPersonal = () => {
            return this.hasReachedState(navigation.loanAppNavigationState.borrowerPersonalInfo);
        }

        isAtPersonal = () => {
            return this.isAt(navigation.loanAppNavigationState.borrowerPersonalInfo, navigation.loanAppNavigationState.coBorrowerPersonalInfo);
        }

        hasReachedProperty = () => {
            return this.hasReachedState(navigation.loanAppNavigationState.propertyInfo);
        }

        isAtProperty = () => {
            return this.isAt(navigation.loanAppNavigationState.propertyInfo, navigation.loanAppNavigationState.borrowerAddressInfo, navigation.loanAppNavigationState.coBorrowerAddressInfo);
        }

        hasReachedFinancial = () => {
            return this.hasReachedState(navigation.loanAppNavigationState.borrowerEmployment);
        }

        isAtFinancial = () => {
            return this.isAt(navigation.loanAppNavigationState.borrowerEmployment, navigation.loanAppNavigationState.coBorrowerEmployment,
                navigation.loanAppNavigationState.otherIncome, navigation.loanAppNavigationState.assets);
        }

        hasReachedSummary = () => {
            return this.hasReachedState(navigation.loanAppNavigationState.borrowerGovernmentMonitoring);
        }

        isAtSummary = () => {
            return this.isAt(navigation.loanAppNavigationState.borrowerGovernmentMonitoring, navigation.loanAppNavigationState.coBorrowerGovernmentMonitoring,
                navigation.loanAppNavigationState.declarations, navigation.loanAppNavigationState.summary);
        }

        hasReachedCredit = () => {
            return this.hasReachedState(navigation.loanAppNavigationState.credit);
        }

        isAtCredit = () => {
            return this.isAt(navigation.loanAppNavigationState.credit, navigation.loanAppNavigationState.account, navigation.loanAppNavigationState.creditResults);
        }

        // where the "flag" state begins is TBD
        hasReachedCompletion = () => {
            return this.hasReachedState(navigation.loanAppNavigationState.success);
        }

        isAtCompletion = () => {
            return this.isAt(navigation.loanAppNavigationState.creditResults, navigation.loanAppNavigationState.eConsent,
                navigation.loanAppNavigationState.alertPreferences, navigation.loanAppNavigationState.activationCode,
                navigation.loanAppNavigationState.signout);
        }

        goToProperty = () => {
            this.goToSection(navigation.loanAppNavigationState.propertyInfo);
        }

        goToAddress = () => {
            this.goToSection(navigation.loanAppNavigationState.borrowerAddressInfo);
        }

        goToPersonal = () => {
            this.goToSection(navigation.loanAppNavigationState.borrowerPersonalInfo);
        }

        goToFinanical = () => {
            this.goToSection(navigation.loanAppNavigationState.borrowerEmployment);
        }

        goToSummary = () => {
            this.goToSection(navigation.loanAppNavigationState.summary);
        }

        goToCredit = () => {
            this.goToSection(navigation.loanAppNavigationState.credit);
        }

        // next is the method that is linked to the Save & Continue button
        next = () => {
            this.consumerLoanService.saveLoan(this.loan);
            this.pageEvent();
            this.goToState(this.getNextValidStateIndex(), this.nextDestNavStateIndex < 0);
        }

        back = () => {

            if (this.backQueue.length > 0) {
                this.goToState(this.backQueue.pop(), false);
            }
        }

        canGoBack = (): boolean => {
            return this.backQueue.length > 0;
        }

        private pageEvent = (): void => {
            if (this.consumerLoanAppStates[this.currNavStateIndex].pageEventMethod) {
                switch (this.consumerLoanAppStates[this.currNavStateIndex].pageEventMethod(this.loan)) {
                    case navigation.pageEvent.borrowerAddedOrRemoved:
                        this.borrowerAddedOrRemoved();
                        break;
                }
            }
        }

        private borrowerAddedOrRemoved = (): void => {
            this.highestIndex = this.currNavStateIndex;
        }

        getBorrowerLink = (loanAppState: navigation.loanAppNavigationState = navigation.loanAppNavigationState.undefined): string => {
            return this.generateLink(this.borrowerStateName, loanAppState);
        }

        getCoBorrowerLink = (loanAppState: navigation.loanAppNavigationState = navigation.loanAppNavigationState.undefined): string => {
            return this.generateLink(this.coBorrowerStateName, loanAppState);
        }

        getBorrowerEmploymentLink = (loanAppState: navigation.loanAppNavigationState = navigation.loanAppNavigationState.undefined): string => {
            return this.generateLink(this.borrowerEmploymentStateName, loanAppState);
        }

        getCoBorrowerEmploymentLink = (loanAppState: navigation.loanAppNavigationState = navigation.loanAppNavigationState.undefined): string => {
            return this.generateLink(this.coBorrowerEmploymentStateName, loanAppState);
        }

        getBorrowerGovermentMonitoringLink = (loanAppState: navigation.loanAppNavigationState = navigation.loanAppNavigationState.undefined): string => {
            return this.generateLink(this.borrowerGovernmentMonitoringStateName, loanAppState);
        }

        getCoBorrowerGovermentMonitoringLink = (loanAppState: navigation.loanAppNavigationState = navigation.loanAppNavigationState.undefined): string => {
            return this.generateLink(this.coBorrowerGovernmentMonitoringStateName, loanAppState);
        }

        getBorrowerAddressLink = (loanAppState: navigation.loanAppNavigationState = navigation.loanAppNavigationState.undefined): string => {
            return this.generateLink(this.borrowerAddressStateName, loanAppState);
        }

        getCoBorrowerAddressLink = (loanAppState: navigation.loanAppNavigationState = navigation.loanAppNavigationState.undefined): string => {
            return this.generateLink(this.coBorrowerAddressStateName, loanAppState);
        }

        getOtherIncomeLink = (loanAppState: navigation.loanAppNavigationState = navigation.loanAppNavigationState.undefined): string => {
            return this.generateLink(this.otherIncomeStateName, loanAppState);
        }

        getDeclarationsLink = (loanAppState: navigation.loanAppNavigationState = navigation.loanAppNavigationState.undefined): string => {
            return this.generateLink(this.declarationsStateName, loanAppState);
        }

        getPropertyLink = (loanAppState: navigation.loanAppNavigationState = navigation.loanAppNavigationState.undefined): string => {
            return this.generateLink(this.propertyStateName, loanAppState);
        }

        getFinancialLink = (loanAppState: navigation.loanAppNavigationState = navigation.loanAppNavigationState.undefined): string => {
            return this.generateLink(this.financialStateName, loanAppState);
        }

        getSummaryLink = (loanAppState: navigation.loanAppNavigationState = navigation.loanAppNavigationState.undefined): string => {
            return this.generateLink(this.summaryStateName, loanAppState);
        }

        getAdditionalBorrowerLink = (loanAppState: navigation.loanAppNavigationState = navigation.loanAppNavigationState.undefined): string => {
            return this.generateLink(this.additionalBorrowerStateName, loanAppState);
        }

        getCreditLink = (loanAppState: navigation.loanAppNavigationState = navigation.loanAppNavigationState.undefined): string => {
            return this.generateLink(this.creditStateName, loanAppState);
        }

        getAssetsLink = (loanAppState: navigation.loanAppNavigationState = navigation.loanAppNavigationState.undefined): string => {
            return this.generateLink(this.assetsStateName, loanAppState);
        }

        getSuccessLink = (loanAppState: navigation.loanAppNavigationState = navigation.loanAppNavigationState.undefined): string => {
            return this.generateLink(this.successStateName, loanAppState);
        }

        private generateLink = (stateName: string, loanAppState: navigation.loanAppNavigationState): string => {
            var url = this.$state.href(stateName, {ns: loanAppState});
            return url;
        }

        private getProgress = () => {
            return this.consumerLoanAppStates[this.highestIndex].loanAppNavState;
        }

        getNavigationDisplayName = (): string => {
            return this.doesNextDestinationStateHaveNavigationDisplayName() ? this.getPreviousNavigationDisplayName() : 'Save & Continue';
        }

        private doesNextDestinationStateHaveNavigationDisplayName = (): boolean => {
            return this.nextDestNavStateIndex > 0 && this.getPreviousNavigationDisplayName() != null;
        }

        private getPreviousNavigationDisplayName = (): string => {
            return this.consumerLoanAppStates[this.nextDestNavStateIndex].navigationDisplayName;
        }

        private goToState = (index: number, pushCurrentStateToBackQueue: boolean = true) => {

            if (index < this.consumerLoanAppStates.length) {
                if (pushCurrentStateToBackQueue && index != this.currNavStateIndex) {
                    this.backQueue.push(this.currNavStateIndex);
                }

                this.highestIndex = Math.max(index, this.highestIndex);
                this.$state.go(this.consumerLoanAppStates[this.currNavStateIndex = index].stateName);
                console.log("Going to ::: " + this.consumerLoanAppStates[this.currNavStateIndex].stateName);
                console.log(this.loan);
            }
        }

        private goToSection = (loanAppNavState: navigation.loanAppNavigationState) => {
            var index = lib.findIndex(this.consumerLoanAppStates, s => s.loanAppNavState == loanAppNavState);
            if (index < 0) {
                throw Error(loanAppNavState + " state was not found");
            }
            this.goToState(index);
        }

        private getNextValidStateIndex = () => {

            if (this.nextDestNavStateIndex > 0) {
                var index = this.nextDestNavStateIndex;
                this.nextDestNavStateIndex = -1;
                return index;
            }

            var startingIndex = this.currNavStateIndex + 1;
            while (startingIndex < this.consumerLoanAppStates.length && !this.consumerLoanAppStates[startingIndex].canTransistionTo(this.loan)) {
                startingIndex++;
            }
            return startingIndex;
        }

        private hasReachedState = (loanAppNavState: navigation.loanAppNavigationState) => {
            return this.consumerLoanAppStates[this.highestIndex].loanAppNavState >= loanAppNavState;
        }

        private isAt = (...loanAppNavStates: navigation.loanAppNavigationState[]) => {
            for (var i = 0; i < loanAppNavStates.length; i++) {
                if (this.consumerLoanAppStates[this.currNavStateIndex].loanAppNavState == loanAppNavStates[i]) {
                    return true;
                }
            }
            return false;
        }
    }

    moduleRegistration.registerService(moduleName, UINavigationService);
} 