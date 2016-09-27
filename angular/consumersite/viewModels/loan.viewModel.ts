/// <reference path='../../../angular/ts/extendedViewModels/loan.extendedViewModel.ts' />
/// <reference path='../../../angular/ts/extendedViewModels/loanApplication.extendedViewModel.ts' />
/// <reference path='loanApplication.viewModel.ts' />
/// <reference path='property.viewModel.ts' />

module consumersite.vm {

    export enum CreditStatusEnum {
        None = 0,
        NotInitiated = 1,
        InProgress = 2,
        CompletedSuccess = 3,
        CompletedError = 4,
    }

    export class Loan {

        getLoan: () => cls.LoanViewModel;

        property: Property;
        loanApp: LoanApplication;
        appraisal: Appraisal;
        _pricingProduct: consumersite.vm.PricingRowViewModel;


        //TODO REMOVE THIS
        private _docusignSigningRoom: any;

        get docusignSigningRoom(): any {
            return this._docusignSigningRoom;
        }
        set docusignSigningRoom(val: any) {
            this._docusignSigningRoom = val;
        }

        get loanNumber(): string {
            return this.getLoan().loanNumber;
        }
        set loanNumber(val: string) {
            //read only
        }


        private _creditStatusCd: CreditStatusEnum;
        get creditStatusCd(): CreditStatusEnum {
            return this._creditStatusCd;
        }
        set creditStatusCd(hasCreditInitiated: CreditStatusEnum) {
            this._creditStatusCd = hasCreditInitiated;
        }

        isCreditInitiated = (): boolean => {
            return this.creditStatusCd > CreditStatusEnum.NotInitiated;
        }

        isCreditInProgress = (): boolean => {
            return this.creditStatusCd == CreditStatusEnum.InProgress;
        }

        isCreditCompleted = (): boolean => {
            return this.creditStatusCd > CreditStatusEnum.InProgress;
        }

        isCreditSuccessful = (): boolean => {
            return this.creditStatusCd == CreditStatusEnum.CompletedSuccess;
        }

        canRunCredit = (): boolean => {
            // @todo-cc: review and harden implementation
            //      Need to check before save but run after save , this could be better encapsulated ; pre-Save state tuple should be implemented (remove credit specific flags)

            var canRunCredit = false;

            // Run only if we have enough data
            var borrower = this.getLoan().getLoanApplications()[0].getBorrower();
            if (!!borrower) {
                var ssn = borrower.ssn;
                if (ssn && ssn.length == 9) {
                    canRunCredit = true;
                }
            }

            return canRunCredit;
        }


        get loanPurposeType(): srv.LoanPurposeTypeEnum {
            return this.getLoan().loanPurposeType;
        }
        set loanPurposeType(loanPurposeType: srv.LoanPurposeTypeEnum) {
            var lvm = this.getLoan();
            lvm.loanPurposeType = loanPurposeType;

            // ridiculous ; english language has dissapointed by lack of words to express
            var lvmInner: srv.ILoanViewModel = lvm["loan"];
            lvmInner.loanPurposeType = loanPurposeType;

            // reset defaults for Pricing UI
            this.resetDefaultsForPricing(loanPurposeType);
        }
        get pricingProduct(): consumersite.vm.PricingRowViewModel {
            return this._pricingProduct;
        }
        set pricingProduct(value: consumersite.vm.PricingRowViewModel) {
            this._pricingProduct = value;
        }

        get loanAmount() {
            return this.getLoan().loanAmount;
        }
        set loanAmount(loanAmount: number) {
            this.getLoan().loanAmount = loanAmount;
        }

        //// constructor(applicationData?: any) {
        //constructor(applicationData: any, loan?: cls.LoanViewModel) {
        //    if (!!loan) {
        //        this.constructExisting(applicationData, loan);
        //    }
        //    else {
        //        this.constructNew(applicationData);
        //    }
        //}

        private constructExisting = (applicationData: any, loan: cls.LoanViewModel ) => {
            //
            // @todo:
            // Refine object model usage for PropertyViewModel
            //

            // Loan
            this.getLoan = () => loan;
            if (!!applicationData) {
                cls.LoanViewModel["_lookupInfo"] = applicationData.lookup;
            }

            // Loan Application ; Loan and LoanApplication have same ID
            this.loanApp = new LoanApplication(<cls.LoanApplicationViewModel>loan.getLoanApplications()[0]);
            loan.loanId = this.loanApp.loanApplicationId;

            // Facade Subject Property
            this.property = new Property(<cls.PropertyViewModel>loan.subjectProperty);

            // Default interview if neeeded
            if (!loan.otherInterviewData) {
                loan.otherInterviewData = new srv.cls.OtherInterviewDataViewModel();
            }

            // Pricing , not too important
            this._pricingProduct = null; //todo: populate and tie to underlying loan app...
        }

        constructor(applicationData?: any, loanVM?: srv.ILoanViewModel, $filter?: ng.IFilterService) {
            //
            // @todo:
            //      Refine object model usage for PropertyViewModel
            //
            
            var loan = new cls.LoanViewModel(loanVM, $filter);

            // ridiculous ; english language has dissapointed by lack of words to express
            var loanInner = new cls.LoanViewModel();
            loan["loan"] = loanInner;

            loan.enableDigitalDocsCall = true;
            if (!!applicationData) {
                cls.LoanViewModel["_lookupInfo"] = applicationData.lookup;
            }
            this.getLoan = () => loan;

            this.loanApp = new LoanApplication(<cls.LoanApplicationViewModel>loan.getLoanApplications()[0]);
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
                this.property = new Property(<cls.PropertyViewModel>loan.getSubjectProperty());
                this.loanApp = new LoanApplication(<cls.LoanApplicationViewModel>loan.active);
            }
            else {
            var property = new cls.PropertyViewModel(loan.getTransactionInfoRef());
            property.needPreApproval = true;
            property.isSubjectProperty = true;
            property.loanId = loan.loanId;
            property.loanApplicationId = this.loanApp.loanApplicationId;
            property.PropertyType = "1"/*SingleFamily*/; // @todo: USE ENUM
            loan.setSubjectProperty(property);
            this.property = new Property(<cls.PropertyViewModel>loan.subjectProperty);
            }

            if (!loan.otherInterviewData) {
                loan.otherInterviewData = new srv.cls.OtherInterviewDataViewModel();
            }

            this.setDefaultsForPricing();

            this._pricingProduct = null; //todo: populate and tie to underlying loan app...
        }

        //loanAmount
            //purchasePrice
            //downPaymentAmount
            //secondMortgageRefinanceComment
            //firstMortgage
            //cashOutAmount
            //outstandingBalance

        get downPaymentAmount(): number {
            var paramnullnum: number;
            var downPaymentAmount: number = <number>this.getLoan().downPaymentAmount(paramnullnum);
            return downPaymentAmount;
        }
        set downPaymentAmount(downPaymentAmount: number) {
            this.getLoan().downPaymentAmount(downPaymentAmount);

            // @dependency: LoanViewModel::loanAmount ("Desired Loan Amount")
            this.calculateDesiredLoanAmount();
        }

        get purchasePrice(): number {
            return this.property.purchasePrice;
        }
        set purchasePrice(purchasePrice: number) {
            this.property.purchasePrice = purchasePrice;

            // @dependency: LoanViewModel::loanAmount ("Desired Loan Amount")
            this.calculateDesiredLoanAmount();
        }

        get firstMortgage(): number {
            return this.getLoan().otherInterviewData.firstMortgage;
        }
        set firstMortgage(firstMortgage: number) {
            this.getLoan().otherInterviewData.firstMortgage = firstMortgage;

            // @dependency: LoanViewModel::loanAmount ("Desired Loan Amount")
            this.calculateDesiredLoanAmount();
        }

        get cashOutAmount(): number {
            return this.getLoan().financialInfo.cashOutAmount;
        }
        set cashOutAmount(cashOutAmount: number) {
            this.getLoan().financialInfo.cashOutAmount = cashOutAmount;

            // @dependency: LoanViewModel::loanAmount ("Desired Loan Amount")
            this.calculateDesiredLoanAmount();
        }

        get outstandingBalance(): number {
            return this.getLoan().otherInterviewData.outstandingBalance;
        }
        set outstandingBalance(outstandingBalance: number) {
            this.getLoan().otherInterviewData.outstandingBalance = outstandingBalance;

            // @dependency: LoanViewModel::loanAmount ("Desired Loan Amount")
            this.calculateDesiredLoanAmount();
        }

        get secondMortgageRefinanceComment(): string {
            return this.getLoan().otherInterviewData.secondMortgageRefinanceComment;
        }
        set secondMortgageRefinanceComment(secondMortgageRefinanceComment: string) {
            this.getLoan().otherInterviewData.secondMortgageRefinanceComment = secondMortgageRefinanceComment;

            // @dependency: LoanViewModel::loanAmount ("Desired Loan Amount")
            this.calculateDesiredLoanAmount();
        }

        private calculateDesiredLoanAmount = () => {
            if (this.loanPurposeType == srv.LoanPurposeTypeEnum.Purchase) {
                this.calculateDesiredLoanAmountPurch();
            }
            else {
                this.calculateDesiredLoanAmountRefi();
            }
        }

        private calculateDesiredLoanAmountPurch = () => {
            this.loanAmount = this.purchasePrice - this.downPaymentAmount;
        }

        private calculateDesiredLoanAmountRefi = () => {
            // "0"; // Do not payoff ; // " ; 1:Do not payoff", " ; 2:Payoff at closing", " ; 3:Payoff and don't close account", " ; 4:Payoff and close account"]

            var subordinateLienAmt: number;
            switch (this.secondMortgageRefinanceComment) {
                case "2": // Payoff at closing
                case "3": // Payoff and don't close account
                case "4": // Payoff and close account
                    subordinateLienAmt = this.outstandingBalance;
                    break;
                default:
                    subordinateLienAmt = 0;
                    break;
            }

            this.loanAmount = lib.reduceNumeric((x, y) => x + y, this.firstMortgage, this.cashOutAmount, subordinateLienAmt);
        }

        private _haveDefaultsForPricingBeenSet: boolean = false;

        setDefaultsForPricing = (): void => {
            if (this._haveDefaultsForPricingBeenSet) {
                return;
            }
            this.setDefaultsForPricingImpl();
        }

        private resetDefaultsForPricing = (loanPurpose: srv.LoanPurposeTypeEnum): void => {
            this.setDefaultsForPricingImpl(loanPurpose);
        }

        private setDefaultsForPricingImpl = (loanPurpose?: srv.LoanPurposeTypeEnum): void => {

            //
            // Convenience variables
            //

            var lvm = this.getLoan();
            var sp = lvm.getSubjectProperty();
            var ivw = lvm.otherInterviewData;
            var fi = lvm.financialInfo;

            //
            // COLUMN 1
            //

            // @todo
            this.purchasePrice = 300000;
            this.downPaymentAmount = 60000;
            ivw.firstTimeHomebuyer = false;

            //Loan Purpose
            //ng-model="pricingCntrl.loan.loanPurposeType"
            if (!!loanPurpose) {
                this.getLoan().loanPurposeType = loanPurpose;
            }
            else {
                this.getLoan().loanPurposeType = srv.LoanPurposeTypeEnum.Refinance;
            }            

            //Zip Code
            //ng-model="pricingCntrl.loan.getLoan().getSubjectProperty().zipCode"
            sp.zipCode = "90001";
            
            //Existing 1st Mortgage
            //ng-model="pricingCntrl.loan.getLoan().otherInterviewData.firstMortgage"
            this.firstMortgage = 300000;
            
            //Cash Out
            //ng-model="pricingCntrl.loan.getLoan().financialInfo.cashOutAmount"
            this.cashOutAmount = 0;
            
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
            sp.propertyType = (<number>srv.PropertyTypeEnum.SingleFamily).toString();
            
            //Number of Units
            //ng-model="pricingCntrl.NumberOfUnits"
            sp.numberOfUnits = 1;
            
            //How is the Home Used?
            //ng-model="pricingCntrl.homeUseType"
            this.getLoan().active.occupancyType = srv.PropertyUsageTypeEnum.PrimaryResidence;
            
            //Taxes & Insurance (Impounds)
            //ng-model="pricingCntrl.taxType"
            ivw.selectedImpoundsOption = (<number>srv.impoundType.taxesAndInsurance).toString();
            
            //Employment Status
            //ng-model="pricingCntrl.employmentStatusType"
            this.loanApp.borrower.employments[0].employmentType = srv.EmploymentTypeEnum.SalariedEmployee;


            //
            // COLUMN 3
            //

            //Have a 2nd Mortgage?
            //ng-model="pricingCntrl.secondMortgageType"
            ivw.existingSecondMortgage = "0"; // No. // 0:"No" ; 1:"Fixed Rate" ; 2:"Home Equity Line of Credit"
            
            //Payoff a 2nd Mortgage?
            //ng-model="pricingCntrl.payoffSecondMortgageType"
            this.secondMortgageRefinanceComment = "1"; // Do not payoff ; // " ; 1:Do not payoff", " ; 2:Payoff at closing", " ; 3:Payoff and don't close account", " ; 4:Payoff and close account"]
            
            //HELOC Credit Line Limit
            //ng-model="pricingCntrl.helocCreditLimit"
            ivw.maximumCreditLine = 0;
            
            //HELOC Balance --or-- 2nd mgtg amt
            //ng-model="pricingCntrl.helocBalance"
            this.outstandingBalance = 0;

            this._haveDefaultsForPricingBeenSet = true;
        }

        //private _pricingSearch: vm.IPricingAdvancedSearchViewModel
        //public get pricingSearch(): vm.IPricingAdvancedSearchViewModel {
        //    return this._pricingSearch;
        //}
        //public set pricingSearch(val: vm.IPricingAdvancedSearchViewModel) {
        //    this._pricingSearch = val;
        //}

        private _pricingFilter: vm.PricingFilterViewModel;
        public get pricingFilter() : vm.PricingFilterViewModel {
            return this._pricingFilter;
        }
        public set pricingFilter(val: vm.PricingFilterViewModel) {
            this._pricingFilter = val;
        }
    }
}