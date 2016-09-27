(function () {
    'use strict';

    // directive for loading incomeinformation, regular or military
    angular.module('loanApplication').directive('incomeInformation', incomeInformation);

    incomeInformation.$inject = ['enums', 'loanEvent'];

    function incomeInformation(enums, loanEvent) {
        //  Usage:
        //  <income-information incomeInfoList="incomeInfoCollection"       
        //  is-disabled=""
        //  amount-periods=""></income-information>

        var directive = {
            scope: {
                'employmentInfo': '=',
                'isDisabled': '=',
                'amountPeriods': '=',
                'areSixPiecesAcquired': '=',
                'wrappedLoan': '=?'
            },
            controller: controller,
            controllerAs: 'incomeInformation',
            bindToController: true,
            restrict: 'E',
            templateUrl: 'angular/loanapplication/income/incomeinformation.html'
        };

        return directive;

        function controller() {
            var vm = this;

            vm.enums = enums;

            vm.validateIncome = validateIncome;
            vm.disableIncomeTypes = disableIncomeTypes;
            vm.onIncomeAmountChanged = onIncomeAmountChanged;
            vm.onIncomePeriodChanged = onIncomePeriodChanged;
            vm.validateBaseOrPartSalary = validateBaseOrPartSalary;
            vm.checkIfSixPiecesAreAcquired = checkIfSixPiecesAreAcquired;

            function validateIncome(income) {
                disableIncomeTypes();
                if (String(income.amount).trim() == "-")
                    income.amount = 0;
            }

            function checkIfSixPiecesAreAcquired() {
                if (vm.wrappedLoan && typeof vm.wrappedLoan.ref.areSixPiecesAcquiredForAllLoanApplications == "function")
                    vm.wrappedLoan.ref.areSixPiecesAcquiredForAllLoanApplications();
            }

            function onIncomeAmountChanged(incomeInfoItem) {
                loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.IncomeAmountChanged, incomeInfoItem);
            }

            function onIncomePeriodChanged(incomeInfoItem) {
                loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.IncomePeriodChanged, incomeInfoItem);
            }

            function disableIncomeTypes() {
                if (vm.employmentInfo.EmploymentTypeId == 2) {
                    var baseIncome = getIncome(16);
                } else {
                    var baseIncome = getIncome(0);
                }

                var partTimeIncome = getIncome(13);

                if (!toggleIncome(baseIncome, partTimeIncome))
                    toggleIncome(partTimeIncome, baseIncome);
            }

            /**
            * @desc Disables target income if source income has amount != 0. Else enables target income
            * Returns true if target has been disabled.
            */
            function toggleIncome(sourceIncome, targetIncome) {
                var isTargetIncomeDisabled = false;
                if (sourceIncome && sourceIncome.amount != 0 && targetIncome)
                    isTargetIncomeDisabled = disableIncome(targetIncome);
                else
                    isTargetIncomeDisabled = enableIncome(targetIncome);

                return isTargetIncomeDisabled;
            }
            
            /**
            * @desc Disables income.
            */
            function disableIncome(income) {
                if (!income)
                    return false;

                income.amount = 0;
                income.incomeTypeDisabled = true;
                return true;
            }

            /**
            * @desc Enables income.
            */
            function enableIncome(income) {
                if (!income)
                    return;

                income.incomeTypeDisabled = false;
            }

            /**
            * @desc Gets first income from income collection by specified type.
            */
            function getIncome(incomeType){
                if (vm.employmentInfo && vm.employmentInfo.incomeInformationCollection && vm.employmentInfo.incomeInformationCollection.length > 0)
                var incomes = vm.employmentInfo.incomeInformationCollection.filter(function (incomeInfoItem) {
                    return incomeInfoItem.incomeTypeId == incomeType;
                });

                if (incomes && incomes.length > 0)
                    return incomes[0];
            }
            // @todo: replace incomeinfo typeId with enum
            //13 - part time, 0 - salaried employee base salary,  16 - self employed base salary
            function validateBaseOrPartSalary(incomeInfoItem) {
                if (!(vm.areSixPiecesAcquired && incomeInfoItem && !incomeInfoItem.amount)) return false;
                
                switch (incomeInfoItem.incomeTypeId) {
                    case 0:
                    case 16:
                        var partTimeIncome = vm.employmentInfo.incomeInfoByTypeId(13);
                        return partTimeIncome && !partTimeIncome.amount;
                    case 13:
                        var slariedBaseSalaryIncome = vm.employmentInfo.incomeInfoByTypeId(0);
                        var selfEmployedBaseSalaryIncome = vm.employmentInfo.incomeInfoByTypeId(16);
                        return (slariedBaseSalaryIncome && !slariedBaseSalaryIncome.amount || selfEmployedBaseSalaryIncome && !selfEmployedBaseSalaryIncome.amount);
                }
            }
        }
    }


    // directive for loading employment info (current employment info or additional employment info) for Borrower/CoBorrower
    angular.module('loanApplication').directive('employmentInfo', employmentInfo);

    employmentInfo.$inject = ['enums', 'incomeService', 'loanEvent'];

    function employmentInfo(enums, incomeService, loanEvent) {

        var directive = {
            scope: {
                'borrowerWithInfo': '=',
                'defaultMilitaryIncomeInfoList': '=',
                'defaultRegularIncomeInfoList': '=',
                'isDisabled': '=',
                'isAdditionalEmpInfo': '=',
                'dropDownLists': '=',
                'areSixPiecesAcquired': '=',
                'wrappedLoan': '=?',
                'onYearsOnThisJobChangedFn': '&',
                'removeEmploymentInfoFn': '&',
            },
            controller: controller,
            controllerAs: 'employmentInfo',
            bindToController: true,
            restrict: 'E',
            template: '<ng-include src="employmentInfo.getTemplateUrl()"/>'
        };

        return directive;

        function controller($timeout) {
            var vm = this;
            var ddls = vm.dropDownLists;

            vm.enums = enums;

            vm.additionalEmploymentTypes = ddls.additionalEmploymentTypes;
            vm.amountPeriods = ddls.paymentPeriodOptions;
            vm.branches = ddls.branchOfService;
            vm.employmentStatuses = ddls.employmentStatuses;
            vm.employmentTypes = ddls.employmentTypes;

            vm.isMilitary = false;
            vm.isRetired = false;
            vm.isOtherUnemployed = false;
            vm.isRetiredOrUnemployed = false;

            vm.yearsText = '';
            vm.positionDescription = '';

            // Methods
            vm.additionalEmploymentTypeChanged = additionalEmploymentTypeChanged;         
            vm.employmentStatusChanged = employmentStatusChanged;
            vm.employmentTypeChanged = employmentTypeChanged;
            vm.getTemplateUrl = getTemplateUrl;
            vm.onYearsOnThisJobChanged = onYearsOnThisJobChanged;
            vm.removeEmploymentInfo = removeEmploymentInfo;
            vm.validateEmploymentStartAndRetiredDate = validateEmploymentStartAndRetiredDate;
            vm.validateIsSalariedOrSelfEmployed = validateIsSalariedOrSelfEmployed;
            vm.validateIsActiveMilitaryDuty = validateIsActiveMilitaryDuty;
            vm.validateIsSalariedOrSelfEmployedAdditional = validateIsSalariedOrSelfEmployedAdditional;

            setData();

            function setData() {
                setEmploymentTypeFlags();
                setSpanValues();
            }
         
            function setEmploymentTypeFlags() {
                if (vm.borrowerWithInfo == null)
                    return;
                var empTypeId = vm.borrowerWithInfo.getCurrentEmploymentInfo().EmploymentTypeId;

                // @todo: Review to see if we can go directly => getCurrentEmploymentInfo()
                //      Or , better yet use a get/set property
                vm.isMilitary = empTypeId == enums.employmentType.activeMilitaryDuty;

                vm.isRetired = empTypeId == enums.employmentType.retired;
                vm.isOtherUnemployed = empTypeId == enums.employmentType.otherUnemployed;
                vm.isRetiredOrUnemployed = vm.isRetired || vm.isOtherUnemployed;
            }

            function setSpanValues() {
                vm.yearsText = vm.isRetired ? 'Retirement Date' : 'Years on this job';
                vm.positionDescription = vm.isMilitary ? 'Rank' : 'Position';
            }

            function removeEmploymentInfo(employmentInfoItem) {
                vm.removeEmploymentInfoFn()(employmentInfoItem, vm.borrowerWithInfo);
                loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.BorrowerIncome, employmentInfoItem);
            }

            function getTemplateUrl() {
                return 'angular/loanapplication/income/' + (vm.isAdditionalEmpInfo ? 'additionalemployer' : 'currentemployer') + '.html';
            }

            function employmentTypeChanged() {
                var borrowerWithInfo = vm.borrowerWithInfo;
                //var isPreviousMilitary = vm.isMilitary;
                setData();
                //setEmploymentInfoValues(vm.isMilitary, isPreviousMilitary);
                borrowerWithInfo.getCurrentEmploymentInfo().isMilitary = vm.isMilitary;
                          
                resetNegativeValuesAndCalculateMonthly(borrowerWithInfo.getCurrentEmploymentInfo());
            }

            function employmentStatusChanged(employmentInfo) {
                if (employmentInfo.EmploymentStatusId == enums.employmentStatus.current) {
                    var currentTime = moment();
                    employmentInfo.employmentEndDate = currentTime;
                }
                else {
                    employmentInfo.employmentEndDate = null;
                }
                loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.BorrowerIncome, employmentInfo);
            }

            function additionalEmploymentTypeChanged(employmentInfo) {
                resetNegativeValuesAndCalculateMonthly(employmentInfo);
            }

            function resetNegativeValuesAndCalculateMonthly(employmentInfo) {
                resetNegativeValues(employmentInfo);
                loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.BorrowerIncome, employmentInfo);
            }

            function resetNegativeValues(employmentInfo) {
                // Amount can be negative value only for self employed
                if (employmentInfo.EmploymentTypeId != enums.employmentType.selfEmployed) {
                    angular.forEach(employmentInfo.getIncomeInformation(), function (income) {
                        if (income.amount < 0)
                            income.amount = 0;
                    });
                }
            }

            function onYearsOnThisJobChanged(employmentInfo) {
                $timeout(function () {
                    vm.onYearsOnThisJobChangedFn()(vm.borrowerWithInfo, employmentInfo);
                });
            }

            function validateEmploymentStartAndRetiredDate(model) {
                return vm.areSixPiecesAcquired && vm.borrowerWithInfo.getCurrentEmploymentInfo().isRetired && !model;
            }

            function validateIsSalariedOrSelfEmployed(model) {
                return vm.areSixPiecesAcquired && vm.borrowerWithInfo.getCurrentEmploymentInfo().isSalariedEmployeeOrSelfEmployed && !model;
            }

            function validateIsActiveMilitaryDuty(model) {
                return vm.borrowerWithInfo.getCurrentEmploymentInfo().isActiveMilitaryDuty && vm.areSixPiecesAcquired && !model;
            }

            function validateIsSalariedOrSelfEmployedAdditional(model, empInfo) {
                return vm.areSixPiecesAcquired && empInfo.isSalariedEmployeeOrSelfEmployed && !model;
            }
        }
    }


})();
