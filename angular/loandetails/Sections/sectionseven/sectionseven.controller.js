
/**
  * @namespace Controllers
  * @desc Secion VII Controller
  * @logic VM binding, section VII calculator bindning & update, section VII barchart (only binding no ctrl logic)
  * @update section VII calculator updates Loan Amount, Purchase Price, Down Payment, Down Payment Source, cancel & save option
  * @memberOf loanDetails module - loandetails section
 */

(function () {
    'use strict';
    angular.module('loanDetails').controller('sectionSevenController', sectionSevenController);

    sectionSevenController.$inject = ['$log', '$scope', '$modal', '$filter', 'loanDetailsSvc', 'modalPopoverFactory', 'calculatorSvc', '$controller', 'wrappedLoan',
        'applicationData', 'enums', 'loanEvent', 'commonCalculatorSvc', 'costDetailsHelpers'];

    function sectionSevenController($log, $scope, $modal, $filter, loanDetailsSvc, modalPopoverFactory, calculatorSvc, $controller, wrappedLoan,
        applicationData, enums, loanEvent, commonCalculatorSvc, costDetailsHelpers) {

        var vm = this;

        /**
		  * Properties
		 */
        //vm.$scope = $scope;
        vm.wrappedLoan = wrappedLoan;
        vm.loanDetailsViewModel = [];
        vm.cashFromBorrower = cashFromBorrower;
        vm.applicationData = applicationData;
        vm.downPaymentSource = { value: '101', text: 'test' };
        vm.downPaymentRules = downPaymentRules;
        vm.concurrent2ndMortgageEnable = false;
        vm.creditLineCapEnable = false;

        vm.getDownPaymentSourceText = getDownPaymentSourceText;

        /**
		  * Functions
		 */

        vm.getHudLineNumber = getHudLineNumber;

        vm.showSectionSeven = showSectionSeven;
        vm.showSubordinateFinancingDetailsModal = showSubordinateFinancingDetailsModal;
        vm.calculateMonthlyPayment = calculateMonthlyPayment;
        vm.setDownPaymentSourceValue = setDownPaymentSourceValue;
        vm.onCashoutChange = onCashoutChange;
        vm.getTotalForClosingDisclosure = getTotalForClosingDisclosure;

        vm.fundingFeeFinancedDetailsModal = fundingFeeFinancedDetailsModal;
        vm.isAmountFinancedValid = isAmountFinancedValid;
        vm.maxAllowedFundingFeeAmount = vm.wrappedLoan.ref.detailsOfTransaction.pmiMipFundingFeeFinanced; //This amount should only be on the first load.
        vm.onConcurrent2ndMortgageChange = onConcurrent2ndMortgageChange;

        function cashFromBorrower() {
             

            if (!!vm.wrappedLoan.ref.detailsOfTransaction) {
                return vm.wrappedLoan.ref.detailsOfTransaction.cashFromToBorrower > 0;
                //vm.wrappedLoan.ref.detailsOfTransaction.cashToOrFromBorrowerDecimalVal = vm.detailsOfTransaction.castFromToBorrower;
            }
            else {
                return false;
                //vm.wrappedLoan.ref.detailsOfTransaction.cashToOrFromBorrowerDecimalVal = 0.0;
            }
        }

        $scope.$on("UpdateSectionSeven", function (data) {
            downPaymentRules(wrappedLoan.ref, "LoanAmount");
            
        });


        // TODO: Check if this line is needed after CDM load.
        //if (vm.wrappedLoan.ref && vm.wrappedLoan.ref.detailsOfTransaction && vm.wrappedLoan.ref.detailsOfTransaction.subordinateFinancing)
        //    vm.wrappedLoan.ref.detailsOfTransaction.subordinateFinancing = vm.wrappedLoan.ref.detailsOfTransaction.subordinateFinancing.replace("$", "");

        /**
		  * Function declarations
		 */

        // open calculator popup for section seven
        function showSectionSeven(event, model) {
            downPaymentRules(wrappedLoan.ref, "LoanAmount", false);
            var sectionSevenPopup = modalPopoverFactory.openModalPopover('angular/loandetails/sections/sectionseven/sectionsevenpopup.html', this, wrappedLoan.ref, event, {
                arrowRight: true, className: 'tooltip-arrow-right', verticalPopupPositionPerHeight: 0, horisontalPopupPositionPerWidth: 0.8333
            });
            sectionSevenPopup.result.then(function (data) {
                updateSectionVIIData(data);
                downPaymentRules(wrappedLoan.ref, "LoanAmount");
                    });
        }

        function setDownPaymentSourceValue() {
            var downPaymentTypes = applicationData.lookup.downPaymentSourcesTypes;

            for (var i = 0, length = downPaymentTypes; i < downPaymentTypes.length; i++) {
                if (downPaymentTypes[i].value === vm.wrappedLoan.ref.getSubjectProperty().downPaymentSource || vm.wrappedLoan.ref.getSubjectProperty().downPaymentSource === 0) {
                    vm.downPaymentSource = downPaymentTypes[i].text;
                    return downPaymentTypes[i].text;
                }
            }
        }

        // popup logic
        function updateSectionVIIData(popupModel) {
            popupModel.financialInfo.mortgageAmount = popupModel.loanAmount;
            loanDetailsSvc.UpdateVIIPoupData.UpdateVIIPoupData({ loanId: wrappedLoan.ref.loanId }, popupModel).$promise.then(
            function (loan) {
                // after section seven update loan object, update reference to vm.wrappedLoan.ref
                // data from callback is also loan but there is a posibility that not all the functions from ts are there after update 
                // so we only update the reference to loan


                // todo - ensure that the 'active' loan application is maintained
                vm.wrappedLoan.ref = new cls.LoanViewModel(loan, $filter, applicationData.currentUser.isWholesale);

                costDetailsHelpers.initializeCostService(wrappedLoan);
                costDetailsHelpers.getCostDetailsData();

                // todo trigger and update for the calculator
                loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.todo, {});

            },
            function (error) {
                $log.error('Failure saving Loan Details data', error);
            });
            /*Notes.update({ id: $id }, note);*/
        };

        // show subordinate financing modal popover
        function showSubordinateFinancingDetailsModal(event, model) {
            refreshConcurrent2ndMortgageSection();
            var subordinateFinancingModal = modalPopoverFactory.openModalPopover('angular/loandetails/sections/sectionseven/subordinatefinancingdetails.html', this, vm.wrappedLoan.ref, event, {
                arrowRight: true, className: 'tooltip-arrow-right', verticalPopupPositionPerHeight: 0, horisontalPopupPositionPerWidth: 0.8333, refExtModelAndCtrl: true
            });
            subordinateFinancingModal.result.then(function (data) {
                //data.monthlyPayment = calculateMonthlyPayment(data.loanAmount, data.interestRate, data.termInMonths)
                vm.wrappedLoan.ref.subordinateFinancingDetails.monthlyPayment = data.subordinateFinancingDetails.monthlyPayment;
                vm.wrappedLoan.ref.subordinateFinancingDetails.loanAmount = data.subordinateFinancingDetails.loanAmount;
                vm.wrappedLoan.ref.subordinateFinancingDetails.secondMortgageType = data.subordinateFinancingDetails.secondMortgageType;
                vm.wrappedLoan.ref.subordinateFinancingDetails.creditLineCap = data.subordinateFinancingDetails.creditLineCap;
                vm.wrappedLoan.ref.subordinateFinancingDetails.interestRate = data.subordinateFinancingDetails.interestRate;
                vm.wrappedLoan.ref.subordinateFinancingDetails.termInMonths = data.subordinateFinancingDetails.termInMonths;
                vm.wrappedLoan.ref.detailsOfTransaction.cashFromToBorrower = parseFloat(wrappedLoan.ref.detailsOfTransaction.cashFromToBorrower) - parseFloat(data.subordinateFinancingDetails.loanAmount) + parseFloat(wrappedLoan.ref.detailsOfTransaction.subordinateFinancing);
                //wrappedLoan.ref.detailsOfTransaction.cashToOrFromBorrowerDecimalVal = vm.detailsOfTransaction.castFromToBorrower;
                vm.cashFromBorrower = wrappedLoan.ref.detailsOfTransaction.cashFromToBorrower > 0;
                vm.wrappedLoan.ref.detailsOfTransaction.subordinateFinancing = data.subordinateFinancingDetails.loanAmount;
                vm.wrappedLoan.ref.housingExpenses.newSecondMtgPi = data.subordinateFinancingDetails.monthlyPayment;

                // todo - add contextual values
                loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.SubordinateFinancing, wrappedLoan.ref.subordinateFinancingDetails.monthlyPayment);

            });
        }

        function fundingFeeFinancedDetailsModal(event, model) {
            vm.maxAllowedFundingFeeAmount = vm.wrappedLoan.ref.detailsOfTransaction.pmiMipFundingFeeFinanced;

            if (getHudLineNumber() > 0)
            {
                var cost = getCost(getHudLineNumber());

                var financedFundingFeeModal = modalPopoverFactory.openModalPopover('angular/loandetails/sections/sectionseven/fundingfeefinanceddetails.html', { isAmountFinancedValid: vm.isAmountFinancedValid }, {
                    mortgageType: vm.wrappedLoan.ref.financialInfo.mortgageType, amountFinanced: vm.wrappedLoan.ref.detailsOfTransaction.pmiMipFundingFeeFinanced, costAmount: cost.amount, maxAllowedFundingFeeAmount: vm.maxAllowedFundingFeeAmount
                }, event, {
                    arrowRight: true, className: 'tooltip-arrow-right', verticalPopupPositionPerHeight: 0.035, horisontalPopupPositionPerWidth: 0.7655
                });
                financedFundingFeeModal.result.then(function (data) {
                    var cost = getCost(getHudLineNumber());
                    if (cost != null) {
                        cost.financedAmount = data.maxAllowedFundingFeeAmount;
                        vm.wrappedLoan.ref.otherInterviewData.usdaInformation.financedAmount = cost.financedAmount;
                    }

                    //Notify loan calculator to recalculate costs with new changes
                    loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.todo);
                });
            }
        }

        function isAmountFinancedValid(model)
        {
            var hudLineNumber = getHudLineNumber();

            if (hudLineNumber > 0) {
                var cost = getCost(hudLineNumber);

                if (model.maxAllowedFundingFeeAmount > cost.amount) {
                    model.maxAllowedFundingFeeAmount = cost.amount;
                    return;
                }
            }
            return;
        }

        function getHudLineNumber()
        {
            var hudLineNumber = -1;

            switch (wrappedLoan.ref.financialInfo.mortgageType)
            {
                case 1:
                    hudLineNumber = 902; //FHA
                    break;
                case 4:
                    hudLineNumber = 905; //VA
                    break;
                case 5:
                    hudLineNumber = 819; //USDA
                    break;
            }

            return hudLineNumber;
        }

        function getCost(hudLineNumber) {

            var cost = null;

            if (wrappedLoan.ref && wrappedLoan.ref.closingCost && wrappedLoan.ref.closingCost.costs) {
                lib.forEach(wrappedLoan.ref.closingCost.costs, function (costItem) {
                    if ((!costItem.originalHUDLineNumber || costItem.originalHUDLineNumber == 0) && costItem.hudLineNumber == hudLineNumber) {
                        cost = costItem;
                    }
                })
            } 

            return cost;
        }


        function calculateMonthlyPayment(loanAmount, interestRatePercent, termInMonths) {
            if (!loanAmount|| !interestRatePercent || !termInMonths)
                return 0;

            var monthlyInterestRate = (interestRatePercent / 100) / 12;

            var calc = (Math.pow((1 + monthlyInterestRate), termInMonths));

            var monthlyPayment = loanAmount * (monthlyInterestRate * calc) / (calc - 1);

            return Math.round(monthlyPayment * 10000) / 10000;
        }




        function downPaymentRules(model, keyword, skipLoanCalculatorCall) {

            // parse
            var purchasePrice = Number.isNaN(parseFloat(model.getSubjectProperty().purchasePrice)) ? 0 : parseFloat(model.getSubjectProperty().purchasePrice);
            var loanAmount = Number.isNaN(parseFloat(model.loanAmount)) ? 0 : parseFloat(model.loanAmount);
            var downPayment = Number.isNaN(parseFloat(model.downPayment)) ? 0 : parseFloat(model.downPayment);
            var downPaymentPercent = Number.isNaN(parseFloat(model.downPaymentPercent)) ? 0 : parseFloat(model.downPaymentPercent);

            // calculate         
            var result = commonCalculatorSvc.recalculateDownPayment(purchasePrice, loanAmount, downPayment, downPaymentPercent, 0, keyword);
            vm.wrappedLoan.ref.downPaymentAmount(result.downPayment);
            model.downPayment = vm.wrappedLoan.ref.downPaymentAmount();
            model.loanAmount = result.loanAmount;
            model.downPaymentPercent = result.downPaymentPercentage;
            //vm.wrappedLoan.ref.getSubjectProperty().purchasePrice = model.getSubjectProperty().purchasePrice = result.purchasePrice;

            //if (keyword == "PurchasePrice")
            //    loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.PurchasePrice, wrappedLoan.ref.getSubjectProperty().purchasePrice);
            //if (keyword == "LoanAmount")
            if (!skipLoanCalculatorCall)
                loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LoanAmount, wrappedLoan.ref.loanAmount);

        };

        function onCashoutChange() {
            wrappedLoan.ref.financialInfo.cashout = wrappedLoan.ref.financialInfo.cashOutAmount ? "1" : "0";
        }

        function getDownPaymentSourceText() {
            return wrappedLoan.ref.getSubjectProperty().getDownPaymentSourceText(wrappedLoan.ref.getSubjectProperty().downPaymentSource, wrappedLoan.ref.lookup.downPaymentSourcesTypes);
        }

        function getTotalForClosingDisclosure() {
            return Math.abs(vm.wrappedLoan.ref.detailsOfTransaction.cashFromToBorrower) + vm.wrappedLoan.ref.totalAggregateAdjustment;
        }

        function onConcurrent2ndMortgageChange(option) {
            switch (parseInt(option)) {
                case srv.Concurrent2ndMortgageEnum.No:
                    vm.concurrent2ndMortgageEnable = false;
                    vm.creditLineCapEnable = false;
                    vm.wrappedLoan.ref.subordinateFinancingDetails.loanAmount = null;
                    vm.wrappedLoan.ref.subordinateFinancingDetails.creditLineCap = null;
                    break;
                case srv.Concurrent2ndMortgageEnum.Fixed:
                    vm.concurrent2ndMortgageEnable = true;
                    vm.creditLineCapEnable = false;
                    vm.wrappedLoan.ref.subordinateFinancingDetails.creditLineCap = null;
                    break;
                case srv.Concurrent2ndMortgageEnum.HELOC:
                    vm.concurrent2ndMortgageEnable = true;
                    vm.creditLineCapEnable = true;
                    break;
            }
        }

        function refreshConcurrent2ndMortgageSection() {
            // Invoking onConcurrent2ndMortgageChange to refresh the Concurrent 2nd Mortgage section
            onConcurrent2ndMortgageChange(vm.wrappedLoan.ref.subordinateFinancingDetails.secondMortgageType);
        }
    }

})();