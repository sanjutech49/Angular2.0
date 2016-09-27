/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="vacenter.service.ts" />

module va.controller {
    'use strict';

    class VACenterController {
        loanTypeEnum: any;
        eligibleProudctsExists: boolean;

        static $inject = ['vaCenterService', 'wrappedLoan', '$state', 'NavigationSvc', 'applicationData', 'enums', 'fhaCenterService'];
        constructor(private vaCenterService: va.service.IVACenterService, private wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>, private $state: angular.ui.IStateService,
            private navigationService: any, public applicationData: any, private enums: any, private fhaCenterService: fha.service.IFHACenterService) {
            navigationService.contextualType = enums.ContextualTypes.VaCenter;
            lib.forEach(this.applicationData.lookup.vaCalculators,(item: srv.ILookupItem) => {
                item.selected = item.value == String(srv.VACalculatorsEnum.VAGeneralInformation) ? true : false;
            });
        }


        /*
         * @desc: Calls Mega save
        */
        saveChanges = (): void => {
            this.navigationService.SaveAndUpdateWrappedLoan(this.applicationData.currentUserId, this.wrappedLoan);
        }

        /*
         * @desc: Reloads current state
        */
        cancelChanges = (): void => {
            this.navigationService.cancelChanges(this.wrappedLoan.ref.loanId);
        }

        selectVACalculator = (value: string): void => {
            this.fhaCenterService.selectProduct(this.applicationData.lookup.vaCalculators, value);
            this.navigationService.navigateToVACalculator(value);
        }

        getSelectedVACalculatorName = (): string => {
            return lib.filter(this.applicationData.lookup.vaCalculators,(item: srv.ILookupItem) => { return item.selected; })[0].text;
        }
    }
    angular.module('vaCenter').controller('vaCenterController', VACenterController);
} 