/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../ts/extendedviewmodels/extendedviewmodels.ts" />
/// <reference path="../../../angular/ts/generated/viewModels.ts" />
/// <reference path="../../../angular/ts/generated/viewModelClasses.ts" />
/// <reference path="../../../angular/ts/generated/enums.ts" />
var loanCenter;
(function (loanCenter) {
    'use strict';
    var assets = (function () {
        function assets(borrowerId) {
            this.assetsObj = {
                accountNumber: null,
                assetId: '00000000-0000-0000-0000-000000000000',
                assetType: 15,
                automobileMake: null,
                automobileYear: null,
                borrowerFullName: null,
                borrowerId: borrowerId,
                description: null,
                financialInstitutionName: null,
                isDownPayment: false,
                jointAccount: false,
                lifeInsuranceFaceValue: null,
                liquidAsset: false,
                monthlyAmount: null,
                unpaidBalance: null,
                financialInstitutionAddress: {
                    propertyId: '00000000-0000-0000-0000-000000000000',
                    addressTypeId: 0,
                    cityName: null,
                    counties: [],
                    countyName: null,
                    stateId: null,
                    stateName: null,
                    states: null,
                    streetName: null,
                    unitNumber: null,
                    zipCode: null
                },
                institiutionContactInfo: {
                    assetId: '00000000-0000-0000-0000-000000000000',
                    attn: null,
                    companyId: '00000000-0000-0000-0000-000000000000',
                    companyName: null,
                    email: null,
                    fax: null,
                    liabillityFor: null,
                    phone: null,
                    streetAddress1: null,
                    streetAddress2: null,
                    addressViewModel: {
                        propertyId: '00000000-0000-0000-0000-000000000000',
                        addressTypeId: 0,
                        cityName: null,
                        counties: null,
                        countyName: null,
                        stateId: null,
                        stateName: null,
                        states: [],
                        streetName: null,
                        unitNumber: null,
                        zipCode: null
                    }
                }
            };
        }
        return assets;
    })();
})(loanCenter || (loanCenter = {}));
//# sourceMappingURL=assets.utils.js.map