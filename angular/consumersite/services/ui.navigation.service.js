var consumersite;
(function (consumersite) {
    var UINavigationService = (function () {
        function UINavigationService(uiNavigation, $state, consumerLoanService) {
            var _this = this;
            this.uiNavigation = uiNavigation;
            this.$state = $state;
            this.consumerLoanService = consumerLoanService;
            this.currNavStateIndex = 0;
            this.nextDestNavStateIndex = -1;
            this.highestIndex = 0;
            this.backQueue = [];
            this.borrowerStateName = "";
            this.coBorrowerStateName = "";
            this.borrowerEmploymentStateName = "";
            this.coBorrowerEmploymentStateName = "";
            this.borrowerAddressStateName = "";
            this.coBorrowerAddressStateName = "";
            this.borrowerGovernmentMonitoringStateName = "";
            this.coBorrowerGovernmentMonitoringStateName = "";
            this.propertyStateName = "";
            this.otherIncomeStateName = "";
            this.assetsStateName = "";
            this.financialStateName = "";
            this.summaryStateName = "";
            this.additionalBorrowerStateName = "";
            this.creditStateName = "";
            this.successStateName = "";
            this.declarationsStateName = "";
            this.setLoan = function (loan) {
                _this.loan = loan;
            };
            // this call is made when the state change is by StateName
            this.onCurrentState = function () {
                if (_this.$state.current && _this.$state.current.data && _this.$state.current.data.loanAppNavState) {
                    var loanAppState = _this.$state.current.data.loanAppNavState;
                    if (_this.consumerLoanAppStates[_this.currNavStateIndex].loanAppNavState != loanAppState) {
                        _this.backQueue.push(_this.currNavStateIndex);
                        _this.currNavStateIndex = lib.findIndex(_this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == loanAppState; }, _this.currNavStateIndex);
                        _this.nextDestNavStateIndex = (_this.$state.params && _this.$state.params['ns']) ? lib.findIndex(_this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == +_this.$state.params['ns']; }) : -1;
                    }
                }
            };
            this.getProgressPercent = function () {
                var percent = 0.0;
                switch (_this.getProgress()) {
                    case 1 /* borrowerPersonalInfo */:
                    case 2 /* coBorrowerPersonalInfo */:
                        percent = 0.05;
                        break;
                    case 3 /* propertyInfo */:
                    case 4 /* borrowerAddressInfo */:
                    case 5 /* coBorrowerAddressInfo */:
                        percent = 0.18;
                        break;
                    case 6 /* borrowerEmployment */:
                    case 7 /* borrowerPreviousEmployment */:
                    case 8 /* coBorrowerEmployment */:
                    case 9 /* coBorrowerPreviousEmployment */:
                        percent = 0.37;
                        break;
                    case 10 /* otherIncome */:
                        percent = 0.54;
                        break;
                    case 11 /* assets */:
                        percent = 0.65;
                        break;
                    case 12 /* borrowerGovernmentMonitoring */:
                    case 13 /* coBorrowerGovernmentMonitoring */:
                    case 14 /* declarations */:
                    case 15 /* summary */:
                        percent = 0.79;
                        break;
                    case 16 /* additionalBorrower */:
                    case 17 /* credit */:
                    case 18 /* account */:
                    case 19 /* creditResults */:
                    case 21 /* eConsent */:
                    case 22 /* alertPreferences */:
                    case 23 /* activationCode */:
                    case 24 /* signout */:
                        percent = 0.92;
                        break;
                    case 20 /* success */:
                        percent = 1.0;
                        break;
                    default:
                        console.log('getProgressPercent(): value ' + _this.getProgress() + ' not handled');
                }
                return percent;
            };
            this.hasReachedPersonal = function () {
                return _this.hasReachedState(1 /* borrowerPersonalInfo */);
            };
            this.isAtPersonal = function () {
                return _this.isAt(1 /* borrowerPersonalInfo */, 2 /* coBorrowerPersonalInfo */);
            };
            this.hasReachedProperty = function () {
                return _this.hasReachedState(3 /* propertyInfo */);
            };
            this.isAtProperty = function () {
                return _this.isAt(3 /* propertyInfo */, 4 /* borrowerAddressInfo */, 5 /* coBorrowerAddressInfo */);
            };
            this.hasReachedFinancial = function () {
                return _this.hasReachedState(6 /* borrowerEmployment */);
            };
            this.isAtFinancial = function () {
                return _this.isAt(6 /* borrowerEmployment */, 8 /* coBorrowerEmployment */, 10 /* otherIncome */, 11 /* assets */);
            };
            this.hasReachedSummary = function () {
                return _this.hasReachedState(12 /* borrowerGovernmentMonitoring */);
            };
            this.isAtSummary = function () {
                return _this.isAt(12 /* borrowerGovernmentMonitoring */, 13 /* coBorrowerGovernmentMonitoring */, 14 /* declarations */, 15 /* summary */);
            };
            this.hasReachedCredit = function () {
                return _this.hasReachedState(17 /* credit */);
            };
            this.isAtCredit = function () {
                return _this.isAt(17 /* credit */, 18 /* account */, 19 /* creditResults */);
            };
            // where the "flag" state begins is TBD
            this.hasReachedCompletion = function () {
                return _this.hasReachedState(20 /* success */);
            };
            this.isAtCompletion = function () {
                return _this.isAt(19 /* creditResults */, 21 /* eConsent */, 22 /* alertPreferences */, 23 /* activationCode */, 24 /* signout */);
            };
            this.goToProperty = function () {
                _this.goToSection(3 /* propertyInfo */);
            };
            this.goToAddress = function () {
                _this.goToSection(4 /* borrowerAddressInfo */);
            };
            this.goToPersonal = function () {
                _this.goToSection(1 /* borrowerPersonalInfo */);
            };
            this.goToFinanical = function () {
                _this.goToSection(6 /* borrowerEmployment */);
            };
            this.goToSummary = function () {
                _this.goToSection(15 /* summary */);
            };
            this.goToCredit = function () {
                _this.goToSection(17 /* credit */);
            };
            // next is the method that is linked to the Save & Continue button
            this.next = function () {
                _this.consumerLoanService.saveLoan(_this.loan);
                _this.pageEvent();
                _this.goToState(_this.getNextValidStateIndex(), _this.nextDestNavStateIndex < 0);
            };
            this.back = function () {
                if (_this.backQueue.length > 0) {
                    _this.goToState(_this.backQueue.pop(), false);
                }
            };
            this.canGoBack = function () {
                return _this.backQueue.length > 0;
            };
            this.pageEvent = function () {
                if (_this.consumerLoanAppStates[_this.currNavStateIndex].pageEventMethod) {
                    switch (_this.consumerLoanAppStates[_this.currNavStateIndex].pageEventMethod(_this.loan)) {
                        case 1 /* borrowerAddedOrRemoved */:
                            _this.borrowerAddedOrRemoved();
                            break;
                    }
                }
            };
            this.borrowerAddedOrRemoved = function () {
                _this.highestIndex = _this.currNavStateIndex;
            };
            this.getBorrowerLink = function (loanAppState) {
                if (loanAppState === void 0) { loanAppState = 0 /* undefined */; }
                return _this.generateLink(_this.borrowerStateName, loanAppState);
            };
            this.getCoBorrowerLink = function (loanAppState) {
                if (loanAppState === void 0) { loanAppState = 0 /* undefined */; }
                return _this.generateLink(_this.coBorrowerStateName, loanAppState);
            };
            this.getBorrowerEmploymentLink = function (loanAppState) {
                if (loanAppState === void 0) { loanAppState = 0 /* undefined */; }
                return _this.generateLink(_this.borrowerEmploymentStateName, loanAppState);
            };
            this.getCoBorrowerEmploymentLink = function (loanAppState) {
                if (loanAppState === void 0) { loanAppState = 0 /* undefined */; }
                return _this.generateLink(_this.coBorrowerEmploymentStateName, loanAppState);
            };
            this.getBorrowerGovermentMonitoringLink = function (loanAppState) {
                if (loanAppState === void 0) { loanAppState = 0 /* undefined */; }
                return _this.generateLink(_this.borrowerGovernmentMonitoringStateName, loanAppState);
            };
            this.getCoBorrowerGovermentMonitoringLink = function (loanAppState) {
                if (loanAppState === void 0) { loanAppState = 0 /* undefined */; }
                return _this.generateLink(_this.coBorrowerGovernmentMonitoringStateName, loanAppState);
            };
            this.getBorrowerAddressLink = function (loanAppState) {
                if (loanAppState === void 0) { loanAppState = 0 /* undefined */; }
                return _this.generateLink(_this.borrowerAddressStateName, loanAppState);
            };
            this.getCoBorrowerAddressLink = function (loanAppState) {
                if (loanAppState === void 0) { loanAppState = 0 /* undefined */; }
                return _this.generateLink(_this.coBorrowerAddressStateName, loanAppState);
            };
            this.getOtherIncomeLink = function (loanAppState) {
                if (loanAppState === void 0) { loanAppState = 0 /* undefined */; }
                return _this.generateLink(_this.otherIncomeStateName, loanAppState);
            };
            this.getDeclarationsLink = function (loanAppState) {
                if (loanAppState === void 0) { loanAppState = 0 /* undefined */; }
                return _this.generateLink(_this.declarationsStateName, loanAppState);
            };
            this.getPropertyLink = function (loanAppState) {
                if (loanAppState === void 0) { loanAppState = 0 /* undefined */; }
                return _this.generateLink(_this.propertyStateName, loanAppState);
            };
            this.getFinancialLink = function (loanAppState) {
                if (loanAppState === void 0) { loanAppState = 0 /* undefined */; }
                return _this.generateLink(_this.financialStateName, loanAppState);
            };
            this.getSummaryLink = function (loanAppState) {
                if (loanAppState === void 0) { loanAppState = 0 /* undefined */; }
                return _this.generateLink(_this.summaryStateName, loanAppState);
            };
            this.getAdditionalBorrowerLink = function (loanAppState) {
                if (loanAppState === void 0) { loanAppState = 0 /* undefined */; }
                return _this.generateLink(_this.additionalBorrowerStateName, loanAppState);
            };
            this.getCreditLink = function (loanAppState) {
                if (loanAppState === void 0) { loanAppState = 0 /* undefined */; }
                return _this.generateLink(_this.creditStateName, loanAppState);
            };
            this.getAssetsLink = function (loanAppState) {
                if (loanAppState === void 0) { loanAppState = 0 /* undefined */; }
                return _this.generateLink(_this.assetsStateName, loanAppState);
            };
            this.getSuccessLink = function (loanAppState) {
                if (loanAppState === void 0) { loanAppState = 0 /* undefined */; }
                return _this.generateLink(_this.successStateName, loanAppState);
            };
            this.generateLink = function (stateName, loanAppState) {
                var url = _this.$state.href(stateName, { ns: loanAppState });
                return url;
            };
            this.getProgress = function () {
                return _this.consumerLoanAppStates[_this.highestIndex].loanAppNavState;
            };
            this.getNavigationDisplayName = function () {
                return _this.doesNextDestinationStateHaveNavigationDisplayName() ? _this.getPreviousNavigationDisplayName() : 'Save & Continue';
            };
            this.doesNextDestinationStateHaveNavigationDisplayName = function () {
                return _this.nextDestNavStateIndex > 0 && _this.getPreviousNavigationDisplayName() != null;
            };
            this.getPreviousNavigationDisplayName = function () {
                return _this.consumerLoanAppStates[_this.nextDestNavStateIndex].navigationDisplayName;
            };
            this.goToState = function (index, pushCurrentStateToBackQueue) {
                if (pushCurrentStateToBackQueue === void 0) { pushCurrentStateToBackQueue = true; }
                if (index < _this.consumerLoanAppStates.length) {
                    if (pushCurrentStateToBackQueue && index != _this.currNavStateIndex) {
                        _this.backQueue.push(_this.currNavStateIndex);
                    }
                    _this.highestIndex = Math.max(index, _this.highestIndex);
                    _this.$state.go(_this.consumerLoanAppStates[_this.currNavStateIndex = index].stateName);
                    console.log("Going to ::: " + _this.consumerLoanAppStates[_this.currNavStateIndex].stateName);
                    console.log(_this.loan);
                }
            };
            this.goToSection = function (loanAppNavState) {
                var index = lib.findIndex(_this.consumerLoanAppStates, function (s) { return s.loanAppNavState == loanAppNavState; });
                if (index < 0) {
                    throw Error(loanAppNavState + " state was not found");
                }
                _this.goToState(index);
            };
            this.getNextValidStateIndex = function () {
                if (_this.nextDestNavStateIndex > 0) {
                    var index = _this.nextDestNavStateIndex;
                    _this.nextDestNavStateIndex = -1;
                    return index;
                }
                var startingIndex = _this.currNavStateIndex + 1;
                while (startingIndex < _this.consumerLoanAppStates.length && !_this.consumerLoanAppStates[startingIndex].canTransistionTo(_this.loan)) {
                    startingIndex++;
                }
                return startingIndex;
            };
            this.hasReachedState = function (loanAppNavState) {
                return _this.consumerLoanAppStates[_this.highestIndex].loanAppNavState >= loanAppNavState;
            };
            this.isAt = function () {
                var loanAppNavStates = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    loanAppNavStates[_i - 0] = arguments[_i];
                }
                for (var i = 0; i < loanAppNavStates.length; i++) {
                    if (_this.consumerLoanAppStates[_this.currNavStateIndex].loanAppNavState == loanAppNavStates[i]) {
                        return true;
                    }
                }
                return false;
            };
            this.consumerLoanAppStates = uiNavigation();
            this.borrowerStateName = lib.findFirst(this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == 1 /* borrowerPersonalInfo */; }).stateName;
            this.coBorrowerStateName = lib.findFirst(this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == 2 /* coBorrowerPersonalInfo */; }).stateName;
            this.borrowerAddressStateName = lib.findFirst(this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == 4 /* borrowerAddressInfo */; }).stateName;
            this.coBorrowerAddressStateName = lib.findFirst(this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == 5 /* coBorrowerAddressInfo */; }).stateName;
            this.borrowerEmploymentStateName = lib.findFirst(this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == 6 /* borrowerEmployment */; }).stateName;
            this.coBorrowerEmploymentStateName = lib.findFirst(this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == 8 /* coBorrowerEmployment */; }).stateName;
            this.borrowerGovernmentMonitoringStateName = lib.findFirst(this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == 12 /* borrowerGovernmentMonitoring */; }).stateName;
            this.coBorrowerGovernmentMonitoringStateName = lib.findFirst(this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == 13 /* coBorrowerGovernmentMonitoring */; }).stateName;
            this.declarationsStateName = lib.findFirst(this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == 14 /* declarations */; }).stateName;
            this.otherIncomeStateName = lib.findFirst(this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == 10 /* otherIncome */; }).stateName;
            this.propertyStateName = lib.findFirst(this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == 3 /* propertyInfo */; }).stateName;
            this.financialStateName = lib.findFirst(this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == 6 /* borrowerEmployment */; }).stateName;
            this.summaryStateName = lib.findFirst(this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == 15 /* summary */; }).stateName;
            this.additionalBorrowerStateName = lib.findFirst(this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == 16 /* additionalBorrower */; }).stateName;
            this.creditStateName = lib.findFirst(this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == 17 /* credit */; }).stateName;
            this.successStateName = lib.findFirst(this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == 20 /* success */; }).stateName;
            this.assetsStateName = lib.findFirst(this.consumerLoanAppStates, function (cs) { return cs.loanAppNavState == 11 /* assets */; }).stateName;
        }
        Object.defineProperty(UINavigationService.prototype, "currentState", {
            get: function () {
                return this.currNavStateIndex >= 0 ? this.consumerLoanAppStates[this.currNavStateIndex].loanAppNavState : 0 /* undefined */;
            },
            enumerable: true,
            configurable: true
        });
        UINavigationService.$inject = ['uiNavigation', '$state', 'consumerLoanService']; // 'consumerCreditService'];
        UINavigationService.className = 'navigationService';
        return UINavigationService;
    })();
    consumersite.UINavigationService = UINavigationService;
    moduleRegistration.registerService(consumersite.moduleName, UINavigationService);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=ui.navigation.service.js.map