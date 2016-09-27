/// <reference path="../ts/lib/common.util.ts" />
/// <reference path="../ts/extendedviewmodels/extendedviewmodels.ts" />
/// <reference path="../../scripts/typings/moment/moment.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../ts/generated/enums.ts" />
/// <reference path="../ts/generated/enums.ts" />
/// <reference path="../ts/generated/viewmodelbaseclasses.ts" />
/// <reference path="../ts/generated/viewmodelclasses.ts" />
/// <reference path="../ts/generated/viewmodels.ts" />
module common.services {
    'use strict';

    export interface ICommonService {
        recalculateMonths(years: number, months: number): any;
        compareDates(a: any, b: any): any;
        compareDatesCustom(date1: any, date2: any, interval: any): any;
        getFHAOrVALoanLimit(listOfLimits: srv.ICollection<srv.ICountyLoanLimitViewModel>, stateName: string, countyName: string, numberOfUnits: number): number;
        getYearsOutOfDate (date: any): number;
    }

    export class CommonService implements ICommonService {
        static $inject = ['enums']
        constructor(private enums: any) { }

        /**
        * Recalculates months into years.
        */
        recalculateMonths = (years: number, months: number): any => {
            if (!months) {
                //if months are falsy value, we can assign 0 to it, because Math.floor(0 / 12) will return 0
                //and that means we will append 0 to year.
                months = 0; 
            }
            years += Math.floor(months / 12);
            months %= 12;

            return {
                years: years === 0 ? null : years,
                months: months === 0 ? null : months
            };
        }

        compareDates = (a: any, b: any): any => {
            return moment.duration({ from: a, to: b });
        }

        compareDatesCustom = (date1: any, date2: any, interval: any): any => {
            if (date1 == null || date2 == null || date1 == undefined || date2 == undefined) return NaN;

            var second = 1000;
            var minute = second * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var week = day * 7;

            date1 = new Date(date1);
            date2 = new Date(date2);
            var timediff = date2 - date1;
            if (isNaN(timediff)) return NaN;

            switch (interval) {
                case this.enums.timeInterval.years: return date2.getFullYear() - date1.getFullYear();
                case this.enums.timeInterval.months: return (
                    (date2.getFullYear() * 12 + date2.getMonth())
                    -
                    (date1.getFullYear() * 12 + date1.getMonth())
                    );
                case this.enums.timeInterval.weeks: return Math.floor(timediff / week);
                case this.enums.timeInterval.days:
                    var days = timediff / day
                    return days > Math.floor(days) ? Math.floor(days + 1) : Math.floor(days);
                case this.enums.timeInterval.hours: return Math.floor(timediff / hour);
                case this.enums.timeInterval.minutes: return Math.floor(timediff / minute);
                case this.enums.timeInterval.seconds: return Math.floor(timediff / second);
                default: return undefined;
            }
        }

        getFHAOrVALoanLimit = (listOfLimits: srv.ICollection<srv.ICountyLoanLimitViewModel>, stateName: string, countyName: string, numberOfUnits: number): number => {

            var result = lib.filter(listOfLimits,(item: srv.ICountyLoanLimitViewModel) => { return item.countyName.toLowerCase() == countyName.toLowerCase() && item.stateName.toLowerCase() == stateName.toLowerCase(); });

            if (result.length > 0) {
                switch (Number(numberOfUnits)) {
                    case 1:
                        return result[0].oneFamilyUnit;
                    case 2:
                        return result[0].twoFamilyUnit;
                    case 3:
                        return result[0].threeFamilyUnit;
                    case 4:
                        return result[0].fourFamilyUnit;
                    default:
                        console.warn('getFHAOrVALoanLimit:: Number of units is not allowed. [[ ' + numberOfUnits + ' ]]');
                        return 0;
                }
            }
            else {
                console.warn('getFHAOrVALoanLimit:: Could not find any limit for provided parameters.');
                return 0;
            }
        }

        getYearsOutOfDate = (date: any): number => {
            var today = new Date();
            var providedDate = new Date(date);

            var age = today.getFullYear() - providedDate.getFullYear();
            var age_month = today.getMonth() - providedDate.getMonth();
            var age_day = today.getDate() - providedDate.getDate();

            if (age_month < 0 || (age_month == 0 && age_day < 0)) {
                age = age - 1;
            }
            return age;
        };
    }
    angular.module('common').service('commonService', CommonService);
}

