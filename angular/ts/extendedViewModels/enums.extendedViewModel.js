var srv;
(function (srv) {
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
    var lazyLoadControllerName = (function () {
        function lazyLoadControllerName() {
        }
        lazyLoadControllerName.loanLockHistory = 'LoanLockHistory';
        return lazyLoadControllerName;
    })();
    srv.lazyLoadControllerName = lazyLoadControllerName;
    (function (OwnerTypeEnum) {
        OwnerTypeEnum[OwnerTypeEnum["None"] = 0] = "None";
        OwnerTypeEnum[OwnerTypeEnum["Borrower"] = 1] = "Borrower";
        OwnerTypeEnum[OwnerTypeEnum["CoBorrower"] = 2] = "CoBorrower";
        OwnerTypeEnum[OwnerTypeEnum["Joint"] = 3] = "Joint";
    })(srv.OwnerTypeEnum || (srv.OwnerTypeEnum = {}));
    var OwnerTypeEnum = srv.OwnerTypeEnum;
    var folderName = (function () {
        function folderName() {
        }
        folderName.FeesClosingCorp = 'Fees - Closing Corp';
        folderName.LOSEncompass = 'LOS - Encompass';
        folderName.PricingOptimalBlue = 'Pricing - Optimal Blue';
        folderName.SigningeOriginal = 'Signing - eOriginal';
        folderName.DisclosuresApplicationDocument = 'Disclosures - Application Document';
        folderName.DisclosuresWetSignature = 'Disclosures - Wet Signature';
        folderName.BiDirectionalEncompass = 'BiDirectional - Encompass';
        folderName.Credit = 'Credit';
        folderName.AppraisalLenderX = 'Appraisal - LenderX';
        folderName.CRMLead360 = 'CRM - Lead360';
        folderName.Audit = 'Audit';
        folderName.AusDl = 'Automated Underwriting Specification - Desktop Underwriter';
        folderName.AusLp = 'Automated Underwriting Specification - Loan Prospector';
        return folderName;
    })();
    srv.folderName = folderName;
    (function (LiabilitiesAccountOwnershipType) {
        LiabilitiesAccountOwnershipType[LiabilitiesAccountOwnershipType["None"] = -1] = "None";
        LiabilitiesAccountOwnershipType[LiabilitiesAccountOwnershipType["AuthorizedUser"] = 0] = "AuthorizedUser";
        LiabilitiesAccountOwnershipType[LiabilitiesAccountOwnershipType["Comaker"] = 1] = "Comaker";
        LiabilitiesAccountOwnershipType[LiabilitiesAccountOwnershipType["Individual"] = 2] = "Individual";
        LiabilitiesAccountOwnershipType[LiabilitiesAccountOwnershipType["JointContractualLiability"] = 3] = "JointContractualLiability";
        LiabilitiesAccountOwnershipType[LiabilitiesAccountOwnershipType["JointParticipating"] = 4] = "JointParticipating";
        LiabilitiesAccountOwnershipType[LiabilitiesAccountOwnershipType["Maker"] = 5] = "Maker";
        LiabilitiesAccountOwnershipType[LiabilitiesAccountOwnershipType["OnBehalfOf"] = 6] = "OnBehalfOf";
        LiabilitiesAccountOwnershipType[LiabilitiesAccountOwnershipType["Terminated"] = 7] = "Terminated";
        LiabilitiesAccountOwnershipType[LiabilitiesAccountOwnershipType["Undesignated"] = 8] = "Undesignated";
        LiabilitiesAccountOwnershipType[LiabilitiesAccountOwnershipType["Deceased"] = 9] = "Deceased";
    })(srv.LiabilitiesAccountOwnershipType || (srv.LiabilitiesAccountOwnershipType = {}));
    var LiabilitiesAccountOwnershipType = srv.LiabilitiesAccountOwnershipType;
    (function (LiabilitiesDebtCommentEnum) {
        LiabilitiesDebtCommentEnum[LiabilitiesDebtCommentEnum["Agree"] = 0] = "Agree";
        LiabilitiesDebtCommentEnum[LiabilitiesDebtCommentEnum["Disagree"] = 1] = "Disagree";
        LiabilitiesDebtCommentEnum[LiabilitiesDebtCommentEnum["PaidOff"] = 3] = "PaidOff";
        LiabilitiesDebtCommentEnum[LiabilitiesDebtCommentEnum["PayoffAtClose"] = 4] = "PayoffAtClose";
        LiabilitiesDebtCommentEnum[LiabilitiesDebtCommentEnum["AcctNotMine"] = 5] = "AcctNotMine";
        LiabilitiesDebtCommentEnum[LiabilitiesDebtCommentEnum["Duplicate"] = 6] = "Duplicate";
        LiabilitiesDebtCommentEnum[LiabilitiesDebtCommentEnum["NotMyLoan"] = 7] = "NotMyLoan";
        LiabilitiesDebtCommentEnum[LiabilitiesDebtCommentEnum["SomeoneElsePays"] = 8] = "SomeoneElsePays";
        LiabilitiesDebtCommentEnum[LiabilitiesDebtCommentEnum["NonBorrowingSpouse"] = 9] = "NonBorrowingSpouse";
    })(srv.LiabilitiesDebtCommentEnum || (srv.LiabilitiesDebtCommentEnum = {}));
    var LiabilitiesDebtCommentEnum = srv.LiabilitiesDebtCommentEnum;
    (function (PhoneNumberType) {
        PhoneNumberType[PhoneNumberType["None"] = -1] = "None";
        PhoneNumberType[PhoneNumberType["Home"] = 0] = "Home";
        PhoneNumberType[PhoneNumberType["Cell"] = 1] = "Cell";
        PhoneNumberType[PhoneNumberType["Work"] = 2] = "Work";
        PhoneNumberType[PhoneNumberType["Other"] = 3] = "Other";
    })(srv.PhoneNumberType || (srv.PhoneNumberType = {}));
    var PhoneNumberType = srv.PhoneNumberType;
    (function (DocumentClassType) {
        DocumentClassType[DocumentClassType["None"] = 0] = "None";
        DocumentClassType[DocumentClassType["IncomeVerification"] = 1] = "IncomeVerification";
        DocumentClassType[DocumentClassType["LoanDisclosuresPackage"] = 2] = "LoanDisclosuresPackage";
        DocumentClassType[DocumentClassType["AppraisalReport"] = 3] = "AppraisalReport";
        DocumentClassType[DocumentClassType["CreditReport"] = 4] = "CreditReport";
        DocumentClassType[DocumentClassType["Authorization"] = 5] = "Authorization";
        DocumentClassType[DocumentClassType["AuthorizationsPackage"] = 6] = "AuthorizationsPackage";
        DocumentClassType[DocumentClassType["OtherDocuments"] = 7] = "OtherDocuments";
        DocumentClassType[DocumentClassType["LoanReDisclosuresPackage"] = 8] = "LoanReDisclosuresPackage";
        DocumentClassType[DocumentClassType["MiscellaneousDocuments"] = 9] = "MiscellaneousDocuments";
        DocumentClassType[DocumentClassType["SmartGFEComplianceCertificate"] = 10] = "SmartGFEComplianceCertificate";
        DocumentClassType[DocumentClassType["PreApprovalLetter"] = 11] = "PreApprovalLetter";
        DocumentClassType[DocumentClassType["Collateral"] = 12] = "Collateral";
        DocumentClassType[DocumentClassType["VariousDocuments"] = 13] = "VariousDocuments";
        DocumentClassType[DocumentClassType["AppraisalDocuments"] = 14] = "AppraisalDocuments";
        DocumentClassType[DocumentClassType["CounterOfferApprovalLetter"] = 15] = "CounterOfferApprovalLetter";
        DocumentClassType[DocumentClassType["CounterOfferApprovalLetterInitialDisclousure"] = 16] = "CounterOfferApprovalLetterInitialDisclousure";
        DocumentClassType[DocumentClassType["InitialDisclosuresMailingCoverLetter"] = 17] = "InitialDisclosuresMailingCoverLetter";
        DocumentClassType[DocumentClassType["ReDisclosuresMailingCoverLetter"] = 18] = "ReDisclosuresMailingCoverLetter";
        DocumentClassType[DocumentClassType["HudBooklet"] = 19] = "HudBooklet";
        DocumentClassType[DocumentClassType["LoanDisclosuresDocuments"] = 20] = "LoanDisclosuresDocuments";
        DocumentClassType[DocumentClassType["BorrowersNeedsListToBeCompleted"] = 21] = "BorrowersNeedsListToBeCompleted";
        DocumentClassType[DocumentClassType["AssetsDocuments"] = 22] = "AssetsDocuments";
        DocumentClassType[DocumentClassType["Other"] = 99] = "Other";
    })(srv.DocumentClassType || (srv.DocumentClassType = {}));
    var DocumentClassType = srv.DocumentClassType;
    (function (AddressType) {
        AddressType[AddressType["Default"] = 0] = "Default";
        AddressType[AddressType["Present"] = 1] = "Present";
        AddressType[AddressType["Former"] = 2] = "Former";
        AddressType[AddressType["Mailing"] = 3] = "Mailing";
        AddressType[AddressType["Billing"] = 4] = "Billing";
        AddressType[AddressType["GovernmentMonitoring"] = 5] = "GovernmentMonitoring";
        AddressType[AddressType["RealEstate"] = 6] = "RealEstate";
    })(srv.AddressType || (srv.AddressType = {}));
    var AddressType = srv.AddressType;
    (function (OccupancyType) {
        OccupancyType[OccupancyType["None"] = 0] = "None";
        OccupancyType[OccupancyType["PrimaryResidence"] = 1] = "PrimaryResidence";
        OccupancyType[OccupancyType["InvestmentProperty"] = 2] = "InvestmentProperty";
        OccupancyType[OccupancyType["SecondVacationHome"] = 3] = "SecondVacationHome";
    })(srv.OccupancyType || (srv.OccupancyType = {}));
    var OccupancyType = srv.OccupancyType;
    (function (BorrowerType) {
        BorrowerType[BorrowerType["Borrower"] = 0] = "Borrower";
        BorrowerType[BorrowerType["CoBorrower"] = 1] = "CoBorrower";
        BorrowerType[BorrowerType["OtherBorrower"] = 2] = "OtherBorrower";
    })(srv.BorrowerType || (srv.BorrowerType = {}));
    var BorrowerType = srv.BorrowerType;
    (function (PreferredPaymentPeriod) {
        PreferredPaymentPeriod[PreferredPaymentPeriod["None"] = 0] = "None";
        PreferredPaymentPeriod[PreferredPaymentPeriod["Monthly"] = 1] = "Monthly";
        PreferredPaymentPeriod[PreferredPaymentPeriod["Annual"] = 2] = "Annual";
    })(srv.PreferredPaymentPeriod || (srv.PreferredPaymentPeriod = {}));
    var PreferredPaymentPeriod = srv.PreferredPaymentPeriod;
    (function (AmortizationType) {
        AmortizationType[AmortizationType["None"] = 0] = "None";
        AmortizationType[AmortizationType["Fixed"] = 1] = "Fixed";
        AmortizationType[AmortizationType["ARM"] = 2] = "ARM";
        AmortizationType[AmortizationType["GPM"] = 3] = "GPM";
        AmortizationType[AmortizationType["Other"] = 4] = "Other";
    })(srv.AmortizationType || (srv.AmortizationType = {}));
    var AmortizationType = srv.AmortizationType;
    (function (MortageType) {
        MortageType[MortageType["Conventional"] = 0] = "Conventional";
        MortageType[MortageType["FHA"] = 1] = "FHA";
        MortageType[MortageType["ConventionalJumbo"] = 2] = "ConventionalJumbo";
        MortageType[MortageType["ConventionalSuperJumbo"] = 3] = "ConventionalSuperJumbo";
        MortageType[MortageType["VA"] = 4] = "VA";
        MortageType[MortageType["USDA"] = 5] = "USDA";
    })(srv.MortageType || (srv.MortageType = {}));
    var MortageType = srv.MortageType;
    (function (CreditReportStatus) {
        CreditReportStatus[CreditReportStatus["undefined"] = 0] = "undefined";
        CreditReportStatus[CreditReportStatus["retrieving"] = 1] = "retrieving";
        CreditReportStatus[CreditReportStatus["retrieved"] = 2] = "retrieved";
        CreditReportStatus[CreditReportStatus["error"] = 3] = "error";
    })(srv.CreditReportStatus || (srv.CreditReportStatus = {}));
    var CreditReportStatus = srv.CreditReportStatus;
    (function (LienPosition) {
        LienPosition[LienPosition["First"] = 1] = "First";
        LienPosition[LienPosition["Second"] = 2] = "Second";
        LienPosition[LienPosition["Third"] = 3] = "Third";
        LienPosition[LienPosition["Fourth"] = 4] = "Fourth";
        LienPosition[LienPosition["Fifth"] = 5] = "Fifth";
    })(srv.LienPosition || (srv.LienPosition = {}));
    var LienPosition = srv.LienPosition;
    (function (LockStatus) {
        LockStatus[LockStatus["NotLocked"] = 0] = "NotLocked";
        LockStatus[LockStatus["LockRequested"] = 1] = "LockRequested";
        LockStatus[LockStatus["LockPending"] = 2] = "LockPending";
        LockStatus[LockStatus["LockExpirationDate"] = 3] = "LockExpirationDate";
        LockStatus[LockStatus["Locked"] = 4] = "Locked";
    })(srv.LockStatus || (srv.LockStatus = {}));
    var LockStatus = srv.LockStatus;
    (function (PropertyTaxPayPeriods) {
        PropertyTaxPayPeriods[PropertyTaxPayPeriods["Monthly"] = 1] = "Monthly";
        PropertyTaxPayPeriods[PropertyTaxPayPeriods["Annual"] = 2] = "Annual";
    })(srv.PropertyTaxPayPeriods || (srv.PropertyTaxPayPeriods = {}));
    var PropertyTaxPayPeriods = srv.PropertyTaxPayPeriods;
    (function (LoanType) {
        LoanType[LoanType["Purchase"] = 1] = "Purchase";
        LoanType[LoanType["Refinance"] = 2] = "Refinance";
    })(srv.LoanType || (srv.LoanType = {}));
    var LoanType = srv.LoanType;
    (function (HomeBuyingType) {
        HomeBuyingType[HomeBuyingType["None"] = 0] = "None";
        HomeBuyingType[HomeBuyingType["SignedAPurchaseAgreement"] = 1] = "SignedAPurchaseAgreement";
        HomeBuyingType[HomeBuyingType["OfferPendingFoundAHouse"] = 2] = "OfferPendingFoundAHouse";
        HomeBuyingType[HomeBuyingType["GetPreApproved"] = 3] = "GetPreApproved";
        HomeBuyingType[HomeBuyingType["WhatCanIAfford"] = 4] = "WhatCanIAfford";
    })(srv.HomeBuyingType || (srv.HomeBuyingType = {}));
    var HomeBuyingType = srv.HomeBuyingType;
    (function (PropertyExpenseType) {
        PropertyExpenseType[PropertyExpenseType["propertyTax"] = 1] = "propertyTax";
        PropertyExpenseType[PropertyExpenseType["homeOwnerInsurance"] = 2] = "homeOwnerInsurance";
        PropertyExpenseType[PropertyExpenseType["mortgageInsurance"] = 3] = "mortgageInsurance";
        PropertyExpenseType[PropertyExpenseType["hOADues"] = 4] = "hOADues";
        PropertyExpenseType[PropertyExpenseType["floodInsurance"] = 5] = "floodInsurance";
    })(srv.PropertyExpenseType || (srv.PropertyExpenseType = {}));
    var PropertyExpenseType = srv.PropertyExpenseType;
    (function (PhoneTypes) {
        PhoneTypes[PhoneTypes["Cell"] = 1] = "Cell";
        PhoneTypes[PhoneTypes["Work"] = 2] = "Work";
    })(srv.PhoneTypes || (srv.PhoneTypes = {}));
    var PhoneTypes = srv.PhoneTypes;
    (function (MiscellaneousDebtTypes) {
        MiscellaneousDebtTypes[MiscellaneousDebtTypes["ChildCareExpensesForVALoansOnly"] = 1] = "ChildCareExpensesForVALoansOnly";
        MiscellaneousDebtTypes[MiscellaneousDebtTypes["Expenses2106FromTaxReturns"] = 2] = "Expenses2106FromTaxReturns";
        MiscellaneousDebtTypes[MiscellaneousDebtTypes["EmptyDebt"] = -77] = "EmptyDebt"; // because logic on miscExpenses requests that new rows have value selected one, random number -77 so we wont break other sections
    })(srv.MiscellaneousDebtTypes || (srv.MiscellaneousDebtTypes = {}));
    var MiscellaneousDebtTypes = srv.MiscellaneousDebtTypes;
    (function (DebtsAccountOwnershipType) {
        DebtsAccountOwnershipType[DebtsAccountOwnershipType["Borrower"] = 0] = "Borrower";
        DebtsAccountOwnershipType[DebtsAccountOwnershipType["CoBorrower"] = 1] = "CoBorrower";
        DebtsAccountOwnershipType[DebtsAccountOwnershipType["Joint"] = 2] = "Joint";
        DebtsAccountOwnershipType[DebtsAccountOwnershipType["BorrowerWithOther"] = 3] = "BorrowerWithOther";
        DebtsAccountOwnershipType[DebtsAccountOwnershipType["CoBorrowerWithOther"] = 4] = "CoBorrowerWithOther";
    })(srv.DebtsAccountOwnershipType || (srv.DebtsAccountOwnershipType = {}));
    var DebtsAccountOwnershipType = srv.DebtsAccountOwnershipType;
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
    (function (pricingAdjustmentSectionType) {
        pricingAdjustmentSectionType[pricingAdjustmentSectionType["investor"] = 1] = "investor";
        pricingAdjustmentSectionType[pricingAdjustmentSectionType["loanOfficer"] = 2] = "loanOfficer";
        pricingAdjustmentSectionType[pricingAdjustmentSectionType["investorBasePurchase"] = 3] = "investorBasePurchase";
        pricingAdjustmentSectionType[pricingAdjustmentSectionType["adjustment"] = 4] = "adjustment";
    })(srv.pricingAdjustmentSectionType || (srv.pricingAdjustmentSectionType = {}));
    var pricingAdjustmentSectionType = srv.pricingAdjustmentSectionType;
    //export enum LockStatus {
    //    NotLocked = 0,
    //    LockRequested = 1,
    //    LockPending = 2,
    //    LockExpirationDate = 3,
    //    Locked = 4
    //}
    (function (EmploymentType) {
        EmploymentType[EmploymentType["ActiveMilitaryDuty"] = 0] = "ActiveMilitaryDuty";
        EmploymentType[EmploymentType["SalariedEmployee"] = 1] = "SalariedEmployee";
        EmploymentType[EmploymentType["SelfEmployed"] = 2] = "SelfEmployed";
        EmploymentType[EmploymentType["Retired"] = 3] = "Retired";
        EmploymentType[EmploymentType["OtherUnemployed"] = 4] = "OtherUnemployed";
    })(srv.EmploymentType || (srv.EmploymentType = {}));
    var EmploymentType = srv.EmploymentType;
    //export enum AddressType {
    //    Default = 0,
    //    Present = 1,
    //    Former = 2,
    //    Mailing = 3,
    //    Billing = 4,
    //    GovernmentMonitoring = 5,
    //    RealEstate = 6
    //}
    (function (pledgedAssetCommentType) {
        pledgedAssetCommentType[pledgedAssetCommentType["DoNotPayoff"] = 0] = "DoNotPayoff";
        pledgedAssetCommentType[pledgedAssetCommentType["PaidOffFreeAndClear"] = 1] = "PaidOffFreeAndClear";
        pledgedAssetCommentType[pledgedAssetCommentType["PayoffAtClose"] = 2] = "PayoffAtClose";
        pledgedAssetCommentType[pledgedAssetCommentType["PayoffAtClosingAndDontCloseAccount"] = 3] = "PayoffAtClosingAndDontCloseAccount";
        pledgedAssetCommentType[pledgedAssetCommentType["PayoffAtClosingAndCloseAccount"] = 4] = "PayoffAtClosingAndCloseAccount";
        pledgedAssetCommentType[pledgedAssetCommentType["Sold"] = 5] = "Sold";
        pledgedAssetCommentType[pledgedAssetCommentType["NotMyLoan"] = 6] = "NotMyLoan";
        pledgedAssetCommentType[pledgedAssetCommentType["PendingSale"] = 7] = "PendingSale";
        pledgedAssetCommentType[pledgedAssetCommentType["NotAMortgage"] = 8] = "NotAMortgage";
        pledgedAssetCommentType[pledgedAssetCommentType["Duplicate"] = 9] = "Duplicate";
    })(srv.pledgedAssetCommentType || (srv.pledgedAssetCommentType = {}));
    var pledgedAssetCommentType = srv.pledgedAssetCommentType;
    (function (collectionsDebtComment) {
        collectionsDebtComment[collectionsDebtComment["Agree"] = 0] = "Agree";
        collectionsDebtComment[collectionsDebtComment["Disagree"] = 1] = "Disagree";
        collectionsDebtComment[collectionsDebtComment["PaidOff"] = 3] = "PaidOff";
        collectionsDebtComment[collectionsDebtComment["PayoffAtClose"] = 4] = "PayoffAtClose";
        collectionsDebtComment[collectionsDebtComment["Duplicate"] = 5] = "Duplicate";
    })(srv.collectionsDebtComment || (srv.collectionsDebtComment = {}));
    var collectionsDebtComment = srv.collectionsDebtComment;
    (function (pledgedAssetLoanType) {
        pledgedAssetLoanType[pledgedAssetLoanType["None"] = 0] = "None";
        pledgedAssetLoanType[pledgedAssetLoanType["Fixed"] = 1] = "Fixed";
        pledgedAssetLoanType[pledgedAssetLoanType["Heloc"] = 2] = "Heloc";
    })(srv.pledgedAssetLoanType || (srv.pledgedAssetLoanType = {}));
    var pledgedAssetLoanType = srv.pledgedAssetLoanType;
    (function (propertyExpensesType) {
        propertyExpensesType[propertyExpensesType["None"] = 0] = "None";
        propertyExpensesType[propertyExpensesType["Tax"] = 1] = "Tax";
        propertyExpensesType[propertyExpensesType["HOI"] = 2] = "HOI";
        propertyExpensesType[propertyExpensesType["PMI"] = 3] = "PMI";
        propertyExpensesType[propertyExpensesType["HOA"] = 4] = "HOA";
        propertyExpensesType[propertyExpensesType["FloodInsurance"] = 5] = "FloodInsurance";
    })(srv.propertyExpensesType || (srv.propertyExpensesType = {}));
    var propertyExpensesType = srv.propertyExpensesType;
    (function (milestoneStatus) {
        milestoneStatus[milestoneStatus["prospect"] = 1] = "prospect";
        milestoneStatus[milestoneStatus["incomplete"] = 2] = "incomplete";
        milestoneStatus[milestoneStatus["processing"] = 3] = "processing";
        milestoneStatus[milestoneStatus["preApproved"] = 4] = "preApproved";
        milestoneStatus[milestoneStatus["approved"] = 5] = "approved";
        milestoneStatus[milestoneStatus["docsOut"] = 6] = "docsOut";
        milestoneStatus[milestoneStatus["funded"] = 8] = "funded";
        milestoneStatus[milestoneStatus["cancelled"] = 9] = "cancelled";
        milestoneStatus[milestoneStatus["unsubmitted"] = 10] = "unsubmitted";
        milestoneStatus[milestoneStatus["registered"] = 11] = "registered";
        milestoneStatus[milestoneStatus["submitted"] = 12] = "submitted";
        milestoneStatus[milestoneStatus["rejected"] = 13] = "rejected";
        milestoneStatus[milestoneStatus["adverse"] = 14] = "adverse";
        milestoneStatus[milestoneStatus["appCompleted"] = 15] = "appCompleted";
    })(srv.milestoneStatus || (srv.milestoneStatus = {}));
    var milestoneStatus = srv.milestoneStatus;
    (function (impoundType) {
        impoundType[impoundType["insuranceOnly"] = 2] = "insuranceOnly";
        impoundType[impoundType["noImpound"] = 3] = "noImpound";
        impoundType[impoundType["taxesAndInsurance"] = 0] = "taxesAndInsurance";
        impoundType[impoundType["taxesOnly"] = 1] = "taxesOnly";
    })(srv.impoundType || (srv.impoundType = {}));
    var impoundType = srv.impoundType;
    (function (incomeTypeEnum) {
        incomeTypeEnum[incomeTypeEnum["baseEmploymentIncome"] = 0] = "baseEmploymentIncome";
        incomeTypeEnum[incomeTypeEnum["militaryBasePay"] = 11] = "militaryBasePay";
        incomeTypeEnum[incomeTypeEnum["partTime"] = 13] = "partTime";
        incomeTypeEnum[incomeTypeEnum["selfEmployedIncome"] = 16] = "selfEmployedIncome";
        incomeTypeEnum[incomeTypeEnum["netRentalIncome"] = 5] = "netRentalIncome";
    })(srv.incomeTypeEnum || (srv.incomeTypeEnum = {}));
    var incomeTypeEnum = srv.incomeTypeEnum;
    (function (preferredPaymentPeriodsTypeEnum) {
        preferredPaymentPeriodsTypeEnum[preferredPaymentPeriodsTypeEnum["Monthly"] = 1] = "Monthly";
        preferredPaymentPeriodsTypeEnum[preferredPaymentPeriodsTypeEnum["Annual"] = 2] = "Annual";
    })(srv.preferredPaymentPeriodsTypeEnum || (srv.preferredPaymentPeriodsTypeEnum = {}));
    var preferredPaymentPeriodsTypeEnum = srv.preferredPaymentPeriodsTypeEnum;
    (function (docDeliveryTypeEnum) {
        docDeliveryTypeEnum[docDeliveryTypeEnum["Mail"] = 0] = "Mail";
        docDeliveryTypeEnum[docDeliveryTypeEnum["Electronic"] = 1] = "Electronic";
    })(srv.docDeliveryTypeEnum || (srv.docDeliveryTypeEnum = {}));
    var docDeliveryTypeEnum = srv.docDeliveryTypeEnum;
    (function (accountOption) {
        accountOption[accountOption["JointWithBorrower"] = 1] = "JointWithBorrower";
        accountOption[accountOption["separateFromBorrower"] = 2] = "separateFromBorrower";
    })(srv.accountOption || (srv.accountOption = {}));
    var accountOption = srv.accountOption;
    (function (adverseReasons) {
        adverseReasons[adverseReasons["SelectOne"] = 0] = "SelectOne";
        adverseReasons[adverseReasons["ApplicationDenied"] = 1] = "ApplicationDenied";
        adverseReasons[adverseReasons["ApplicationWithdrawnByBorrower"] = 2] = "ApplicationWithdrawnByBorrower";
        adverseReasons[adverseReasons["FileClosedForIncompletenes"] = 3] = "FileClosedForIncompletenes";
        adverseReasons[adverseReasons["PreApprovalRequestDenied"] = 4] = "PreApprovalRequestDenied";
        adverseReasons[adverseReasons["PreApprovalRequestApprovedButNotAccepted"] = 5] = "PreApprovalRequestApprovedButNotAccepted";
    })(srv.adverseReasons || (srv.adverseReasons = {}));
    var adverseReasons = srv.adverseReasons;
    var manageUserAccountButtonActions = (function () {
        function manageUserAccountButtonActions() {
        }
        manageUserAccountButtonActions.createAccount = 'Create Account';
        manageUserAccountButtonActions.updateAccount = 'Update Account';
        manageUserAccountButtonActions.connectAccount = 'Connect Account';
        return manageUserAccountButtonActions;
    })();
    srv.manageUserAccountButtonActions = manageUserAccountButtonActions;
    var loanDetailsActions = (function () {
        function loanDetailsActions() {
        }
        loanDetailsActions.SaveLoanApplications = 'Save Loan Application';
        loanDetailsActions.RunComplianceCheck = 'Run Compliance Check';
        loanDetailsActions.CreateInitialDisclosures = 'Create Initial Disclosures';
        loanDetailsActions.CreateInitialLockDisclosures = 'Create Initial Lock Disclosures';
        return loanDetailsActions;
    })();
    srv.loanDetailsActions = loanDetailsActions;
})(srv || (srv = {}));
//# sourceMappingURL=enums.extendedViewModel.js.map