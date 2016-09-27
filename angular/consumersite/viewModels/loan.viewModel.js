/// <reference path='../../../angular/ts/extendedViewModels/loan.extendedViewModel.ts' />
/// <reference path='../../../angular/ts/extendedViewModels/loanApplication.extendedViewModel.ts' />
/// <reference path='loanApplication.viewModel.ts' />
/// <reference path='property.viewModel.ts' />
var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        (function (CreditStatusEnum) {
            CreditStatusEnum[CreditStatusEnum["None"] = 0] = "None";
            CreditStatusEnum[CreditStatusEnum["NotInitiated"] = 1] = "NotInitiated";
            CreditStatusEnum[CreditStatusEnum["InProgress"] = 2] = "InProgress";
            CreditStatusEnum[CreditStatusEnum["CompletedSuccess"] = 3] = "CompletedSuccess";
            CreditStatusEnum[CreditStatusEnum["CompletedError"] = 4] = "CompletedError";
        })(vm.CreditStatusEnum || (vm.CreditStatusEnum = {}));
        var CreditStatusEnum = vm.CreditStatusEnum;
        var Loan = (function () {
            function Loan(applicationData, loanVM, $filter) {
                //
                // @todo:
                //      Refine object model usage for PropertyViewModel
                //
                var _this = this;
                this.isCreditInitiated = function () {
                    return _this.creditStatusCd > 1 /* NotInitiated */;
                };
                this.isCreditInProgress = function () {
                    return _this.creditStatusCd == 2 /* InProgress */;
                };
                this.isCreditCompleted = function () {
                    return _this.creditStatusCd > 2 /* InProgress */;
                };
                this.isCreditSuccessful = function () {
                    return _this.creditStatusCd == 3 /* CompletedSuccess */;
                };
                this.canRunCredit = function () {
                    // @todo-cc: review and harden implementation
                    //      Need to check before save but run after save , this could be better encapsulated ; pre-Save state tuple should be implemented (remove credit specific flags)
                    var canRunCredit = false;
                    // Run only if we have enough data
                    var borrower = _this.getLoan().getLoanApplications()[0].getBorrower();
                    if (!!borrower) {
                        var ssn = borrower.ssn;
                        if (ssn && ssn.length == 9) {
                            canRunCredit = true;
                        }
                    }
                    return canRunCredit;
                };
                //// constructor(applicationData?: any) {
                //constructor(applicationData: any, loan?: cls.LoanViewModel) {
                //    if (!!loan) {
                //        this.constructExisting(applicationData, loan);
                //    }
                //    else {
                //        this.constructNew(applicationData);
                //    }
                //}
                this.constructExisting = function (applicationData, loan) {
                    //
                    // @todo:
                    // Refine object model usage for PropertyViewModel
                    //
                    // Loan
                    _this.getLoan = function () { return loan; };
                    if (!!applicationData) {
                        cls.LoanViewModel["_lookupInfo"] = applicationData.lookup;
                    }
                    // Loan Application ; Loan and LoanApplication have same ID
                    _this.loanApp = new vm.LoanApplication(loan.getLoanApplications()[0]);
                    loan.loanId = _this.loanApp.loanApplicationId;
                    // Facade Subject Property
                    _this.property = new vm.Property(loan.subjectProperty);
                    // Default interview if neeeded
                    if (!loan.otherInterviewData) {
                        loan.otherInterviewData = new srv.cls.OtherInterviewDataViewModel();
                    }
                    // Pricing , not too important
                    _this._pricingProduct = null; //todo: populate and tie to underlying loan app...
                };
                this.calculateDesiredLoanAmount = function () {
                    if (_this.loanPurposeType == 1 /* Purchase */) {
                        _this.calculateDesiredLoanAmountPurch();
                    }
                    else {
                        _this.calculateDesiredLoanAmountRefi();
                    }
                };
                this.calculateDesiredLoanAmountPurch = function () {
                    _this.loanAmount = _this.purchasePrice - _this.downPaymentAmount;
                };
                this.calculateDesiredLoanAmountRefi = function () {
                    // "0"; // Do not payoff ; // " ; 1:Do not payoff", " ; 2:Payoff at closing", " ; 3:Payoff and don't close account", " ; 4:Payoff and close account"]
                    var subordinateLienAmt;
                    switch (_this.secondMortgageRefinanceComment) {
                        case "2":
                        case "3":
                        case "4":
                            subordinateLienAmt = _this.outstandingBalance;
                            break;
                        default:
                            subordinateLienAmt = 0;
                            break;
                    }
                    _this.loanAmount = lib.reduceNumeric(function (x, y) { return x + y; }, _this.firstMortgage, _this.cashOutAmount, subordinateLienAmt);
                };
                this._haveDefaultsForPricingBeenSet = false;
                this.setDefaultsForPricing = function () {
                    if (_this._haveDefaultsForPricingBeenSet) {
                        return;
                    }
                    _this.setDefaultsForPricingImpl();
                };
                this.resetDefaultsForPricing = function (loanPurpose) {
                    _this.setDefaultsForPricingImpl(loanPurpose);
                };
                this.setDefaultsForPricingImpl = function (loanPurpose) {
                    //
                    // Convenience variables
                    //
                    var lvm = _this.getLoan();
                    var sp = lvm.getSubjectProperty();
                    var ivw = lvm.otherInterviewData;
                    var fi = lvm.financialInfo;
                    //
                    // COLUMN 1
                    //
                    // @todo
                    _this.purchasePrice = 300000;
                    _this.downPaymentAmount = 60000;
                    ivw.firstTimeHomebuyer = false;
                    //Loan Purpose
                    //ng-model="pricingCntrl.loan.loanPurposeType"
                    if (!!loanPurpose) {
                        _this.getLoan().loanPurposeType = loanPurpose;
                    }
                    else {
                        _this.getLoan().loanPurposeType = 2 /* Refinance */;
                    }
                    //Zip Code
                    //ng-model="pricingCntrl.loan.getLoan().getSubjectProperty().zipCode"
                    sp.zipCode = "90001";
                    //Existing 1st Mortgage
                    //ng-model="pricingCntrl.loan.getLoan().otherInterviewData.firstMortgage"
                    _this.firstMortgage = 300000;
                    //Cash Out
                    //ng-model="pricingCntrl.loan.getLoan().financialInfo.cashOutAmount"
                    _this.cashOutAmount = 0;
                    //Estimated Property Value
                    //ng-model="pricingCntrl.loan.getLoan().getSubjectProperty().currentEstimatedValue"
                    sp.currentEstimatedValue = 400000;
                    //Credit Score
                    //ng-model="pricingCntrl.loan.getLoan().otherInterviewData.selectedDecisionScoreRange"
                    ivw.selectedDecisionScoreRange = "4"; // @todo-cc: gotta use the enum for 720-739
                    //
                    // COLUMN 2
                    //
                    //Property Type
                    //ng-model="pricingCntrl.propertyType"
                    sp.propertyType = 1 /* SingleFamily */.toString();
                    //Number of Units
                    //ng-model="pricingCntrl.NumberOfUnits"
                    sp.numberOfUnits = 1;
                    //How is the Home Used?
                    //ng-model="pricingCntrl.homeUseType"
                    _this.getLoan().active.occupancyType = 1 /* PrimaryResidence */;
                    //Taxes & Insurance (Impounds)
                    //ng-model="pricingCntrl.taxType"
                    ivw.selectedImpoundsOption = 0 /* taxesAndInsurance */.toString();
                    //Employment Status
                    //ng-model="pricingCntrl.employmentStatusType"
                    _this.loanApp.borrower.employments[0].employmentType = 1 /* SalariedEmployee */;
                    //
                    // COLUMN 3
                    //
                    //Have a 2nd Mortgage?
                    //ng-model="pricingCntrl.secondMortgageType"
                    ivw.existingSecondMortgage = "0"; // No. // 0:"No" ; 1:"Fixed Rate" ; 2:"Home Equity Line of Credit"
                    //Payoff a 2nd Mortgage?
                    //ng-model="pricingCntrl.payoffSecondMortgageType"
                    _this.secondMortgageRefinanceComment = "1"; // Do not payoff ; // " ; 1:Do not payoff", " ; 2:Payoff at closing", " ; 3:Payoff and don't close account", " ; 4:Payoff and close account"]
                    //HELOC Credit Line Limit
                    //ng-model="pricingCntrl.helocCreditLimit"
                    ivw.maximumCreditLine = 0;
                    //HELOC Balance --or-- 2nd mgtg amt
                    //ng-model="pricingCntrl.helocBalance"
                    _this.outstandingBalance = 0;
                    _this._haveDefaultsForPricingBeenSet = true;
                };
                var loan = new cls.LoanViewModel(loanVM, $filter);
                // ridiculous ; english language has dissapointed by lack of words to express
                var loanInner = new cls.LoanViewModel();
                loan["loan"] = loanInner;
                loan.enableDigitalDocsCall = true;
                if (!!applicationData) {
                    cls.LoanViewModel["_lookupInfo"] = applicationData.lookup;
                }
                this.getLoan = function () { return loan; };
                this.loanApp = new vm.LoanApplication(loan.getLoanApplications()[0]);
                // Loan and LoanApplication have same ID
                loan.loanId = this.loanApp.loanApplicationId;
                // @todo-cc: Review , hard-coded , copy/paste , etc.
                if (!loanVM) {
                    loan.status = 2;
                    loan.currentMilestone = 1;
                    loan.loanNumber = 'Pending';
                    loan.getLoanApplications()[0].declarations.loanOriginatorSource = 3; // @todo-cc: use enum [<option value="3">By the applicant and submitted via email or the Internet</option>]
                }
                if (loanVM) {
                    this.property = new vm.Property(loan.getSubjectProperty());
                    this.loanApp = new vm.LoanApplication(loan.active);
                }
                else {
                    var property = new cls.PropertyViewModel(loan.getTransactionInfoRef());
                    property.needPreApproval = true;
                    property.isSubjectProperty = true;
                    property.loanId = loan.loanId;
                    property.loanApplicationId = this.loanApp.loanApplicationId;
                    property.PropertyType = "1"; // @todo: USE ENUM
                    loan.setSubjectProperty(property);
                    this.property = new vm.Property(loan.subjectProperty);
                }
                if (!loan.otherInterviewData) {
                    loan.otherInterviewData = new srv.cls.OtherInterviewDataViewModel();
                }
                this.setDefaultsForPricing();
                this._pricingProduct = null; //todo: populate and tie to underlying loan app...
            }
            Object.defineProperty(Loan.prototype, "docusignSigningRoom", {
                get: function () {
                    return this._docusignSigningRoom;
                },
                set: function (val) {
                    this._docusignSigningRoom = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loan.prototype, "loanNumber", {
                get: function () {
                    return this.getLoan().loanNumber;
                },
                set: function (val) {
                    //read only
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loan.prototype, "creditStatusCd", {
                get: function () {
                    return this._creditStatusCd;
                },
                set: function (hasCreditInitiated) {
                    this._creditStatusCd = hasCreditInitiated;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loan.prototype, "loanPurposeType", {
                get: function () {
                    return this.getLoan().loanPurposeType;
                },
                set: function (loanPurposeType) {
                    var lvm = this.getLoan();
                    lvm.loanPurposeType = loanPurposeType;
                    // ridiculous ; english language has dissapointed by lack of words to express
                    var lvmInner = lvm["loan"];
                    lvmInner.loanPurposeType = loanPurposeType;
                    // reset defaults for Pricing UI
                    this.resetDefaultsForPricing(loanPurposeType);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loan.prototype, "pricingProduct", {
                get: function () {
                    return this._pricingProduct;
                },
                set: function (value) {
                    this._pricingProduct = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loan.prototype, "loanAmount", {
                get: function () {
                    return this.getLoan().loanAmount;
                },
                set: function (loanAmount) {
                    this.getLoan().loanAmount = loanAmount;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loan.prototype, "downPaymentAmount", {
                //loanAmount
                //purchasePrice
                //downPaymentAmount
                //secondMortgageRefinanceComment
                //firstMortgage
                //cashOutAmount
                //outstandingBalance
                get: function () {
                    var paramnullnum;
                    var downPaymentAmount = this.getLoan().downPaymentAmount(paramnullnum);
                    return downPaymentAmount;
                },
                set: function (downPaymentAmount) {
                    this.getLoan().downPaymentAmount(downPaymentAmount);
                    // @dependency: LoanViewModel::loanAmount ("Desired Loan Amount")
                    this.calculateDesiredLoanAmount();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loan.prototype, "purchasePrice", {
                get: function () {
                    return this.property.purchasePrice;
                },
                set: function (purchasePrice) {
                    this.property.purchasePrice = purchasePrice;
                    // @dependency: LoanViewModel::loanAmount ("Desired Loan Amount")
                    this.calculateDesiredLoanAmount();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loan.prototype, "firstMortgage", {
                get: function () {
                    return this.getLoan().otherInterviewData.firstMortgage;
                },
                set: function (firstMortgage) {
                    this.getLoan().otherInterviewData.firstMortgage = firstMortgage;
                    // @dependency: LoanViewModel::loanAmount ("Desired Loan Amount")
                    this.calculateDesiredLoanAmount();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loan.prototype, "cashOutAmount", {
                get: function () {
                    return this.getLoan().financialInfo.cashOutAmount;
                },
                set: function (cashOutAmount) {
                    this.getLoan().financialInfo.cashOutAmount = cashOutAmount;
                    // @dependency: LoanViewModel::loanAmount ("Desired Loan Amount")
                    this.calculateDesiredLoanAmount();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loan.prototype, "outstandingBalance", {
                get: function () {
                    return this.getLoan().otherInterviewData.outstandingBalance;
                },
                set: function (outstandingBalance) {
                    this.getLoan().otherInterviewData.outstandingBalance = outstandingBalance;
                    // @dependency: LoanViewModel::loanAmount ("Desired Loan Amount")
                    this.calculateDesiredLoanAmount();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loan.prototype, "secondMortgageRefinanceComment", {
                get: function () {
                    return this.getLoan().otherInterviewData.secondMortgageRefinanceComment;
                },
                set: function (secondMortgageRefinanceComment) {
                    this.getLoan().otherInterviewData.secondMortgageRefinanceComment = secondMortgageRefinanceComment;
                    // @dependency: LoanViewModel::loanAmount ("Desired Loan Amount")
                    this.calculateDesiredLoanAmount();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Loan.prototype, "pricingFilter", {
                get: function () {
                    return this._pricingFilter;
                },
                set: function (val) {
                    this._pricingFilter = val;
                },
                enumerable: true,
                configurable: true
            });
            return Loan;
        })();
        vm.Loan = Loan;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=loan.viewModel.js.map