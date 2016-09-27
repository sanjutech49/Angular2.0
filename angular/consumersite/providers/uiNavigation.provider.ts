
// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
// <reference path="../../ts/global/global.ts" />

module navigation {

    export enum loanAppNavigationState {
        undefined = 0,
        borrowerPersonalInfo,
        coBorrowerPersonalInfo,
        propertyInfo,
        borrowerAddressInfo,
        coBorrowerAddressInfo,
        borrowerEmployment,
        borrowerPreviousEmployment,
        coBorrowerEmployment,
        coBorrowerPreviousEmployment,
        otherIncome,
        assets,
        borrowerGovernmentMonitoring,
        coBorrowerGovernmentMonitoring,
        declarations,
        summary,
        additionalBorrower,
        credit,
        account,
        creditResults,
        success,
        eConsent,
        alertPreferences,
        activationCode,
        signout
    }

    export enum pageEvent {
        noEvent,
        borrowerAddedOrRemoved,
    }

    export interface INavigationState {
        templateUrl: string;
        stateName: string;
        loanAppNavState: loanAppNavigationState;
        controllerName: string;
        controllerAs: string;
        isCoBorrowerState: boolean;
        url: string;
        canTransistionTo: (loan: consumersite.vm.Loan) => boolean;
        navigationDisplayName?: string;
        pageEventMethod?: (loan: consumersite.vm.Loan) => pageEvent;
    }

    // creating these methods to help with debugging
    function hasCoBorrower(loan: consumersite.vm.Loan): boolean {
        return loan.loanApp.hasCoBorrower;
    }

    function doesCoBorrowerHaveDifferentCurrentAddress(loan: consumersite.vm.Loan): boolean {
        return loan.loanApp.coBorrowerHasDifferentCurrentAddress;
    }

    function needsPreviousEmployment(borrower: consumersite.vm.Borrower): boolean {
        return borrower.needPreviousEmployment;
    }

    function doBorrowersHaveOtherIncome(loanApp: consumersite.vm.LoanApplication): boolean {
        return loanApp.hasOtherIncome;
    }

    function canAlwaysTransitionTo(loan: consumersite.vm.Loan) {
        return true;
    }

    function neverReturnTo(loan: consumersite.vm.Loan) {
        return false;
    }

    function coBorrowerAddedOrRemoved(loan: consumersite.vm.Loan): pageEvent {
        return loan.loanApp.hasCoBorrower != loan.loanApp.initialHasCoBorrowerState ? pageEvent.borrowerAddedOrRemoved : pageEvent.noEvent;
    }

    export class UINavigationProvider implements ng.IServiceProvider {

        static className = 'uiNavigation';
        static $inject = [];

        constructor() {
        }

        private consumerLoanAppStates: INavigationState[] = [
            {
                stateName: 'consumerSite.loanApp.borrowerPersonalInfo',
                url: '/borrowerPersonalInfo',
                controllerName: 'personalController',
                controllerAs: 'personalCntrl',
                templateUrl: '/angular/consumersite/loanApp/personal/personalInfo.html',
                loanAppNavState: loanAppNavigationState.borrowerPersonalInfo,
                isCoBorrowerState: false,
                canTransistionTo: canAlwaysTransitionTo,
                pageEventMethod: coBorrowerAddedOrRemoved
            }, {
                stateName: 'consumerSite.loanApp.coBorrowerPersonalInfo',
                url: '/coBorrowerPersonalInfo',
                controllerName: 'personalController',
                controllerAs: 'personalCntrl',
                templateUrl: '/angular/consumersite/loanApp/personal/personalInfo.html',
                loanAppNavState: loanAppNavigationState.coBorrowerPersonalInfo,
                isCoBorrowerState: true,
                canTransistionTo: hasCoBorrower
            }, {
                stateName: 'consumerSite.loanApp.propertyInfo',
                url: '/propertyInfo',
                controllerName: 'propertyController',
                controllerAs: 'propertyCntrl',
                templateUrl: '/angular/consumersite/loanApp/property/property.html',
                loanAppNavState: loanAppNavigationState.propertyInfo,
                isCoBorrowerState: false,
                canTransistionTo: canAlwaysTransitionTo
            }, {
                stateName: 'consumerSite.loanApp.borrowerAddressInfo',
                url: '/borrowerAddressInfo',
                controllerName: 'addressController',
                controllerAs: 'addressCntrl',
                templateUrl: '/angular/consumersite/loanApp/addresses/address.html',
                loanAppNavState: loanAppNavigationState.borrowerAddressInfo,
                isCoBorrowerState: false,
                canTransistionTo: canAlwaysTransitionTo
            }, {
                stateName: 'consumerSite.loanApp.coBorrowerAddressInfo',
                url: '/coBorrowerAddressInfo',
                controllerName: 'addressController',
                controllerAs: 'addressCntrl',
                templateUrl: '/angular/consumersite/loanApp/addresses/address.html',
                loanAppNavState: loanAppNavigationState.coBorrowerAddressInfo,
                isCoBorrowerState: true,
                canTransistionTo: loan => hasCoBorrower(loan) && doesCoBorrowerHaveDifferentCurrentAddress(loan)
            }, {
                stateName: 'consumerSite.loanApp.borrowerEmployment',
                url: '/borrowerEmployment',
                controllerName: 'employmentController',
                controllerAs: 'employmentCntrl',
                templateUrl: '/angular/consumersite/loanApp/employment/employment.html',
                loanAppNavState: loanAppNavigationState.borrowerEmployment,
                isCoBorrowerState: false,
                canTransistionTo: canAlwaysTransitionTo
            }, {
                stateName: 'consumerSite.loanApp.borrowerPreviousEmployment',
                url: '/borrowerPreviousEmployment',
                controllerName: 'employmentController',
                controllerAs: 'employmentCntrl',
                templateUrl: '/angular/consumersite/loanApp/employment/employment.html',
                loanAppNavState: loanAppNavigationState.borrowerPreviousEmployment,
                isCoBorrowerState: false,
                canTransistionTo: loan => needsPreviousEmployment(loan.loanApp.borrower)
            }, {
                stateName: 'consumerSite.loanApp.coBorrowerEmployment',
                url: '/coBorrowerEmployment',
                controllerName: 'employmentController',
                controllerAs: 'employmentCntrl',
                templateUrl: '/angular/consumersite/loanApp/employment/employment.html',
                isCoBorrowerState: true,
                loanAppNavState: loanAppNavigationState.coBorrowerEmployment,
                canTransistionTo: hasCoBorrower
            }, {
                stateName: 'consumerSite.loanApp.coBorrowerPreviousEmployment',
                url: '/coBorrowerPreviousEmployment',
                controllerName: 'employmentController',
                controllerAs: 'employmentCntrl',
                templateUrl: '/angular/consumersite/loanApp/employment/employment.html',
                isCoBorrowerState: true,
                loanAppNavState: loanAppNavigationState.coBorrowerPreviousEmployment,
                canTransistionTo: loan => hasCoBorrower(loan) && needsPreviousEmployment(loan.loanApp.coBorrower)
            }, {
                stateName: 'consumerSite.loanApp.otherIncome',
                url: '/otherIncome',
                controllerName: 'otherIncomeController',
                controllerAs: 'otherIncomeCntrl',
                templateUrl: '/angular/consumersite/loanApp/otherIncome/otherincome.html',
                loanAppNavState: loanAppNavigationState.otherIncome,
                isCoBorrowerState: false,
                canTransistionTo: (loan: consumersite.vm.Loan) => doBorrowersHaveOtherIncome(loan.loanApp)
            }, {
                stateName: 'consumerSite.loanApp.assets',
                url: '/assets',
                controllerName: 'assetsController',
                controllerAs: 'assetsCntrl',
                templateUrl: '/angular/consumersite/loanApp/assets/assets.html',
                isCoBorrowerState: false,
                loanAppNavState: loanAppNavigationState.assets,
                canTransistionTo: canAlwaysTransitionTo
            }, {
                stateName: 'consumerSite.loanApp.borrowerGovernmentMonitoring',
                url: '/borrowerGovernmentMonitoring',
                controllerName: 'governmentMonitoringController',
                controllerAs: 'governmentMonitoringCntrl',
                templateUrl: '/angular/consumersite/loanApp/governmentMonitoring/governmentMonitoring.html',
                isCoBorrowerState: false,
                loanAppNavState: loanAppNavigationState.borrowerGovernmentMonitoring,
                canTransistionTo: canAlwaysTransitionTo
            }, {
                stateName: 'consumerSite.loanApp.coBorrowerGovernmentMonitoring',
                url: '/coBorrowerGovernmentMonitoring',
                controllerName: 'governmentMonitoringController',
                controllerAs: 'governmentMonitoringCntrl',
                templateUrl: '/angular/consumersite/loanApp/governmentMonitoring/governmentMonitoring.html',
                isCoBorrowerState: true,
                loanAppNavState: loanAppNavigationState.coBorrowerGovernmentMonitoring,
                canTransistionTo: hasCoBorrower
            }, {
                stateName: 'consumerSite.loanApp.declarations',
                url: '/declarations',
                controllerName: 'declarationsController',
                controllerAs: 'declarationsCntrl',
                templateUrl: '/angular/consumersite/loanApp/declarations/declarations.html',
                isCoBorrowerState: false,
                loanAppNavState: loanAppNavigationState.declarations,
                canTransistionTo: canAlwaysTransitionTo
            }, {
                stateName: 'consumerSite.loanApp.summary',
                url: '/summary',
                controllerName: 'summaryController',
                controllerAs: 'summaryCntrl',
                templateUrl: '/angular/consumersite/loanApp/summary/summary.html',
                isCoBorrowerState: false,
                loanAppNavState: loanAppNavigationState.summary,
                canTransistionTo: canAlwaysTransitionTo,
                navigationDisplayName: 'Save & Back to Summary'
            }, {
                stateName: 'consumerSite.loanApp.additionalBorrower',
                url: '/additionalBorrower',
                controllerName: 'additionalBorrowerController',
                controllerAs: 'additionalBorrowerCntrl',
                templateUrl: '/angular/consumersite/loanApp/additionalBorrower/additionalBorrower.html',
                isCoBorrowerState: false,
                loanAppNavState: loanAppNavigationState.additionalBorrower,
                canTransistionTo: canAlwaysTransitionTo
            },{
                stateName: 'consumerSite.loanApp.credit',
                url: '/credit',
                controllerName: 'creditController',
                controllerAs: 'creditCntrl',
                templateUrl: '/angular/consumersite/loanApp/credit/credit.html',
                isCoBorrowerState: false,
                loanAppNavState: loanAppNavigationState.credit,
                canTransistionTo: canAlwaysTransitionTo
            }, {
                stateName: 'consumerSite.loanApp.account',
                url: '/account',
                controllerName: 'accountController',
                controllerAs: 'accountCntrl',
                templateUrl: '/angular/consumersite/loanApp/account/account.html',
                isCoBorrowerState: false,
                loanAppNavState: loanAppNavigationState.account,
                canTransistionTo: canAlwaysTransitionTo
            }, {
                stateName: 'consumerSite.loanApp.creditResults',
                url: '/creditResults',
                controllerName: 'creditResultsController',
                controllerAs: 'creditResultsCntrl',
                templateUrl: '/angular/consumersite/loanApp/credit/creditResults.html',
                isCoBorrowerState: false,
                loanAppNavState: loanAppNavigationState.creditResults,
                canTransistionTo: canAlwaysTransitionTo
            }, {
                stateName: 'consumerSite.loanApp.success',
                url: '/creditScores',
                controllerName: 'successController',
                controllerAs: 'successCntrl',
                templateUrl: '/angular/consumersite/loanApp/success/success.html',
                isCoBorrowerState: false,
                loanAppNavState: loanAppNavigationState.success,
                canTransistionTo: canAlwaysTransitionTo
            }, {
                stateName: 'consumerSite.loanApp.eConsent',
                url: '/eConsent',
                controllerName: 'eConsentController',
                controllerAs: 'eConsentCntrl',
                templateUrl: '/angular/consumersite/loanApp/eConsent/eConsent.html',
                isCoBorrowerState: false,
                loanAppNavState: loanAppNavigationState.eConsent,
                canTransistionTo: canAlwaysTransitionTo
            }, {
                stateName: 'consumerSite.loanApp.alertPreferences',
                url: '/alertPref',
                controllerName: 'alertPreferencesController',
                controllerAs: 'alertPrefCntrl',
                templateUrl: '/angular/consumersite/loanApp/alertPreferences/alertpreferences.html',
                isCoBorrowerState: false,
                loanAppNavState: loanAppNavigationState.alertPreferences,
                canTransistionTo: canAlwaysTransitionTo
            }, {
                stateName: 'consumerSite.loanApp.activationCode',
                url: '/activation',
                controllerName: 'activationCodeController',
                controllerAs: 'activationCodedCntrl',
                templateUrl: '/angular/consumersite/loanApp/activationcode/activationcode.html',
                isCoBorrowerState: false,
                loanAppNavState: loanAppNavigationState.activationCode,
                canTransistionTo: canAlwaysTransitionTo
            }, {
                stateName: 'consumerSite.loanApp.signout',
                url: '/signout',
                controllerName: 'signoutController',
                controllerAs: 'signoutCntrl',
                templateUrl: '/angular/consumersite/loanApp/signout/signout.html',
                isCoBorrowerState: false,
                loanAppNavState: loanAppNavigationState.signout,
                canTransistionTo: canAlwaysTransitionTo
            }
        ]

        $get = (): () => INavigationState[] => {
            return () => this.consumerLoanAppStates;
        }

        getConsumerLoanAppStates = () => this.consumerLoanAppStates;
    }

    moduleRegistration.registerProvider(consumersite.moduleName, UINavigationProvider);
}