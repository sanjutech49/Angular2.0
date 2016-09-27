(function () {
    'use strict';

    angular.module('loanApplication')

    .factory('propertySvc', propertySvc);

    propertySvc.$inject = ['$resource', 'apiRoot', 'propertyConstant'];

    function propertySvc($resource, ApiRoot, propertyConstant) {
        //var propertyApiPath = ApiRoot + 'property/'
       
        //var GetPropertyData = $resource(propertyApiPath, { params: { loanId: 'loanId' } });
        //var SavePropertyData = $resource(propertyApiPath + "SavePropertyData", { data: '@data' });

        /*
        * @desc Sets a flag based on the amount of time in years at address. If less than 2 then return true.
        */
        function showPreviousAddress(years, months) {
            if (!years) {
                if (!months)
                return false;

                return parseInt(months) < 12;
            }

            return parseInt(years) < 2;
        };

        /*
        * @desc Gets the label text based on key and value pair.
        */
        function getLabelText(key, value) {
            switch (key) {
                case 'subjectPropertyValue':
                    if (value == 1)
                        return propertyConstant.PURCHASE.LABELS.PRICE;
                    else if (value == 2)
                        return propertyConstant.REFINANCE.LABELS.PRICE;
                case 'subjectPropertyPayment':
                    if (value == 1)
                        return propertyConstant.PURCHASE.LABELS.PAYMENT;
                    else if (value == 2)
                        return propertyConstant.REFINANCE.LABELS.PAYMENT;
                case 'subjectPropertySource':
                    if (value == 1)
                        return propertyConstant.PURCHASE.LABELS.SOURCE;
                    else if (value == 2)
                        return propertyConstant.REFINANCE.LABELS.SOURCE;
            }
        }

        /*
        * @desc Gets the label text based on key and value pair.
        */
        function getLabelText(key, value) {
            switch (key) {
                case 'subjectPropertyValue':
                    if (value == 1)
                        return propertyConstant.PURCHASE.LABELS.PRICE;
                    else if (value == 2)
                        return propertyConstant.REFINANCE.LABELS.PRICE;
                case 'subjectPropertyPayment':
                    if (value == 1)
                        return propertyConstant.PURCHASE.LABELS.PAYMENT;
                    else if (value == 2)
                        return propertyConstant.REFINANCE.LABELS.PAYMENT;
                case 'subjectPropertySource':
                    if (value == 1)
                        return propertyConstant.PURCHASE.LABELS.SOURCE;
                    else if (value == 2)
                        return propertyConstant.REFINANCE.LABELS.SOURCE;
            }
        }

        function calculateLoanAmount(purchasePrice, downPayment){
            return purchasePrice - downPayment;
        }

        function calculateDownPayment(purchasePrice, loanAmount) {
            return purchasePrice - loanAmount;
        }

        function calculateDownPaymentPercentage(purchasePrice, downPayment){
            return parseFloat((downPayment / purchasePrice) * 100);
        }

        function calculateDownPaymentByPercentage(purchasePrice, downPaymentPercentage) {
            return purchasePrice * (downPaymentPercentage / 100);
        }

        var service = {
            //GetPropertyData: GetPropertyData,
            //SavePropertyData: SavePropertyData,
            showPreviousAddress: showPreviousAddress,
            getLabelText: getLabelText,
            calculateLoanAmount: calculateLoanAmount,
            calculateDownPayment: calculateDownPayment,
            calculateDownPaymentPercentage: calculateDownPaymentPercentage,
            calculateDownPaymentByPercentage: calculateDownPaymentByPercentage,
        };

        return service;
    };
})();
