/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
var ntb;
(function (ntb) {
    var service;
    (function (service) {
        'use strict';
        var NTBCenterService = (function () {
            function NTBCenterService($resource, apiRoot, costDetailsSvc, costDetailsHelpers, loanDetailsSvc) {
                var _this = this;
                this.$resource = $resource;
                this.apiRoot = apiRoot;
                this.costDetailsSvc = costDetailsSvc;
                this.costDetailsHelpers = costDetailsHelpers;
                this.loanDetailsSvc = loanDetailsSvc;
                this.calculateCurrentMonthlyObligations = function (wrappedLoan) {
                    return _this.loanDetailsSvc.totalCurrentExpenses(wrappedLoan.ref.housingExpenses.rent, wrappedLoan.ref.housingExpenses.firstMtgPi, wrappedLoan.ref.housingExpenses.secondMtgPi, wrappedLoan.ref.loanPurposeType, wrappedLoan.ref.getSubjectProperty().occupancyType, wrappedLoan.ref.getSubjectProperty, wrappedLoan.ref.primary.getBorrower().getCurrentAddress) + _this.loanDetailsSvc.getAdditionalMortgages(wrappedLoan.ref.getLoanApplications(), wrappedLoan.ref.loanPurposeType, wrappedLoan.ref.getSubjectProperty().occupancyType, wrappedLoan.ref.getSubjectProperty, wrappedLoan.ref.primary.getBorrower().getCurrentAddress, function () {
                        return wrappedLoan.ref.primary;
                    });
                };
                this.calculateNTB = function (wrappedLoan) {
                    return _this.$resource(_this.apiRoot + '/NtbBenefitActivations').save(_this.getNtbBenefitActivationRequest(wrappedLoan));
                };
                this.getNtbBenefitActivationRequest = function (wrappedLoan) {
                    var ntbBenefitActivationRequest = new srv.cls.NtbBenefitActivationRequest();
                    //ntbBenefitActivationRequest.debtTotalMonthlyPayments = 10;
                    ntbBenefitActivationRequest.geoStateUS = wrappedLoan.ref.getSubjectProperty().stateId;
                    ntbBenefitActivationRequest.existingLoans = [];
                    var loan = _this.fillNtbLoan(wrappedLoan.ref.FirstLienReoItem, wrappedLoan);
                    if (loan != null) {
                        ntbBenefitActivationRequest.existingLoans.push(loan);
                        var secondLoan = _this.fillNtbLoan(wrappedLoan.ref.JuniorLienReoItem, wrappedLoan);
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
                    ntbBenefitActivationRequest.proposedLoan.totalClosingCosts = _this.costDetailsSvc.getBorrowerTotal();
                    ntbBenefitActivationRequest.proposedLoan.amortizationType = wrappedLoan.ref.financialInfo.amortizationType;
                    ntbBenefitActivationRequest.proposedLoan.fullyIndexedRate = wrappedLoan.ref.fullyIndexedRate;
                    ntbBenefitActivationRequest.proposedLoan.hasPrepaymentPenalty = wrappedLoan.ref.prePaymentPenalty;
                    ntbBenefitActivationRequest.proposedLoan.prepaymentPenaltyAmount = wrappedLoan.ref.prePaymentAmount;
                    ntbBenefitActivationRequest.proposedLoan.term = wrappedLoan.ref.financialInfo.term;
                    ntbBenefitActivationRequest.proposedLoan.floodInsurance = wrappedLoan.ref.housingExpenses.floodInsurance;
                    ntbBenefitActivationRequest.proposedLoan.hazardInsurance = wrappedLoan.ref.housingExpenses.hazardInsurance;
                    ntbBenefitActivationRequest.proposedLoan.haveNegativeAmortization = wrappedLoan.ref.negativeAmortization;
                    // sum all liabilities taht have comment PayOff  At Close
                    ntbBenefitActivationRequest.proposedLoan.totalPaymentByLiability = lib.summate(wrappedLoan.ref.primary.getAllLiabilitiesCombined(), function (p) { return p.debtCommentId == 4 /* PayoffAtClose */; }, function (l) { return l.minPayment; });
                    ntbBenefitActivationRequest.proposedLoan.totalClosingCostsWithoutG = _this.costDetailsSvc.totalClosingCostsWithoutG();
                    var reos = wrappedLoan.ref.active.reos.filter(function (item) {
                        return !item.isSecondaryPartyRecord;
                    });
                    ntbBenefitActivationRequest.proposedLoan.totalReosPayment = lib.summateAll(reos, function (r) { return r.minPayment; });
                    return ntbBenefitActivationRequest;
                };
                this.fillNtbLoan = function (lienReoItem, wrappedLoan) {
                    if (lienReoItem == null)
                        return null;
                    var loan = new srv.cls.Loan();
                    loan.lienPosition = lienReoItem.lienPosition;
                    //loan.noteRate = this.wrappedLoan.ref.financialInfo.noteRate;
                    //loan.isqm = this.wrappedLoan.ref.FirstLienReoItem.reoInfo.;
                    loan.dti = wrappedLoan.ref.financialInfo.dti;
                    loan.recoupmentTime = wrappedLoan.ref.recoupmentPeriodCalculated.recoupmentPeriod;
                    loan.monthlyMortgageInsurance = _this.calculateCurrentMonthlyObligations(wrappedLoan);
                    //loan.monthlyPrincipleInterest = this.wrappedLoan.ref.FirstLienReoItem.lienPosition;
                    //loan.monthlyTaxes = this.wrappedLoan.ref.FirstLienReoItem.lienPosition;
                    loan.mortgageType = wrappedLoan.ref.financialInfo.mortgageType;
                    //loan.prepaids = this.wrappedLoan.ref.financialInfo.pre;
                    loan.totalClosingCosts = _this.costDetailsSvc.getBorrowerTotal();
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
                };
                this.updateLoanNTB = function (wrappedLoan, ntbBenefitActivationResponse) {
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
                                        var activationResponse = lib.findFirst(ntbBenefitActivationResponse.ntbBenefitActivations, function (x) { return x.ntbBenefit == wrappedLoan.ref.ntbBenefitActivations[i].ntbBenefitEnumId; });
                                        if (activationResponse != null) {
                                            wrappedLoan.ref.ntbBenefitActivations[i].active = activationResponse.active;
                                            wrappedLoan.ref.ntbBenefitActivations[i].ntbBenefitEnumId = activationResponse.ntbBenefit;
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                this.apiRoot = apiRoot + 'NetTangibleBenefitService';
            }
            NTBCenterService.className = 'ntbCenterService';
            NTBCenterService.$inject = ['$resource', 'apiRoot', 'costDetailsSvc', 'costDetailsHelpers', 'loanDetailsSvc'];
            return NTBCenterService;
        })();
        service.NTBCenterService = NTBCenterService;
        angular.module('ntbCenter').service('ntbCenterService', NTBCenterService);
    })(service = ntb.service || (ntb.service = {}));
})(ntb || (ntb = {}));
//# sourceMappingURL=ntbcenter.service.js.map