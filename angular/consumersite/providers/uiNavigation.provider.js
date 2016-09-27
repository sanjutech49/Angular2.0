// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
// <reference path="../../ts/global/global.ts" />
var navigation;
(function (navigation) {
    (function (loanAppNavigationState) {
        loanAppNavigationState[loanAppNavigationState["undefined"] = 0] = "undefined";
        loanAppNavigationState[loanAppNavigationState["borrowerPersonalInfo"] = 1] = "borrowerPersonalInfo";
        loanAppNavigationState[loanAppNavigationState["coBorrowerPersonalInfo"] = 2] = "coBorrowerPersonalInfo";
        loanAppNavigationState[loanAppNavigationState["propertyInfo"] = 3] = "propertyInfo";
        loanAppNavigationState[loanAppNavigationState["borrowerAddressInfo"] = 4] = "borrowerAddressInfo";
        loanAppNavigationState[loanAppNavigationState["coBorrowerAddressInfo"] = 5] = "coBorrowerAddressInfo";
        loanAppNavigationState[loanAppNavigationState["borrowerEmployment"] = 6] = "borrowerEmployment";
        loanAppNavigationState[loanAppNavigationState["borrowerPreviousEmployment"] = 7] = "borrowerPreviousEmployment";
        loanAppNavigationState[loanAppNavigationState["coBorrowerEmployment"] = 8] = "coBorrowerEmployment";
        loanAppNavigationState[loanAppNavigationState["coBorrowerPreviousEmployment"] = 9] = "coBorrowerPreviousEmployment";
        loanAppNavigationState[loanAppNavigationState["otherIncome"] = 10] = "otherIncome";
        loanAppNavigationState[loanAppNavigationState["assets"] = 11] = "assets";
        loanAppNavigationState[loanAppNavigationState["borrowerGovernmentMonitoring"] = 12] = "borrowerGovernmentMonitoring";
        loanAppNavigationState[loanAppNavigationState["coBorrowerGovernmentMonitoring"] = 13] = "coBorrowerGovernmentMonitoring";
        loanAppNavigationState[loanAppNavigationState["declarations"] = 14] = "declarations";
        loanAppNavigationState[loanAppNavigationState["summary"] = 15] = "summary";
        loanAppNavigationState[loanAppNavigationState["additionalBorrower"] = 16] = "additionalBorrower";
        loanAppNavigationState[loanAppNavigationState["credit"] = 17] = "credit";
        loanAppNavigationState[loanAppNavigationState["account"] = 18] = "account";
        loanAppNavigationState[loanAppNavigationState["creditResults"] = 19] = "creditResults";
        loanAppNavigationState[loanAppNavigationState["success"] = 20] = "success";
        loanAppNavigationState[loanAppNavigationState["eConsent"] = 21] = "eConsent";
        loanAppNavigationState[loanAppNavigationState["alertPreferences"] = 22] = "alertPreferences";
        loanAppNavigationState[loanAppNavigationState["activationCode"] = 23] = "activationCode";
        loanAppNavigationState[loanAppNavigationState["signout"] = 24] = "signout";
    })(navigation.loanAppNavigationState || (navigation.loanAppNavigationState = {}));
    var loanAppNavigationState = navigation.loanAppNavigationState;
    (function (pageEvent) {
        pageEvent[pageEvent["noEvent"] = 0] = "noEvent";
        pageEvent[pageEvent["borrowerAddedOrRemoved"] = 1] = "borrowerAddedOrRemoved";
    })(navigation.pageEvent || (navigation.pageEvent = {}));
    var pageEvent = navigation.pageEvent;
    // creating these methods to help with debugging
    function hasCoBorrower(loan) {
        return loan.loanApp.hasCoBorrower;
    }
    function doesCoBorrowerHaveDifferentCurrentAddress(loan) {
        return loan.loanApp.coBorrowerHasDifferentCurrentAddress;
    }
    function needsPreviousEmployment(borrower) {
        return borrower.needPreviousEmployment;
    }
    function doBorrowersHaveOtherIncome(loanApp) {
        return loanApp.hasOtherIncome;
    }
    function canAlwaysTransitionTo(loan) {
        return true;
    }
    function neverReturnTo(loan) {
        return false;
    }
    function coBorrowerAddedOrRemoved(loan) {
        return loan.loanApp.hasCoBorrower != loan.loanApp.initialHasCoBorrowerState ? 1 /* borrowerAddedOrRemoved */ : 0 /* noEvent */;
    }
    var UINavigationProvider = (function () {
        function UINavigationProvider() {
            var _this = this;
            this.consumerLoanAppStates = [
                {
                    stateName: 'consumerSite.loanApp.borrowerPersonalInfo',
                    url: '/borrowerPersonalInfo',
                    controllerName: 'personalController',
                    controllerAs: 'personalCntrl',
                    templateUrl: '/angular/consumersite/loanApp/personal/personalInfo.html',
                    loanAppNavState: 1 /* borrowerPersonalInfo */,
                    isCoBorrowerState: false,
                    canTransistionTo: canAlwaysTransitionTo,
                    pageEventMethod: coBorrowerAddedOrRemoved
                },
                {
                    stateName: 'consumerSite.loanApp.coBorrowerPersonalInfo',
                    url: '/coBorrowerPersonalInfo',
                    controllerName: 'personalController',
                    controllerAs: 'personalCntrl',
                    templateUrl: '/angular/consumersite/loanApp/personal/personalInfo.html',
                    loanAppNavState: 2 /* coBorrowerPersonalInfo */,
                    isCoBorrowerState: true,
                    canTransistionTo: hasCoBorrower
                },
                {
                    stateName: 'consumerSite.loanApp.propertyInfo',
                    url: '/propertyInfo',
                    controllerName: 'propertyController',
                    controllerAs: 'propertyCntrl',
                    templateUrl: '/angular/consumersite/loanApp/property/property.html',
                    loanAppNavState: 3 /* propertyInfo */,
                    isCoBorrowerState: false,
                    canTransistionTo: canAlwaysTransitionTo
                },
                {
                    stateName: 'consumerSite.loanApp.borrowerAddressInfo',
                    url: '/borrowerAddressInfo',
                    controllerName: 'addressController',
                    controllerAs: 'addressCntrl',
                    templateUrl: '/angular/consumersite/loanApp/addresses/address.html',
                    loanAppNavState: 4 /* borrowerAddressInfo */,
                    isCoBorrowerState: false,
                    canTransistionTo: canAlwaysTransitionTo
                },
                {
                    stateName: 'consumerSite.loanApp.coBorrowerAddressInfo',
                    url: '/coBorrowerAddressInfo',
                    controllerName: 'addressController',
                    controllerAs: 'addressCntrl',
                    templateUrl: '/angular/consumersite/loanApp/addresses/address.html',
                    loanAppNavState: 5 /* coBorrowerAddressInfo */,
                    isCoBorrowerState: true,
                    canTransistionTo: function (loan) { return hasCoBorrower(loan) && doesCoBorrowerHaveDifferentCurrentAddress(loan); }
                },
                {
                    stateName: 'consumerSite.loanApp.borrowerEmployment',
                    url: '/borrowerEmployment',
                    controllerName: 'employmentController',
                    controllerAs: 'employmentCntrl',
                    templateUrl: '/angular/consumersite/loanApp/employment/employment.html',
                    loanAppNavState: 6 /* borrowerEmployment */,
                    isCoBorrowerState: false,
                    canTransistionTo: canAlwaysTransitionTo
                },
                {
                    stateName: 'consumerSite.loanApp.borrowerPreviousEmployment',
                    url: '/borrowerPreviousEmployment',
                    controllerName: 'employmentController',
                    controllerAs: 'employmentCntrl',
                    templateUrl: '/angular/consumersite/loanApp/employment/employment.html',
                    loanAppNavState: 7 /* borrowerPreviousEmployment */,
                    isCoBorrowerState: false,
                    canTransistionTo: function (loan) { return needsPreviousEmployment(loan.loanApp.borrower); }
                },
                {
                    stateName: 'consumerSite.loanApp.coBorrowerEmployment',
                    url: '/coBorrowerEmployment',
                    controllerName: 'employmentController',
                    controllerAs: 'employmentCntrl',
                    templateUrl: '/angular/consumersite/loanApp/employment/employment.html',
                    isCoBorrowerState: true,
                    loanAppNavState: 8 /* coBorrowerEmployment */,
                    canTransistionTo: hasCoBorrower
                },
                {
                    stateName: 'consumerSite.loanApp.coBorrowerPreviousEmployment',
                    url: '/coBorrowerPreviousEmployment',
                    controllerName: 'employmentController',
                    controllerAs: 'employmentCntrl',
                    templateUrl: '/angular/consumersite/loanApp/employment/employment.html',
                    isCoBorrowerState: true,
                    loanAppNavState: 9 /* coBorrowerPreviousEmployment */,
                    canTransistionTo: function (loan) { return hasCoBorrower(loan) && needsPreviousEmployment(loan.loanApp.coBorrower); }
                },
                {
                    stateName: 'consumerSite.loanApp.otherIncome',
                    url: '/otherIncome',
                    controllerName: 'otherIncomeController',
                    controllerAs: 'otherIncomeCntrl',
                    templateUrl: '/angular/consumersite/loanApp/otherIncome/otherincome.html',
                    loanAppNavState: 10 /* otherIncome */,
                    isCoBorrowerState: false,
                    canTransistionTo: function (loan) { return doBorrowersHaveOtherIncome(loan.loanApp); }
                },
                {
                    stateName: 'consumerSite.loanApp.assets',
                    url: '/assets',
                    controllerName: 'assetsController',
                    controllerAs: 'assetsCntrl',
                    templateUrl: '/angular/consumersite/loanApp/assets/assets.html',
                    isCoBorrowerState: false,
                    loanAppNavState: 11 /* assets */,
                    canTransistionTo: canAlwaysTransitionTo
                },
                {
                    stateName: 'consumerSite.loanApp.borrowerGovernmentMonitoring',
                    url: '/borrowerGovernmentMonitoring',
                    controllerName: 'governmentMonitoringController',
                    controllerAs: 'governmentMonitoringCntrl',
                    templateUrl: '/angular/consumersite/loanApp/governmentMonitoring/governmentMonitoring.html',
                    isCoBorrowerState: false,
                    loanAppNavState: 12 /* borrowerGovernmentMonitoring */,
                    canTransistionTo: canAlwaysTransitionTo
                },
                {
                    stateName: 'consumerSite.loanApp.coBorrowerGovernmentMonitoring',
                    url: '/coBorrowerGovernmentMonitoring',
                    controllerName: 'governmentMonitoringController',
                    controllerAs: 'governmentMonitoringCntrl',
                    templateUrl: '/angular/consumersite/loanApp/governmentMonitoring/governmentMonitoring.html',
                    isCoBorrowerState: true,
                    loanAppNavState: 13 /* coBorrowerGovernmentMonitoring */,
                    canTransistionTo: hasCoBorrower
                },
                {
                    stateName: 'consumerSite.loanApp.declarations',
                    url: '/declarations',
                    controllerName: 'declarationsController',
                    controllerAs: 'declarationsCntrl',
                    templateUrl: '/angular/consumersite/loanApp/declarations/declarations.html',
                    isCoBorrowerState: false,
                    loanAppNavState: 14 /* declarations */,
                    canTransistionTo: canAlwaysTransitionTo
                },
                {
                    stateName: 'consumerSite.loanApp.summary',
                    url: '/summary',
                    controllerName: 'summaryController',
                    controllerAs: 'summaryCntrl',
                    templateUrl: '/angular/consumersite/loanApp/summary/summary.html',
                    isCoBorrowerState: false,
                    loanAppNavState: 15 /* summary */,
                    canTransistionTo: canAlwaysTransitionTo,
                    navigationDisplayName: 'Save & Back to Summary'
                },
                {
                    stateName: 'consumerSite.loanApp.additionalBorrower',
                    url: '/additionalBorrower',
                    controllerName: 'additionalBorrowerController',
                    controllerAs: 'additionalBorrowerCntrl',
                    templateUrl: '/angular/consumersite/loanApp/additionalBorrower/additionalBorrower.html',
                    isCoBorrowerState: false,
                    loanAppNavState: 16 /* additionalBorrower */,
                    canTransistionTo: canAlwaysTransitionTo
                },
                {
                    stateName: 'consumerSite.loanApp.credit',
                    url: '/credit',
                    controllerName: 'creditController',
                    controllerAs: 'creditCntrl',
                    templateUrl: '/angular/consumersite/loanApp/credit/credit.html',
                    isCoBorrowerState: false,
                    loanAppNavState: 17 /* credit */,
                    canTransistionTo: canAlwaysTransitionTo
                },
                {
                    stateName: 'consumerSite.loanApp.account',
                    url: '/account',
                    controllerName: 'accountController',
                    controllerAs: 'accountCntrl',
                    templateUrl: '/angular/consumersite/loanApp/account/account.html',
                    isCoBorrowerState: false,
                    loanAppNavState: 18 /* account */,
                    canTransistionTo: canAlwaysTransitionTo
                },
                {
                    stateName: 'consumerSite.loanApp.creditResults',
                    url: '/creditResults',
                    controllerName: 'creditResultsController',
                    controllerAs: 'creditResultsCntrl',
                    templateUrl: '/angular/consumersite/loanApp/credit/creditResults.html',
                    isCoBorrowerState: false,
                    loanAppNavState: 19 /* creditResults */,
                    canTransistionTo: canAlwaysTransitionTo
                },
                {
                    stateName: 'consumerSite.loanApp.success',
                    url: '/creditScores',
                    controllerName: 'successController',
                    controllerAs: 'successCntrl',
                    templateUrl: '/angular/consumersite/loanApp/success/success.html',
                    isCoBorrowerState: false,
                    loanAppNavState: 20 /* success */,
                    canTransistionTo: canAlwaysTransitionTo
                },
                {
                    stateName: 'consumerSite.loanApp.eConsent',
                    url: '/eConsent',
                    controllerName: 'eConsentController',
                    controllerAs: 'eConsentCntrl',
                    templateUrl: '/angular/consumersite/loanApp/eConsent/eConsent.html',
                    isCoBorrowerState: false,
                    loanAppNavState: 21 /* eConsent */,
                    canTransistionTo: canAlwaysTransitionTo
                },
                {
                    stateName: 'consumerSite.loanApp.alertPreferences',
                    url: '/alertPref',
                    controllerName: 'alertPreferencesController',
                    controllerAs: 'alertPrefCntrl',
                    templateUrl: '/angular/consumersite/loanApp/alertPreferences/alertpreferences.html',
                    isCoBorrowerState: false,
                    loanAppNavState: 22 /* alertPreferences */,
                    canTransistionTo: canAlwaysTransitionTo
                },
                {
                    stateName: 'consumerSite.loanApp.activationCode',
                    url: '/activation',
                    controllerName: 'activationCodeController',
                    controllerAs: 'activationCodedCntrl',
                    templateUrl: '/angular/consumersite/loanApp/activationcode/activationcode.html',
                    isCoBorrowerState: false,
                    loanAppNavState: 23 /* activationCode */,
                    canTransistionTo: canAlwaysTransitionTo
                },
                {
                    stateName: 'consumerSite.loanApp.signout',
                    url: '/signout',
                    controllerName: 'signoutController',
                    controllerAs: 'signoutCntrl',
                    templateUrl: '/angular/consumersite/loanApp/signout/signout.html',
                    isCoBorrowerState: false,
                    loanAppNavState: 24 /* signout */,
                    canTransistionTo: canAlwaysTransitionTo
                }
            ];
            this.$get = function () {
                return function () { return _this.consumerLoanAppStates; };
            };
            this.getConsumerLoanAppStates = function () { return _this.consumerLoanAppStates; };
        }
        UINavigationProvider.className = 'uiNavigation';
        UINavigationProvider.$inject = [];
        return UINavigationProvider;
    })();
    navigation.UINavigationProvider = UINavigationProvider;
    moduleRegistration.registerProvider(consumersite.moduleName, UINavigationProvider);
})(navigation || (navigation = {}));
//# sourceMappingURL=uiNavigation.provider.js.map