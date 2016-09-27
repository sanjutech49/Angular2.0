
module loanCenter {
    'use strict';

    interface IPropertyInfo {
        //propertyInfoAddress: {
            propertyId: number;
            addressTypeId: number;
            cityName: string;
            stateId: string;
            stateName: string;
            states: string;
            streetName: number;
            unitNumber: number;
            zipCode: number;
            origPurchasePrice: number;
            monthlyHOA: number;
            estimatedValue: number;
            loanAmt: number;
            occupancyType: number;
            propertyType: number;
            nbrOfUnits: number;
            downPayment: number;
            downPaymentBounce: number;
        //};
    }

    class PropertyInfo {
        public propertyInfoObj: IPropertyInfo;

        constructor(PropertyInfo) {
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
                }
            }
        }
    }