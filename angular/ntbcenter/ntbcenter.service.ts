/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />

module ntb.service {
    'use strict';

    export interface INTBCenterService {
        calculateNTB(wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>): ng.resource.IResource<any>;
        updateLoanNTB(wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, ntbBenefitActivationResponse: srv.INtbBenefitActivationResponse);
        calculateCurrentMonthlyObligations(wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>);
        getNtbBenefitActivationRequest(wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>): srv.cls.NtbBenefitActivationRequest;
    }

    export class NTBCenterService implements INTBCenterService {

        static className = 'ntbCenterService';
        static $inject = ['$resource', 'apiRoot', 'costDetailsSvc', 'costDetailsHelpers', 'loanDetailsSvc'];

        constructor(private $resource: angular.resource.IResourceService, private apiRoot: string, private costDetailsSvc, private costDetailsHelpers, private loanDetailsSvc) {
            this.apiRoot = apiRoot + 'NetTangibleBenefitService';
        }

        calculateCurrentMonthlyObligations = (wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>): number => {
            return this.loanDetailsSvc.totalCurrentExpenses(wrappedLoan.ref.housingExpenses.rent, wrappedLoan.ref.housingExpenses.firstMtgPi, wrappedLoan.ref.housingExpenses.secondMtgPi, wrappedLoan.ref.loanPurposeType, wrappedLoan.ref.getSubjectProperty().occupancyType, wrappedLoan.ref.getSubjectProperty, wrappedLoan.ref.primary.getBorrower().getCurrentAddress) +
                this.loanDetailsSvc.getAdditionalMortgages(wrappedLoan.ref.getLoanApplications(), wrappedLoan.ref.loanPurposeType, wrappedLoan.ref.getSubjectProperty().occupancyType, wrappedLoan.ref.getSubjectProperty, wrappedLoan.ref.primary.getBorrower().getCurrentAddress, function () { return wrappedLoan.ref.primary; });
        }

        calculateNTB = (wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>): ng.resource.IResource<any> => {
            return this.$resource(this.apiRoot + '/NtbBenefitActivations').save(this.getNtbBenefitActivationRequest(wrappedLoan));
        }

        getNtbBenefitActivationRequest = (wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>): srv.cls.NtbBenefitActivationRequest => {

            var ntbBenefitActivationRequest = new srv.cls.NtbBenefitActivationRequest();

            //ntbBenefitActivationRequest.debtTotalMonthlyPayments = 10;
            ntbBenefitActivationRequest.geoStateUS = wrappedLoan.ref.getSubjectProperty().stateId;

            ntbBenefitActivationRequest.existingLoans = [];

            var loan = this.fillNtbLoan(wrappedLoan.ref.FirstLienReoItem, wrappedLoan);
            if (loan != null) {
                ntbBenefitActivationRequest.existingLoans.push(loan);
                var secondLoan = this.fillNtbLoan(wrappedLoan.ref.JuniorLienReoItem, wrappedLoan);
                if (secondLoan != null)
                    ntbBenefitActivationRequest.existingLoans.push(secondLoan);
            }

            ntbBenefitActivationRequest.proposedLoan = new srv.cls.Loan();

            ntbBenefitActivationRequest.proposedLoan.loanAmount = wrappedLoan.ref.loanAmount;
            ntbBenefitActivationRequest.proposedLoan.dti = wrappedLoan.ref.financialInfo.dti;
            ntbBenefitActivationRequest.proposedLoan.isBalloon = wrappedLoan.ref.financialInfo.isBaloonPayment;
            ntbBenefitActivationRequest.proposedLoan.monthlyMortgageInsurance = wrappedLoan.ref.loanLock.newMonthlyPayment;
            ntbBenefitActivationRequest.proposedLoan.mortgageType = wrappedLoan.ref.financialInfo.mortgageType;
            //ntbBenefitActivationRequest.proposedLoan.noteRate = this.wrappedLoan.ref.financialInfo.noteRate;
            ntbBenefitActivationRequest.proposedLoan.interestRate = wrappedLoan.ref.financialInfo.baseInterestRate;
            ntbBenefitActivationRequest.proposedLoan.totalCashout = wrappedLoan.ref.CashFromToBorrower;
            ntbBenefitActivationRequest.proposedLoan.totalClosingCosts = this.costDetailsSvc.getBorrowerTotal();
            ntbBenefitActivationRequest.proposedLoan.amortizationType = wrappedLoan.ref.financialInfo.amortizationType;
            ntbBenefitActivationRequest.proposedLoan.fullyIndexedRate = wrappedLoan.ref.fullyIndexedRate;
            ntbBenefitActivationRequest.proposedLoan.hasPrepaymentPenalty = wrappedLoan.ref.prePaymentPenalty;
            ntbBenefitActivationRequest.proposedLoan.prepaymentPenaltyAmount = wrappedLoan.ref.prePaymentAmount;
            ntbBenefitActivationRequest.proposedLoan.term = wrappedLoan.ref.financialInfo.term;
            ntbBenefitActivationRequest.proposedLoan.floodInsurance = wrappedLoan.ref.housingExpenses.floodInsurance;
            ntbBenefitActivationRequest.proposedLoan.hazardInsurance = wrappedLoan.ref.housingExpenses.hazardInsurance;
            ntbBenefitActivationRequest.proposedLoan.haveNegativeAmortization = wrappedLoan.ref.negativeAmortization;
            // sum all liabilities taht have comment PayOff  At Close
            ntbBenefitActivationRequest.proposedLoan.totalPaymentByLiability = lib.summate(wrappedLoan.ref.primary.getAllLiabilitiesCombined(),
                p => p.debtCommentId == srv.DebtCommentTypeEnum.PayoffAtClose, l => l.minPayment);
            ntbBenefitActivationRequest.proposedLoan.totalClosingCostsWithoutG = this.costDetailsSvc.totalClosingCostsWithoutG();
            var reos: srv.IList<srv.ILiabilityViewModel> = wrappedLoan.ref.active.reos.filter((item: srv.ILiabilityViewModel) => { return !item.isSecondaryPartyRecord; });
            ntbBenefitActivationRequest.proposedLoan.totalReosPayment = lib.summateAll(reos, r => r.minPayment);

            return ntbBenefitActivationRequest;
        }

        private fillNtbLoan = (lienReoItem: srv.ILiabilityViewModel, wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>): srv.cls.Loan => {
            if (lienReoItem == null)
                return null;

            var loan = new srv.cls.Loan();

            loan.lienPosition = lienReoItem.lienPosition;
            //loan.noteRate = this.wrappedLoan.ref.financialInfo.noteRate;
            //loan.isqm = this.wrappedLoan.ref.FirstLienReoItem.reoInfo.;
            loan.dti = wrappedLoan.ref.financialInfo.dti;
            loan.recoupmentTime = wrappedLoan.ref.recoupmentPeriodCalculated.recoupmentPeriod;
            loan.monthlyMortgageInsurance = this.calculateCurrentMonthlyObligations(wrappedLoan);

            //loan.monthlyPrincipleInterest = this.wrappedLoan.ref.FirstLienReoItem.lienPosition;
            //loan.monthlyTaxes = this.wrappedLoan.ref.FirstLienReoItem.lienPosition;
            loan.mortgageType = wrappedLoan.ref.financialInfo.mortgageType;
            //loan.prepaids = this.wrappedLoan.ref.financialInfo.pre;
            loan.totalClosingCosts = this.costDetailsSvc.getBorrowerTotal();

            loan.loanAmount = lienReoItem.unpaidBalance;

            loan.lienTotalPayment = lienReoItem.getTotalPayments();

            if (lienReoItem.reoInfo != null) {
                loan.amortizationType = lienReoItem.reoInfo.amortizationType;
                loan.fullyIndexedRate = lienReoItem.reoInfo.fullyIndexedRate;
                loan.hasPrepaymentPenalty = lienReoItem.reoInfo.prePaymentPenalty;
                loan.prepaymentPenaltyAmount = lienReoItem.reoInfo.prePaymentAmount;
                loan.term = lienReoItem.reoInfo.loanTerm;
                loan.interestRate = lienReoItem.reoInfo.interestRate;
                loan.haveNegativeAmortization = lienReoItem.reoInfo.negativeAmortizationFeature;
            }

            return loan;
        }

        updateLoanNTB = (wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, ntbBenefitActivationResponse: srv.INtbBenefitActivationResponse) => {
            if (wrappedLoan.ref.ntbBenefitActivations != null && ntbBenefitActivationResponse != null && ntbBenefitActivationResponse.ntbBenefitActivations != null) {
                if (wrappedLoan.ref.ntbBenefitActivations.length == 0) {
                    for (var i = 0; i < ntbBenefitActivationResponse.ntbBenefitActivations.length; i++) {
                        var activation = new srv.cls.NtbActivationViewModel();
                        activation.active = ntbBenefitActivationResponse.ntbBenefitActivations[i].active;
                        activation.ntbBenefitEnumId = ntbBenefitActivationResponse.ntbBenefitActivations[i].ntbBenefit;
                        activation.loanId = wrappedLoan.ref.loanId;
                        activation.isManual = false;
                        wrappedLoan.ref.ntbBenefitActivations.push(activation);
                    }
                }
                else {
                    for (var i = 0; i < ntbBenefitActivationResponse.ntbBenefitActivations.length; i++) {
                        if (wrappedLoan.ref.ntbBenefitActivations[i] != null) {
                            if (wrappedLoan.ref.ntbBenefitActivations[i].isManual != true) {
                                var activationResponse = lib.findFirst(ntbBenefitActivationResponse.ntbBenefitActivations,
                                    x => x.ntbBenefit == wrappedLoan.ref.ntbBenefitActivations[i].ntbBenefitEnumId);

                                if (activationResponse != null) {
                                    wrappedLoan.ref.ntbBenefitActivations[i].active = activationResponse.active;
                                    wrappedLoan.ref.ntbBenefitActivations[i].ntbBenefitEnumId = activationResponse.ntbBenefit;
                                }
                            }
                        }
                    }
                }
            }
        }

    }

    angular.module('ntbCenter').service('ntbCenterService', NTBCenterService);
} 