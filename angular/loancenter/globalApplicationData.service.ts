/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../ts/generated/viewModels.ts" />

module loanCenter {
    class GlobalApplicationDataService {

        static className = 'applicationData';
        static $inject = ['applicationDataService'];

        constructor(private applicationDataService) {
        }

        private applicationData: any;

        getApplicationData(): ng.IPromise<any> {

            if (this.applicationData)
                return this.applicationData;

            this.applicationDataService.getUserAccountId().then((userAccountId: string) => {

                this.applicationData = this.applicationDataService.applicationData().get({ userAccountId: userAccountId }).$promise.then(function (appData) {
                    this.applicationData = appData;
                    this.applicationData.currentUserId = userAccountId; // TODO: this should be removed since we have entire User object here. It is left for compatibility.
                    return GlobalApplicationDataService.addMissingLookups(this.applicationData, userAccountId);
                });

            }, error => {
                });
        }

        /**
        * @desc These two lookups are not entries in the DB, and they were hardcoded in C# code, so we move them here until they are created 
        *       porperly in DB.
        */

        // todo, retire this ...
        private static addMissingLookups = (applicationData, loggedUserAccountId: string) => {

            applicationData.lookup.lienPosition = [new cls.LookupItem("First", '1'), new cls.LookupItem("Second", '2'), new cls.LookupItem("Third", '3'), new cls.LookupItem("Fourth", '4'), new cls.LookupItem("Fifth", '5')];
            applicationData.lookup.propertyTaxPayPeriods = [new cls.LookupItem("Monthly", '1'), new cls.LookupItem("Annual", '2')];

            applicationData.lookup.additionalEmploymentTypes = GlobalApplicationDataService.getAdditionalEmploymentTypes(applicationData.lookup.employmentTypes);

            // TODO: Remove this. For some reason, CDM does not load this lookup, so I hardcoded it temporarily.
            if (!applicationData.lookup.employmentStatuses || applicationData.lookup.employmentStatuses.length <= 0)
                applicationData.lookup.employmentStatuses = [new cls.LookupItem("Current", '1'), new cls.LookupItem("Previous", '2')];

            return applicationData;
        }

        /**
        * Builds additional employment type lookup based on the employment types lookup.
        */
        private static getAdditionalEmploymentTypes = (employmentTypes) => {
            if (!employmentTypes || employmentTypes.length <= 0)
                return;
            var list = angular.copy(employmentTypes);

            list.filter(function (e) {
                // We only allow salaried employee and self employed types for additional employer.
                return e.value == 0 || e.value == 3 || e.value == 4;
            }).map(function (e) {
                e.disabled = true;
            });

            return list;
        }
    }
    angular.module('loanCenter').service(GlobalApplicationDataService);
}