module srv {
    //export enum HomeBuyingType {
    //    None = 0,
    //    OfferAccepted = 1,
    //    OfferPendingFoundAHouse = 2,
    //    GetPreApproved = 3,
    //    WhatCanIAfford = 4
    //}

    //export enum AmortizationType {
    //    None = 0,
    //    Fixed = 1,
    //    ARM = 2,
    //    GPM = 3,
    //    Other = 4
    //}

    /**
    * Constant string names for REST controllers.
    */
    export class lazyLoadControllerName {
        public static loanLockHistory = 'LoanLockHistory'
    }

    export enum OwnerTypeEnum {
        None = 0,
        Borrower = 1,
        CoBorrower = 2,
        Joint = 3,
    }

    export class folderName {
        public static FeesClosingCorp = 'Fees - Closing Corp';
        public static LOSEncompass = 'LOS - Encompass';
        public static PricingOptimalBlue = 'Pricing - Optimal Blue';
        public static SigningeOriginal = 'Signing - eOriginal';
        public static DisclosuresApplicationDocument = 'Disclosures - Application Document';
        public static DisclosuresWetSignature = 'Disclosures - Wet Signature';
        public static BiDirectionalEncompass = 'BiDirectional - Encompass';
        public static Credit = 'Credit';
        public static AppraisalLenderX = 'Appraisal - LenderX';
        public static CRMLead360 = 'CRM - Lead360';
        public static Audit = 'Audit';
        public static AusDl = 'Automated Underwriting Specification - Desktop Underwriter';
        public static AusLp = 'Automated Underwriting Specification - Loan Prospector';
    }
    export enum LiabilitiesAccountOwnershipType {
        None = -1,
        AuthorizedUser = 0,
        Comaker = 1,
        Individual = 2,
        JointContractualLiability = 3,
        JointParticipating = 4,
        Maker = 5,
        OnBehalfOf = 6,
        Terminated = 7,
        Undesignated = 8,
        Deceased = 9
    }

    export enum LiabilitiesDebtCommentEnum {
        Agree = 0,
        Disagree = 1,
        PaidOff = 3,
        PayoffAtClose = 4,
        AcctNotMine = 5,
        Duplicate = 6,
        NotMyLoan = 7,
        SomeoneElsePays = 8,
        NonBorrowingSpouse = 9
    }

    export enum PhoneNumberType {
        None = -1,
        Home = 0,
        Cell = 1,
        Work = 2,
        Other = 3
    }

    export enum DocumentClassType {
        None = 0,
        IncomeVerification = 1,
        LoanDisclosuresPackage = 2,
        AppraisalReport = 3,
        CreditReport = 4,
        Authorization = 5,
        AuthorizationsPackage = 6,
        OtherDocuments = 7,
        LoanReDisclosuresPackage = 8,
        MiscellaneousDocuments = 9,
        SmartGFEComplianceCertificate = 10,
        PreApprovalLetter = 11,
        Collateral = 12,
        VariousDocuments = 13,
        AppraisalDocuments = 14,
        CounterOfferApprovalLetter = 15,
        CounterOfferApprovalLetterInitialDisclousure = 16,
        InitialDisclosuresMailingCoverLetter = 17,
        ReDisclosuresMailingCoverLetter = 18,
        HudBooklet = 19,
        LoanDisclosuresDocuments = 20,
        BorrowersNeedsListToBeCompleted = 21,
        AssetsDocuments = 22,
        Other = 99,
    }

    export enum AddressType {
        Default = 0,
        Present = 1,
        Former = 2,
        Mailing = 3,
        Billing = 4,
        GovernmentMonitoring = 5,
        RealEstate = 6,
    }

    export enum OccupancyType {
        None = 0,
        PrimaryResidence = 1,
        InvestmentProperty = 2,
        SecondVacationHome = 3,
    }

    export enum BorrowerType {
        Borrower = 0,
        CoBorrower = 1,
        OtherBorrower = 2
    }

    export enum PreferredPaymentPeriod {
        None = 0,
        Monthly = 1,
        Annual = 2
    }

    export enum AmortizationType {
        None = 0,
        Fixed = 1,
        ARM = 2,
        GPM = 3,
        Other = 4
    }

    export enum MortageType {
        Conventional = 0,
        FHA = 1,
        ConventionalJumbo = 2,
        ConventionalSuperJumbo = 3,
        VA = 4,
        USDA = 5
    }

    export enum CreditReportStatus {
        undefined = 0,
        retrieving,
        retrieved,
        error
    }

    export enum LienPosition {
        First = 1,
        Second = 2,
        Third = 3,
        Fourth = 4,
        Fifth = 5
    }

    export enum LockStatus {
        NotLocked = 0,
        LockRequested = 1,
        LockPending = 2,
        LockExpirationDate = 3,
        Locked = 4
    }

    export enum PropertyTaxPayPeriods {
        Monthly = 1,
        Annual = 2
    }
    export enum LoanType {
        Purchase = 1,
        Refinance = 2
    }

    export enum HomeBuyingType {
        None = 0,
        SignedAPurchaseAgreement = 1,
        OfferPendingFoundAHouse = 2,
        GetPreApproved = 3,
        WhatCanIAfford = 4
    }

   
   

    export enum PropertyExpenseType {

        propertyTax = 1,
        homeOwnerInsurance = 2,
        mortgageInsurance = 3,
        hOADues = 4,
        floodInsurance = 5,
    }

   
    export enum PhoneTypes {
        Cell = 1,
        Work = 2
    }
    export enum MiscellaneousDebtTypes {
        ChildCareExpensesForVALoansOnly = 1,
        Expenses2106FromTaxReturns = 2,
        EmptyDebt = -77 // because logic on miscExpenses requests that new rows have value selected one, random number -77 so we wont break other sections
    }
    
       
    export enum DebtsAccountOwnershipType {
        Borrower = 0,
        CoBorrower = 1,
        Joint = 2,
        BorrowerWithOther = 3,
        CoBorrowerWithOther = 4,
    }
    //export enum LiabilitiesDebtComment {
    //    Agree = 0,
    //    Disagree = 1,
    //    PaidOff = 3,
    //    PayoffAtClose = 4,
    //    AcctNotMine = 5,
    //    Duplicate = 6,
    //    NotMyLoan = 7,
    //    SomeoneElsePays = 8,
    //    NonBorrowingSpouse = 9
    //}
    export enum pricingAdjustmentSectionType {
        investor = 1,
        loanOfficer = 2,
        investorBasePurchase = 3,
        adjustment = 4

    }

    //export enum LockStatus {
    //    NotLocked = 0,
    //    LockRequested = 1,
    //    LockPending = 2,
    //    LockExpirationDate = 3,
    //    Locked = 4
    //}
   
    export enum EmploymentType {
        ActiveMilitaryDuty = 0,
        SalariedEmployee = 1,
        SelfEmployed = 2,
        Retired = 3,
        OtherUnemployed = 4
    }


    //export enum AddressType {
    //    Default = 0,
    //    Present = 1,
    //    Former = 2,
    //    Mailing = 3,
    //    Billing = 4,
    //    GovernmentMonitoring = 5,
    //    RealEstate = 6
    //}

    export enum pledgedAssetCommentType {
        DoNotPayoff = 0,
        PaidOffFreeAndClear = 1,
        PayoffAtClose = 2,
        PayoffAtClosingAndDontCloseAccount = 3,
        PayoffAtClosingAndCloseAccount = 4,
        Sold = 5,
        NotMyLoan = 6,
        PendingSale = 7,
        NotAMortgage = 8,
        Duplicate = 9
    }

    export enum collectionsDebtComment {
        Agree = 0,
        Disagree = 1,
        PaidOff = 3,
        PayoffAtClose = 4,
        Duplicate = 5
    }
    export enum pledgedAssetLoanType {
        None = 0,
        Fixed = 1,
        Heloc = 2
    }
    export enum propertyExpensesType {
        None = 0,
        Tax = 1,
        HOI = 2,
        PMI = 3,
        HOA = 4,
        FloodInsurance = 5
    }
    export enum milestoneStatus {
        prospect = 1,
        incomplete = 2,
        processing = 3,
        preApproved = 4,
        approved = 5,
        docsOut = 6,
        funded = 8,
        cancelled = 9,
        unsubmitted = 10,
        registered = 11,
        submitted = 12,
        rejected = 13,
        adverse = 14,
        appCompleted = 15
    }

    export enum impoundType {
        insuranceOnly = 2,
        noImpound = 3,
        taxesAndInsurance = 0,
        taxesOnly = 1
    }

    export enum incomeTypeEnum {
        baseEmploymentIncome = 0,
        militaryBasePay = 11,
        partTime = 13,
        selfEmployedIncome = 16,
        netRentalIncome = 5
    }

    export enum preferredPaymentPeriodsTypeEnum {
        Monthly = 1,
        Annual = 2
    }

    export enum docDeliveryTypeEnum {
        Mail = 0,
        Electronic = 1
    }

    export enum accountOption {
        JointWithBorrower = 1,
        separateFromBorrower = 2
    }
    export enum adverseReasons {
        SelectOne = 0,
        ApplicationDenied = 1,
        ApplicationWithdrawnByBorrower = 2,
        FileClosedForIncompletenes = 3,
        PreApprovalRequestDenied = 4,
        PreApprovalRequestApprovedButNotAccepted=5

    }

    export class manageUserAccountButtonActions {
        public static createAccount = 'Create Account';
        public static updateAccount = 'Update Account';
        public static connectAccount = 'Connect Account';
    }

    export class loanDetailsActions {
        public static SaveLoanApplications = 'Save Loan Application';
        public static RunComplianceCheck = 'Run Compliance Check';
        public static CreateInitialDisclosures = 'Create Initial Disclosures';
        public static CreateInitialLockDisclosures = 'Create Initial Lock Disclosures';
    }
} 