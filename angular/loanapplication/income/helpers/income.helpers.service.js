(function () {
    'use strict';

    angular.module('loanApplication').factory('incomeHelper', incomeHelper);

    incomeHelper.$inject = ['enums', 'commonService'];

    function incomeHelper(enums, commonService) {

        var service = {
            areEmploymentDatesValid: areEmploymentDatesValid,
            calculateBorrowersIncomeInfo: calculateBorrowersIncomeInfo,
            calculateTotalMonthlyAmount: calculateTotalMonthlyAmount,
            checkEmploymentInfosHistory: checkEmploymentInfosHistory,
            disableIncome: disableIncome,
            getMaxOrderNumberForNewEmploymentInfo: getMaxOrderNumberForNewEmploymentInfo,
            isAmountValid: isAmountValid,
            orderEmploymentInfoList: orderEmploymentInfoList,
            timeDifferenceTwoOrMoreYears: timeDifferenceTwoOrMoreYears           
        };

        return service;

        // returns true if Employment Info sections contains at least 2 years of Employment History
        function checkEmploymentInfosHistory(borrower) {

            if (!borrower || !borrower.getCurrentEmploymentInfo())
                return;

            // Check current emp info history
            var twoOrMoreYears = timeDifferenceTwoOrMoreYears(borrower.getCurrentEmploymentInfo().employmentStartDate,
                borrower.getCurrentEmploymentInfo().employmentEndDate);

            // if current employment info isn't two or more years check additional employment info history
            var isAdditionalEmpInfoTwoOrMoreYears = additionalEmpInfoTwoOrMoreYears(borrower);
        }

        function additionalEmpInfoTwoOrMoreYears(borrower) {
            var additionalEmpInfo = borrower.getAdditionalEmploymentInfo();
            var currentEmpInfoEndDate = borrower.getCurrentEmploymentInfo().employmentEndDate;

            for (var i = 0; i < additionalEmpInfo.length; i++) {
                var empInfo = additionalEmpInfo[i];
                if (!empInfo.IsRemoved) {
                    var areDatesValid = areEmploymentDatesValid(empInfo.employmentStartDate, empInfo.employmentEndDate);
                    if (!areDatesValid)
                        continue; // if entered dates aren't valid skip this entry

                    var twoOrMoreYears = timeDifferenceTwoOrMoreYears(empInfo.employmentStartDate, currentEmpInfoEndDate);
                    if (twoOrMoreYears)
                        return true;
                }
            }

            return false;
        }

        function areEmploymentDatesValid(employmentStartDate, employmentEndDate) {
            if (employmentStartDate == null || employmentEndDate == null)
                return false;

            var empInfoStartDate = moment(employmentStartDate);
            var empInfoEndDate = moment(employmentEndDate);

            if (!empInfoStartDate.isValid() || !empInfoEndDate.isValid())
                return false;

            var currentTime = moment();

            var isStartDateAfterCurrent = empInfoStartDate.isAfter(currentTime);
            var isEndDateAfterCurrent = empInfoEndDate.isAfter(currentTime);

            if (isStartDateAfterCurrent || isEndDateAfterCurrent)
                return false;

            return true;
        }

        function calculateBorrowersIncomeInfo(employmentInfoCurrent, employmentInfoAdditional) {

            //if (getCurrentEmploymentInfo() && getCurrentEmploymentInfo().incomeInformation
            //      && getCurrentEmploymentInfo().incomeInformation.length > 0) {

            //    calculateTotalMonthlyAmount(getCurrentEmploymentInfo());

            //    //Calculate total monthly amount for every additional employment
            //    if (employmentInfoAdditional)
            //        angular.forEach(employmentInfoAdditional, function (employmentInfo) {
            //            if (!employmentInfo.IsRemoved)
            //                calculateTotalMonthlyAmount(employmentInfo);
            //        });
            //}
        }

        function calculateTotalMonthlyAmount(employmentInfo) {
            //var incomeInfoCollection = employmentInfo.incomeInformation;
            //if (incomeInfoCollection && incomeInfoCollection.length > 0) {
            //    employmentInfo.totalMonthlyAmount = sumArrayProperties(incomeInfoCollection, "calculatedMonthlyAmount");
            //}
        }

        function disableIncome(incomeInfoItem, incomeInfoList, incomeTypeEnum) {
            angular.forEach(incomeInfoList, function (income) {
                if (income.incomeTypeId == incomeTypeEnum) {
                    if (incomeInfoItem.amount != 0) {
                        income.amount = 0;
                        income.incomeTypeDisabled = true;
                    }
                    else {
                        income.incomeTypeDisabled = false;
                    }
                }
            });
        }

        function getMaxOrderNumberForNewEmploymentInfo(employmentInfoList) {
            var orderNumber = 1;
            var employmentInfoListWithoutRemoved = _.filter(employmentInfoList, function (empInfo) { return !empInfo.isRemoved; });
            if (employmentInfoListWithoutRemoved.length > 0) {
                var empInfoMaxOrderNumber = _.max(employmentInfoListWithoutRemoved, function (empInfo) { return empInfo.orderNumber; });
                orderNumber = empInfoMaxOrderNumber.orderNumber + 1;
            }

            return orderNumber;
        }
      

        function orderEmploymentInfoList(employmentInfoList) {

            var index = 1;

            for (var i = 0; i < employmentInfoList.length; i++) {         
                if (!employmentInfoList[i].isRemoved) {
                    employmentInfoList[i].orderNumber = index++;
                } else {
                    employmentInfoList[i].orderNumber = -1;
                }
            }
        }

        function sumArrayProperties(arrayOfObjects, propName) {
            return arrayOfObjects.reduce(function (i, j) {
                if (j[propName] != undefined && j[propName] != "")
                    return parseFloat(i) + parseFloat(j[propName]);
                j[propName] = 0;
                return parseFloat(i);
            }, 0);
        }

        function timeDifferenceTwoOrMoreYears(dateTimeFrom, dateTimeTo) {
            return commonService.compareDates(dateTimeFrom, dateTimeTo).asYears() >= 2.0;
        }

        function isAmountValid(amount) {
            return amount != null && !isNaN(parseFloat(amount));
        }
    }
})();