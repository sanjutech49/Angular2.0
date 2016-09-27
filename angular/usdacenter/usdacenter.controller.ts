/// <reference path="../common/directives/common/impdirectives.settings.ts" />
module usda.controller {
    class USDACenterController {
        static $inject = ['NavigationSvc', 'enums', '$window', '$state', 'applicationData', 'wrappedLoan', 'commonService'];

        constructor(private navigationService: any, private enums: any, private $window: ng.IWindowService, private $state: ng.ui.IStateService, private applicationData: any,
            private wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>, private commonService: common.services.ICommonService) {
            navigationService.contextualType = enums.ContextualTypes.USDACenter;
        }

        /**
        * @desc: Function will add new household member to the list
        */
        public addNewHouseholdMember = (): void => { }

        /**
        * @desc: Function will display Property Eligibility pop up
        */
        public runPropertyEligibility = (): void => { }

        /**
        * @desc: Function will opet third party web site in a new browser tab
        */
        public openThirtPartyWebSite = (): void => {
            this.$window.open('http://eligibility.sc.egov.usda.gov/eligibility/incomeEligibilityAction.do', '_blank');
        }

        /**
        * @desc:  Function will run Mega Save
        */
        public saveChanges = (): void => {
            this.navigationService.SaveAndUpdateWrappedLoan(this.applicationData.currentUserId, this.wrappedLoan);
        }

        /**
        * @desc: Function will reload a loan, and all unsaved changes will be lost
        */
        public cancelChanges = (): void => {
            this.$state.reload();
        }

        private getAgeOutOfDoB = (dateOfBirth: any): number => {
            return this.commonService.getYearsOutOfDate(dateOfBirth);
        }
    }
    angular.module('usdaCenter').controller('usdaCenterController', USDACenterController);
} 