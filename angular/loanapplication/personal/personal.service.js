(function () {
    'use strict';

    angular.module('loanApplication')

    .factory('personalSvc', personalSvc);

    personalSvc.$inject = ['$http', '$resource', 'apiRoot', '$q'];

    function personalSvc($http, $resource, ApiRoot, $q) {
        var personalApiPath = ApiRoot + 'personal/';
        var getHowDidYouHearAboutUsData = $resource(personalApiPath + "GetHowDidYouHearAboutUsData", { method: 'GET', params: { loanId: 'loanId', useraccountId: 'useraccountId' } });
        var getter = $resource(personalApiPath + "GetPersonalData/");

        var service = {
            getter: getter,
            save: save,
            getHowDidYouHearAboutUsData: getHowDidYouHearAboutUsData
        };
        
        return service;    

        function save(viewModel) {
            if (viewModel.SwitchCoBorrowerToBorrower) {

                var tempPersonal = angular.copy(viewModel.BorrowerInfo.PersonalInfo);
                angular.copy(viewModel.CoBorrowerInfo.PersonalInfo, viewModel.BorrowerInfo.PersonalInfo);
                angular.copy(tempPersonal, viewModel.CoBorrowerInfo.PersonalInfo);

                var tempContact = angular.copy(viewModel.BorrowerInfo.ContactInfo);
                angular.copy(viewModel.CoBorrowerInfo.ContactInfo, viewModel.BorrowerInfo.ContactInfo);
                angular.copy(tempContact, viewModel.CoBorrowerInfo.ContactInfo);

                var tempName = angular.copy(viewModel.BorrowerInfo.NameInfo);
                angular.copy(viewModel.CoBorrowerInfo.NameInfo, viewModel.BorrowerInfo.NameInfo);
                angular.copy(tempName, viewModel.CoBorrowerInfo.NameInfo);

                var tempEmployment = angular.copy(viewModel.BorrowerInfo.EmploymentAndBackgroundInfo);
                angular.copy(viewModel.CoBorrowerInfo.EmploymentAndBackgroundInfo, viewModel.BorrowerInfo.EmploymentAndBackgroundInfo);
                angular.copy(tempEmployment, viewModel.CoBorrowerInfo.EmploymentAndBackgroundInfo);

                var tempId = angular.copy(viewModel.BorrowerInfo.UserAccountId);
                angular.copy(viewModel.CoBorrowerInfo.UserAccountId, viewModel.BorrowerInfo.UserAccountId);
                angular.copy(tempId, viewModel.CoBorrowerInfo.UserAccountId);

                // to fix binding issue for empty value on SSN field
                viewModel.CoBorrowerInfo.PersonalInfo.SSN = viewModel.CoBorrowerInfo.PersonalInfo.SSN || '';
                viewModel.BorrowerInfo.PersonalInfo.SSN = viewModel.BorrowerInfo.PersonalInfo.SSN || '';

            }

            var deferred = $q.defer();

            savePersonalData().save(viewModel,
                function (data) {
                    deferred.resolve(data);
                },
                function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function savePersonalData() {
            return $resource(personalApiPath + 'SavePersonalData', { viewModel: '@viewModel' });
        };

    };

})();


