(function () {
    'use strict';

    angular.module('loanApplication').factory('incomeService', incomeService);

    incomeService.$inject = ['$resource', 'apiRoot', 'enums', 'incomeHelper'];

    function incomeService($resource, ApiRoot, enums, incomeHelper) {
        //var IncomeApiPath = ApiRoot + 'Income/';
        //var IncomeSvcGetters = $resource(IncomeApiPath, {}, {
        //    GetIncomeData: { method: 'GET', params: { loanId: 'loanId', userAccountId: 'userAccountId' } }
        //});

        //var SaveIncomeData = $resource(IncomeApiPath + 'SaveIncomeData', { viewModel: '@viewModel' });

        var service = {
            //IncomeSvcGetters: IncomeSvcGetters,
            //SaveIncomeData: SaveIncomeData,

            //service methods
            addEmploymentInfo: addEmploymentInfo,
            handleAdditionalSections: handleAdditionalSections,
            onYearsOnThisJobChanged: onYearsOnThisJobChanged,          
            performBorrowerCalculations: performBorrowerCalculations,
            sortAdditionalEmploymentInfos: sortAdditionalEmploymentInfos,
            orderEmpInfoListAndCalculateTotals: orderEmpInfoListAndCalculateTotals
        }

        return service;

        function sortAdditionalEmploymentInfos(loanApplication) {
            sortAdditionalEmploymentInfoForBorrower(loanApplication.getBorrower());
            if (loanApplication.getCoBorrower() && loanApplication.isSpouseOnTheLoan)
                sortAdditionalEmploymentInfoForBorrower(loanApplication.getCoBorrower());
        }

        function sortAdditionalEmploymentInfoForBorrower(borrower) {
            var employmentInfoAdditional = borrower.getAdditionalEmploymentInfo();

            if (employmentInfoAdditional && employmentInfoAdditional.length > 0) {

                // Sort the additional employment info.
                employmentInfoAdditional.sort(function (a, b) {

                    // Sort by isPresent descending.
                    if (a.isPresent != b.isPresent)
                        return a.isPresent ? -1 : 1;

                    // Sort by employmentStartDate descending.
                    if (a.employmentStartDate && b.employmentStartDate)
                        if (a.employmentStartDate > b.employmentStartDate)
                            return -1;
                        else if (a.employmentStartDate < b.employmentStartDate)
                            return 1;

                    // Sort by employmentEndDate descending.
                    if (a.employmentEndDate && b.employmentEndDate)
                        if (a.employmentEndDate > b.employmentEndDate)
                            return -1;
                        else if (a.employmentEndDate < b.employmentEndDate)
                            return 1;

                    return 0;
                });
            }
        }

        /**
        * Adds additional employment info section if needed (if we don't have 2 years of EmploymentHistory)
        * @param {Object} borrower 
        * @param {Object} employmentInfo
        */
        function onYearsOnThisJobChanged(borrower, employmentInfo) {
            if (borrower == null || borrower.getCurrentEmploymentInfo() == null || borrower.getAdditionalEmploymentInfo() == null)
                return;

            var areDatesValid = incomeHelper.areEmploymentDatesValid(borrower.getCurrentEmploymentInfo().employmentStartDate,
                borrower.getCurrentEmploymentInfo().employmentEndDate);

            if (!areDatesValid)
                return;

            if (employmentInfo) { //if method was called from additional emp. info section ( we don't send employmentInfo parameter from current section)
                areDatesValid = incomeHelper.areEmploymentDatesValid(employmentInfo.employmentStartDate, employmentInfo.employmentEndDate);
                if (!areDatesValid) {
                    return;
                }

            }
            else { // if method was called from current emp. info section
                borrower.getCurrentEmploymentInfo().orderNumber = 0;
            }

            toggleEmploymentInfo(borrower);
        }

        function handleAdditionalSections(borrower) {
            if (borrower && !borrower.isTotalEmploymentTwoYears)
                toggleEmploymentInfo(borrower);
        }

        // if we don't have two or more years of employment history add new employment info section
        function toggleEmploymentInfo(borrower) {
            var twoOrMoreYears = incomeHelper.checkEmploymentInfosHistory(borrower);

            if (!twoOrMoreYears) {
                if (needAdditionalRecord(borrower.getAdditionalEmploymentInfo()) === true)
                    addEmploymentInfo(borrower.getAdditionalEmploymentInfo(), true);
            } else {
                removeSections(borrower);
            }
        }


        function needAdditionalRecord(additionalEmpInfo) {
            var addedPreviousList = _.filter(additionalEmpInfo, function (empInfo) {
                var areDatesValid = incomeHelper.areEmploymentDatesValid(empInfo.employmentStartDate, empInfo.employmentEndDate);
                return !empInfo.isRemoved && empInfo.isAddedPrevious && !areDatesValid;
            });

            return addedPreviousList.length === 0;
        }

        ///Method is called when we have 2+ years of employment history and need to remove unneeded sections
        function removeSections(borrower) {
            if (borrower.isTotalEmploymentTwoYears === false) {
                return;
            }

            var isCurrentEmpInfoTwoOrMoreYears = incomeHelper.timeDifferenceTwoOrMoreYears(borrower.getCurrentEmploymentInfo().employmentStartDate, borrower.getCurrentEmploymentInfo().employmentEndDate);

            var additionalEmployments = [];
            if (isCurrentEmpInfoTwoOrMoreYears) {
                additionalEmployments = _.filter(borrower.getAdditionalEmploymentInfo(), function (empInfo) {
                    return !empInfo.isAddedPrevious;
                });
                borrower.replaceAdditionalEmploymentInfo(additionalEmployments);

                orderEmpInfoListAndCalculateTotals(borrower.getCurrentEmploymentInfo(), borrower.getAdditionalEmploymentInfo());
                return;
            }


            //filter out emp infos with IsAddedPrevious and with invalid dates
            additionalEmployments = _.reject(borrower.getAdditionalEmploymentInfo(), function (empInfo) {
                var areDatesValid = incomeHelper.areEmploymentDatesValid(empInfo.employmentStartDate, empInfo.employmentEndDate);
                return empInfo.isAddedPrevious && !areDatesValid;
            });
            borrower.replaceAdditionalEmploymentInfo(additionalEmployments);

            var removeAdditionalAddedSections = false;

            additionalEmployments = borrower.getAdditionalEmploymentInfo();
            for (var i = 0; i < additionalEmployments.length; i++) {
                var empInfo = additionalEmployments[i];
                if (empInfo.isRemoved || !empInfo.isAddedPrevious)
                    continue;

                if (removeAdditionalAddedSections) {
                    // we can remove automatically added employment infos
                    var idx = additionalEmployments.indexOf(empInfo);
                    if (idx > -1) {
                        additionalEmployments.splice(idx, 1);
                    }
                    i--;
                }
                else {
                    removeAdditionalAddedSections = incomeHelper.timeDifferenceTwoOrMoreYears(empInfo.employmentStartDate, borrower.getCurrentEmploymentInfo().employmentEndDate);
                }
            }
            borrower.replaceAdditionalEmploymentInfo(additionalEmployments);

            orderEmpInfoListAndCalculateTotals(borrower.getCurrentEmploymentInfo(), borrower.getAdditionalEmploymentInfo());
        }

        function orderEmpInfoListAndCalculateTotals(employmentInfoCurrent, employmentInfoAdditional) {
            incomeHelper.orderEmploymentInfoList(employmentInfoAdditional);
        }

        function addEmploymentInfo(isAddedPrevious) {
        }

      /**
        * Performs initial calculations for provided borrower.
        */
        function performBorrowerCalculations(borrower) {
            handleAdditionalSections(borrower);
        }
    }
})();
