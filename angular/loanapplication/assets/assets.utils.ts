/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../ts/extendedviewmodels/extendedviewmodels.ts" />
/// <reference path="../../../angular/ts/generated/viewModels.ts" />
/// <reference path="../../../angular/ts/generated/viewModelClasses.ts" />
/// <reference path="../../../angular/ts/generated/enums.ts" />

module loanCenter {
    'use strict';

    interface IAsset {
        accountNumber: number;
        assetId: string;
        assetType: number;
        automobileMake: string;
        automobileYear: string;
        borrowerFullName: string;
        borrowerId: string;
        description: string;
        financialInstitutionName: string;
        isDownPayment: boolean;
        jointAccount: boolean;
        lifeInsuranceFaceValue: number;
        liquidAsset: boolean;
        monthlyAmount: number;
        unpaidBalance: number;
        financialInstitutionAddress: {
            propertyId: string;
            addressTypeId: number;
            cityName: string;
            counties: Array<string>;
            countyName: string;
            stateId: number;
            stateName: string;
            states: string;
            streetName: number;
            unitNumber: number;
            zipCode: number;
        };
        institiutionContactInfo: {
            assetId: string;
            attn: string;
            companyId: string;
            companyName: string;
            email: string;
            fax: string;
            liabillityFor: string;
            phone: string;
            streetAddress1: string;
            streetAddress2: string;
            addressViewModel: {
                propertyId: string;
                addressTypeId: number;
                cityName: string;
                counties: Array<string>;
                countyName: string;
                stateId: number;
                stateName: string;
                states: Array<string>;
                streetName: string;
                unitNumber: number;
                zipCode: number;
            };
        };

    }

    class assets {
        public assetsObj: IAsset;

        constructor(borrowerId) {
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
            }
        }
    }

    //class assetsUtils implements srv.ICollection<srv.cls.AssetViewModel> {

    //    constructor() {

    //    }

    //    length: number;


      
        //changeBorrowerForSection = (borrower: String, item: cls.AssetViewModel, activeLoan: srv.cls.LoanApplicationViewModel) => {

        //    switch (borrower) {
        //        case "Borrower":
        //            if (item.borrowerId == activeLoan.coBorrower.borrowerId) {
        //                for (var i = 0; activeLoan.coBorrower.assets.length; i++) {
        //                    if (activeLoan.coBorrower.assets[i].assetId == item.assetId) {
        //                        activeLoan.coBorrower.assets.splice(i, 1);
        //                        activeLoan.borrower.assets.push(item);
        //                        break;
        //                    }
        //                }
        //            }
        //            item.borrowerId = activeLoan.borrower.borrowerId;
        //            item.jointAccount = false;
        //            break;
        //        case "CoBorrower":
        //            if (item.borrowerId == activeLoan.borrower.borrowerId) {
        //                for (var i = 0; activeLoan.borrower.assets.length; i++) {
        //                    if (activeLoan.borrower.assets[i].assetId == item.assetId) {
        //                        activeLoan.borrower.assets.splice(i, 1);
        //                        activeLoan.coBorrower.assets.push(item);
        //                        break;
        //                    }
        //                }
        //            }
        //            item.borrowerId = activeLoan.coBorrower.borrowerId;
        //            item.jointAccount = false;
        //            break;
        //        case "Joint Account":
        //            if (item.borrowerId == activeLoan.coBorrower.borrowerId) {
        //                for (var i = 0; activeLoan.coBorrower.assets.length; i++) {
        //                    if (activeLoan.coBorrower.assets[i].assetId == item.assetId) {
        //                        activeLoan.coBorrower.assets.splice(i, 1);
        //                        activeLoan.borrower.assets.push(item);
        //                        break;
        //                    }
        //                }
        //            }
        //            item.borrowerId = activeLoan.borrower.borrowerId;
        //            item.jointAccount = true;
        //            break;
        //    }
        //}

        
    //}

    //factory.$inject = [

    //];

    //function factory() {
    //    return new assetsUtils();
    //}

    //angular.module('loanCenter').factory('assetsUtils', factory);

}







