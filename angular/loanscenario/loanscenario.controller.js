(function () {
    'use strict';
    angular.module('loanScenario')
        .controller('loanScenarioController', loanScenarioController);

    loanScenarioController.$inject = ['$log', '$state', 'loanScenarioSvc', 'commonCalculatorSvc', 'wrappedLoan', 'loanEvent', 'NavigationSvc', 'enums', 'controllerData', 'applicationData',
        'commonModalWindowFactory', 'modalWindowType', 'anchorSmoothScroll', '$stateParams', 'propertySvc', 'commonService', 'costDetailsHelpers'];

    function loanScenarioController($log, $state, loanScenarioSvc, commonCalculatorSvc, wrappedLoan, loanEvent, NavigationSvc, enums, controllerData, applicationData,
        commonModalWindowFactory, modalWindowType, anchorSmoothScroll, $stateParams, propertySvc, commonService, costDetailsHelpers) {

        var vm = this;
        vm.wrappedLoan = wrappedLoan;
        vm.applicationData = applicationData;
        if ($stateParams.contextualBarTitle)
            NavigationSvc.contextualType = enums.ContextualTypes.ShopForRates;
        else
            NavigationSvc.contextualType = enums.ContextualTypes.LoanScenario;

        // controller properties - defaults
        vm.isLoanInformationSectionShown = true;
        vm.isSearchCriteriaSectionShown = true;
        vm.disableDecisionScoreDDL = false;
        vm.downPaymentPercent = null;
        vm.manualCashout = Boolean(controllerData.repricing);
        vm.dti = 40;
        vm.licencedStates = vm.wrappedLoan.ref.getLicencedStates(vm.applicationData);
        vm.concurrent2ndMortgageEnable = false;
        vm.creditLineCapEnable = false;

        // controller properties - resolved values
        vm.repricing = controllerData.repricing;
        vm.payOff2ndMortgageList = controllerData.payOff2ndMortgageList;
        vm.isTPO = controllerData.isWholesale;
        vm.pricingFicoScore = getLowestMiddleFicoScore();
        vm.firstMortgage = controllerData.firstMortgage;
        vm.secondMortgage = controllerData.secondMortgage;
        vm.forceDisableFirst = controllerData.forceDisableFirst;
        vm.forceDisableSecond = controllerData.forceDisableSecond;

        vm.otherInterviewData = angular.copy(wrappedLoan.ref.otherInterviewData);

        // TPO fields
        vm.brokerCompensationMaxAmount = controllerData.maxCompensation;
        vm.brokerCompensationMinAmount = controllerData.minCompensation;
        vm.defaultBrokerCompPercent = controllerData.brokerCompensationPercent;
        vm.defaultBrokerCompAmount = controllerData.brokerCompensationAmount;
        vm.showBrokerCompensationError = false;
        vm.validateBrokerCompensation = function () {
            vm.showBrokerCompensationError = vm.brokerCompensationError();
        };
        vm.brokerCompensationTotalAmount = function () {
            if (isNaN(parseFloat(vm.wrappedLoan.ref.otherInterviewData.brokerCompPercent)))
                vm.wrappedLoan.ref.otherInterviewData.brokerCompPercent = 0;
            if (isNaN(parseFloat(vm.wrappedLoan.ref.otherInterviewData.brokerCompAmount)))
                vm.wrappedLoan.ref.otherInterviewData.brokerCompAmount = 0;
            return (vm.wrappedLoan.ref.otherInterviewData.brokerCompPercent / 100) * (isNaN(parseFloat(vm.wrappedLoan.ref.loanAmount)) ? 0 : vm.wrappedLoan.ref.loanAmount) + parseFloat(vm.wrappedLoan.ref.otherInterviewData.brokerCompAmount);
        };
        vm.brokerCompensationError = function () {
            return (vm.brokerCompensationTotalAmount() > vm.brokerCompensationMaxAmount || vm.brokerCompensationTotalAmount() < vm.brokerCompensationMinAmount);
        };
        vm.onCompensationOptionChange = function () {
            if (vm.wrappedLoan.ref.otherInterviewData.selectedCompensationOption == 1) {
                vm.wrappedLoan.ref.otherInterviewData.brokerCompPercent = vm.defaultBrokerCompPercent;
                vm.wrappedLoan.ref.otherInterviewData.brokerCompAmount = vm.defaultBrokerCompAmount;
            }
        }

        //validationFields
        vm.validateForm = false;
        vm.purchasePriceBlur = false;
        vm.currentEstimatedValueBlur = false;
        vm.loanAmountBlur = false;
        vm.cashOutBlur = false;
        vm.downPaymentBlur = false;
        vm.dtiBlur = false;
        vm.exactDecisionScoreBlur = false;
        vm.secondBalanceBlur = false;
        vm.creditLineCapBlur = false;
        vm.firstBalanceBlur = false;
        vm.negativeDti = false;
        vm.highlightNegativeDti = false;

        // method declaration
        vm.calculateDti = calculateDti;
        vm.isDTINegative = isDTINegative;
        vm.openDTIAlert = openDTIAlert;
        vm.runCashoutRules = runCashoutRules;
        vm.collapseExpand = collapseExpand;
        vm.loanTypeSwitch = loanTypeSwitch;
        vm.onDownPaymentChange = onDownPaymentChange;
        vm.onDownPaymentPercentageChange = onDownPaymentPercentageChange;
        vm.onPurchasePriceChange = onPurchasePriceChange;
        vm.onLoanAmountChange = onLoanAmountChange;
        vm.onHomeBuyingTypeChange = onHomeBuyingTypeChange;
        vm.onFHAinformationChange = onFHAinformationChange;
        vm.onUSDAinformationChange = onUSDAinformationChange;
        vm.overrideDecisionScoreDDL = overrideDecisionScoreDDL;
        vm.onEstimatedValueChange = onEstimatedValueChange;
        vm.onSecondMortgageTypeChange = onSecondMortgageTypeChange;
        vm.onSecondBalanceChange = onSecondBalanceChange;
        vm.onCreditLineCapChange = onCreditLineCapChange;
        vm.onSecondMortgagePayoffTypeChange = onSecondMortgagePayoffTypeChange;
        vm.BindPayOff2ndMortgageDropDown = BindPayOff2ndMortgageDropDown;
        vm.onCurrentLoanOnSubjectPropertyChange = onCurrentLoanOnSubjectPropertyChange;
        vm.onIsVaUsedInPastChange = onIsVaUsedInPastChange;
        vm.onVAinformationChange = onVAinformationChange;
        vm.onCashOutChange = onCashOutChange;
        vm.onCashoutOptionChange = onCashoutOptionChange;
        vm.onReceivingVADisabilityBenefitsChange = onReceivingVADisabilityBenefitsChange;
        vm.searchCriteriaSelectDeselectAll = searchCriteriaSelectDeselectAll;
        vm.checkForSelectedSearchCriteria = checkForSelectedSearchCriteria;
        vm.onFirstBalanceBlur = onFirstBalanceBlur;
        vm.calculateETPCosts = calculateETPCosts;
        vm.onConcurrent2ndMortgageChange = onConcurrent2ndMortgageChange;
        vm.onDTIBlur = onDTIBlur;
        vm.shopForRates = shopForRates;
        vm.cancel = cancel;
        vm.saveLoan = saveLoan;
        vm.enableSave = enableSave;
        vm.anchorSmoothScroll = anchorSmoothScroll;
        vm.scrollToElement = scrollToElement;
        vm.validateLoanScenario = validateLoanScenario;
        vm.onOccupancyTypeChanged = onOccupancyTypeChanged;
        calculateETPCosts();
        initalizeFHAsection();
        initalizeVAsection();
        initalizeUSDAsection();

        refreshConcurrent2ndMortgageSection();

        function onOccupancyTypeChanged() {
            // accessing will create if not exists (lazy)
            vm.wrappedLoan.ref.getSubjectProperty().getNetRentalIncome();

            // broadcast
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.PropertyOccupancyTypeChanged, vm.wrappedLoan.ref.getSubjectProperty());
        }

        (function () {
            if (!vm.wrappedLoan.ref.otherInterviewData.brokerCompAmount && !vm.wrappedLoan.ref.otherInterviewData.brokerCompPercent) {
                vm.wrappedLoan.ref.otherInterviewData.brokerCompPercent = vm.defaultBrokerCompPercent;
                vm.wrappedLoan.ref.otherInterviewData.brokerCompAmount = vm.defaultBrokerCompAmount;
            }
            if (wrappedLoan.ref.loanAmount != 0) {
                onLoanAmountChange();

                if (wrappedLoan.ref.financialInfo.qualifyingDtiDu && wrappedLoan.ref.loanId) {
                    vm.dti = wrappedLoan.ref.financialInfo.qualifyingDtiDu;
                }
                else {
                    vm.dti = wrappedLoan.ref.financialInfo.dti;                    
                    
                }
                vm.negativeDti = vm.isDTINegative(vm.dti);
            };
        })();

        // REFACTORED

        function cancel() {
            if (vm.repricing) {
                wrappedLoan.ref.otherInterviewData = vm.otherInterviewData;
                $state.go('loanCenter.loan.loanDetails.sections');
            }
        };

        function saveLoan($event) {
            if (vm.enableSave()) {

                //Update DTI Value
                wrappedLoan.ref.financialInfo.dti = vm.dti;

                NavigationSvc.SaveAndUpdateWrappedLoan(applicationData.currentUserId, wrappedLoan, function (wrappedLoan) {

                    vm.onLoanAmountChange();
                    // Do not validate after Save
                    vm.loanAmountBlur = false

                    //Chash out drop down
                    wrappedLoan.ref.financialInfo.cashOut = (!wrappedLoan.ref.financialInfo.cashOutAmount || wrappedLoan.ref.financialInfo.cashOutAmount == '0') ? '0' : '1';

                });

            }
            else
                $event.stopPropagation();
        };

        function scrollToElement(selector) {
            var fieldToScroll = document.querySelector(selector);

            if (fieldToScroll && vm.anchorSmoothScroll) {
                vm.anchorSmoothScroll(selector, 200);
                //fieldHasError.focus && fieldHasError.focus();
            }
        }

        function enableSave() {
            if ((vm.wrappedLoan.canSave() && vm.wrappedLoan.ref.active.getBorrower().firstName && vm.wrappedLoan.ref.active.getBorrower().lastName) ||
                                    vm.wrappedLoan.ref.active.getBorrower().userAccount.username)
                return true;

            return false;
        };

        function validateLoanScenario() {
            // flag for validation on UI, if all required fields are filled don't show validation class
            vm.validateForm = false;

            // Validation rules
            if ((wrappedLoan.ref.otherInterviewData.selectedDecisionScoreRange == -1 && !wrappedLoan.ref.financialInfo.ficoScore) ||
                !wrappedLoan.ref.getSubjectProperty().zipCode || !wrappedLoan.ref.loanAmount || wrappedLoan.ref.loanAmount == '0')
                vm.validateForm = true;

            else if (wrappedLoan.ref.loanPurposeType == 2) {
                if ((!wrappedLoan.ref.getSubjectProperty().currentEstimatedValue || wrappedLoan.ref.getSubjectProperty().currentEstimatedValue == '0') ||
                    (wrappedLoan.ref.financialInfo.cashOut == '1' && (!wrappedLoan.ref.financialInfo.cashOutAmount || wrappedLoan.ref.financialInfo.cashOutAmount == '0')) ||
                    (wrappedLoan.ref.otherInterviewData.existingSecondMortgage != '0' && !wrappedLoan.ref.otherInterviewData.outstandingBalance) ||
                    (wrappedLoan.ref.otherInterviewData.existingSecondMortgage == '2' && !wrappedLoan.ref.otherInterviewData.maximumCreditLine)
                    || (!wrappedLoan.ref.otherInterviewData.firstMortgage && wrappedLoan.ref.otherInterviewData.firstMortgage != 0)
                    )
                    vm.validateForm = true;

            }
            else if (vm.wrappedLoan.ref.loanPurposeType == 1) {
                if ((!vm.wrappedLoan.ref.getSubjectProperty().purchasePrice || vm.wrappedLoan.ref.getSubjectProperty().purchasePrice == '0') ||
                    (vm.wrappedLoan.ref.otherInterviewData.selectedDTIOption == '1' &&
                        (vm.dti == '0%' || vm.dti == '0' || !vm.dti)))

                    vm.validateForm = true;
            }

            else if (vm.isTPO) {
                if (wrappedLoan.ref.otherInterviewData.selectedBuyoutOption == 0 && wrappedLoan.ref.otherInterviewData.selectedCompensationOption == 0) {
                    vm.validateBrokerCompensation();
                    if (vm.brokerCompensationError())
                        vm.validateForm = true;
                }
            }

            if (!vm.validateForm)
            {
                if (wrappedLoan.ref.vaInformation.isvaLoan) {
                    if (!wrappedLoan.ref.vaInformation.militaryService || wrappedLoan.ref.vaInformation.militaryService == '0'
                                    || !wrappedLoan.ref.vaInformation.militaryBranch || wrappedLoan.ref.vaInformation.militaryBranch == '0'
                                    || !wrappedLoan.ref.vaInformation.serviceStatus || wrappedLoan.ref.vaInformation.serviceStatus == '0')
                    {
                        vm.validateForm = true;
                    }
                }
                
                if (vm.creditLineCapEnable && (!wrappedLoan.ref.subordinateFinancingDetails.creditLineCap
                    || wrappedLoan.ref.subordinateFinancingDetails.creditLineCap == 0)) {
                    vm.validateForm = true;
                }
            }

            return vm.validateForm;

        }

        function shopForRates() {

            if (vm.negativeDti) {
                openDTIAlert();
                vm.highlightNegativeDti = true;
                return;
            }
            
            if (vm.validateLoanScenario && vm.validateLoanScenario()) {
                if (vm.wrappedLoan.ref.loanPurposeType == 1)
                    vm.scrollToElement && vm.scrollToElement('.imp-psection-purchasePrice');
                else if (!vm.wrappedLoan.ref.otherInterviewData.firstMortgage && vm.wrappedLoan.ref.otherInterviewData.firstMortgage != 0)
                    vm.scrollToElement && vm.scrollToElement('.imp-psection-firstMortgage');
                return;
            }

            if (wrappedLoan.ref.getSubjectProperty().purchaseDate && angular.isDate(wrappedLoan.ref.getSubjectProperty().purchaseDate))
                wrappedLoan.ref.getSubjectProperty().purchaseDate = moment(wrappedLoan.ref.getSubjectProperty().purchaseDate).format("MM/YYYY");

            if (wrappedLoan.ref.getSubjectProperty().stateName == "") {
                try {
                    wrappedLoan.ref.getSubjectProperty().stateName = applicationData.lookup.states.filter(function (e) { return e.value == wrappedLoan.ref.getSubjectProperty().stateId.toString() })[0].text;
                }
                catch (e) {
                    return;
                };
            };

            //occupancy type from subject property user in interview data
            wrappedLoan.ref.getSubjectProperty().occupancyType = wrappedLoan.ref.primary.occupancyType;

            if (wrappedLoan.ref.active.getBorrower()) {
                wrappedLoan.ref.active.getBorrower().userAccount.currentUserAccountId = applicationData.currentUserId;
            }
            
            wrappedLoan.ref.financialInfo.dti = vm.dti;
            wrappedLoan.ref.otherInterviewData.enableTPO = vm.isTPO;
            onFHAinformationChange(wrappedLoan.ref.otherInterviewData.fhaInformation.isfhaLoan);
            onUSDAinformationChange(wrappedLoan.ref.otherInterviewData.usdaInformation.isusdaLoan);

            commonModalWindowFactory.open({ type: modalWindowType.loader, message: 'Calculating Rates, Price and Fees...' });

            wrappedLoan.ref.prepareSave();

            loanScenarioSvc.loanScenario.shopForRates({ currentUserId: applicationData.currentUserId, sixPieces: wrappedLoan.ref.areSixPiecesAcquiredForAllLoanApplications() || (wrappedLoan.ref.closingCost && wrappedLoan.ref.closingCost.smartGFEId ? true : false) }, wrappedLoan.ref).$promise.then(function (data) {
                wrappedLoan.ref.pricingResults = data.pricingResults;
                wrappedLoan.ref.closingCost = data.closingCost;
                costDetailsHelpers.getCostDetailsData();
                for (var i = 0; i < vm.wrappedLoan.ref.getLoanApplications().length; i++) {
                    if (vm.wrappedLoan.ref.active.loanId == vm.wrappedLoan.ref.getLoanApplications()[i]) {
                        vm.wrappedLoan.ref.active.getBorrower().userAccount = new cls.UserAccountViewModel(data.transactionInfo.borrowers[0].userAccount);
                        vm.wrappedLoan.ref.active.getCoBorrower().userAccount = new cls.UserAccountViewModel(data.transactionInfo.borrowers[1].userAccount);
                    }
                    else {
                        vm.wrappedLoan.ref.getLoanApplications()[i].getBorrower().userAccount = new cls.UserAccountViewModel(data.transactionInfo.borrowers[2 * i].userAccount);
                        vm.wrappedLoan.ref.getLoanApplications()[i].getCoBorrower().userAccount = new cls.UserAccountViewModel(data.transactionInfo.borrowers[2 * i + 1].userAccount);
                    }
                }
                commonModalWindowFactory.close('close');
                var anyCosts = false;
                if (data.pricingResults.productListViewModel.eligibleProducts[0]) {
                    var firstProductNumberOfCosts = data.pricingResults.productListViewModel.eligibleProducts[0].costDetails.lenderCost.length +
                        data.pricingResults.productListViewModel.eligibleProducts[0].costDetails.prepaidCosts.length +
                        data.pricingResults.productListViewModel.eligibleProducts[0].costDetails.reservesCosts.length +
                        data.pricingResults.productListViewModel.eligibleProducts[0].costDetails.thirdPartyCosts.length;
                    anyCosts = firstProductNumberOfCosts !== 0;
                }

                if (data.pricingResults.productListViewModel.eligibleProducts[0] && !anyCosts) {
                    commonModalWindowFactory.open({ type: modalWindowType.error, message: 'We are unable to calculate your closing costs because we were unable to obtain current fees.' });
                }

                $state.go('loanCenter.loan.pricing', { 'repricing': vm.repricing }, { reload: false });


            }, function () {
                commonModalWindowFactory.close('close');
            });
        };

        function onCreditLineCapChange() {
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LoanAmount, wrappedLoan.ref.loanAmount);

            if (!vm.manualCashout)
                runCashoutRules();
            vm.creditLineCapBlur = true;
        };

        function onSecondBalanceChange() {
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LoanAmount, wrappedLoan.ref.loanAmount);

            if (!vm.manualCashout)
                runCashoutRules();
            vm.secondBalanceBlur = true;
        };

        function onSecondMortgagePayoffTypeChange() {
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LoanAmount, wrappedLoan.ref.loanAmount);

            if (!vm.manualCashout)
                runCashoutRules();

            configureConcurrent2ndMortgageSection();
        };

        function onCurrentLoanOnSubjectPropertyChange() {
            loanScenarioSvc.currentLoanOnSubjectPropertyChange(wrappedLoan.ref.vaInformation);
        };

        function onIsVaUsedInPastChange() {
            loanScenarioSvc.isVaUsedInPastChange(wrappedLoan.ref.vaInformation);
        };

        function onVAinformationChange() {
            if (!wrappedLoan.ref.vaInformation.isvaLoan) {
                wrappedLoan.ref.vaInformation.isCurrentLoanVA = false;
                wrappedLoan.ref.vaInformation.isVaUsedInPast = false;
                wrappedLoan.ref.vaInformation.vaLoanPaidOff = false;
                wrappedLoan.ref.vaInformation.disabilityBenefits = false;
            }
            else
                wrappedLoan.ref.vaInformation.includeVAFee = true;
        };

        function onReceivingVADisabilityBenefitsChange() {
            wrappedLoan.ref.vaInformation.includeVAFee = !wrappedLoan.ref.vaInformation.disabilityBenefits;
        };

        function collapseExpand(sectionName) {

            switch (sectionName) {
                case 'LoanInformationSection':
                    vm.isLoanInformationSectionShown = !vm.isLoanInformationSectionShown;
                    break;
                case 'SearchCriteriaSection':
                    vm.isSearchCriteriaSectionShown = !vm.isSearchCriteriaSectionShown;
                    break;
            }
        };

        function loanTypeSwitch(loantype) {

            switch (loantype) {
                case 'Purchase':
                    wrappedLoan.ref.loanPurposeType = 1;
                    wrappedLoan.ref.homeBuyingType = srv.HomeBuyingType.GetPreApproved;
                    vm.wrappedLoan.ref.getSubjectProperty().streetName = 'TBD';
                    break;
                case 'Refinance':
                    if (wrappedLoan.ref.homeBuyingType == srv.HomeBuyingType.GetPreApproved)
                        vm.wrappedLoan.ref.getSubjectProperty().streetName = null;
                    wrappedLoan.ref.loanPurposeType = 2;
                    vm.wrappedLoan.ref.getSubjectProperty().streetName = '';
                    break;
            }

            refreshConcurrent2ndMortgageSection();
        };

        function onPurchasePriceChange() {

            if (wrappedLoan.ref.loanPurposeType == 1) {
                // if purchase, run down payment rules
                vm.downPaymentPercent = loanScenarioSvc.ruleEngine.runDownPaymentRules(wrappedLoan, vm.downPaymentPercent, 'PurchasePrice');
            } else if (wrappedLoan.ref.loanPurposeType == 2) {
                // if refinance, run cashout rules
                if (!vm.manualCashout)
                    runCashoutRules();
            }

            // recalculate 
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.PurchasePrice, wrappedLoan.ref.getSubjectProperty().purchasePrice);

            // validate
            vm.purchasePriceBlur = true;
        };

        function onLoanAmountChange() {

            if (wrappedLoan.ref.loanPurposeType == 1) {
                // if purchase, run down payment rules
                vm.downPaymentPercent = loanScenarioSvc.ruleEngine.runDownPaymentRules(wrappedLoan, vm.downPaymentPercent, 'LoanAmount')
                calculateETPCosts();
            } else if (wrappedLoan.ref.loanPurposeType == 2) {
                // if refinance, run cashout rules
                if (!vm.manualCashout)
                    runCashoutRules();
                calculateETPCosts();
            }

            // recalculate
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LoanAmount, wrappedLoan.ref.loanAmount);

            // validate
            vm.loanAmountBlur = true;

        };

        function onDownPaymentChange() {

            // run down payment rules
            vm.downPaymentPercent = loanScenarioSvc.ruleEngine.runDownPaymentRules(wrappedLoan, vm.downPaymentPercent, 'DownPayment');

            // recalculate
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LoanAmount, wrappedLoan.ref.loanAmount);

        };

        function onDownPaymentPercentageChange() {

            // run down payment rules
            vm.downPaymentPercent = loanScenarioSvc.ruleEngine.runDownPaymentRules(wrappedLoan, vm.downPaymentPercent, 'DownPaymentPercentage');

            // recalculate
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LoanAmount, wrappedLoan.ref.loanAmount);
        };

        function onDTIBlur(dti) {
            vm.negativeDti = vm.isDTINegative(dti);
            vm.dtiBlur = true;
        }

        function onEstimatedValueChange() {

            // recalculate
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.EstimatedValue, wrappedLoan.ref.getSubjectProperty().currentEstimatedValue);

            // validate
            vm.currentEstimatedValueBlur = true;
        };

        function onCashoutOptionChange() {
            vm.manualCashout = true;

            if (!vm.manualCashout) { // redundant piece of logic for probable future update
                if (wrappedLoan.ref.financialInfo.cashOut == "0") {
                    wrappedLoan.ref.financialInfo.cashOutAmount = 0;
                }
                runCashoutChange();
            }

        };

        function onCashOutChange() {
            vm.manualCashout = true;

            wrappedLoan.ref.financialInfo.cashOut = wrappedLoan.ref.financialInfo.cashOutAmount > 0 ? "1" : "0";
            vm.cashOutBlur = true;

            if (!vm.manualCashout) { // redundant piece of logic for probable future update
                runCashoutChange();
            }
        };

        function onSecondMortgageTypeChange(secondMortgageType) {
            BindPayOff2ndMortgageDropDown(secondMortgageType);
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LoanAmount, wrappedLoan.ref.loanAmount);

            if (!vm.manualCashout)
                runCashoutRules();

            configureConcurrent2ndMortgageSection();
        };

        function onHomeBuyingTypeChange(item) {
            vm.wrappedLoan.ref.getSubjectProperty().streetName = (item == '3' ? 'TBD' : '');

        };

        function onFirstBalanceBlur() {
            vm.firstBalanceBlur = true;

            if (!vm.manualCashout)
                vm.runCashoutRules()
        }

        //Update FHA item. 
        //This item needs to be updated because of filer on ProductResult page.
        function onFHAinformationChange(fhaValue) {

            angular.forEach(vm.wrappedLoan.ref.otherInterviewData.searchCriteria.loanTypeList, function (item) {
                if (item.name == "FHA")
                    item.value = fhaValue;
            });

        };

        function onUSDAinformationChange(usdaValue) {
            angular.forEach(vm.wrappedLoan.ref.otherInterviewData.searchCriteria.loanTypeList, function (item) {
                if (item.name == "USDA")
                    item.value = usdaValue;
            });
        }

        function deSelectAll(list, value, isARMFixedTerms) {
            if (list == null || list.length == 0)
                return;

            angular.forEach(list, function (item) {
                //Do not check/uncheck FHA option (there is separate section for FHA loans)
                if (item.name != "FHA")
                    item.value = value;
            });
            if (value == false && !isARMFixedTerms) {
                list[0].value = !value;
            }
        }

        function searchCriteriaSelectDeselectAll(value) {
            deSelectAll(wrappedLoan.ref.otherInterviewData.searchCriteria.loanTypeList, value);
            deSelectAll(wrappedLoan.ref.otherInterviewData.searchCriteria.amortizationTypeList, value);
            deSelectAll(wrappedLoan.ref.otherInterviewData.searchCriteria.loanTermsList, value);
            deSelectAll(wrappedLoan.ref.otherInterviewData.searchCriteria.armTermsList, value, true);
        };


        function calculateDti() {

            if (wrappedLoan.ref.otherInterviewData.selectedDTIOption == "1") {
                return;
            }

            var coBorrowerIncomeAmount = 0;
            if (vm.isSpouseOnTheLoanSelected === true) {
                coBorrowerIncomeAmount = wrappedLoan.ref.otherInterviewData.coBorrowerIncome;
            }

            var DTI = commonCalculatorSvc.calculateDti(wrappedLoan.ref.otherInterviewData.monthlyDebt, wrappedLoan.ref.otherInterviewData.borrowerIncome, wrappedLoan.ref.otherInterviewData.selectedBorrowerIncomeType, coBorrowerIncomeAmount, wrappedLoan.ref.otherInterviewData.selectedCoBorrowerIncomeType);
            wrappedLoan.ref.financialInfo.dti = DTI.dti;
            vm.dti = DTI.dti;
            vm.negativeDti = vm.isDTINegative(vm.dti);

        };

        function BindPayOff2ndMortgageDropDown(secondMortgageType) {

            vm.payOff2ndMortgageList = applicationData.lookup.secondMortgageInsurancePayOffTypes.slice();

            if (secondMortgageType == "0" || secondMortgageType == "1") {
                angular.forEach(vm.payOff2ndMortgageList, function (val, key) {
                    //Remove "Payoff and don''t close account" item from list
                    //Remove "Payoff and close account" item from list
                    if (val.value == "3") {
                        vm.payOff2ndMortgageList.splice(key, 2);
                    }

                })
            }
            else if (secondMortgageType == "2") {
                vm.payOff2ndMortgageList = applicationData.lookup.secondMortgageInsurancePayOffTypes.slice();
                angular.forEach(vm.payOff2ndMortgageList, function (val, key) {
                    //Remove "Payoff at closing" item from list
                    if (val.value == "2") {
                        vm.payOff2ndMortgageList.splice(key, 1);
                    }

                })
            }

            wrappedLoan.ref.otherInterviewData.secondMortgageRefinanceComment = "1";

        };

        function runCashoutRules() {
            wrappedLoan.ref.fhaCountyLoanLimit = commonService.getFHAOrVALoanLimit(applicationData.fhaLoanLimits, wrappedLoan.ref.getSubjectProperty().stateName, wrappedLoan.ref.getSubjectProperty().countyName, wrappedLoan.ref.getSubjectProperty().numberOfUnits);
            /* if (wrappedLoan.ref.loanPurposeType == 1) {
                return;
            }

            var payingOffSecondMortgage = false;
            var loanAmountValue = vm.wrappedLoan.ref.loanAmount;
            var firstMortgage = vm.wrappedLoan.ref.otherInterviewData.firstMortgage;
            if (firstMortgage == undefined || firstMortgage == null) {
                firstMortgage = 0;
            }
            var existingSecondMortgage = "0";  // enum: ExistingSecondMortgage
            var secondMortgagePayoffType = "0"; // enum: RefinanceComment
            var existingMortgagesAmount = 0; // Calculate total existing mortgages amount
            var rcbRefExistingSecondMortgage = wrappedLoan.ref.otherInterviewData.existingSecondMortgage;
            if (rcbRefExistingSecondMortgage != null && rcbRefExistingSecondMortgage != undefined) {
                existingSecondMortgage = rcbRefExistingSecondMortgage;
        }
            
            var secondMortgageOutstandingBalance = 0;
            var refOutstandingBalance = wrappedLoan.ref.otherInterviewData.outstandingBalance;
            var maximumCreditLine = "0";
            var rcbRef2ndMortgageInfo = "-1";//???
            var withdrawnFromHelocInLast12Months = false;

            if (wrappedLoan.ref.otherInterviewData.existingSecondMortgage != "0") {

                var rcbRefSecondMortgagePayoffType = wrappedLoan.ref.otherInterviewData.secondMortgageRefinanceComment;
                if (rcbRefSecondMortgagePayoffType != null && rcbRefSecondMortgagePayoffType != undefined) {
                    secondMortgagePayoffType = rcbRefSecondMortgagePayoffType;
            }

                if (refOutstandingBalance != null && refOutstandingBalance != undefined) {
                    secondMortgageOutstandingBalance = refOutstandingBalance;
            }


                if (wrappedLoan.ref.otherInterviewData.existingSecondMortgage == "2") {
                    if (wrappedLoan.ref.otherInterviewData.maximumCreditLine != null && wrappedLoan.ref.otherInterviewData.maximumCreditLine != undefined) {
                        maximumCreditLine = wrappedLoan.ref.otherInterviewData.maximumCreditLine;
                }

                    var heSelected = wrappedLoan.ref.otherInterviewData.overThousandWithdrawnFromHeloc;
                    if (heSelected == "1") {
                        withdrawnFromHelocInLast12Months = true;
                }
                } else if (wrappedLoan.ref.otherInterviewData.existingSecondMortgage == "1" && wrappedLoan.ref.otherInterviewData.secondMortgageRefinanceComment == "1") {
                    rcbRef2ndMortgageInfo = wrappedLoan.ref.otherInterviewData.whenWasSecondOpened;
            }
        }



       
            // If there is a second, and it is Payoff calculate total of first and second (heloc and fixed)
            if (existingSecondMortgage != "0" && existingSecondMortgage != "-1" && (secondMortgagePayoffType == "2" || secondMortgagePayoffType == "3" || secondMortgagePayoffType == "4")) {
                existingMortgagesAmount = parseFloat(firstMortgage) + parseFloat(secondMortgageOutstandingBalance);
                payingOffSecondMortgage = true;
            }
            else {
                existingMortgagesAmount = firstMortgage;
        }

            
            

            var estimatedValueOfProperty = wrappedLoan.ref.getSubjectProperty().purchasePrice;
            var rcbNumberOfUnitsCount = wrappedLoan.ref.getSubjectProperty().numberOfUnits;
            var rcbPropertyCounty = wrappedLoan.ref.getSubjectProperty().countyName;
            var txtRefPurchaseDate = wrappedLoan.ref.getSubjectProperty().purchaseDate;
            var state = wrappedLoan.ref.getSubjectProperty().stateName;
            // Calculate total existing mortgages amount

            if (loanAmountValue == null || loanAmountValue == 0)
                 return;

            var secondMortgageComment = secondMortgagePayoffType;
            

            if (secondMortgagePayoffType == null || secondMortgagePayoffType == "") {
                secondMortgageComment = -1;
        }



            // If new wrappedLoan.ref less than existing mortgages, display payoff message
            if (parseFloat(loanAmountValue) >= parseFloat(existingMortgagesAmount)) {


                var cashOutObject = {
                        secondMortgageInfo: rcbRef2ndMortgageInfo,
                        withdrawnFromHelocInLast12Months: withdrawnFromHelocInLast12Months,
                        payingOffSecondMortgage: payingOffSecondMortgage,
                        secondMortgageAmortizationType: existingSecondMortgage,
                        countyName: rcbPropertyCounty,
                        numberOfUnits: rcbNumberOfUnitsCount,
                        newLoanAmount: loanAmountValue,
                        existingMortgagesAmount: existingMortgagesAmount,
                        propertyValue: estimatedValueOfProperty,
                        outstandingBalance: secondMortgageOutstandingBalance,
                        comment: secondMortgageComment,//RefinanceComment
                        purchaseDate: txtRefPurchaseDate,
                        firstMortgage: firstMortgage,
                        maxCreditLine: maximumCreditLine,
                    state: state
            };

                commonCalculatorSvc.calculateCashOut.CalculateCashOut({}, cashOutObject).$promise.then(
                function (data) {
                    wrappedLoan.ref.financialInfo.cashOutAmount = data.CashoutAmount;
                    if (data.CashoutAmount > 0) {
                        wrappedLoan.ref.financialInfo.cashOut = "1";
                    } else {
                        wrappedLoan.ref.financialInfo.cashOut = "0";
                }
                },
                function (error) {
                    $log.error('Failure calculating Hcltv', error);
            });
        }

        */
        };

        function runCashoutChange() {


            /* var payingOffSecondMortgage = false;
            var loanAmountValue = vm.wrappedLoan.ref.loanAmount;
            var firstMortgage = vm.wrappedLoan.ref.otherInterviewData.firstMortgage;
            if (firstMortgage == undefined || firstMortgage == null) {
                firstMortgage = 0;
            }
            var existingSecondMortgage = "0";  // enum: ExistingSecondMortgage
            var secondMortgagePayoffType = "0"; // enum: RefinanceComment
            var existingMortgagesAmount = 0; // Calculate total existing mortgages amount
            var rcbRefExistingSecondMortgage = wrappedLoan.ref.otherInterviewData.existingSecondMortgage;
            if (rcbRefExistingSecondMortgage != null && rcbRefExistingSecondMortgage != undefined) {
                existingSecondMortgage = rcbRefExistingSecondMortgage;
            }
            
            var secondMortgageOutstandingBalance = 0;
            var refOutstandingBalance = wrappedLoan.ref.otherInterviewData.outstandingBalance;
            var maximumCreditLine = "0";
            var rcbRef2ndMortgageInfo = "-1";//???
            var withdrawnFromHelocInLast12Months = false;

            if (wrappedLoan.ref.otherInterviewData.existingSecondMortgage != "0") {

                var rcbRefSecondMortgagePayoffType = wrappedLoan.ref.otherInterviewData.secondMortgageRefinanceComment;
                if (rcbRefSecondMortgagePayoffType != null && rcbRefSecondMortgagePayoffType != undefined) {
                    secondMortgagePayoffType = rcbRefSecondMortgagePayoffType;
            }

                if (refOutstandingBalance != null && refOutstandingBalance != undefined) {
                    secondMortgageOutstandingBalance = refOutstandingBalance;
            }


                if (wrappedLoan.ref.otherInterviewData.existingSecondMortgage == "2") {
                    if (wrappedLoan.ref.otherInterviewData.maximumCreditLine != null && wrappedLoan.ref.otherInterviewData.maximumCreditLine != undefined) {
                        maximumCreditLine = wrappedLoan.ref.otherInterviewData.maximumCreditLine;
                }

                    var heSelected = wrappedLoan.ref.otherInterviewData.overThousandWithdrawnFromHeloc;
                    if (heSelected == "1") {
                        withdrawnFromHelocInLast12Months = true;
                }
                } else if (wrappedLoan.ref.otherInterviewData.existingSecondMortgage == "1" && wrappedLoan.ref.otherInterviewData.secondMortgageRefinanceComment == "1") {
                    rcbRef2ndMortgageInfo = wrappedLoan.ref.otherInterviewData.whenWasSecondOpened;
            }
        }



       
            // If there is a second, and it is Payoff calculate total of first and second (heloc and fixed)
            if (existingSecondMortgage != "0" && existingSecondMortgage != "-1" && (secondMortgagePayoffType == "2" || secondMortgagePayoffType == "3" || secondMortgagePayoffType == "4")) {
            existingMortgagesAmount = parseFloat(firstMortgage) + parseFloat(secondMortgageOutstandingBalance);
                payingOffSecondMortgage = true;
            }
            else {
                existingMortgagesAmount = firstMortgage;
        }

            
            

            
            var estimatedValueOfProperty = wrappedLoan.ref.getSubjectProperty().purchasePrice;
            var rcbNumberOfUnitsCount = wrappedLoan.ref.getSubjectProperty().numberOfUnits;
            var rcbPropertyCounty = wrappedLoan.ref.getSubjectProperty().countyName;
            var txtRefPurchaseDate = wrappedLoan.ref.getSubjectProperty().purchaseDate;
            var state = wrappedLoan.ref.getSubjectProperty().stateName;
            // Calculate total existing mortgages amount

        if (loanAmountValue == null || loanAmountValue == 0)
                return;

            var secondMortgageComment = secondMortgagePayoffType;
            

            if (secondMortgagePayoffType == null || secondMortgagePayoffType == "") {
                secondMortgageComment = -1;
        }
            // Calculate total existing mortgages amount
        
            var cashoutValue = wrappedLoan.ref.financialInfo.cashOutAmount;

            // Calculate total existing mortgages amount
            

            var cashOutObject = {
                    secondMortgageInfo: rcbRef2ndMortgageInfo,
                    withdrawnFromHelocInLast12Months: withdrawnFromHelocInLast12Months,
                    payingOffSecondMortgage: payingOffSecondMortgage,
                    secondMortgageAmortizationType: existingSecondMortgage,
                    countyName: rcbPropertyCounty,
                    numberOfUnits: rcbNumberOfUnitsCount,
                    newLoanAmount: loanAmountValue,
                    existingMortgagesAmount: existingMortgagesAmount,
                    propertyValue: estimatedValueOfProperty,
                    outstandingBalance: secondMortgageOutstandingBalance,
                    comment: secondMortgageComment,//RefinanceComment
                    purchaseDate: txtRefPurchaseDate,
                    firstMortgage: firstMortgage,
                    maxCreditLine: maximumCreditLine,
                state: state,
                    cashoutValue: cashoutValue

        };

            commonCalculatorSvc.calculateCashOutChange.CalculateCashOutChange({}, cashOutObject).$promise.then(
                               function (data) {
                                   wrappedLoan.ref.loanAmount = data.result;
                                   loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LoanAmount, wrappedLoan.ref.loanAmount);
                },
                               function (error) {
                                   $log.error('Failure calculating Hcltv', error);
            });

            
        */
        };

        function overrideDecisionScoreDDL(item) {
            if (item > 0) {
                wrappedLoan.ref.otherInterviewData.selectedDecisionScoreRange = -1;
                vm.disableDecisionScoreDDL = true;
            }
            else {
                vm.disableDecisionScoreDDL = false;
                vm.exactDecisionScoreBlur = true;
            }
        };


        function checkForSelectedSearchCriteria(event, item, list, isARMFixedTerms) {
            if (!item.value && !isARMFixedTerms) {
                var isAnyItemSelected = _.find(list, function (itemInList) { return itemInList.value });
                if (!isAnyItemSelected) {
                    event.preventDefault();
                }
                else if (item.name == "ARM") {
                    deSelectAll(vm.wrappedLoan.ref.otherInterviewData.searchCriteria.armTermsList, item.value, true);
                }
            }
            else if (item.name.indexOf("HARP") > -1) {
                disableHARP(item.name)
            }
        }

        function disableHARP(clickedItem) {
            for (var item in vm.wrappedLoan.ref.otherInterviewData.searchCriteria.loanTypeList) {
                if (vm.wrappedLoan.ref.otherInterviewData.searchCriteria.loanTypeList[item].name != clickedItem && vm.wrappedLoan.ref.otherInterviewData.searchCriteria.loanTypeList[item].name.indexOf("HARP") > -1)
                    vm.wrappedLoan.ref.otherInterviewData.searchCriteria.loanTypeList[item].value = false;
            }
        }

        function calculateETPCosts() {

            var ddlOption = vm.wrappedLoan.ref.otherInterviewData.selectedETPCOption;
            var loanAmount = parseFloat(vm.wrappedLoan.ref.loanAmount);
            var etpcPercent = vm.wrappedLoan.ref.otherInterviewData.percentETPCValue;
            var etpcValue = (etpcPercent / 100) * loanAmount;
            switch (ddlOption) {

                case '0':
                    vm.wrappedLoan.ref.otherInterviewData.disclaimerETPCValue = etpcValue;
                    break;
                case '1':
                    break;
                case '2':
                    break;
            }


        }

        function getLowestMiddleFicoScore() {
            var midFicoScore = commonCalculatorSvc.GetLowestMiddleFicoScore(vm.wrappedLoan, vm.applicationData);

            return midFicoScore;
        }

        function initalizeFHAsection() {

            wrappedLoan.ref.otherInterviewData.fhaInformation.isFinanceUfmip = setFlagIncludeInLoanAmount(902, wrappedLoan.ref.otherInterviewData.fhaInformation.isFinanceUfmip);
        }

        function initalizeVAsection() {

            wrappedLoan.ref.vaInformation.includeVAFee = setFlagIncludeInLoanAmount(905, wrappedLoan.ref.vaInformation.includeVAFee);
                
        }


        function initalizeUSDAsection() {

            wrappedLoan.ref.otherInterviewData.usdaInformation.addUSDAGFeeToLoanAmount = setFlagIncludeInLoanAmount(819, wrappedLoan.ref.otherInterviewData.usdaInformation.addUSDAGFeeToLoanAmount);
            
        }

        function setFlagIncludeInLoanAmount(hudLineNumber, flag) {
            var cost = getCost(hudLineNumber);

            if(cost && cost.financedAmount > 0) {
                   flag = true;
            } else if (cost && cost.financedAmount == 0) {
                   flag = false;
            }

            return flag;
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

        function configureConcurrent2ndMortgageSection() {
            switch (vm.wrappedLoan.ref.loanPurposeType) {
                case enums.LoanTransactionTypes.Refinance:
                    vm.wrappedLoan.ref.subordinateFinancingDetails.secondMortgageType = srv.Concurrent2ndMortgageEnum.No;
                    refreshConcurrent2ndMortgageSection();
                    break;
                case enums.LoanTransactionTypes.Purchase:
                    refreshConcurrent2ndMortgageSection();
                    break;
            }            
        }

        function refreshConcurrent2ndMortgageSection() {
            // Invoking onConcurrent2ndMortgageChange to refresh the Concurrent 2nd Mortgage section
            onConcurrent2ndMortgageChange(vm.wrappedLoan.ref.subordinateFinancingDetails.secondMortgageType);
        }

        function isDTINegative(dti) {
            return dti < 0 ? true : false;            
        }

        function openDTIAlert() {
            commonModalWindowFactory.open({
                type: modalWindowType.success, message: "This loan cannot be priced with a negative DTI.",
                messageDetails: "Please correct your search criteria and try again.",
                messageClass: 'loan-scenario-negative-dti-modal'
                
            });
        }
    };
})();
