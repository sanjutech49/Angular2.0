/// <reference path="../ts/lib/common.util.ts" />
/// <reference path="../ts/generated/viewModels.ts" />
/// <reference path="../common/common.string.ts" />

module contextualBar {

    export class ContextualBarSvc {

        static $inject = ['NavigationSvc'];
        static className = 'ContextualBarSvc';

        constructor(private NavigationSvc) {
        }

        /**
        * @desc Gets Aus type string representation.
        */
        public getAusType = (loan: srv.ILoanViewModel, ausTypesLookup: srv.ILookupItem[]): string => {

            lib.assert(loan, "Invalid argument: Loan");
            lib.assert(loan.product, "Invalid argument: Loan.Product");

            var ausTypes = loan.product.loanAusTypes;
            if (!ausTypes)
                return;

            // Get corresponding aus strings from lookup.
            var ausTypesStringCollection: Array<string> = [];
            for (var i = 0; i < ausTypes.length; i++)
                ausTypesLookup.filter(a => { return a.value == ausTypes[i] })
                    .forEach(ausType => ausTypesStringCollection.push(ausType.text));

            return common.string.buildCommaSeparatedString(ausTypesStringCollection);
        }

        /**
        * @desc The following method is used to fetch and filter contextual types from lookup by selected contextual type
        */
        public getContextualName = (applicationData, selectedContextualType): string => {
            if (selectedContextualType) {
                return applicationData.lookup.contextualTypes.filter(function (c) {
                    return c.value == selectedContextualType;
                })[0].text;
            }
        }
  
        /**
        * @desc This method is used to fetch selected contextual type
        */
        public getContextualType = () => {
            return this.NavigationSvc.contextualType;
        }
    }

    moduleRegistration.registerService('contextualBar', ContextualBarSvc);
}