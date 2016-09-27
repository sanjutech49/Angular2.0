var loanCenter;
(function (loanCenter) {
    'use strict';
    var PropertyInfo = (function () {
        function PropertyInfo(PropertyInfo) {
            this.propertyInfoObj = {
                propertyId: null,
                addressTypeId: null,
                cityName: null,
                stateId: null,
                stateName: null,
                states: null,
                streetName: null,
                unitNumber: null,
                zipCode: null,
                origPurchasePrice: null,
                monthlyHOA: null,
                estimatedValue: null,
                loanAmt: null,
                occupancyType: null,
                propertyType: null,
                nbrOfUnits: null,
                downPayment: null,
                downPaymentBounce: null
            };
        }
        return PropertyInfo;
    })();
})(loanCenter || (loanCenter = {}));
//# sourceMappingURL=propertyinfocontroller.js.map