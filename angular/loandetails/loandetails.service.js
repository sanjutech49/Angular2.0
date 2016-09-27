(function () {
    'use strict';

    angular.module('loanDetails')

    .factory('loanDetailsSvc', loanDetailsSvc);

    loanDetailsSvc.$inject = ['$resource', 'apiRoot', 'enums', 'CreditStateService'];

    function loanDetailsSvc($resource, ApiRoot, enums, CreditStateService) {

        var loanDetailsApiPath = ApiRoot + 'LoanDetails/';
        var loanDetailsSectionVIIPopupApiPath = ApiRoot + 'SectionVIIPopup/';
        var closingDateApiPath = ApiRoot + 'ClosingDatePopup/';
        var pricingResultsApiPath = ApiRoot + 'PricingResults/';


        var repriceEngine = $resource(pricingResultsApiPath, {}, {
            reprice: {
                method: 'PUT',
                params: { currentUserId : 'currentUserId' }
            }
        });

        var getLiabilitesBalance = getLiabilitesBalance;

        function getLiabilitesBalance(borrower) {
            var calculateModel = borrower.getLiability();
            return sumTotalLiabilityBalance(calculateModel);
        }

        /**
        * @desc: Sums Payment & MI 
        */
        function calculatePaymentAndMI(payment, mortgageInsurance) {
            return +payment.toFixed(2) + +mortgageInsurance.toFixed(2);
        }

        function getMIAmount(isNewLoan, costsFunc, loanPurposeType, occupancyType, subjectPropertyFunc, borrowerCurrentAddressFunc, mtgExpenseEnum) {
            if (!isNewLoan)
                return getCurrentExpenseByType(loanPurposeType, occupancyType, subjectPropertyFunc, borrowerCurrentAddressFunc, mtgExpenseEnum).monthlyAmount;
            return getCosts(1003, costsFunc).amountPerMonth;
        }

        var getPrice = getPrice;

        function getPrice(wrappedLoan) {
            
            return {
                pricingEngine: 100 - wrappedLoan.financialInfo.adjustedPoints,
                amount: wrappedLoan.financialInfo.adjustedPoints / 100 * wrappedLoan.detailsOfTransaction.totalLoanAmount
            };
        };

        var UpdateData = $resource(loanDetailsSectionVIIPopupApiPath + ':id', {},
        {
            UpdateVIIPoupData: { method: 'PUT' }
        });

        var updateClosingDate = $resource(closingDateApiPath, {},
        {
            updateClosingDate: { method: 'PUT', params: { loanId: 'loanId', userAccountId: 'userAccountId' } }
        });

        var getFinancialInfo = $resource(loanDetailsApiPath + 'GetFinancialInfo', {}, { getFinancialInfo: { method: 'GET', params: { loanId: 'loanId' } } });

        var getComplianceDate = $resource(loanDetailsApiPath + 'GetComplianceDate', {}, { getComplianceDate: { method: 'GET', params: { appDate: 'appDate', stateName: 'stateName' } } });

        var exportAditionalFieldsToEncompass = $resource(ApiRoot + '/Encompass/ExportAdditionalFields', { loanVm: '@loanVm' }, { exportData: {method: 'POST'}});
        

        function getCurrentProperty(loanPurposeType, occupancyType, subjectPropertyCb, currentAddressCb) {
            //
            // Currently for REFI the subject property is used as the Borrower Current Residence for property expense purposes when it's the Primary Residence
            //
            occupancyType = parseInt(occupancyType);
            loanPurposeType = parseInt(loanPurposeType);
            var currentProperty = null;
            if (loanPurposeType == srv.LoanPurposeTypeEnum.Refinance/*2*/
                && occupancyType == srv.PropertyUsageTypeEnum.PrimaryResidence/*1*/) {
                currentProperty = subjectPropertyCb();
            }
            else {
                currentProperty = currentAddressCb();
            }
            return currentProperty;
        }

        function getCurrentPropertyExpenseValue(propertyExpense) {
            if (propertyExpense) {
                return propertyExpense;
            }
            return { monthlyAmount: 0, impounded: false };
        }

        function getCosts(hudLineNumber, getCostsCb) {
            var costs = getCostsCb();
            if (costs) {
                for (var i = 0; i < costs.length; i++) {
                    if ((!costs[i].originalHUDLineNumber || costs[i].originalHUDLineNumber == 0 || costs[i].originalHUDLineNumber == hudLineNumber)
                        && costs[i].hudLineNumber == hudLineNumber) {
                        return costs[i];
                    }
                }
            }
            return { amountPerMonth: 0, impounded: false };
        }

        function getCurrentExpenseByType(loanPurposeType, occupancyType, subjectPropertyCb, currentAddressCb, expenseType) {
            var currentProperty = getCurrentProperty(loanPurposeType, occupancyType, subjectPropertyCb, currentAddressCb);
            if (currentProperty) {
                switch (expenseType) {
                    case enums.housingExpenses.homeOwnerExpense:
                        return getCurrentPropertyExpenseValue(currentProperty.homeOwnerExpense);
                    case enums.housingExpenses.floodInsuranceExpense:
                        return getCurrentPropertyExpenseValue(currentProperty.floodInsuranceExpense);
                    case enums.housingExpenses.mortgageInsuranceExpense:
                        return getCurrentPropertyExpenseValue(currentProperty.mortgageInsuranceExpense);
                    case enums.housingExpenses.propertyTaxExpense:
                        return getCurrentPropertyExpenseValue(currentProperty.propertyTaxExpense);
                    case enums.housingExpenses.HOAExpense:
                        return getCurrentPropertyExpenseValue(currentProperty.hoaDuesExpense);
                }
            }
            return { monthlyAmount: 0, impounded: false };
        }

        function totalCurrentExpenses(rent, firtMtgPi, secondMtgPi, loanPurposeType, occupancyType, subjectPropertyCb, currentAddressCb, addlMortgagees) {

            var total = 0;

            total += roundToFourDecimalPlaces(rent);
            total += roundToFourDecimalPlaces(firtMtgPi);
            total += roundToFourDecimalPlaces(secondMtgPi);
            total += roundToFourDecimalPlaces(getCurrentExpenseByType(loanPurposeType, occupancyType, subjectPropertyCb, currentAddressCb, enums.housingExpenses.homeOwnerExpense).monthlyAmount);
            total += roundToFourDecimalPlaces(getCurrentExpenseByType(loanPurposeType, occupancyType, subjectPropertyCb, currentAddressCb, enums.housingExpenses.floodInsuranceExpense).monthlyAmount);
            total += roundToFourDecimalPlaces(getCurrentExpenseByType(loanPurposeType, occupancyType, subjectPropertyCb, currentAddressCb, enums.housingExpenses.propertyTaxExpense).monthlyAmount);
            total += roundToFourDecimalPlaces(getCurrentExpenseByType(loanPurposeType, occupancyType, subjectPropertyCb, currentAddressCb, enums.housingExpenses.mortgageInsuranceExpense).monthlyAmount);
            total += roundToFourDecimalPlaces(getCurrentExpenseByType(loanPurposeType, occupancyType, subjectPropertyCb, currentAddressCb, enums.housingExpenses.HOAExpense).monthlyAmount);

            if (!(common.objects.isNullOrUndefined(addlMortgagees))) {
                total += addlMortgagees;
            }

            return total
        }

        function getAdditionalMortgages(loanApplications, loanPurposeType, occupancyType, subjectPropertyCb, currentAddressCb, getPrimaryLoanAppCb) {

            var total = 0;
            var usedPropertyID = [];

            usedPropertyID = checkIfpropertyExpensesHaveBeenAlreadyInculede(loanPurposeType, occupancyType, subjectPropertyCb, currentAddressCb, getPrimaryLoanAppCb, usedPropertyID);

            for (var i = 0; i < loanApplications.length; i++) {
                if (!loanApplications[i].isPrimary) {
                    var loanApp = loanApplications[i];

                    if (loanApp.getBorrower().getCurrentAddress()
                        && loanApp.getBorrower().getCurrentAddress().monthlyRent
                        && loanApp.getBorrower().getCurrentAddress().ownership == 1)
                        total += roundToFourDecimalPlaces(loanApp.getBorrower().getCurrentAddress().monthlyRent);

                    if (loanApp.getCoBorrower()
                        && loanApp.getCoBorrower().getCurrentAddress()
                        && loanApp.getCoBorrower().getCurrentAddress().monthlyRent
                        && loanApp.getCoBorrower().getCurrentAddress().ownership == 1)
                        total += roundToFourDecimalPlaces(loanApp.getCoBorrower().getCurrentAddress().monthlyRent);

                    if (loanApp.reos && loanApp.reos.length > 0) {
                        for (var j = 0; j < loanApp.reos.length; j++) {

                            if (loanApp.reos[j].property &&
                                loanApp.getBorrower() &&
                                loanApp.getBorrower().getCurrentAddress() &&
                                loanApp.reos[j].property.propertyId == loanApp.getBorrower().getCurrentAddress().propertyId
                                && loanApp.reos[j].payoffCommentId != enums.PledgedAssetComment.PaidOffFreeAndClear
                                && loanApp.reos[j].payoffCommentId != enums.PledgedAssetComment.Sold
                                && loanApp.reos[j].payoffCommentId != enums.PledgedAssetComment.NotMyLoan) {

                                total += roundToFourDecimalPlaces(loanApp.reos[j].minPayment);


                                if (usedPropertyID.indexOf(loanApp.reos[j].property.propertyId) < 0) {
                                    usedPropertyID.push(loanApp.reos[j].property.propertyId);
                                    total += sumNonImpoundedExpeses(loanApp.reos[j].property);
                                }
                            }

                        }
                    }
                }
            }
            return total;
        }

        function isMoreThan2Mortgages (pledgedAssets){

            var filteredPledgedAssets = null;

            if (pledgedAssets && pledgedAssets.length > 0) {
                filteredPledgedAssets = pledgedAssets.filter(function (pa) {
                    return pa.lienPosition > 1
                        && pa.borrowerDebtCommentId != srv.pledgedAssetCommentType.Sold
                        && pa.borrowerDebtCommentId != srv.pledgedAssetCommentType.NotMyLoan
                        && pa.borrowerDebtCommentId != srv.pledgedAssetCommentType.PaidOffFreeAndClear
                        && pa.getProperty() && (pa.getProperty().occupancyType == srv.PropertyUsageTypeEnum.PrimaryResidence
                            || pa.getProperty().addressTypeId == srv.AddressTypeEnum.Present)
                });
            }

            return (filteredPledgedAssets && filteredPledgedAssets.length > 1);
        }

        var loanDetailService =
           {
               UpdateVIIPoupData: UpdateData,
               updateClosingDate: updateClosingDate,
               getLiabilitesBalance: getLiabilitesBalance,
               getPrice: getPrice,
               RepriceEngine: repriceEngine,
               getComplianceDate: getComplianceDate,
               getCurrentProperty: getCurrentProperty,
               getCosts: getCosts,
               totalCurrentExpenses: totalCurrentExpenses,
               getCurrentExpenseByType: getCurrentExpenseByType,
               getCurrentPropertyExpenseValue: getCurrentPropertyExpenseValue,
               getAdditionalMortgages: getAdditionalMortgages,
               getOtherPayments: getOtherPayments,
               getCacheFlowAdditionalMorgages: getCacheFlowAdditionalMorgages,
               calculatePaymentAndMI: calculatePaymentAndMI,
               getMIAmount: getMIAmount,
               isMoreThan2Mortgages: isMoreThan2Mortgages,
               exportAdditionalFieldsToEncompassCb: exportAdditionalFieldsToEncompassCb
           }

        // ---
        // PRIVATE METHODS.
        // ---

        function sumTotalLiabilityBalance(model) {
            var total = 0;
            angular.forEach(model, function (item) {
                if (!item.isRemoved && item.minPayment) {
                    total += parseFloat(item.minPayment);
                }
            });
            return total;
        }
        function roundToFourDecimalPlaces(value) {
            return value ? Math.round(value * 10000) / 10000 : 0;
        }

        function checkIfpropertyExpensesHaveBeenAlreadyInculede(loanPurposeType, occupancyType, subjectPropertyCb, currentAddressCb, getPrimaryLoanAppCb, usedPropertyID) {

            var result = false;

            var currentPrimaryProperty = getCurrentProperty(loanPurposeType, occupancyType, subjectPropertyCb, currentAddressCb);
            if (currentPrimaryProperty && getPrimaryLoanAppCb() && getPrimaryLoanAppCb().reos) {

                var primaryBorrowerREOs = getPrimaryLoanAppCb().reos;

                for (var n = 0; n < primaryBorrowerREOs.length; n++) {
                    if (primaryBorrowerREOs.property) {
                        if (primaryBorrowerREOs[n].property.propertyId == currentPrimaryProperty.propertyId) {
                            usedPropertyID.push(currentPrimaryProperty.propertyId);
                            break;
                        }
                    }
                    else {
                        continue;
                    }
                }
            }
            return usedPropertyID;
        }

        function sumNonImpoundedExpeses(propertyItem) {

            var total = 0;
            if (propertyItem && propertyItem.propertyExpenses) {
                for (var k = 0; k < propertyItem.propertyExpenses.length; k++) {
                    total += propertyItem.propertyExpenses[k].impounded ? 0 : roundToFourDecimalPlaces(propertyItem.propertyExpenses[k].monthlyAmount);
                }
            }
            return total;
        }

        function getOtherPayments(context, loanPurposeType, usePrimaryLoanApp) {
            if (usePrimaryLoanApp === undefined || usePrimaryLoanApp == null) {
                return 0;
            }

            if (usePrimaryLoanApp == true) {
                var otherPaymentTotal = CreditStateService.summateLiabiltyPaymentPrimary(context);
            }
            else {
                var otherPaymentTotal = CreditStateService.summateLiabilityPaymentAdditionalMortgages(context);
            }

            var primaryPayment = 0;
            var additionalLiabilitiesPayment = 0;
                //If Refinance
            if (loanPurposeType == enums.LoanTransactionTypes.Refinance) {
                angular.forEach(CreditStateService.wrappedLoan.ref.getLoanApplications(), function (loanApplication) {
                    if ((context == srv.BorrowerContextTypeEnum.Borrower && loanApplication.getBorrower()) ||
                        (context == srv.BorrowerContextTypeEnum.CoBorrower && loanApplication.getCoBorrower() && loanApplication.isSpouseOnTheLoan) ||
                         context == srv.BorrowerContextTypeEnum.Both) {
                        if (usePrimaryLoanApp && loanApplication.isPrimary) {
                            primaryPayment += getOtherPaymentsFromReo(loanApplication.reos);
                        } else if (!usePrimaryLoanApp && !loanApplication.isPrimary) {
                            additionalLiabilitiesPayment += getOtherPaymentsFromReo(loanApplication.reos);
                        }
                    }
                });
            }

            var pred = function(miscDebt) { return miscDebt.typeId == srv.MiscellaneousDebtTypes.ChildCareExpensesForVALoansOnly; } 
            var accessor = function (l) { return l.amount; }

            var childCareExpenses = 0;

            // add child care expenses for borrower
            if ((context == srv.BorrowerContextTypeEnum.Borrower || context == srv.BorrowerContextTypeEnum.Both)
                && CreditStateService.wrappedLoan.ref.primary.getBorrower()
                && CreditStateService.wrappedLoan.ref.primary.getBorrower().getMiscDebts()
                && CreditStateService.wrappedLoan.ref.primary.getBorrower().getMiscDebts().filter(function (i) { return (i.typeId == srv.MiscellaneousDebtTypes.ChildCareExpensesForVALoansOnly) })) {
                
                if (usePrimaryLoanApp) {
                    childCareExpenses += lib.summate(CreditStateService.wrappedLoan.ref.primary.getBorrower().getMiscDebts(), pred, accessor);
                } else if (!usePrimaryLoanApp ) {
                    childCareExpenses += getChildCareForAdditionalApp(pred, accessor, srv.BorrowerTypeEnum.Borrower);
                }
            }

            // add child care expenses for co-orrower
            if ((context == srv.BorrowerContextTypeEnum.CoBorrower || context == srv.BorrowerContextTypeEnum.Both)
                && CreditStateService.wrappedLoan.ref.primary.isSpouseOnTheLoan  && CreditStateService.wrappedLoan.ref.primary.getCoBorrower()
                && CreditStateService.wrappedLoan.ref.primary.getCoBorrower().getMiscDebts()
                && CreditStateService.wrappedLoan.ref.primary.getCoBorrower().getMiscDebts().filter(function (i) { return (i.typeId == srv.MiscellaneousDebtTypes.ChildCareExpensesForVALoansOnly) })) {
              
                if (usePrimaryLoanApp) {
                    childCareExpenses += lib.summate(CreditStateService.wrappedLoan.ref.primary.getCoBorrower().getMiscDebts(), pred, accessor);
                } else if (!usePrimaryLoanApp) {
                    childCareExpenses += getChildCareForAdditionalApp(pred, accessor, srv.BorrowerTypeEnum.CoBorrower);
                    
                }
            }
            

            //If PrimarLoanApp - additionalLiabilitiesPayment is going to be 0
            //If Not PrimaryLoanApp - primaryPayment is going to be 0
            return otherPaymentTotal + primaryPayment + additionalLiabilitiesPayment + childCareExpenses;
        }

        function getChildCareForAdditionalApp(pred, accessor, borrowerType) {

            var childCareExpenses = 0;

            angular.forEach(CreditStateService.wrappedLoan.ref.getLoanApplications(), function(loanApplication) {
                if (!loanApplication.isPrimary) {
                    if (borrowerType == srv.BorrowerTypeEnum.Borrower)
                    {
                        childCareExpenses += lib.summate(loanApplication.getBorrower().getMiscDebts(), pred, accessor);
                    }
                    if (borrowerType == srv.BorrowerTypeEnum.CoBorrower)
                    {
                        childCareExpenses += lib.summate(loanApplication.getCoBorrower().getMiscDebts(), pred, accessor);
                    }                    
                }

            });

            return childCareExpenses;
        }

        function getOtherPaymentsFromReo(reos) {
            var otherPaymentTotal = 0;
            angular.forEach(reos, function (reoItem) {
                if (!reoItem.isRemoved && reoItem.getProperty() && reoItem.getProperty().OccupancyType == srv.PropertyUsageTypeEnum.SecondVacationHome) {
                    if (!reoItem.getProperty().isSubjectProperty)//Not Subject Property
                    {
                        if (reoItem.payoffCommentId == enums.PledgedAssetComment.PayoffAtClose ||
                            (reoItem.pledgedAssetLoanType != enums.PledgedAssetLoanType.Heloc &&
                            (reoItem.payoffCommentId == enums.PledgedAssetComment.PayoffAtClosingAndDontCloseAccount ||
                            reoItem.payoffCommentId == enums.PledgedAssetComment.PayoffAtClosingAndCloseAccount)))
                        {
                            otherPaymentTotal += roundToFourDecimalPlaces(reoItem.getProperty().sumPropertyExpenses());
                        }
                        else if (reoItem.payoffCommentId == enums.PledgedAssetComment.DoNotPayoff)
                        {
                            otherPaymentTotal += roundToFourDecimalPlaces(CreditStateService.setTotalPaymentsDisplayValue(reoItem));
                        }
                    }
                }
            });

            return otherPaymentTotal;
        }

        function getCacheFlowAdditionalMorgages(isNegative, context) {
            var total = 0;
            angular.forEach(CreditStateService.wrappedLoan.ref.getLoanApplications(), function (loanApplication) {
                if (!loanApplication.isPrimary) {
                    if (context == srv.BorrowerContextTypeEnum.Borrower) {
                        total += CreditStateService.wrappedLoan.ref.getCashFlowForNetRentalIncomes(loanApplication.getBorrower(), isNegative);
                    }
                    else if (context == srv.BorrowerContextTypeEnum.CoBorrower) {
                        total += CreditStateService.wrappedLoan.ref.getCashFlowForNetRentalIncomes(loanApplication.getCoBorrower(), isNegative);
            }
                }
            });

            return total;
        }

        function exportAdditionalFieldsToEncompassCb(wrappedLoan) {
            //todo mb: not good solution, all these calculations needs to be moved to loan calculator!
            if (wrappedLoan.ref.housingExpenses) {
                wrappedLoan.ref.housingExpenses.paymentWithMI = wrappedLoan.ref.housingExpenses.firstMtgPi + getCurrentExpenseByType(wrappedLoan.ref.loanPurposeType, wrappedLoan.ref.getSubjectProperty().occupancyType, wrappedLoan.ref.getSubjectProperty, wrappedLoan.ref.primary.getBorrower().getCurrentAddress, enums.housingExpenses.mortgageInsuranceExpense).monthlyAmount;
                wrappedLoan.ref.housingExpenses.totalMonthlyMortgageObligation = totalCurrentExpenses(wrappedLoan.ref.housingExpenses.rent, wrappedLoan.ref.housingExpenses.firstMtgPi, wrappedLoan.ref.housingExpenses.secondMtgPi, wrappedLoan.ref.loanPurposeType, wrappedLoan.ref.getSubjectProperty(), wrappedLoan.ref.getSubjectProperty(), wrappedLoan.ref.primary.getBorrower().getCurrentAddress) +
                getAdditionalMortgages(wrappedLoan.ref.getLoanApplications(), wrappedLoan.ref.loanPurposeType, wrappedLoan.ref.getSubjectProperty().occupancyType, wrappedLoan.ref.getSubjectProperty, wrappedLoan.ref.primary.getBorrower().getCurrentAddress, function () { return wrappedLoan.ref.primary; });
            }

            exportAditionalFieldsToEncompass.exportData(wrappedLoan.ref).$promise.then(
                function (success) { console.log('Additional fields successfully exported!'); },
                function (error) { console.warn('exportAdditionalFieldsToEncompassCb:: Updating additional fields failed!'); }
            );
        }

        return loanDetailService;

        /*
        return $resource('http://localhost:52037/api/LoanDetails', {}, {
            GetLoanDetailsData: { method: 'GET', params: { loanId: 'loanId' } }
        });*/
    };

})();