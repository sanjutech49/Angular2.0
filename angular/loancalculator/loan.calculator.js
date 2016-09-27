/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../loanevents/loanEvents.service.ts" />
/// <reference path="../ts/generated/viewModels.ts" />
/// <reference path="../ts/generated/serviceProxies/LoanCalculatorService.ts" />
/// <reference path="../ts/lib/referenceWrapper.ts" />
/// <reference path="../ts/lib/httpUtil.ts" />
/// <reference path="../common/common.factory.ts" />
var calc;
(function (calc) {
    // todo - refactor when the summary values are less disconnected
    var LoanCalculator = (function () {
        function LoanCalculator(LoanCalculatorService, $resource, apiRoot, loanEvent, $rootScope, commonCalculatorSvc, BroadcastSvc, costDetailsHelpers, loanDetailsSvc, enums, commonService, costDetailsSvc, ntbCenterService) {
            var _this = this;
            this.LoanCalculatorService = LoanCalculatorService;
            this.$resource = $resource;
            this.apiRoot = apiRoot;
            this.$rootScope = $rootScope;
            this.commonCalculatorSvc = commonCalculatorSvc;
            this.BroadcastSvc = BroadcastSvc;
            this.costDetailsHelpers = costDetailsHelpers;
            this.loanDetailsSvc = loanDetailsSvc;
            this.enums = enums;
            this.commonService = commonService;
            this.costDetailsSvc = costDetailsSvc;
            this.ntbCenterService = ntbCenterService;
            this.currentRequestId = 0;
            this.bindToCalculator = function (wrappedLoan, appData) {
                _this.wrappedLoan = wrappedLoan;
                _this.applicationData = appData;
                // Recalculate everything upon loading loan:
                _this.onPropertyChange(null);
            };
            this.requestCount = 0;
            this.recalculating = false;
            this.incrementRequestCount = function () {
                _this.requestCount++;
                _this.recalculating = true;
            };
            this.decrementRequestCount = function () {
                if (_this.requestCount--)
                    _this.recalculating = false;
            };
            this.onPropertyChange = function (propertyChangedEvent) {
                _this.incrementRequestCount();
                var requestContext = ++_this.currentRequestId;
                var calculatorRequest = _this.getCalculatorRequest(requestContext);
                // check if another request is already behind this one
                if (calculatorRequest.clientContextIdentifier != _this.currentRequestId)
                    return;
                var self = _this;
                _this.calculatorService.UpdateCalculatedValues(calculatorRequest).$promise.then(function (sr) {
                    self.decrementRequestCount();
                    // only interested in the last call, ignore all previous calls
                    if (sr.status == 0 /* Succeeded */ && sr.response.clientContextIdentifier == self.currentRequestId) {
                        self.updateSummaryValue(sr.response, self.calculatedSummaryValues);
                    }
                    if (sr.status == 1 /* Failed */) {
                        console.log('Error processing request context ' + requestContext + ': ' + sr.errorMsg);
                    }
                }, function (error) {
                    // todo - get input from business on how to handle error condition
                    self.decrementRequestCount();
                });
            };
            this.getBranchDataForLoan = function () {
                var defaultBrokerCompensationPercent = 0;
                if (!!_this.applicationData && !!_this.applicationData.companyProfile) {
                    var channelId = Boolean(_this.wrappedLoan.ref.channelId) ? _this.wrappedLoan.ref.channelId : _this.applicationData.currentUser.channelId;
                    var divisionId = Boolean(_this.wrappedLoan.ref.divisionId) ? _this.wrappedLoan.ref.divisionId : _this.applicationData.currentUser.divisionId;
                    var branchId = Boolean(_this.wrappedLoan.ref.branchId) ? _this.wrappedLoan.ref.branchId : _this.applicationData.currentUser.branchId;
                    var channel = lib.findFirst(_this.applicationData.companyProfile.channels, function (c) { return c.channelId == channelId; });
                    if (channel && !!channel.isWholesale) {
                        var division = lib.findFirst(channel.divisions, function (d) { return d.divisionId == divisionId; });
                        if (division && !!division) {
                            var branch = lib.findFirst(division.branches, function (b) { return b.branchId == branchId; });
                            if (branch && !!branch) {
                                defaultBrokerCompensationPercent = branch.defaultBrokerCompensationPercent;
                            }
                        }
                    }
                }
                return defaultBrokerCompensationPercent;
            };
            this.getNtbRequest = function () {
                var ntbRequiredRequest = new srv.cls.NtbRequiredRequest();
                ntbRequiredRequest.loanAmount = _this.wrappedLoan.ref.loanAmount;
                ntbRequiredRequest.loanPurposeType = _this.wrappedLoan.ref.loanPurposeType;
                ntbRequiredRequest.propertyUsageType = _this.wrappedLoan.ref.active.occupancyType;
                ntbRequiredRequest.geoStateUS = _this.wrappedLoan.ref.subjectProperty.stateId;
                ntbRequiredRequest.closingDate = _this.wrappedLoan.ref.closingDate.dateValue;
                ntbRequiredRequest.accountOpenDate = _this.wrappedLoan.ref.CurrentAccountOpenDate;
                return ntbRequiredRequest;
            };
            this.getPrimaryLoanAppCb = function () {
                return _this.wrappedLoan.ref.primary;
            };
            this.getCalculatorRequest = function (requestContext) {
                var calculatorRequest = new srv.cls.CalculatorRequest();
                calculatorRequest.loan = _this.wrappedLoan.ref;
                calculatorRequest.clientContextIdentifier = requestContext;
                calculatorRequest.defaultBrokerCompensationPercent = _this.getBranchDataForLoan();
                calculatorRequest.fico = _this.commonCalculatorSvc.GetFicoScore(_this.wrappedLoan, _this.applicationData);
                calculatorRequest.totalClosingCostsBorrower = _this.getTotalClosingCosts() - _this.costDetailsHelpers.calculateSectionTotal(5 /* Prepaids */) - _this.costDetailsHelpers.calculateSectionTotal(6 /* InitialEscowPaymentAtClosing */) + _this.costDetailsHelpers.getCostsTotalByHUDLineNumber(901);
                if (_this.wrappedLoan.ref.isDataValidForAggregateAdjustmentCalculation()) {
                    var stateName = _this.wrappedLoan.ref.getSubjectProperty().stateName;
                    var impoundSchedulers = _this.applicationData.impoundSchedules.filter(function (c) {
                        if (c.state == stateName)
                            return c;
                    });
                    if (impoundSchedulers.length > 0) {
                        calculatorRequest.monthsOfCushion = impoundSchedulers[0].cushion;
                        calculatorRequest.calculateAggregateAdjustment = true;
                    }
                }
                else {
                    _this.wrappedLoan.ref.resetEscrowsMonthsToBePaid();
                }
                calculatorRequest.ntbRequiredRequest = _this.getNtbRequest();
                calculatorRequest.ntbBenefitActivationRequest = _this.ntbCenterService.getNtbBenefitActivationRequest(_this.wrappedLoan);
                calculatorRequest.stateImpoundLimit = _this.getStateImpoundLimit();
                calculatorRequest.recoupmentPeriodRequest = _this.getRecoupmentPeriodRequest();
                calculatorRequest.allowableBorrowerPaidClosingCosts = _this.costDetailsHelpers.calculateAllowableBorrowerPaidClosingCost();
                calculatorRequest.prepaidExpenses = _this.costDetailsHelpers.calculateSectionTotal(5 /* Prepaids */), calculatorRequest.lenderCreditforClosingCostsAndPrepaids = _this.wrappedLoan.ref.closingCost.totals.lenderCredits, calculatorRequest.fhaCountyLoanLimit = _this.wrappedLoan.ref.fhaCountyLoanLimit, _this.wrappedLoan.ref.prepareSave();
                return calculatorRequest;
            };
            this.getRecoupmentPeriodRequest = function () {
                var recoupmentRequest = new srv.cls.RecoupmentPeriodRequest();
                recoupmentRequest.costOfNewLoan = _this.getTotalClosingCosts();
                recoupmentRequest.currentPaymentAndMI = _this.getCurrentPaymentAndMi(true);
                if (!!_this.wrappedLoan.ref.FirstLienReoItem && !!_this.wrappedLoan.ref.FirstLienReoItem.reoInfo) {
                    recoupmentRequest.prepaymentPenaltyAmount = _this.wrappedLoan.ref.FirstLienReoItem.reoInfo.prePaymentAmount;
                }
                recoupmentRequest.proposedPaymentAndMI = _this.wrappedLoan.ref.loanLock.newMonthlyPayment;
                return recoupmentRequest;
            };
            /**
            * @desc Gets the current payment and MI.
            */
            this.getCurrentPaymentAndMi = function (includeAdditionalMortgagees) {
                if (includeAdditionalMortgagees === void 0) { includeAdditionalMortgagees = false; }
                if (includeAdditionalMortgagees) {
                    return _this.loanDetailsSvc.totalCurrentExpenses(_this.wrappedLoan.ref.housingExpenses.rent, _this.wrappedLoan.ref.housingExpenses.firstMtgPi, _this.wrappedLoan.ref.housingExpenses.secondMtgPi, _this.wrappedLoan.ref.loanPurposeType, _this.wrappedLoan.ref.getSubjectProperty().OccupancyType, _this.wrappedLoan.ref.getSubjectProperty, _this.wrappedLoan.ref.primary.getBorrower().getCurrentAddress, _this.wrappedLoan.ref.housingExpenses.addlMortgagees);
                }
                else {
                    return _this.loanDetailsSvc.totalCurrentExpenses(_this.wrappedLoan.ref.housingExpenses.rent, _this.wrappedLoan.ref.housingExpenses.firstMtgPi, _this.wrappedLoan.ref.housingExpenses.secondMtgPi, _this.wrappedLoan.ref.loanPurposeType, _this.wrappedLoan.ref.getSubjectProperty().OccupancyType, _this.wrappedLoan.ref.getSubjectProperty, _this.wrappedLoan.ref.primary.getBorrower().getCurrentAddress);
                }
            };
            this.getMIAmount = function (isNewLoan) {
                return _this.loanDetailsSvc.getMIAmount(isNewLoan, function () { return _this.wrappedLoan.ref.closingCost.costs; }, _this.wrappedLoan.ref.loanPurposeType, _this.wrappedLoan.ref.getSubjectProperty().occupancyType, _this.wrappedLoan.ref.getSubjectProperty, _this.wrappedLoan.ref.primary.getBorrower().getCurrentAddress, 3);
            };
            this.updateSummaryValue = function (calcResponse, calculatedSummaryValues) {
                if (calcResponse.calculatedValueTypes)
                    calcResponse.calculatedValueTypes.forEach(function (calcValueType) { return _this.updateSummaryField(calcValueType, calcResponse, calculatedSummaryValues); });
                _this.wrappedLoan.ref.fhaCountyLoanLimit = _this.commonService.getFHAOrVALoanLimit(_this.applicationData.fhaLoanLimits, _this.wrappedLoan.ref.getSubjectProperty().stateName, _this.wrappedLoan.ref.getSubjectProperty().countyName, _this.wrappedLoan.ref.getSubjectProperty().numberOfUnits);
                _this.wrappedLoan.ref.vaCountyLoanLimit = _this.commonService.getFHAOrVALoanLimit(_this.applicationData.vaLoanLimits, _this.wrappedLoan.ref.getSubjectProperty().stateName, _this.wrappedLoan.ref.getSubjectProperty().countyName, _this.wrappedLoan.ref.getSubjectProperty().numberOfUnits);
            };
            this.getStateImpoundLimit = function () {
                var ltvLimit = lib.filter(_this.applicationData.impoundLimit, function (item) {
                    return item.stateId == _this.wrappedLoan.ref.getSubjectProperty().stateName;
                });
                if (ltvLimit && ltvLimit.length > 0)
                    return ltvLimit[0].ltvLimit;
                return 0;
            };
            // this should be refactored later - the summary view should be attached in a context near the loan 
            this.updateSummaryField = function (calcValueType, calcResponse, calculatedSummaryValues) {
                switch (calcValueType) {
                    case 3 /* CLTV */:
                        _this.updateCltv(calcResponse.cltv, calculatedSummaryValues);
                        break;
                    case 2 /* DTIAndHousingRatio */:
                        _this.updateDTIAndHousingRatio(calcResponse.dtiAndHousingRatio, calculatedSummaryValues);
                        break;
                    case 4 /* HCLTV */:
                        _this.updateHcltv(calcResponse.hcltv, calculatedSummaryValues);
                        break;
                    case 1 /* LTV */:
                        _this.updateLtv(calcResponse.ltv, calculatedSummaryValues);
                        break;
                    case 13 /* RecalculatedCosts */:
                        _this.recalculateCosts(calcResponse.recalculatedCosts);
                        _this.costDetailsHelpers.getCostDetailsData();
                        _this.BroadcastSvc.broadcastCostsRecalculated();
                        break;
                    case 9 /* Hud801And802 */:
                        _this.updateLoanCosts(calcResponse.hud801And802Costs);
                        _this.updateLoanCosts(calcResponse.hud801And802Costs); //why we had to do twice? reason costs on UI were not refreshing
                        break;
                    case 10 /* HousingExpenses */:
                        _this.updateSectionV(calcResponse.housingExpenses);
                        break;
                    case 11 /* InterestAmountPerDiem */:
                        _this.updateInterestAmountPerDiem(calcResponse.interestAmountPerDiem);
                        break;
                    case 12 /* DetailsOfTransaction */:
                        _this.updateSectionVII(calcResponse.detailsOfTransaction);
                        break;
                    case 7 /* NetRentalIncome */:
                        _this.updateNetRental(calcResponse.netRentalIncomes);
                        break;
                    case 14 /* SubordinateFee */:
                        _this.updateSubordinateFee(calcResponse.subordinateFee);
                        break;
                    case 6 /* Apr */:
                        _this.updateApr(calcResponse.apr);
                        break;
                    case 15 /* FirstPaymentDate */:
                        _this.wrappedLoan.ref.firstPaymentDate = calcResponse.firstPaymentDate;
                        break;
                    case 16 /* AgregateAdjustment */:
                        _this.wrappedLoan.ref.totalAggregateAdjustment = calcResponse.agregateAdjustment;
                        break;
                    case 20 /* QMCertification */:
                        _this.wrappedLoan.ref.vaInformation.qmCertification = calcResponse.qmCertification;
                        break;
                    case 18 /* NewMonthlyPayment */:
                        _this.wrappedLoan.ref.loanLock.newMonthlyPayment = calcResponse.newMonthlyPayment;
                        break;
                    case 21 /* LoanDecisionScore */:
                        _this.wrappedLoan.ref.financialInfo.ficoScore = calcResponse.loanDecisionScore;
                        break;
                    case 22 /* FullyIndexedRate */:
                        _this.wrappedLoan.ref.fullyIndexedRate = calcResponse.fullyIndexedRate;
                        break;
                    case 23 /* IsImpoundMandatory */:
                        _this.wrappedLoan.ref.stateLtvLimit = calcResponse.stateLtvLimit;
                        _this.wrappedLoan.ref.otherInterviewData.selectedImpoundsOption = String(0 /* taxesAndInsurance */);
                        break;
                    case 24 /* RecoupmentPeriod */:
                        _this.wrappedLoan.ref.recoupmentPeriodCalculated = calcResponse.recoupmentPeriodResponse;
                        break;
                    case 19 /* NetTangibleBenefit */:
                        _this.updateLoanNTB(calcResponse.ntbRequiredResponse, calcResponse.ntbBenefitActivationResponse);
                        break;
                    case 25 /* FHACalculator */:
                        _this.updateFHA(calcResponse.fhaCalculatorResponse);
                        break;
                }
            };
            /**
            * @desc Updates the net rental instances based on the calculator response.
            */
            this.updateNetRental = function (netRentalIncomes) {
                if (!_this.wrappedLoan.ref.getTransactionInfoRef())
                    return;
                if (!netRentalIncomes)
                    netRentalIncomes = new Array();
                netRentalIncomes.forEach(function (nriItem) {
                    var income = _this.wrappedLoan.ref.getTransactionInfoRef().incomeInfo.lookup(nriItem.incomeInfoId);
                    if (!!income) {
                        income.calculatedAmount = nriItem.amount;
                    }
                });
            };
            this.updateApr = function (apr) {
                if (_this.wrappedLoan && _this.wrappedLoan.ref && _this.wrappedLoan.ref.financialInfo)
                    _this.wrappedLoan.ref.financialInfo.apr = apr;
            };
            this.updateSubordinateFee = function (subordinateFee) {
                if (!subordinateFee)
                    return;
                if (!lib.replace(_this.wrappedLoan.ref.closingCost.costs, subordinateFee, function (i) { return i.hudLineNumber == subordinateFee.hudLineNumber; }))
                    _this.wrappedLoan.ref.closingCost.costs.push(subordinateFee);
            };
            this.updateSectionV = function (housingExpenses) {
                if (_this.wrappedLoan && _this.wrappedLoan.ref && _this.wrappedLoan.ref.housingExpenses) {
                    _this.wrappedLoan.ref.housingExpenses.firstMtgPi = housingExpenses.firstMtgPi;
                    _this.wrappedLoan.ref.housingExpenses.floodInsurance = housingExpenses.floodInsurance;
                    _this.wrappedLoan.ref.housingExpenses.hazardInsurance = housingExpenses.hazardInsurance;
                    _this.wrappedLoan.ref.housingExpenses.hoa = housingExpenses.hoa;
                    _this.wrappedLoan.ref.housingExpenses.mtgInsurance = housingExpenses.mtgInsurance;
                    _this.wrappedLoan.ref.housingExpenses.newFirstMtgPi = housingExpenses.newFirstMtgPi;
                    _this.wrappedLoan.ref.housingExpenses.newFloodInsurance = housingExpenses.newFloodInsurance;
                    _this.wrappedLoan.ref.housingExpenses.newHazardInsurance = housingExpenses.newHazardInsurance;
                    _this.wrappedLoan.ref.housingExpenses.newHoa = housingExpenses.newHoa;
                    _this.wrappedLoan.ref.housingExpenses.newMtgInsurance = housingExpenses.newMtgInsurance;
                    _this.wrappedLoan.ref.housingExpenses.newSecondMtgPi = housingExpenses.newSecondMtgPi;
                    _this.wrappedLoan.ref.housingExpenses.newTaxes = housingExpenses.newTaxes;
                    _this.wrappedLoan.ref.housingExpenses.other = housingExpenses.other;
                    _this.wrappedLoan.ref.housingExpenses.rent = housingExpenses.rent;
                    _this.wrappedLoan.ref.housingExpenses.secondMtgPi = housingExpenses.secondMtgPi;
                    _this.wrappedLoan.ref.housingExpenses.taxes = housingExpenses.taxes;
                    _this.wrappedLoan.ref.housingExpenses.addlMortgagees = housingExpenses.addlMortgagees;
                }
            };
            this.updateSectionVII = function (detailOfTransaction) {
                _this.wrappedLoan.ref.detailsOfTransaction.alterationImprovementsRepairs = detailOfTransaction.alternationsImprovementsRepairs;
                _this.wrappedLoan.ref.detailsOfTransaction.borrowerClosingCostPaidBySeller = detailOfTransaction.borrowerClosingCostPaidBySeller;
                _this.wrappedLoan.ref.detailsOfTransaction.cashFromToBorrower = detailOfTransaction.castFromToBorrower;
                _this.wrappedLoan.ref.detailsOfTransaction.discount = detailOfTransaction.discount;
                _this.wrappedLoan.ref.detailsOfTransaction.estimatedClosingCosts = detailOfTransaction.estimatedClosingCosts;
                _this.wrappedLoan.ref.detailsOfTransaction.estimatedPrepaidItems = detailOfTransaction.estimatedPrepaidItems;
                _this.wrappedLoan.ref.detailsOfTransaction.land = detailOfTransaction.land;
                _this.wrappedLoan.ref.detailsOfTransaction.otherCredits = detailOfTransaction.otherCredits;
                _this.wrappedLoan.ref.detailsOfTransaction.pmiMipFundingFee = detailOfTransaction.pmI_MPI_FundingFee;
                _this.wrappedLoan.ref.detailsOfTransaction.pmiMipFundingFeeFinanced = detailOfTransaction.pmI_MIP_FundingFeeFinanced;
                _this.wrappedLoan.ref.detailsOfTransaction.refinance = detailOfTransaction.refinance;
                _this.wrappedLoan.ref.detailsOfTransaction.subordinateFinancing = detailOfTransaction.subordinateFinancing;
                _this.wrappedLoan.ref.detailsOfTransaction.totalCosts = detailOfTransaction.totalCosts;
                _this.wrappedLoan.ref.detailsOfTransaction.totalLoanAmount = detailOfTransaction.totalLoanAmount;
                _this.wrappedLoan.ref.detailsOfTransaction.refinanceWithDebts = detailOfTransaction.refinanceWithDebts;
                _this.wrappedLoan.ref.detailsOfTransaction.mLoanAmount = detailOfTransaction.mLoanAmount;
                _this.wrappedLoan.ref.detailsOfTransaction.oLoanAmount = detailOfTransaction.oLoanAmount;
            };
            this.updateMonthlyPayment = function (monthlyPayment) {
                if (_this.wrappedLoan && _this.wrappedLoan.ref && _this.wrappedLoan.ref.financialInfo)
                    _this.wrappedLoan.ref.financialInfo.monthlyPayment = monthlyPayment;
            };
            this.updateCltv = function (cltv, calculatedSummaryValues) {
                if (calculatedSummaryValues)
                    calculatedSummaryValues.Cltv = cltv;
                if (_this.wrappedLoan && _this.wrappedLoan.ref && _this.wrappedLoan.ref.getSubjectProperty()) {
                    _this.wrappedLoan.ref.getSubjectProperty().cltv = cltv.toString();
                }
            };
            this.updateInterestAmountPerDiem = function (interestAmountPerDiem) {
                for (var i = 0; i < _this.wrappedLoan.ref.closingCost.costs.length; i++) {
                    var cost = _this.wrappedLoan.ref.closingCost.costs[i];
                    if (cost.hudLineNumber == '901') {
                        _this.wrappedLoan.ref.closingCost.costs[i].amount = interestAmountPerDiem;
                    }
                }
            };
            this.updateDTIAndHousingRatio = function (dtiAndHousingRatio, calculatedSummaryValues) {
                if (calculatedSummaryValues) {
                    calculatedSummaryValues.Dti = dtiAndHousingRatio.combinedDTIDU;
                    calculatedSummaryValues.HousingExpense = dtiAndHousingRatio.combinedHousingRatioDU;
                }
                if (_this.wrappedLoan && _this.wrappedLoan.ref && _this.wrappedLoan.ref.financialInfo && _this.wrappedLoan.ref.loanId) {
                    _this.wrappedLoan.ref.financialInfo.dti = dtiAndHousingRatio.combinedDTIDU;
                    _this.wrappedLoan.ref.financialInfo.dtiDu = dtiAndHousingRatio.combinedDTIDU;
                    _this.wrappedLoan.ref.financialInfo.dtiLp = dtiAndHousingRatio.combinedDTILP;
                    _this.wrappedLoan.ref.financialInfo.dtiFha = dtiAndHousingRatio.combinedDTIFHA;
                    _this.wrappedLoan.ref.financialInfo.qualifyingDtiDu = dtiAndHousingRatio.qualCombinedDTIDU;
                    _this.wrappedLoan.ref.financialInfo.qualifyingDtiLp = dtiAndHousingRatio.qualCombinedDTILP;
                    _this.wrappedLoan.ref.financialInfo.qualifyingDtiFha = dtiAndHousingRatio.qualCombinedDTIFHA;
                    _this.wrappedLoan.ref.financialInfo.housingRatioDu = dtiAndHousingRatio.combinedHousingRatioDU;
                    _this.wrappedLoan.ref.financialInfo.housingRatioLp = dtiAndHousingRatio.combinedHousingRatioLP;
                    _this.wrappedLoan.ref.financialInfo.housingRatioFha = dtiAndHousingRatio.combinedHousingRatioFHA;
                    console.log('Updating DTI: ' + dtiAndHousingRatio.combinedDTIDU);
                    console.log('Updating HousingRatio: ' + dtiAndHousingRatio.combinedHousingRatioDU);
                }
            };
            this.updateHcltv = function (hcltv, calculatedSummaryValues) {
                if (calculatedSummaryValues)
                    calculatedSummaryValues.Hcltv = hcltv;
                if (_this.wrappedLoan && _this.wrappedLoan.ref && _this.wrappedLoan.ref.getSubjectProperty()) {
                    _this.wrappedLoan.ref.getSubjectProperty().hcltv = hcltv.toString();
                }
            };
            //private updateHousingRatio = (housingRatio: number, calculatedSummaryValues: srv.ICalculatedSummaryValues) => {
            //    if (calculatedSummaryValues)
            //        calculatedSummaryValues.HousingExpense = housingRatio;
            //    if (this.wrappedLoan && this.wrappedLoan.ref && this.wrappedLoan.ref.financialInfo) {
            //        // TODO: Review DU/LP values when working with multi 1003:
            //        this.wrappedLoan.ref.financialInfo.housingRatioDu = housingRatio.toFixed(3) + " %";
            //        this.wrappedLoan.ref.financialInfo.housingRatioLp = housingRatio.toFixed(3) + " %";
            //        console.log('Updating HousingRatio: ' + housingRatio);
            //    }
            //}
            this.updateLtv = function (ltv, calculatedSummaryValues) {
                if (calculatedSummaryValues)
                    calculatedSummaryValues.Ltv = ltv;
                if (_this.wrappedLoan && _this.wrappedLoan.ref && _this.wrappedLoan.ref.getSubjectProperty()) {
                    _this.wrappedLoan.ref.getSubjectProperty().ltv = ltv.toString();
                }
            };
            this.recalculateCosts = function (hudCosts) {
                if (hudCosts && _this.wrappedLoan.ref && _this.wrappedLoan.ref.closingCost && _this.wrappedLoan.ref.closingCost.costs) {
                    _this.wrappedLoan.ref.closingCost.costs = hudCosts;
                }
            };
            // only perform replacement, no additions
            this.updateLoanCost = function (hudCost) {
                if (!_this.wrappedLoan.ref.closingCost.costs)
                    _this.wrappedLoan.ref.closingCost.costs = [hudCost];
                else {
                    for (var i = 0; i < _this.wrappedLoan.ref.closingCost.costs.length; i++) {
                        var cost = _this.wrappedLoan.ref.closingCost.costs[i];
                        if (hudCost.hudLineNumber === cost.hudLineNumber && hudCost.subHUDLineNumber === cost.subHUDLineNumber && hudCost.originalHUDLineNumber === cost.originalHUDLineNumber && hudCost.originalSubHUDLineNumber === cost.originalSubHUDLineNumber) {
                            _this.wrappedLoan.ref.closingCost.costs[i] = hudCost;
                            if (cost.hudLineNumber == '802' && cost.subHUDLineNumber === 'a') {
                                _this.wrappedLoan.ref.closingCost.totalLenderRebate = cost.amount;
                            }
                            return;
                        }
                    }
                    _this.wrappedLoan.ref.closingCost.costs.push(hudCost);
                }
            };
            this.updateLoanCosts = function (hudCosts) {
                if (hudCosts && _this.wrappedLoan.ref && _this.wrappedLoan.ref.closingCost && _this.wrappedLoan.ref.closingCost.costs)
                    hudCosts.forEach(function (hudCost) { return _this.updateLoanCost(hudCost); });
            };
            this.getTotalClosingCosts = function () {
                if (!_this.wrappedLoan.ref.closingCost || !_this.wrappedLoan.ref.closingCost.totals || !_this.wrappedLoan.ref.closingCost.totals.closingCosts)
                    return 0;
                return _this.wrappedLoan.ref.closingCost.totals.closingCosts.borrowerTotal;
            };
            this.updateLoanNTB = function (ntbRequiredResponse, ntbBenefitActivationResponse) {
                _this.wrappedLoan.ref.ntbRequired = ntbRequiredResponse.ntbRequired;
                if (ntbRequiredResponse.ntbRequired) {
                    _this.ntbCenterService.updateLoanNTB(_this.wrappedLoan, ntbBenefitActivationResponse);
                }
            };
            this.updateFHA = function (fhaCalculatorResponse) {
                _this.wrappedLoan.ref.fhaScenarioViewModel.fhaCalculatorResults = fhaCalculatorResponse;
                if (fhaCalculatorResponse.isEligible) {
                    _this.wrappedLoan.ref.govermentEligibility = 1 /* FHAEligible */;
                }
                else {
                    _this.wrappedLoan.ref.govermentEligibility = 2 /* FHANotEligible */;
                }
            };
            loanEvent.registerForPropertyChangeEvent(LoanCalculator.className, this, this.onPropertyChange);
            // this is just temporary, refactor with framework
            this.calculatorService = $resource(this.apiRoot + 'LoanCalculatorService/', {}, {
                UpdateCalculatedValues: { method: 'POST', params: { request: '@request' } }
            });
        }
        LoanCalculator.prototype.setCalculatedValues = function (calculatedSummaryValues) {
            this.calculatedSummaryValues = calculatedSummaryValues;
            // todo - just for now to initialize the summary
            this.onPropertyChange(null);
        };
        LoanCalculator.className = 'LoanCalculator';
        LoanCalculator.$inject = ['LoanCalculatorService', '$resource', 'apiRoot', 'loanEvent', '$rootScope', 'commonCalculatorSvc', 'BroadcastSvc', 'costDetailsHelpers', 'loanDetailsSvc', 'enums', 'commonService', 'costDetailsSvc', 'ntbCenterService'];
        return LoanCalculator;
    })();
    calc.LoanCalculator = LoanCalculator;
    angular.module('loan.calculator', ['CalculatorModule']).service(LoanCalculator.className, LoanCalculator);
})(calc || (calc = {}));
//# sourceMappingURL=loan.calculator.js.map