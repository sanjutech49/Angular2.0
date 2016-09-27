var consumersite;
(function (consumersite) {
    (function (loanAppNavigationState) {
        loanAppNavigationState[loanAppNavigationState["borrowerPersonalInfo"] = 1] = "borrowerPersonalInfo";
        loanAppNavigationState[loanAppNavigationState["coBorrowerPersonalInfo"] = 2] = "coBorrowerPersonalInfo";
        loanAppNavigationState[loanAppNavigationState["propertyInfo"] = 3] = "propertyInfo";
        loanAppNavigationState[loanAppNavigationState["borrowerAddressInfo"] = 4] = "borrowerAddressInfo";
        loanAppNavigationState[loanAppNavigationState["coBorrowerAddressInfo"] = 5] = "coBorrowerAddressInfo";
        loanAppNavigationState[loanAppNavigationState["borrowerEmployment"] = 6] = "borrowerEmployment";
        loanAppNavigationState[loanAppNavigationState["coBorrowerEmployment"] = 7] = "coBorrowerEmployment";
        loanAppNavigationState[loanAppNavigationState["borrowerOtherIncome"] = 8] = "borrowerOtherIncome";
        loanAppNavigationState[loanAppNavigationState["coBorrowerOtherIncome"] = 9] = "coBorrowerOtherIncome";
        loanAppNavigationState[loanAppNavigationState["borrowerAssets"] = 10] = "borrowerAssets";
        loanAppNavigationState[loanAppNavigationState["coBorrowerAssets"] = 11] = "coBorrowerAssets";
        loanAppNavigationState[loanAppNavigationState["race"] = 12] = "race";
        loanAppNavigationState[loanAppNavigationState["delcarations"] = 13] = "delcarations";
        loanAppNavigationState[loanAppNavigationState["summary"] = 14] = "summary";
        loanAppNavigationState[loanAppNavigationState["credit"] = 15] = "credit";
        loanAppNavigationState[loanAppNavigationState["account"] = 16] = "account";
        loanAppNavigationState[loanAppNavigationState["creditResults"] = 17] = "creditResults";
        loanAppNavigationState[loanAppNavigationState["creditScores"] = 18] = "creditScores";
        loanAppNavigationState[loanAppNavigationState["eConcent"] = 19] = "eConcent";
        loanAppNavigationState[loanAppNavigationState["alertPreferences"] = 20] = "alertPreferences";
        loanAppNavigationState[loanAppNavigationState["activationCoded"] = 21] = "activationCoded";
        loanAppNavigationState[loanAppNavigationState["consumerSignOut"] = 22] = "consumerSignOut";
    })(consumersite.loanAppNavigationState || (consumersite.loanAppNavigationState = {}));
    var loanAppNavigationState = consumersite.loanAppNavigationState;
    consumersite.consumerLoanAppStates = [
        {
            stateName: 'consumerSite.loanApp.borrowerPersonalInfo',
            url: '/personal',
            controllerName: 'personalController',
            templateUrl: '/angular/consumersite/loanApp/personal/personalInfo.html',
            isCoBorrowerState: false,
            isStateSticky: false,
            loanAppNavState: loanAppNavigationState.borrowerPersonalInfo
        }, {
            stateName: 'consumerSite.loanApp.coBorrowerPersonalInfo',
            url: '/personal',
            controllerName: 'personalController',
            templateUrl: '/angular/consumersite/loanApp/personal/personalInfo.html',
            isCoBorrowerState: true,
            isStateSticky: false,
            loanAppNavState: loanAppNavigationState.coBorrowerPersonalInfo
        }, {
            stateName: 'consumerSite.loanApp.propertyInfo',
            url: '/property',
            controllerName: 'propertyController',
            templateUrl: '/angular/consumersite/loanApp/property/property.html',
            isCoBorrowerState: false,
            isStateSticky: false,
            loanAppNavState: loanAppNavigationState.propertyInfo
        }, {
            stateName: 'consumerSite.loanApp.borrowerAddressInfo',
            url: '/address',
            controllerName: 'addressController',
            templateUrl: '/angular/consumersite/loanApp/addresses/address.html',
            isCoBorrowerState: false,
            isStateSticky: false,
            loanAppNavState: loanAppNavigationState.borrowerAddressInfo
        }, {
            stateName: 'consumerSite.loanApp.coBorrowerAddressInfo',
            url: '/address',
            controllerName: 'addressController',
            templateUrl: '/angular/consumersite/loanApp/addresses/address.html',
            isCoBorrowerState: true,
            isStateSticky: false,
            loanAppNavState: loanAppNavigationState.coBorrowerAddressInfo
        }, {
            stateName: 'consumerSite.loanApp.borrowerEmployment',
            url: '/employment',
            controllerName: 'employmentController',
            templateUrl: '/angular/consumersite/loanApp/employment/employment.html',
            isCoBorrowerState: false,
            isStateSticky: false,
            loanAppNavState: loanAppNavigationState.borrowerEmployment
        }, {
            stateName: 'consumerSite.loanApp.coBorrowerEmployment',
            url: '/employment',
            controllerName: 'employmentController',
            templateUrl: '/angular/consumersite/loanApp/employment/employment.html',
            isCoBorrowerState: true,
            isStateSticky: false,
            loanAppNavState: loanAppNavigationState.coBorrowerEmployment
        }, {
            stateName: 'consumerSite.loanApp.borrowerOtherIncome',
            url: '/otherIncome',
            controllerName: 'otherIncomeController',
            templateUrl: '/angular/consumersite/loanApp/otherIncome/otherincome.html',
            isCoBorrowerState: true,
            isStateSticky: false,
            loanAppNavState: loanAppNavigationState.borrowerOtherIncome
        }, {
            stateName: 'consumerSite.loanApp.coBorrowerOtherIncome',
            url: '/otherIncome',
            controllerName: 'otherIncomeController',
            templateUrl: '/angular/consumersite/loanApp/otherIncome/otherincome.html',
            isCoBorrowerState: true,
            isStateSticky: false,
            loanAppNavState: loanAppNavigationState.coBorrowerOtherIncome
        }, {
            stateName: 'consumerSite.loanApp.borrowerAssets',
            url: '/borrowerAssets',
            controllerName: 'borrowerAssetsController',
            templateUrl: '/angular/consumersite/loanApp/assets/assets.html',
            isCoBorrowerState: true,
            isStateSticky: false,
            loanAppNavState: loanAppNavigationState.borrowerAssets
        },
    ];
})(consumersite || (consumersite = {}));
//# sourceMappingURL=statelookup.service.js.map