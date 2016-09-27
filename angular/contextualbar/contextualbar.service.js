/// <reference path="../ts/lib/common.util.ts" />
/// <reference path="../ts/generated/viewModels.ts" />
/// <reference path="../common/common.string.ts" />
var contextualBar;
(function (contextualBar) {
    var ContextualBarSvc = (function () {
        function ContextualBarSvc(NavigationSvc) {
            var _this = this;
            this.NavigationSvc = NavigationSvc;
            /**
            * @desc Gets Aus type string representation.
            */
            this.getAusType = function (loan, ausTypesLookup) {
                lib.assert(loan, "Invalid argument: Loan");
                lib.assert(loan.product, "Invalid argument: Loan.Product");
                var ausTypes = loan.product.loanAusTypes;
                if (!ausTypes)
                    return;
                // Get corresponding aus strings from lookup.
                var ausTypesStringCollection = [];
                for (var i = 0; i < ausTypes.length; i++)
                    ausTypesLookup.filter(function (a) {
                        return a.value == ausTypes[i];
                    }).forEach(function (ausType) { return ausTypesStringCollection.push(ausType.text); });
                return common.string.buildCommaSeparatedString(ausTypesStringCollection);
            };
            /**
            * @desc The following method is used to fetch and filter contextual types from lookup by selected contextual type
            */
            this.getContextualName = function (applicationData, selectedContextualType) {
                if (selectedContextualType) {
                    return applicationData.lookup.contextualTypes.filter(function (c) {
                        return c.value == selectedContextualType;
                    })[0].text;
                }
            };
            /**
            * @desc This method is used to fetch selected contextual type
            */
            this.getContextualType = function () {
                return _this.NavigationSvc.contextualType;
            };
        }
        ContextualBarSvc.$inject = ['NavigationSvc'];
        ContextualBarSvc.className = 'ContextualBarSvc';
        return ContextualBarSvc;
    })();
    contextualBar.ContextualBarSvc = ContextualBarSvc;
    moduleRegistration.registerService('contextualBar', ContextualBarSvc);
})(contextualBar || (contextualBar = {}));
//# sourceMappingURL=contextualbar.service.js.map