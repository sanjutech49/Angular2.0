(function () {
    'use strict';

    angular.module('util')
        .provider('applicationDataResolver', applicationDataResolver);

    function applicationDataResolver() {

        var applicationDataObject;
        var applicationDataSvc;
        var Enums;

        this.$get = function () {
            return resolver;
        };

        function resolver(applicationDataService, $stateParams, $rootScope, enums, userAccountId) {
            applicationDataSvc = applicationDataService
            if (applicationDataObject && applicationDataObject.currentUserId) {
                return applicationDataObject;
            }
            Enums = enums;

            applicationDataObject = applicationDataService.applicationData().get({ userAccountId: userAccountId }).$promise.then(function (result) {
                applicationDataObject = result;
                addMissingLookups(applicationDataObject);
                applicationDataObject.currentUserId = userAccountId; // TODO: this should be removed since we have entire User object here. It is left for compatibility.
                applicationDataObject.currentUser = new cls.UserAccountViewModel(applicationDataObject.currentUser);
                applicationDataObject.currentUser.isWholesale = isWholesaleUser(applicationDataObject);
                applicationDataService.applicationDataObject = applicationDataObject;
                applicationDataObject.lookup = new cls.LookupViewModel(applicationDataObject.lookup);
                return applicationDataObject;
            });
            return applicationDataObject;
        }

        /**
        * @desc These two lookups are not entries in the DB, and they were hardcoded in C# code, so we move them here until they are created 
        *       porperly in DB.
        */
        function addMissingLookups(applicationData) {
            applicationData.lookup.lienPosition = [new cls.LookupItem("First", 1), new cls.LookupItem("Second", 2), new cls.LookupItem("Third", 3), new cls.LookupItem("Fourth", 4), new cls.LookupItem("Fifth", 5)];
            applicationData.lookup.propertyTaxPayPeriods = [new cls.LookupItem("Monthly", 1), new cls.LookupItem("Annual", 2)];
            applicationData.lookup.accountOptions = [new cls.LookupItem(Enums.lookupAccountOptions.jointWithBorrower, 1), new cls.LookupItem(Enums.lookupAccountOptions.separateFromBorrower, 2)];
            applicationData.lookup.additionalEmploymentTypes = getAdditionalEmploymentTypes(applicationData.lookup.employmentTypes);

            // TODO: Remove this. For some reason, CDM does not load this lookup, so I hardcoded it temporarily.
            if (!applicationData.lookup.employmentStatuses || applicationData.lookup.employmentStatuses.length <= 0)
                applicationData.lookup.employmentStatuses = [new cls.LookupItem("Current", 1), new cls.LookupItem("Previous", 2)];

            return applicationData;
        }

        /**
        * Builds additional employment type lookup based on the employment types lookup.
        */
        function getAdditionalEmploymentTypes(employmentTypes) {
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

        function isWholesaleUser(applicationData) {
            var channel = _.findWhere(applicationData.companyProfile.channels, { channelId: applicationData.currentUser.channelId });
            return channel ? channel.isWholesale : false;
        }
    }
})();