/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../loanevents/loanEvents.service.ts" />
/// <reference path="../ts/generated/viewModels.ts" />
/// <reference path="../ts/generated/serviceProxies/LoanCalculatorService.ts" />
/// <reference path="../ts/lib/referenceWrapper.ts" />
/// <reference path="../ts/lib/httpUtil.ts" />
/// <reference path="../common/common.factory.ts" />

// temporary place holder only, this needs to be refactored out later
module srv {

    export interface ICalculatedSummaryValues {
        Ltv: number;
        Dti?: number;
        Cltv: number;
        Hcltv: number;
        HousingExpense: number;
    }
}

module calc {

    // todo - refactor when the summary values are less disconnected
    export class LoanCalculator {

        static className = 'LoanCalculator';
        static $inject = ['LoanCalculatorService', '$resource', 'apiRoot', 'loanEvent', '$rootScope', 'commonCalculatorSvc', 'BroadcastSvc', 'costDetailsHelpers', 'loanDetailsSvc', 'enums', 'commonService', 'costDetailsSvc', 'ntbCenterService'];

        private currentRequestId = 0;
        private wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>;
        private calculatorService;
        private applicationData;

        constructor(private LoanCalculatorService: srv.LoanCalculatorService, private $resource: ng.resource.IResourceService, private apiRoot: string, loanEvent: events.LoanEventService, private $rootScope: ng.IRootScopeService,
            private commonCalculatorSvc: any, private BroadcastSvc: any, private costDetailsHelpers, private loanDetailsSvc: any, private enums, private commonService: common.services.ICommonService, private costDetailsSvc, private ntbCenterService: ntb.service.INTBCenterService) {

            loanEvent.registerForPropertyChangeEvent(LoanCalculator.className, this, this.onPropertyChange);

            // this is just temporary, refactor with framework
            this.calculatorService = $resource(this.apiRoot + 'LoanCalculatorService/', {}, {
                UpdateCalculatedValues: { method: 'POST', params: { request: '@request' } }
            });
        }

        bindToCalculator = (wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, appData:any) => {
            this.wrappedLoan = wrappedLoan;
            this.applicationData = appData;
            // Recalculate everything upon loading loan:
            this.onPropertyChange(null);
            
        }

        private requestCount = 0;

        recalculating = false;

        private calculatedSummaryValues: srv.ICalculatedSummaryValues;

        private incrementRequestCount = () => {
            this.requestCount++;
            this.recalculating = true;
        }

        private decrementRequestCount = () => {
            if (this.requestCount--)
                this.recalculating = false;
        }

        public setCalculatedValues(calculatedSummaryValues: srv.ICalculatedSummaryValues) {
            this.calculatedSummaryValues = calculatedSummaryValues;
            // todo - just for now to initialize the summary
            this.onPropertyChange(null);
        }

        onPropertyChange = (propertyChangedEvent: events.IPropertyChangedEvent) => {

            this.incrementRequestCount();
            var requestContext = ++this.currentRequestId;

            var calculatorRequest = this.getCalculatorRequest(requestContext);

            // check if another request is already behind this one
            if (calculatorRequest.clientContextIdentifier != this.currentRequestId)
                return;

            var self = this;
            

            this.calculatorService.UpdateCalculatedValues(calculatorRequest).$promise.then((sr: util.ServiceResponse<any>) => {

                self.decrementRequestCount();

                // only interested in the last call, ignore all previous calls
                if (sr.status == util.ServiceResponseStatus.Succeeded && sr.response.clientContextIdentifier == self.currentRequestId) {

                    self.updateSummaryValue(sr.response, self.calculatedSummaryValues);
                }

                if (sr.status == util.ServiceResponseStatus.Failed) {
                    console.log('Error processing request context ' + requestContext + ': ' + sr.errorMsg);
                }

            }, error => {
                    // todo - get input from business on how to handle error condition
                    self.decrementRequestCount();

                });
        }
        
         private getBranchDataForLoan = ():number => {
            var defaultBrokerCompensationPercent = 0;
            
            if (!!this.applicationData && !!this.applicationData.companyProfile) {
                var channelId = Boolean(this.wrappedLoan.ref.channelId) ? this.wrappedLoan.ref.channelId : this.applicationData.currentUser.channelId;
                var divisionId = Boolean(this.wrappedLoan.ref.divisionId) ? this.wrappedLoan.ref.divisionId : this.applicationData.currentUser.divisionId;
                var branchId = Boolean(this.wrappedLoan.ref.branchId) ? this.wrappedLoan.ref.branchId : this.applicationData.currentUser.branchId;

                var channel = lib.findFirst(this.applicationData.companyProfile.channels,(c: any) => c.channelId == channelId);
                if (channel && !!channel.isWholesale) {
                    var division = lib.findFirst(channel.divisions,(d: any) => d.divisionId == divisionId);

                    if (division && !!division) {
                        var branch = lib.findFirst(division.branches,(b: any) => b.branchId == branchId);
                        if (branch && !!branch) {
                            defaultBrokerCompensationPercent = branch.defaultBrokerCompensationPercent;
                        }
                    }
                }
            }

            return defaultBrokerCompensationPercent;

        }
        
         private getNtbRequest = (): srv.cls.NtbRequiredRequest => {

             var ntbRequiredRequest = new srv.cls.NtbRequiredRequest();

             ntbRequiredRequest.loanAmount = this.wrappedLoan.ref.loanAmount;
             ntbRequiredRequest.loanPurposeType = this.wrappedLoan.ref.loanPurposeType;
             ntbRequiredRequest.propertyUsageType = this.wrappedLoan.ref.active.occupancyType;
             ntbRequiredRequest.geoStateUS = this.wrappedLoan.ref.subjectProperty.stateId;
             ntbRequiredRequest.closingDate = this.wrappedLoan.ref.closingDate.dateValue;
             ntbRequiredRequest.accountOpenDate = this.wrappedLoan.ref.CurrentAccountOpenDate;

             return ntbRequiredRequest;
         }

         private getPrimaryLoanAppCb = (): srv.ILoanApplicationViewModel => {
             return this.wrappedLoan.ref.primary;
        }

        private getCalculatorRequest = (requestContext: number): srv.ICalculatorRequest => {

            var calculatorRequest = new srv.cls.CalculatorRequest();
            calculatorRequest.loan = this.wrappedLoan.ref;            
            calculatorRequest.clientContextIdentifier = requestContext;
            calculatorRequest.defaultBrokerCompensationPercent = this.getBranchDataForLoan();
            calculatorRequest.fico = this.commonCalculatorSvc.GetFicoScore(this.wrappedLoan, this.applicationData);
            calculatorRequest.totalClosingCostsBorrower = this.getTotalClosingCosts() - this.costDetailsHelpers.calculateSectionTotal(srv.CostSectionTypeEnum.Prepaids) - this.costDetailsHelpers.calculateSectionTotal(srv.CostSectionTypeEnum.InitialEscowPaymentAtClosing) + this.costDetailsHelpers.getCostsTotalByHUDLineNumber(901);
            if (this.wrappedLoan.ref.isDataValidForAggregateAdjustmentCalculation()) {
                var stateName = this.wrappedLoan.ref.getSubjectProperty().stateName
                var impoundSchedulers = this.applicationData.impoundSchedules.filter(function (c) {
                    if (c.state == stateName)
                        return c;
                });
                if (impoundSchedulers.length > 0) {
                    calculatorRequest.monthsOfCushion = impoundSchedulers[0].cushion;
                    calculatorRequest.calculateAggregateAdjustment = true;
                }
            }
            else {
                this.wrappedLoan.ref.resetEscrowsMonthsToBePaid();
            }

            calculatorRequest.ntbRequiredRequest = this.getNtbRequest();
            calculatorRequest.ntbBenefitActivationRequest = this.ntbCenterService.getNtbBenefitActivationRequest(this.wrappedLoan);
            calculatorRequest.stateImpoundLimit = this.getStateImpoundLimit();
            calculatorRequest.recoupmentPeriodRequest = this.getRecoupmentPeriodRequest();
            calculatorRequest.allowableBorrowerPaidClosingCosts = this.costDetailsHelpers.calculateAllowableBorrowerPaidClosingCost();
            calculatorRequest.prepaidExpenses = this.costDetailsHelpers.calculateSectionTotal(srv.CostSectionTypeEnum.Prepaids),
            calculatorRequest.lenderCreditforClosingCostsAndPrepaids = this.wrappedLoan.ref.closingCost.totals.lenderCredits,
            calculatorRequest.fhaCountyLoanLimit = this.wrappedLoan.ref.fhaCountyLoanLimit,

            this.wrappedLoan.ref.prepareSave();
            return calculatorRequest;
        }

        private getRecoupmentPeriodRequest = (): srv.IRecoupmentPeriodRequest => {
            var recoupmentRequest = new srv.cls.RecoupmentPeriodRequest();

            recoupmentRequest.costOfNewLoan = this.getTotalClosingCosts();
            recoupmentRequest.currentPaymentAndMI = this.getCurrentPaymentAndMi(true);

            if (!!this.wrappedLoan.ref.FirstLienReoItem && !!this.wrappedLoan.ref.FirstLienReoItem.reoInfo) {
                recoupmentRequest.prepaymentPenaltyAmount = this.wrappedLoan.ref.FirstLienReoItem.reoInfo.prePaymentAmount;
            }

            recoupmentRequest.proposedPaymentAndMI = this.wrappedLoan.ref.loanLock.newMonthlyPayment;

            return recoupmentRequest;

            }

        /**
        * @desc Gets the current payment and MI.
        */
        public getCurrentPaymentAndMi = (includeAdditionalMortgagees: boolean = false): number => {
            if (includeAdditionalMortgagees) {
                return this.loanDetailsSvc.totalCurrentExpenses(this.wrappedLoan.ref.housingExpenses.rent,
                    this.wrappedLoan.ref.housingExpenses.firstMtgPi,
                    this.wrappedLoan.ref.housingExpenses.secondMtgPi,
                    this.wrappedLoan.ref.loanPurposeType,
                    this.wrappedLoan.ref.getSubjectProperty().OccupancyType,
                    this.wrappedLoan.ref.getSubjectProperty,
                    this.wrappedLoan.ref.primary.getBorrower().getCurrentAddress,
                    this.wrappedLoan.ref.housingExpenses.addlMortgagees);
            }
            else {
                return this.loanDetailsSvc.totalCurrentExpenses(this.wrappedLoan.ref.housingExpenses.rent,
                    this.wrappedLoan.ref.housingExpenses.firstMtgPi,
                    this.wrappedLoan.ref.housingExpenses.secondMtgPi,
                    this.wrappedLoan.ref.loanPurposeType,
                    this.wrappedLoan.ref.getSubjectProperty().OccupancyType,
                    this.wrappedLoan.ref.getSubjectProperty,
                    this.wrappedLoan.ref.primary.getBorrower().getCurrentAddress);
            }
        }

        private getMIAmount = (isNewLoan: boolean) => {
            return this.loanDetailsSvc.getMIAmount(isNewLoan, () => this.wrappedLoan.ref.closingCost.costs, this.wrappedLoan.ref.loanPurposeType,
                this.wrappedLoan.ref.getSubjectProperty().occupancyType, this.wrappedLoan.ref.getSubjectProperty, this.wrappedLoan.ref.primary.getBorrower().getCurrentAddress,
                3 /*mortgageInsuranceExpense: 3*/);
        }


        private updateSummaryValue = (calcResponse, calculatedSummaryValues) => {

            if (calcResponse.calculatedValueTypes)
                calcResponse.calculatedValueTypes.forEach(calcValueType => this.updateSummaryField(calcValueType, calcResponse, calculatedSummaryValues));

            this.wrappedLoan.ref.fhaCountyLoanLimit = this.commonService.getFHAOrVALoanLimit(this.applicationData.fhaLoanLimits, this.wrappedLoan.ref.getSubjectProperty().stateName, this.wrappedLoan.ref.getSubjectProperty().countyName, this.wrappedLoan.ref.getSubjectProperty().numberOfUnits);
            this.wrappedLoan.ref.vaCountyLoanLimit = this.commonService.getFHAOrVALoanLimit(this.applicationData.vaLoanLimits, this.wrappedLoan.ref.getSubjectProperty().stateName, this.wrappedLoan.ref.getSubjectProperty().countyName, this.wrappedLoan.ref.getSubjectProperty().numberOfUnits);
        }

        private getStateImpoundLimit = (): number => {
            var ltvLimit = lib.filter(this.applicationData.impoundLimit,(item: any) => { return item.stateId == this.wrappedLoan.ref.getSubjectProperty().stateName })

            if (ltvLimit && ltvLimit.length > 0)
                return ltvLimit[0].ltvLimit;
            return 0;
        }

        // this should be refactored later - the summary view should be attached in a context near the loan 
        private updateSummaryField = (calcValueType: srv.CalculatedValueTypeEnum, calcResponse: srv.ICalculatorResponse, calculatedSummaryValues: srv.ICalculatedSummaryValues) => {
            switch (calcValueType) {
                case srv.CalculatedValueTypeEnum.CLTV:
                    this.updateCltv(calcResponse.cltv, calculatedSummaryValues);
                    break;
                case srv.CalculatedValueTypeEnum.DTIAndHousingRatio:
                    this.updateDTIAndHousingRatio(calcResponse.dtiAndHousingRatio, calculatedSummaryValues);
                    break;
                case srv.CalculatedValueTypeEnum.HCLTV:
                    this.updateHcltv(calcResponse.hcltv, calculatedSummaryValues);
                    break;
                case srv.CalculatedValueTypeEnum.LTV:
                    this.updateLtv(calcResponse.ltv, calculatedSummaryValues);
                    break;
                case srv.CalculatedValueTypeEnum.RecalculatedCosts:
                    this.recalculateCosts(calcResponse.recalculatedCosts);
                    this.costDetailsHelpers.getCostDetailsData();
                    this.BroadcastSvc.broadcastCostsRecalculated();
                    break;
                case srv.CalculatedValueTypeEnum.Hud801And802:
                    this.updateLoanCosts(calcResponse.hud801And802Costs);
                    this.updateLoanCosts(calcResponse.hud801And802Costs); //why we had to do twice? reason costs on UI were not refreshing
                    break;
                case srv.CalculatedValueTypeEnum.HousingExpenses:
                    this.updateSectionV(calcResponse.housingExpenses);
                    break;
                case srv.CalculatedValueTypeEnum.InterestAmountPerDiem:
                    this.updateInterestAmountPerDiem(calcResponse.interestAmountPerDiem);
                    break;
                case srv.CalculatedValueTypeEnum.DetailsOfTransaction:
                    this.updateSectionVII(calcResponse.detailsOfTransaction)
                    break;
                case srv.CalculatedValueTypeEnum.NetRentalIncome:
                    this.updateNetRental(calcResponse.netRentalIncomes)
                    break;
                case srv.CalculatedValueTypeEnum.SubordinateFee:
                    this.updateSubordinateFee(calcResponse.subordinateFee)
                    break;
                case srv.CalculatedValueTypeEnum.Apr:
                    this.updateApr(calcResponse.apr)
                    break;
                case srv.CalculatedValueTypeEnum.FirstPaymentDate:
                    this.wrappedLoan.ref.firstPaymentDate = calcResponse.firstPaymentDate;
                    break;
                case srv.CalculatedValueTypeEnum.AgregateAdjustment:
                    this.wrappedLoan.ref.totalAggregateAdjustment = calcResponse.agregateAdjustment;
                    break;
                case srv.CalculatedValueTypeEnum.QMCertification:
                    this.wrappedLoan.ref.vaInformation.qmCertification = calcResponse.qmCertification;
                    break;
                case srv.CalculatedValueTypeEnum.NewMonthlyPayment:
                    this.wrappedLoan.ref.loanLock.newMonthlyPayment = calcResponse.newMonthlyPayment;
                    break;

                case srv.CalculatedValueTypeEnum.LoanDecisionScore:
                    this.wrappedLoan.ref.financialInfo.ficoScore = calcResponse.loanDecisionScore;
                    break;
                case srv.CalculatedValueTypeEnum.FullyIndexedRate:
                    this.wrappedLoan.ref.fullyIndexedRate = calcResponse.fullyIndexedRate;
                    break;
                case srv.CalculatedValueTypeEnum.IsImpoundMandatory:
                    this.wrappedLoan.ref.stateLtvLimit = calcResponse.stateLtvLimit;
                    this.wrappedLoan.ref.otherInterviewData.selectedImpoundsOption = String(srv.impoundType.taxesAndInsurance);
                    break;
                case srv.CalculatedValueTypeEnum.RecoupmentPeriod:
                    this.wrappedLoan.ref.recoupmentPeriodCalculated = calcResponse.recoupmentPeriodResponse;
                    break;
                case srv.CalculatedValueTypeEnum.NetTangibleBenefit:
                    this.updateLoanNTB(calcResponse.ntbRequiredResponse, calcResponse.ntbBenefitActivationResponse);
                    break;
                case srv.CalculatedValueTypeEnum.FHACalculator:
                    this.updateFHA(calcResponse.fhaCalculatorResponse);
                    break;
            }
        }

        /**
        * @desc Updates the net rental instances based on the calculator response.
        */
        private updateNetRental = (netRentalIncomes: srv.IList<srv.IIncomeInfoViewModel>): void => {
            if (!this.wrappedLoan.ref.getTransactionInfoRef())
                return;
            if (!netRentalIncomes)
                netRentalIncomes = new Array<srv.IIncomeInfoViewModel>();

            netRentalIncomes.forEach(nriItem => {
                var income = this.wrappedLoan.ref.getTransactionInfoRef().incomeInfo.lookup(nriItem.incomeInfoId);
                if (!!income) {
                    income.calculatedAmount = nriItem.amount;
                }
            });
        }

        private updateApr = (apr: number) => {
            if (this.wrappedLoan && this.wrappedLoan.ref && this.wrappedLoan.ref.financialInfo)
                this.wrappedLoan.ref.financialInfo.apr = apr;
        }

        private updateSubordinateFee = (subordinateFee: srv.ICostViewModel): void => {
            if (!subordinateFee)
                return;

            if (!lib.replace(this.wrappedLoan.ref.closingCost.costs, subordinateFee, i => i.hudLineNumber == subordinateFee.hudLineNumber))
                this.wrappedLoan.ref.closingCost.costs.push(subordinateFee);
        }

        private updateSectionV = (housingExpenses) => {
            if (this.wrappedLoan && this.wrappedLoan.ref && this.wrappedLoan.ref.housingExpenses)
            {
                this.wrappedLoan.ref.housingExpenses.firstMtgPi = housingExpenses.firstMtgPi;
                this.wrappedLoan.ref.housingExpenses.floodInsurance = housingExpenses.floodInsurance;
                this.wrappedLoan.ref.housingExpenses.hazardInsurance = housingExpenses.hazardInsurance;
                this.wrappedLoan.ref.housingExpenses.hoa = housingExpenses.hoa;
                this.wrappedLoan.ref.housingExpenses.mtgInsurance = housingExpenses.mtgInsurance;
                this.wrappedLoan.ref.housingExpenses.newFirstMtgPi = housingExpenses.newFirstMtgPi;
                this.wrappedLoan.ref.housingExpenses.newFloodInsurance = housingExpenses.newFloodInsurance;
                this.wrappedLoan.ref.housingExpenses.newHazardInsurance = housingExpenses.newHazardInsurance;
                this.wrappedLoan.ref.housingExpenses.newHoa = housingExpenses.newHoa;
                this.wrappedLoan.ref.housingExpenses.newMtgInsurance = housingExpenses.newMtgInsurance;
                this.wrappedLoan.ref.housingExpenses.newSecondMtgPi = housingExpenses.newSecondMtgPi;
                this.wrappedLoan.ref.housingExpenses.newTaxes = housingExpenses.newTaxes;
                this.wrappedLoan.ref.housingExpenses.other = housingExpenses.other;
                this.wrappedLoan.ref.housingExpenses.rent = housingExpenses.rent;
                this.wrappedLoan.ref.housingExpenses.secondMtgPi = housingExpenses.secondMtgPi;
                this.wrappedLoan.ref.housingExpenses.taxes = housingExpenses.taxes;
                this.wrappedLoan.ref.housingExpenses.addlMortgagees = housingExpenses.addlMortgagees;
            }
        }

        private updateSectionVII = (detailOfTransaction: srv.IDetailsOfTransactionCalculatedViewModel) => {
            this.wrappedLoan.ref.detailsOfTransaction.alterationImprovementsRepairs = detailOfTransaction.alternationsImprovementsRepairs;
            this.wrappedLoan.ref.detailsOfTransaction.borrowerClosingCostPaidBySeller = detailOfTransaction.borrowerClosingCostPaidBySeller;
            this.wrappedLoan.ref.detailsOfTransaction.cashFromToBorrower = detailOfTransaction.castFromToBorrower;
            this.wrappedLoan.ref.detailsOfTransaction.discount = detailOfTransaction.discount;
            this.wrappedLoan.ref.detailsOfTransaction.estimatedClosingCosts = detailOfTransaction.estimatedClosingCosts;
            this.wrappedLoan.ref.detailsOfTransaction.estimatedPrepaidItems = detailOfTransaction.estimatedPrepaidItems;
            this.wrappedLoan.ref.detailsOfTransaction.land = detailOfTransaction.land ;
            this.wrappedLoan.ref.detailsOfTransaction.otherCredits = detailOfTransaction.otherCredits;
            this.wrappedLoan.ref.detailsOfTransaction.pmiMipFundingFee = detailOfTransaction.pmI_MPI_FundingFee;
            this.wrappedLoan.ref.detailsOfTransaction.pmiMipFundingFeeFinanced = detailOfTransaction.pmI_MIP_FundingFeeFinanced;
            this.wrappedLoan.ref.detailsOfTransaction.refinance = detailOfTransaction.refinance;
            this.wrappedLoan.ref.detailsOfTransaction.subordinateFinancing = detailOfTransaction.subordinateFinancing;
            this.wrappedLoan.ref.detailsOfTransaction.totalCosts = detailOfTransaction.totalCosts;
            this.wrappedLoan.ref.detailsOfTransaction.totalLoanAmount = detailOfTransaction.totalLoanAmount;
            this.wrappedLoan.ref.detailsOfTransaction.refinanceWithDebts = detailOfTransaction.refinanceWithDebts;
            this.wrappedLoan.ref.detailsOfTransaction.mLoanAmount = detailOfTransaction.mLoanAmount;
            this.wrappedLoan.ref.detailsOfTransaction.oLoanAmount = detailOfTransaction.oLoanAmount;

        }

        private updateMonthlyPayment = (monthlyPayment: number) => {
            if (this.wrappedLoan && this.wrappedLoan.ref && this.wrappedLoan.ref.financialInfo)
                this.wrappedLoan.ref.financialInfo.monthlyPayment =  monthlyPayment;
        }

        private updateCltv = (cltv: number, calculatedSummaryValues: srv.ICalculatedSummaryValues) => {
            if (calculatedSummaryValues)
                calculatedSummaryValues.Cltv = cltv;

            if (this.wrappedLoan && this.wrappedLoan.ref && this.wrappedLoan.ref.getSubjectProperty()) {
                this.wrappedLoan.ref.getSubjectProperty().cltv = cltv.toString();
            }
        }

        private updateInterestAmountPerDiem = (interestAmountPerDiem: number) => {
            for (var i = 0; i < this.wrappedLoan.ref.closingCost.costs.length; i++) {
                var cost = <any>this.wrappedLoan.ref.closingCost.costs[i];
                if (cost.hudLineNumber == '901') {
                    this.wrappedLoan.ref.closingCost.costs[i].amount = interestAmountPerDiem;
                }
            }
        }

        private updateDTIAndHousingRatio = (dtiAndHousingRatio: srv.ICombinedDTIandHousingRatioCalculatedViewModel, calculatedSummaryValues: srv.ICalculatedSummaryValues) => {
            if (calculatedSummaryValues) {
                calculatedSummaryValues.Dti = dtiAndHousingRatio.combinedDTIDU;
                calculatedSummaryValues.HousingExpense = dtiAndHousingRatio.combinedHousingRatioDU;
            }


            if (this.wrappedLoan && this.wrappedLoan.ref && this.wrappedLoan.ref.financialInfo && this.wrappedLoan.ref.loanId) {
                this.wrappedLoan.ref.financialInfo.dti = dtiAndHousingRatio.combinedDTIDU;
                this.wrappedLoan.ref.financialInfo.dtiDu = dtiAndHousingRatio.combinedDTIDU;
                this.wrappedLoan.ref.financialInfo.dtiLp = dtiAndHousingRatio.combinedDTILP;
                this.wrappedLoan.ref.financialInfo.dtiFha = dtiAndHousingRatio.combinedDTIFHA;
                this.wrappedLoan.ref.financialInfo.qualifyingDtiDu = dtiAndHousingRatio.qualCombinedDTIDU;
                this.wrappedLoan.ref.financialInfo.qualifyingDtiLp = dtiAndHousingRatio.qualCombinedDTILP;
                this.wrappedLoan.ref.financialInfo.qualifyingDtiFha = dtiAndHousingRatio.qualCombinedDTIFHA;
                this.wrappedLoan.ref.financialInfo.housingRatioDu = dtiAndHousingRatio.combinedHousingRatioDU ;
                this.wrappedLoan.ref.financialInfo.housingRatioLp = dtiAndHousingRatio.combinedHousingRatioLP;
                this.wrappedLoan.ref.financialInfo.housingRatioFha = dtiAndHousingRatio.combinedHousingRatioFHA;

                console.log('Updating DTI: ' + dtiAndHousingRatio.combinedDTIDU);
                console.log('Updating HousingRatio: ' + dtiAndHousingRatio.combinedHousingRatioDU);
            }
        }

        private updateHcltv = (hcltv: number, calculatedSummaryValues: srv.ICalculatedSummaryValues) => {
            if (calculatedSummaryValues)
                calculatedSummaryValues.Hcltv = hcltv;

            if (this.wrappedLoan && this.wrappedLoan.ref && this.wrappedLoan.ref.getSubjectProperty()) {
                this.wrappedLoan.ref.getSubjectProperty().hcltv = hcltv.toString();
            }
        }

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

        private updateLtv = (ltv: number, calculatedSummaryValues: srv.ICalculatedSummaryValues) => {
            if (calculatedSummaryValues)
                calculatedSummaryValues.Ltv = ltv;

            if (this.wrappedLoan && this.wrappedLoan.ref && this.wrappedLoan.ref.getSubjectProperty()) {
                this.wrappedLoan.ref.getSubjectProperty().ltv = ltv.toString();
            }
        }
        
        private recalculateCosts = (hudCosts) => {

            if (hudCosts && this.wrappedLoan.ref && this.wrappedLoan.ref.closingCost && this.wrappedLoan.ref.closingCost.costs) {
                this.wrappedLoan.ref.closingCost.costs = hudCosts;
            }
        }
        // only perform replacement, no additions
        private updateLoanCost = (hudCost) => {

            if (!this.wrappedLoan.ref.closingCost.costs)
                this.wrappedLoan.ref.closingCost.costs = [hudCost];
            else {
                for (var i = 0; i < this.wrappedLoan.ref.closingCost.costs.length; i++) {
                    var cost = <any>this.wrappedLoan.ref.closingCost.costs[i];
                    if (hudCost.hudLineNumber === cost.hudLineNumber &&
                        hudCost.subHUDLineNumber === cost.subHUDLineNumber &&
                        hudCost.originalHUDLineNumber === cost.originalHUDLineNumber &&
                        hudCost.originalSubHUDLineNumber === cost.originalSubHUDLineNumber) {
                            this.wrappedLoan.ref.closingCost.costs[i] = hudCost;
                            if (cost.hudLineNumber == '802' && cost.subHUDLineNumber === 'a' ) {
                                this.wrappedLoan.ref.closingCost.totalLenderRebate = cost.amount;
                            }
                            return;
                    } 
                }
                this.wrappedLoan.ref.closingCost.costs.push(hudCost);
            }
        }

        private updateLoanCosts = (hudCosts) => {
            if (hudCosts && this.wrappedLoan.ref && this.wrappedLoan.ref.closingCost && this.wrappedLoan.ref.closingCost.costs)
                hudCosts.forEach(hudCost => this.updateLoanCost(hudCost));
        }

        private getTotalClosingCosts = (): number => {
            if (!this.wrappedLoan.ref.closingCost || !this.wrappedLoan.ref.closingCost.totals || !this.wrappedLoan.ref.closingCost.totals.closingCosts)
                return 0;
            
            return this.wrappedLoan.ref.closingCost.totals.closingCosts.borrowerTotal;
        }

        private updateLoanNTB = (ntbRequiredResponse: srv.INtbRequiredResponse, ntbBenefitActivationResponse: srv.INtbBenefitActivationResponse) => {
            this.wrappedLoan.ref.ntbRequired = ntbRequiredResponse.ntbRequired;

            if (ntbRequiredResponse.ntbRequired) {
                this.ntbCenterService.updateLoanNTB(this.wrappedLoan, ntbBenefitActivationResponse);
            }
        }

        private updateFHA = (fhaCalculatorResponse: srv.IFHACalculatorResponse) => {
            this.wrappedLoan.ref.fhaScenarioViewModel.fhaCalculatorResults = fhaCalculatorResponse;
            if (fhaCalculatorResponse.isEligible) {
                this.wrappedLoan.ref.govermentEligibility = srv.GovermentEligibilityEnum.FHAEligible;
            }
            else {
                this.wrappedLoan.ref.govermentEligibility = srv.GovermentEligibilityEnum.FHANotEligible;
            }
        }
    }
    angular.module('loan.calculator', ['CalculatorModule']).service(LoanCalculator.className, LoanCalculator);
}