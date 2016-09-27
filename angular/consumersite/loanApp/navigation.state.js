var consumersite;
(function (consumersite) {
    (function (loanAppNavigationState) {
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
        loanAppNavigationState[loanAppNavigationState["credit"] = 16] = "credit";
        loanAppNavigationState[loanAppNavigationState["account"] = 17] = "account";
        loanAppNavigationState[loanAppNavigationState["creditResults"] = 18] = "creditResults";
        loanAppNavigationState[loanAppNavigationState["success"] = 19] = "success";
        loanAppNavigationState[loanAppNavigationState["eConsent"] = 20] = "eConsent";
        loanAppNavigationState[loanAppNavigationState["alertPreferences"] = 21] = "alertPreferences";
        loanAppNavigationState[loanAppNavigationState["activationCode"] = 22] = "activationCode";
        loanAppNavigationState[loanAppNavigationState["signout"] = 23] = "signout";
    })(consumersite.loanAppNavigationState || (consumersite.loanAppNavigationState = {}));
    var loanAppNavigationState = consumersite.loanAppNavigationState;
    // creating these methods help with debugging
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
    consumersite.consumerLoanAppStates = [
        {
            stateName: 'consumerSite.loanApp.borrowerPersonalInfo',
            url: '/borrowerPersonalInfo',
            controllerName: 'personalController',
            controllerAs: 'personalCntrl',
            templateUrl: '/angular/consumersite/loanApp/personal/personalInfo.html',
            loanAppNavState: loanAppNavigationState.borrowerPersonalInfo,
            isCoBorrowerState: false,
            returnToSameState: neverReturnTo,
            canTransistionTo: canAlwaysTransitionTo,
        }, {
            stateName: 'consumerSite.loanApp.coBorrowerPersonalInfo',
            url: '/coBorrowerPersonalInfo',
            controllerName: 'personalController',
            controllerAs: 'personalCntrl',
            templateUrl: '/angular/consumersite/loanApp/personal/personalInfo.html',
            loanAppNavState: loanAppNavigationState.coBorrowerPersonalInfo,
            isCoBorrowerState: true,
            returnToSameState: neverReturnTo,
            canTransistionTo: hasCoBorrower
        }, {
            stateName: 'consumerSite.loanApp.propertyInfo',
            url: '/propertyInfo',
            controllerName: 'propertyController',
            controllerAs: 'propertyCntrl',
            templateUrl: '/angular/consumersite/loanApp/property/property.html',
            loanAppNavState: loanAppNavigationState.propertyInfo,
            isCoBorrowerState: false,
            returnToSameState: neverReturnTo,
            canTransistionTo: canAlwaysTransitionTo
        }, {
            stateName: 'consumerSite.loanApp.borrowerAddressInfo',
            url: '/borrowerAddressInfo',
            controllerName: 'addressController',
            controllerAs: 'addressCntrl',
            templateUrl: '/angular/consumersite/loanApp/addresses/addressNew.html',
            loanAppNavState: loanAppNavigationState.borrowerAddressInfo,
            isCoBorrowerState: false,
            returnToSameState: neverReturnTo,
            canTransistionTo: canAlwaysTransitionTo
        }, {
            stateName: 'consumerSite.loanApp.coBorrowerAddressInfo',
            url: '/coBorrowerAddressInfo',
            controllerName: 'addressController',
            controllerAs: 'addressCntrl',
            templateUrl: '/angular/consumersite/loanApp/addresses/addressNew.html',
            loanAppNavState: loanAppNavigationState.coBorrowerAddressInfo,
            isCoBorrowerState: true,
            returnToSameState: neverReturnTo,
            canTransistionTo: function (loan) { return hasCoBorrower(loan) && doesCoBorrowerHaveDifferentCurrentAddress(loan); }
        }, {
            stateName: 'consumerSite.loanApp.borrowerEmployment',
            url: '/borrowerEmployment',
            controllerName: 'employmentController',
            controllerAs: 'employmentCntrl',
            templateUrl: '/angular/consumersite/loanApp/employment/employment.html',
            loanAppNavState: loanAppNavigationState.borrowerEmployment,
            isCoBorrowerState: false,
            returnToSameState: neverReturnTo,
            canTransistionTo: canAlwaysTransitionTo
        }, {
            stateName: 'consumerSite.loanApp.borrowerPreviousEmployment',
            url: '/borrowerPreviousEmployment',
            controllerName: 'employmentController',
            controllerAs: 'employmentCntrl',
            templateUrl: '/angular/consumersite/loanApp/employment/employment.html',
            loanAppNavState: loanAppNavigationState.borrowerPreviousEmployment,
            isCoBorrowerState: false,
            returnToSameState: neverReturnTo,
            canTransistionTo: function (loan) { return needsPreviousEmployment(loan.loanApp.borrower); }
        }, {
            stateName: 'consumerSite.loanApp.coBorrowerEmployment',
            url: '/coBorrowerEmployment',
            controllerName: 'employmentController',
            controllerAs: 'employmentCntrl',
            templateUrl: '/angular/consumersite/loanApp/employment/employment.html',
            isCoBorrowerState: true,
            loanAppNavState: loanAppNavigationState.coBorrowerEmployment,
            returnToSameState: neverReturnTo,
            canTransistionTo: hasCoBorrower
        }, {
            stateName: 'consumerSite.loanApp.coBorrowerPreviousEmployment',
            url: '/coBorrowerPreviousEmployment',
            controllerName: 'employmentController',
            controllerAs: 'employmentCntrl',
            templateUrl: '/angular/consumersite/loanApp/employment/employment.html',
            isCoBorrowerState: true,
            loanAppNavState: loanAppNavigationState.coBorrowerPreviousEmployment,
            returnToSameState: neverReturnTo,
            canTransistionTo: function (loan) { return hasCoBorrower(loan) && needsPreviousEmployment(loan.loanApp.coBorrower); }
        }, {
            stateName: 'consumerSite.loanApp.otherIncome',
            url: '/otherIncome',
            controllerName: 'otherIncomeController',
            controllerAs: 'otherIncomeCntrl',
            templateUrl: '/angular/consumersite/loanApp/otherIncome/otherincome.html',
            loanAppNavState: loanAppNavigationState.otherIncome,
            isCoBorrowerState: false,
            returnToSameState: neverReturnTo,
            canTransistionTo: function (loan) { return doBorrowersHaveOtherIncome(loan.loanApp); }
        }, {
            stateName: 'consumerSite.loanApp.assets',
            url: '/assets',
            controllerName: 'assetsController',
            controllerAs: 'assetsCntrl',
            templateUrl: '/angular/consumersite/loanApp/assets/assets.html',
            isCoBorrowerState: false,
            loanAppNavState: loanAppNavigationState.assets,
            returnToSameState: neverReturnTo,
            canTransistionTo: canAlwaysTransitionTo
        }, {
            stateName: 'consumerSite.loanApp.borrowerGovernmentMonitoring',
            url: '/borrowerGovernmentMonitoring',
            controllerName: 'governmentMonitoringController',
            controllerAs: 'governmentMonitoringCntrl',
            templateUrl: '/angular/consumersite/loanApp/governmentMonitoring/governmentMonitoring.html',
            isCoBorrowerState: false,
            loanAppNavState: loanAppNavigationState.borrowerGovernmentMonitoring,
            returnToSameState: neverReturnTo,
            canTransistionTo: canAlwaysTransitionTo
        }, {
            stateName: 'consumerSite.loanApp.coBorrowerGovernmentMonitoring',
            url: '/coBorrowerGovernmentMonitoring',
            controllerName: 'governmentMonitoringController',
            controllerAs: 'governmentMonitoringCntrl',
            templateUrl: '/angular/consumersite/loanApp/governmentMonitoring/governmentMonitoring.html',
            isCoBorrowerState: true,
            loanAppNavState: loanAppNavigationState.coBorrowerGovernmentMonitoring,
            returnToSameState: neverReturnTo,
            canTransistionTo: hasCoBorrower
        }, {
            stateName: 'consumerSite.loanApp.declarations',
            url: '/declarations',
            controllerName: 'declarationsController',
            controllerAs: 'declarationsCntrl',
            templateUrl: '/angular/consumersite/loanApp/declarations/declarations.html',
            isCoBorrowerState: false,
            loanAppNavState: loanAppNavigationState.declarations,
            returnToSameState: neverReturnTo,
            canTransistionTo: canAlwaysTransitionTo
        }, {
            stateName: 'consumerSite.loanApp.summary',
            url: '/summary',
            controllerName: 'summaryController',
            controllerAs: 'summaryCntrl',
            templateUrl: '/angular/consumersite/loanApp/summary/summary.html',
            isCoBorrowerState: false,
            loanAppNavState: loanAppNavigationState.declarations,
            returnToSameState: neverReturnTo,
            canTransistionTo: canAlwaysTransitionTo
        }, {
            stateName: 'consumerSite.loanApp.credit',
            url: '/credit',
            controllerName: 'creditController',
            controllerAs: 'creditCntrl',
            templateUrl: '/angular/consumersite/loanApp/credit/credit.html',
            isCoBorrowerState: false,
            loanAppNavState: loanAppNavigationState.credit,
            returnToSameState: neverReturnTo,
            canTransistionTo: canAlwaysTransitionTo
        }, {
            stateName: 'consumerSite.loanApp.account',
            url: '/account',
            controllerName: 'accountController',
            controllerAs: 'accountCntrl',
            templateUrl: '/angular/consumersite/loanApp/account/account.html',
            isCoBorrowerState: false,
            loanAppNavState: loanAppNavigationState.account,
            returnToSameState: neverReturnTo,
            canTransistionTo: canAlwaysTransitionTo
        }, {
            stateName: 'consumerSite.loanApp.creditResults',
            url: '/creditResults',
            controllerName: 'creditResultsController',
            controllerAs: 'creditResultsCntrl',
            templateUrl: '/angular/consumersite/loanApp/credit/creditResults.html',
            isCoBorrowerState: false,
            loanAppNavState: loanAppNavigationState.creditResults,
            returnToSameState: neverReturnTo,
            canTransistionTo: canAlwaysTransitionTo
        }, {
            stateName: 'consumerSite.loanApp.success',
            url: '/creditScores',
            controllerName: 'successController',
            controllerAs: 'successCntrl',
            templateUrl: '/angular/consumersite/loanApp/success/success.html',
            isCoBorrowerState: false,
            loanAppNavState: loanAppNavigationState.success,
            returnToSameState: neverReturnTo,
            canTransistionTo: canAlwaysTransitionTo
        }, {
            stateName: 'consumerSite.loanApp.eConsent',
            url: '/eConsent',
            controllerName: 'eConsentController',
            controllerAs: 'eConsentCntrl',
            templateUrl: '/angular/consumersite/loanApp/eConsent/eConsent.html',
            isCoBorrowerState: false,
            loanAppNavState: loanAppNavigationState.eConsent,
            returnToSameState: neverReturnTo,
            canTransistionTo: canAlwaysTransitionTo
        }, {
            stateName: 'consumerSite.loanApp.alertPreferences',
            url: '/alertPref',
            controllerName: 'alertPreferencesController',
            controllerAs: 'alertPrefCntrl',
            templateUrl: '/angular/consumersite/loanApp/alertPreferences/alertpreferences.html',
            isCoBorrowerState: false,
            loanAppNavState: loanAppNavigationState.alertPreferences,
            returnToSameState: neverReturnTo,
            canTransistionTo: canAlwaysTransitionTo
        }, {
            stateName: 'consumerSite.loanApp.activationCode',
            url: '/activation',
            controllerName: 'activationCodeController',
            controllerAs: 'activationCodedCntrl',
            templateUrl: '/angular/consumersite/loanApp/activationcode/activationcode.html',
            isCoBorrowerState: false,
            loanAppNavState: loanAppNavigationState.activationCode,
            returnToSameState: neverReturnTo,
            canTransistionTo: canAlwaysTransitionTo
        }, {
            stateName: 'consumerSite.loanApp.signout',
            url: '/signout',
            controllerName: 'signoutController',
            controllerAs: 'signoutCntrl',
            templateUrl: '/angular/consumersite/loanApp/signout/signout.html',
            isCoBorrowerState: false,
            loanAppNavState: loanAppNavigationState.signout,
            returnToSameState: neverReturnTo,
            canTransistionTo: canAlwaysTransitionTo
        },
    ];
})(consumersite || (consumersite = {}));
//# sourceMappingURL=navigation.state.js.map