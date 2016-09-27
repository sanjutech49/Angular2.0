
// This file (enums.ts - ver 1.0) has been has been automatically generated, do not modify!
// To extend an interface, create a file that exports the same interface name within the same module name with ONLY the ADDITIONAL properties.
// TypeScript will automatically merge both interfaces together.
 
module srv  {

	export enum AccountNameEnum {
		Default = 0,
		Buyer = 1,
		Seller = 2,
		Ghost = 3,
	}

	export enum AccountOwnershipTypeEnum {
		AuthorizedUser = 0,
		Comaker = 1,
		Individual = 2,
		JointContractualLiability = 3,
		JointParticipating = 4,
		Maker = 5,
		OnBehalfOf = 6,
		Terminated = 7,
		Undesignated = 8,
		Deceased = 9,
		None = -1,
	}

	export enum AccountTypeEnum {
		Default = 0,
		Asset = 1,
		Liability = 2,
		Income = 3,
		Expense = 4,
		Capital = 5,
	}

	export enum AddressTypeEnum {
		Default = 0,
		Present = 1,
		Former = 2,
		Mailing = 3,
		Billing = 4,
		GovernmentMonitoring = 5,
		RealEstate = 6,
	}

	export enum AmortizationTypeEnum {
		None = 0,
		Fixed = 1,
		ARM = 2,
		GPM = 3,
		Other = 4,
	}

	export enum AmountMethodEnum {
		Manual = 0,
		Itemized = 1,
		Calculated = 2,
		MonthlyMI = 3,
		SinglePremiumNonRefundable = 4,
		SinglePremiumRefundable = 5,
	}

	export enum AssetTypeEnum {
		Checking = 0,
		Savings = 1,
		CD = 2,
		MutualFunds = 3,
		Bonds = 4,
		Stocks = 5,
		MoneyMarket = 6,
		RetirementFund = 7,
		IRA = 8,
		GiftFunds = 9,
		EscrowDeposit = 10,
		ProceedsfromaPropertySale = 11,
		TrustFunds = 12,
		LifeInsuranceCashValue = 13,
		Other = 14,
		Automobile = 15,
		SecuredBorrowerFundsNotDeposited = 16,
		NotRequired = 99,
		None = -1,
	}

	export enum AuditLogCategoryEnum {
		UserAccount = 0,
		LoanRelated = 1,
		AppraisalRelated = 2,
	}

	export enum AuditLogTypeEnum {
		AgreedToTerms = 0,
		ActivatedAccount = 1,
		AcceptedESign = 2,
		AcceptedCreditAuthorization = 3,
		CreditReportRetrieved = 4,
		UploadedDocuments = 5,
		LockedRate = 6,
		DisclosuresDelivered = 7,
		AuthorizationFormsDelivered = 8,
		ReviewedDisclosures = 9,
		FaxedAuthorizations = 10,
		CreatedLoan = 11,
		CompletedActivity = 12,
		ChangedProfile = 13,
		LockRateRequested = 14,
		FNMImported = 15,
		eSignConsent = 16,
		LoanStatusChanged = 17,
		AppraisalOrderRequested = 18,
		AppraisalOrderOrdered = 19,
		AppraisalOrderDelivered = 20,
		AppraisalOrderAcknowledged = 21,
		ApplicationDateSet = 22,
		LoanApplicationCompleted = 23,
		InitialDisclosuresSent = 24,
	}

	export enum BorrowerContextTypeEnum {
		Borrower = 0,
		CoBorrower = 1,
		Both = 2,
	}

	export enum BorrowerTypeEnum {
		Borrower = 1,
		CoBorrower = 2,
	}

	export enum BusinessContactCategoryTypeEnum {
		None = 0,
		Title = 2,
		Escrow = 3,
		SellerAgent = 4,
		BuyerAgent = 5,
		PropertyManager = 6,
		Others = 7,
		Seller = 10,
	}

	export enum BusinessContactCategoryTypeMask {
		None = 0,
		Title = 32,
		Escrow = 64,
		SellerAgent = 128,
		BuyerAgent = 256,
		PropertyManager = 512,
		Others = 1024,
		Seller = 8192,
	}

	export enum BusinessContactPhoneTypeEnum {
		Home = 0,
		Cell = 1,
		Work = 2,
		Other = 3,
		None = -1,
	}

	export enum CalculatedValueTypeEnum {
		Unknown = 0,
		LTV = 1,
		DTIAndHousingRatio = 2,
		CLTV = 3,
		HCLTV = 4,
		Apr = 6,
		NetRentalIncome = 7,
		MonthlyPayment = 8,
		Hud801And802 = 9,
		HousingExpenses = 10,
		InterestAmountPerDiem = 11,
		DetailsOfTransaction = 12,
		RecalculatedCosts = 13,
		SubordinateFee = 14,
		FirstPaymentDate = 15,
		AgregateAdjustment = 16,
		VaFeeLimitsExceeded = 17,
		NewMonthlyPayment = 18,
		NetTangibleBenefit = 19,
		QMCertification = 20,
		LoanDecisionScore = 21,
		FullyIndexedRate = 22,
		IsImpoundMandatory = 23,
		RecoupmentPeriod = 24,
		FHACalculator = 25,
	}

	export enum CalculationTypeEnum {
		None = 0,
		Tax = 1,
		HOI = 2,
	}

	export enum CertificationIdEnum {
		SelectOne = 0,
		ValidStateDriverLicense = 1,
		ValidStateIdentificationCard = 2,
		MilitaryIdentificationCard = 3,
		MilitaryDependentsPhotoID = 4,
		USPassport = 5,
		NonUSPassport = 6,
		ResidentAlienCard = 7,
		DepartmentOfPublicWelfarePhotoID = 8,
		StudentPhotoID = 9,
		WorkIDWithPhoto = 10,
		MedicareCard = 11,
		CustomerIDValidationCheck = 12,
		ClosingCertification = 13,
		Other = 14,
	}

	export enum ComplianceCheckStatusEnum {
		NotRun = 0,
		Passed = 1,
		Failed = 2,
		InProgress = 3,
	}

	export enum ComplianceResultDetailTypeEnum {
		ReportedDataError = 1,
		ReportedSystemError = 2,
	}

	export enum Concurrent2ndMortgageEnum {
		No = 0,
		Fixed = 1,
		HELOC = 2,
	}

	export enum ConsentStatusEnum {
		None = 0,
		Accept = 1,
		Decline = 2,
	}

	export enum CostContainer {
		LoanCosts = 1,
		OtherCosts = 2,
		LenderCredits = 3,
		CreditCosts = 4,
	}

	export enum CostPaidByTypeEnum {
		Borrower = 0,
		Broker = 1,
		Lender = 2,
		Other = 3,
		EscrowCompany = 4,
		LenderRebate = 5,
		LenderBranch = 6,
		LenderCorporate = 7,
		LenderDivision = 8,
		LenderLoanOfficer = 9,
		Seller = 10,
	}

	export enum CostPaidToTypeEnum {
		Borrower = 1,
		Seller = 2,
		Lender = 3,
		Other = 10,
	}

	export enum CostSectionTypeEnum {
		OriginationCharges = 1,
		ServicesBorrowerDidNotShopFor = 2,
		ServicesBorrowerDidShopFor = 3,
		TaxesAndOtherGovermentFees = 4,
		Prepaids = 5,
		InitialEscowPaymentAtClosing = 6,
		Other = 7,
		LenderCredits = 8,
	}

	export enum CostTypeEnum {
		EstimatedLenderCosts = 0,
		EstimatedThirdPartyCosts = 1,
		Prepaids = 2,
		EstimatedReservesDepositedwithLender = 3,
	}

	export enum DebtCommentTypeEnum {
		Agree = 0,
		Disagree = 1,
		PaidOff = 3,
		PayoffAtClose = 4,
		AccountNotMine = 5,
		Duplicate = 6,
		NotMyLoan = 7,
		SomeoneElsePays = 8,
		NonBorrowingSpouse = 9,
	}

	export enum DebtsAccountOwnershipTypeEnum {
		Borrower = 0,
		CoBorrower = 1,
		Joint = 2,
		BorrowerWithOther = 3,
		CoBorrowerWithOther = 4,
	}

	export enum DisclosureStatusEnum {
		NotNeeded = 1,
		InitialDisclosureRequired = 2,
		ReDisclosureRequired = 3,
		RequestInProgress = 4,
		DisclosuresCreated = 5,
	}

	export enum DocDeliveryTypeEnum {
		Mail = 0,
		Electronic = 1,
	}

	export enum DocumentClassEnum {
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
		Other = 99,
	}

	export enum ElectronicAddressTypeEnum {
		HomePhone = 0,
		CellPhone = 1,
		WorkPhone = 2,
		OtherPhone = 3,
		Email = 4,
		WorkEmail = 5,
		Fax = 6,
		Unspecified = -1,
	}

	export enum EmploymentStatusEnum {
		Current = 1,
		Previous = 2,
	}

	export enum EmploymentTypeEnum {
		ActiveMilitaryDuty = 0,
		SalariedEmployee = 1,
		SelfEmployed = 2,
		Retired = 3,
		OtherOrUnemployed = 4,
		None = -1,
	}

	export enum EncompassRecordFieldNameEnum {
		Status = 1,
		StatusDate = 2,
		IPAddress = 3,
		Source = 4,
		CoBorrowerStatus = 5,
		CoBorrowerStatusDate = 6,
		CoBorrowerIPAddress = 7,
		CoBorrowerSource = 8,
	}

	export enum EncompassRecordNameEnum {
		eConsentRecord = 1,
		IntentToProceed = 2,
	}

	export enum ExistingSecondMortgageTypeEnum {
		NoExistingMortgage = 0,
		Fixed = 1,
		HELOC = 2,
	}

	export enum FeeCategoryEnum {
		None = 0,
		Escrow = 1,
		Title = 2,
		PestInspection = 3,
	}

	export enum FHAProductsEnum {
		None = 0,
		StreamlineRefinance = 1,
		RateAndTermRefinance = 2,
		SimpleRefinance = 3,
		CashOutRefinance = 4,
		Purchase = 5,
		PurchaseDown = 6,
	}

	export enum FHAPropertyOccupiedForEnum {
		LessThanOneYear = 1,
		MoreThanOneYear = 2,
	}

	export enum FormNameEnum {
		Default = 0,
		TransactionSummaryViewModel = 1,
	}

	export enum GFETypeEnum {
		WhatIf = 0,
		SmartGFE = 1,
	}

	export enum GovermentEligibilityEnum {
		None = 0,
		FHAEligible = 1,
		FHANotEligible = 2,
		VAEligible = 3,
		VANotEligible = 4,
		USDAEligible = 5,
		USDANotEligible = 6,
	}

	export enum HomeBuyingTypeEnum {
		None = 0,
		OfferAccepted = 1,
		OfferPendingFoundAHouse = 2,
		GetPreApproved = 3,
		WhatCanIAfford = 4,
	}

	export enum IncomeTypeEnum {
		BaseEmployment = 0,
		Overtime = 1,
		Bonuses = 2,
		Commissions = 3,
		DividendsInterest = 4,
		NetRental = 5,
		Other = 6,
		TrustIncome = 7,
		AlimonyChildSupport = 8,
		AutomobileExpenseAccount = 9,
		FosterCare = 10,
		MilitaryBasePay = 11,
		NotesReceivableInstallment = 12,
		PartTime = 13,
		SocialSecurity = 14,
		DisabilityIncome = 15,
		SelfEmployedIncome = 16,
		RetirementPensionIncome = 17,
		MilitaryClothesAllows = 18,
		MilitaryCombatPay = 19,
		MilitaryFlightPay = 20,
		MilitaryHazardPay = 21,
		MilitaryOverseasPay = 22,
		MilitaryPropPay = 23,
		MilitaryQuartersAllowance = 24,
		MilitaryRationsAllowance = 25,
		MilitaryVariableHousingAllowance = 26,
		Unemployment = 27,
		VABenefitsNonEducational = 28,
	}

	export enum IncomeTypeNetRentalEnum {
		AdjustedNetRentalIncome = 1,
		NetRentalIncome = 2,
		AnticipatedNetRentalIncome = 3,
		AdjustedAnticipatedNetRentalIncome = 4,
	}

	export enum IntegrationLookupSystemEnum {
		Encompass = 1,
	}

	export enum IntegrationStatusDetailTypeEnum {
		IntegrationRequest = 1,
		iMPSourceData = 2,
		VendorRequest = 3,
		VendorResponse = 4,
		SystemError = 5,
	}

	export enum IntegrationStatusTypeEnum {
		New = 1,
		Processing = 2,
		Completed = 3,
		Errored = 4,
	}

	export enum ItemizationDescriptionTypesEnum {
		Installment1 = 1,
		Installment2 = 2,
		Installment3 = 3,
		Installment4 = 4,
		MelloRoos = 5,
		Supplemental1 = 6,
		Supplemental2 = 7,
		Supplemental3 = 8,
	}

	export enum ItemSourceTypeEnum {
		User = 0,
		Credit = 1,
	}

	export enum LedgerEntryNameEnum {
		Empty = 0,
		BorrowerClosingCosts = 1,
		BorrowerDeposit = 2,
		ExistingLoansTaken = 3,
		LoanAmount = 4,
		SalePriceOfPersonalProperty = 5,
		SalePriceOfProperty = 6,
		SellerClosingCosts = 7,
		SellerCredit = 8,
		SellerExcessDeposit = 9,
		CityTownTaxes = 10,
		CountyTaxes = 11,
		Assessments = 12,
		HOADues = 13,
		PayoffFirstMortgage = 14,
		PayoffSecondMortgage = 15,
		PayoffThirdMortgage = 16,
		PayoffOtherMortgage = 17,
		Other = 18,
		BorrowerPaidFees = 19,
		EmployerAsstHousing = 20,
		LeasePurchaseFund = 21,
		LenderCredit = 22,
		RelocationFund = 23,
		OtherDoubleEntry = 24,
	}

	export enum LedgerEntryTypeEnum {
		NotSpecified = 0,
		Credit = 1,
		Debit = 2,
	}

	export enum LegalEntityTypeEnum {
		NotSpecified = 0,
		CPA = 1,
		DocSigning = 2,
		Escrow = 3,
		FloodInsurance = 4,
		HazardInsurance = 5,
		PropertyManagement = 6,
		HomeWarranty = 7,
		Survey = 8,
		PestInspection = 9,
		MortgageInsurance = 10,
		Realtor = 11,
		TitleInsurance = 12,
		Appraiser = 13,
		ReservedForFutureUse_3 = 22,
		ReservedForFutureUse_2 = 23,
		ReservedForFutureUse_1 = 24,
		PreferredSettlementServiceProvider = 25,
		Affiliate = 26,
		FutureUse = 31,
	}

	export enum LegalEntityTypeMask {
		NotSpecified = 0,
		CPA = 16,
		DocSigning = 32,
		Escrow = 64,
		FloodInsurance = 128,
		HazardInsurance = 256,
		PropertyManagement = 512,
		HomeWarranty = 1024,
		Survey = 2048,
		PestInspection = 4096,
		MortgageInsurance = 8192,
		Realtor = 16384,
		TitleInsurance = 32768,
		Appraiser = 65536,
		PreferredSettlementServiceProvider = 268435456,
		Affiliate = 536870912,
		AllLegalEntities = 1073741824,
	}

	export enum LiabilityTypeEnum {
		Other = 0,
		Revolving = 1,
		Installment = 2,
		Public = 3,
		MovedFromReo = 4,
		Alimony = 5,
		ChildCare = 6,
		ChildSupport = 7,
		CollectionsJudgmentAndLiens = 8,
		JobRelatedExpenses = 9,
		LeasePayments = 10,
		Open30DayChargeAccount = 11,
		OtherLiability = 12,
		SeparateMaintenanceExpense = 13,
	}

	export enum LoanApplicationTypeEnum {
		MainApplication = 1,
		AdditionalApplication = 2,
	}

	export enum LoanDateTypeEnum {
		AppraisalContingencyDate = 1,
		ApprovalContingencyDate = 2,
		ClosingDate = 3,
	}

	export enum LoanInfoRequestEnum {
		NullRequest = 0,
		LoanAmount = 1,
		SalePriceOfProperty = 2,
		BorrowerDeposit = 3,
		BorrowerClosingCostsFromSectionJ = 4,
		SellerClosingCostsFromSectionJ = 5,
	}

	export enum LoanLockControlStatusType {
		Acquired = 1,
		Released = 2,
		TimedOut = 3,
	}

	export enum LoanOriginationInterviewTypeEnum {
		FaceToFace = 0,
		Telephone = 1,
		FaxOrMail = 2,
		EmailOrInternet = 3,
	}

	export enum LoanPricingAdjustmentDropDownTypeEnum {
		Adjustment = 0,
		SubType = 1,
		PaidBy = 2,
	}

	export enum LoanPricingAdjustmentPaidByTypeEnum {
		Unkonwn = 0,
		LoanOfficer = 1,
		Division = 2,
		Company = 3,
		Borrower = 4,
	}

	export enum LoanPricingAdjustmentTypeEnum {
		Sec2Llpa = 1,
		Sec2Concession = 2,
		Sec2ExcessPricing = 3,
		Sec2Extension = 4,
		Sec2Renegotation = 5,
		Sec2WorstCasePricing = 6,
		Sec1CorporateMargin = 7,
		Sec1DivisionMargin = 8,
		Sec1LoanOfficerCompensation = 9,
		Sec1ExcessPricing = 10,
		Sec1Extension = 11,
		Sec3ExcessPricing = 12,
		Sec3Extension = 13,
		Sec3Renegotation = 14,
		Sec3WorstCasePricing = 15,
		Sec1CompanyMargin = 16,
		Sec1Compensation = 17,
		Sec1Ipa = 18,
		Sec1Ira = 19,
		Sec2Llra = 20,
		Sec2Ipa = 21,
		Sec3Ipa = 22,
	}

	export enum LoanPurposeTypeEnum {
		None = 0,
		Purchase = 1,
		Refinance = 2,
	}

	export enum LoanStatus {
		Closed = 1,
		InProgress = 2,
		Cancelled = 3,
		Reopened = 4,
	}

	export enum LockingConfigurationEnum {
		None = 0,
		AllowedMinutesFromSearchToRequestMandatory = 1,
		AllowedMinutesFromSearchToRequestEforts = 2,
		AutoLockSettingsBestEfforts = 3,
		AutoLockSettingsMandatoryEfforts = 4,
		MaxNumberOfConcessions = 5,
		MaxConcessionAmountTotal = 6,
		MaxConcessionAmountLevel1 = 7,
		MaxConcessionAmountLevel2 = 8,
		MaxConcessionAmountLevel3 = 9,
		MaxConcessionAmountLevel4 = 10,
		MaxConcessionAmountLevel5 = 11,
	}

	export enum LockingConfigurationTypeEnum {
		None = 0,
		RulesForLock = 1,
		RulesForConcession = 2,
	}

	export enum MannerOfPaymentRatingEnum {
		Unknown = 0,
		Late30Days = 1,
		Late60Days = 2,
		Late90Days = 3,
		LateOver120Days = 4,
	}

	export enum MaritalStatusTypeEnum {
		Married = 0,
		Separated = 1,
		Unmarried = 2,
		SelectOne = -1,
	}

	export enum MilestoneStatusTypeEnum {
		Prospect = 1,
		Incomplete = 2,
		Processing = 3,
		PreApproved = 4,
		Approved = 5,
		DocsOut = 6,
		Funding = 7,
		Closed = 8,
		Canceled = 9,
		Unsubmitted = 10,
		Registered = 11,
		Submitted = 12,
		Rejected = 13,
		Adverse = 14,
	}

	export enum MilitaryBranchOrServiceTypeEnum {
		AirForce = 0,
		Army = 1,
		Marines = 2,
		Navy = 3,
		Other = 4,
	}

	export enum MortgageInsuranceTerminationEnum {
		LTV78orMidpointTermination = 0,
		MidpointTermination = 1,
		NoAutoTermination = 2,
	}

	export enum MortgageTypeEnum {
		Conventional = 0,
		FHA = 1,
		ConventionalJumbo = 2,
		ConventionalSuperJumbo = 3,
		VA = 4,
		USDA = 5,
	}

	export enum NtbBenefitEnum {
		AvoidForeclosure = 1,
		LowerInterestRate = 2,
		LowerMonthlyPayment = 3,
		LowerInterestRateOrLowerTermAndCostsRecouped = 4,
		LowerDuration = 5,
		LowerAmortizationSchedule = 6,
		EliminateFeatureNegativeAmortization = 7,
		EliminateFeatureBalloonPayment = 8,
		EliminatePrivateMortgageInsurance = 9,
		ChangeAdjustableRateToFixedRate = 10,
		CashoutReasonable = 11,
		CashoutReasonableBonaFiedPersonalNeed = 12,
		CashoutSignificantPurpose = 13,
		ConsolidateLoans = 14,
		ConsolidateDebts = 15,
		NewLoanGuaranteed = 16,
		NewLoanQualifiedMortgage = 17,
		DTIBelowThreshold = 18,
	}

	export enum OtherCreditType {
		CashDepositOnSales = 0,
		SellerCredit = 1,
		LenderCredit = 2,
		RelocationFunds = 3,
		EmployerAssistedHousing = 4,
		LeasePurchaseFund = 5,
		Other = 6,
		BorrowerPaidfees = 7,
		LenderPointCredit = 8,
	}

	export enum OwnershipStatusTypeEnum {
		Own = 0,
		Rent = 1,
		RentFree = 2,
		None = -1,
	}

	export enum PartyTypeEnum {
		Borrower = 1,
		CoBorrower = 2,
		LoanConcierge = 3,
		LoanProcessor = 4,
		ImpersonatedConciergeId = 5,
		CallCenter = 6,
		LeadSource = 7,
		PartnerLeadSource = 8,
		BuyersAgent = 9,
		SellersAgent = 10,
		LoanOfficer = 11,
		Investor = 12,
	}

	export enum PaymentMonthEnum {
		Unspecified = 0,
		January = 1,
		February = 2,
		March = 3,
		April = 4,
		May = 5,
		June = 6,
		July = 7,
		August = 8,
		September = 9,
		October = 10,
		November = 11,
		December = 12,
	}

	export enum PeriodTypeEnum {
		None = 0,
		Monthly = 1,
		Annually = 2,
		Weekly = 3,
		BiWeekly = 4,
		Quarterly = 5,
		SemiAnnually = 6,
	}

	export enum PledgedAssetCommentTypeEnum {
		DoNotPayoff = 0,
		PaidOffFreeAndClear = 1,
		PayoffAtClose = 2,
		PayoffAtClosingAndDontCloseAccount = 3,
		PayoffAtClosingAndCloseAccount = 4,
		Sold = 5,
		NotMyLoan = 6,
		PendingSale = 7,
		NotAMortgage = 8,
		Duplicate = 9,
	}

	export enum PricingAdjustmentSectionTypeEnum {
		Enterprise = 1,
		LOPrice = 2,
		FinalPrice = 3,
	}

	export enum PrivilegeType {
		System = 0,
		User = 1,
	}

	export enum ProductTypeEnum {
		CreditReport = 4,
		AuditReport = 5,
	}

	export enum PropertyExpenseTypeEnum {
		None = 0,
		PropertyTax = 1,
		HomeOwnerInurance = 2,
		MortgageInsurance = 3,
		HomeOwnerAssociationDues = 4,
		FloodInsurance = 5,
	}

	export enum PropertyHeldTypeEnum {
		Individual = 0,
		Trust = 1,
		Corporation = 2,
	}

	export enum PropertyTypeEnum {
		None = 0,
		SingleFamily = 1,
		Condominium = 2,
		PUD = 3,
		ManufacturedHousingDoubleWide = 4,
		ManufacturedHousingSingleWide = 5,
		Cooperative = 6,
		Condotel = 7,
		Modular = 8,
		Timeshare = 9,
		NonWarrantableCondo = 10,
		TownHouse = 11,
		Commercial = 12,
		MixedUse = 13,
		MultiFamilyTwoToFourUnits = 14,
		MobileHome = 15,
		MultiFamilyMoreThanFourUnits = 16,
		HomeAndBusinessCombined = 17,
		Farm = 18,
		Land = 19,
	}

	export enum PropertyUsageTypeEnum {
		None = 0,
		PrimaryResidence = 1,
		InvestmentProperty = 2,
		SecondVacationHome = 3,
	}

	export enum ProspectStatusTypeEnum {
		NewProspect = 0,
		Badcredit = 1,
		Cancelled = 2,
		DoNotCall = 3,
		FollowUp = 4,
		WarmLead = 5,
		ApplicationStarted = 6,
		LostToCompetition = 8,
		NoBenefitRateAlert = 11,
		NoEquity = 12,
		NoIncome = 13,
		NotLicensedInTheState = 14,
		PreApprovalRequest = 16,
		LoanApplicationPending = 17,
		ApplicationCompleted = 19,
	}

	export enum RefinanceCommentTypeEnum {
		None = 0,
		DoNotPayoff = 1,
		PayoffAtClosing = 2,
		PayoffDontCloseAccount = 3,
		PayoffCloseAccount = 4,
	}

	export enum RefinancePurposeTypeEnum {
		None = 0,
		CashOut = 1,
		RateAndTerm = 2,
	}

	export enum RightsTypeEnum {
		FeeSimple = 0,
		Leasehold = 1,
		Other = 2,
	}

	export enum RoleDefaultPage {
		None = 0,
		ConciergeCenterProspectQueue = 1,
		LoanCenter = 2,
		ConciergeCenterNewLoanAppOrPipelineQueue = 3,
		SystemAdmin = 4,
	}

	export enum RoleEnum {
		None = 0,
		Administrator = 1,
		Borrower = 2,
		BranchManager = 3,
		Business = 4,
		ChannelManager = 5,
		Concierge = 6,
		DivisionManager = 7,
		HVM = 8,
		LoanAdmin = 9,
		LoanOfficer = 10,
		LoanOfficerAssistant = 11,
		LoanProcessor = 12,
		LockDesk = 13,
		Manager = 14,
		Public = 15,
		SalesManager = 16,
		SalesMarketing = 17,
		SalesMarketingExternal = 18,
		Secondary = 19,
		TeamLeader = 20,
	}

	export enum RoleTypeEnum {
		None = 0,
		LoanAssignments = 1,
	}

	export enum SearchCriteriaAmortizationTypeEnum {
		Fixed = 1,
		ARM = 2,
	}

	export enum SearchCriteriaARMFixedTermEnum {
		ARM10yr = 1,
		ARM7yr = 2,
		ARM5yr = 4,
		ARM3yr = 8,
		ARM2yr = 16,
		ARM1yr = 32,
		ARM6mo = 64,
		ARM3mo = 128,
		ARM1mo = 256,
	}

	export enum SearchCriteriaLoanTermEnum {
		Loan40yr = 1,
		Loan30yr = 2,
		Loan25yr = 4,
		Loan20yr = 8,
		Loan15yr = 16,
		Loan10yr = 32,
		Loan7yr = 64,
		Loan5yr = 128,
		Loan4yr = 256,
		Loan2yr = 512,
	}

	export enum SearchCriteriaLoanTypeEnum {
		Conforming = 1,
		NonConforming = 2,
		FHA = 4,
		USDA = 8,
		HARP_FannieMae = 16,
		HARP_FreddieMac = 32,
	}

	export enum SecondMortgageInfoTypeEnum {
		OpenedAtTimeOfPurchase = 0,
		OpenedInLast12Months = 1,
		OpenedOver12MonthsAgo = 2,
		None = -1,
	}

	export enum SectionTypeEnum {
		Empty = 0,
		BorrowerDebits = 1,
		BorrowerCredits = 2,
		SellerCredits = 3,
		SellerDebits = 4,
	}

	export enum ServiceProviderEnum {
		BorrowerSelected = 0,
		Affiliate = 1,
		SSP = 2,
	}

	export enum SigningStatusEnum {
		None = 0,
		Decline = 1,
		Signed = 2,
	}

	export enum SubSectionTypeEnum {
		Empty = 0,
		Main = 1,
		PaidAdjustments = 2,
		UnpaidAdjustments = 3,
		OtherCredits = 4,
		Adjustments = 5,
		AdditionalAdjustments = 6,
		Payoffs = 7,
		SellerCredit = 8,
	}

	export enum TitleCostIncludedTypeEnum {
		None = 0,
		IncludeInLendersPolicy = 1,
		IncludeInOwnersPolicy = 2,
		ShowAsALineItem = 3,
	}

	export enum TitleVestedAsEnum {
		None = 0,
		Veteran = 1,
		VeteranAndSpouse = 2,
		Other = 3,
	}

	export enum ToleranceDisclosureTypeEnum {
		Disclosure = 0,
		ReDisclosure = 1,
		Lock = 2,
	}

	export enum TotalPaidByEnum {
		Unknown = 0,
		LoanOfficer = 1,
		Division = 2,
		Company = 3,
		Borrower = 4,
	}

	export enum UpfrontPreferredPaymentPeriodEnum {
		None = 0,
		Financed = 1,
		InCash = 2,
	}

	export enum US_StateEnum {
		Alabama = 0,
		Alaska = 1,
		Arizona = 2,
		Arkansas = 3,
		California = 4,
		Colorado = 5,
		Connecticut = 6,
		Delaware = 7,
		Florida = 8,
		Georgia = 9,
		Hawaii = 10,
		Idaho = 11,
		Illinois = 12,
		Indiana = 13,
		Iowa = 14,
		Kansas = 15,
		Kentucky = 16,
		Louisiana = 17,
		Maine = 18,
		Maryland = 19,
		Massachussets = 20,
		Michigan = 21,
		Minnesota = 22,
		Mississippi = 23,
		Missouri = 24,
		Montana = 25,
		Nebraska = 26,
		Nevada = 27,
		NewHamshire = 28,
		NewJersey = 29,
		NewMexico = 30,
		NewYork = 31,
		NorthCarolina = 32,
		NorthDakota = 33,
		Ohio = 34,
		Oklahoma = 35,
		Oregon = 36,
		Pennsylvania = 37,
		RhodeIsland = 38,
		SouthCarolina = 39,
		SouthDakota = 40,
		Tennessee = 41,
		Texas = 42,
		Utah = 43,
		Vermont = 44,
		Virginia = 45,
		Washington = 46,
		WestVirginia = 47,
		Wisconsin = 48,
		Wyoming = 49,
		DistrictOfColumbia = 50,
		Undefined = -1,
	}

	export enum VaAllowableTypeEnum {
		None = 0,
		NonAllowable = 1,
		Allowable = 2,
		NonAllowableToOnePercent = 3,
	}

	export enum VACalculatorsEnum {
		VAGeneralInformation = 1,
		IRRLMax = 2,
		IRRLQMCertification = 3,
	}

	export enum VAFeeLimitExceededReasonEnum {
		None = 0,
		UnAllowableFeeCharged = 1,
		FeesExceedsOnePercentLimit = 2,
	}

	export enum VALoanPurposeEnum {
		None = 0,
		PurchaseHomePreviouslyOccupied = 1,
		FinanceImprovement = 2,
		Refinance = 3,
		PurchaseNewCondoUnit = 4,
		PurchaseExistingCondoUnit = 5,
		PurchaseHomeNotPreviouslyOccupied = 6,
		ConstructHome = 7,
		FinanceCoopPurchase = 8,
		PurchaseManufacturedHome = 9,
		PurchaseManufacturedHomeAndLot = 10,
		RefiManufacturedHomeToBuyLot = 11,
		RefiManufacturedHomeOrLotLoan = 12,
	}

	export enum VARegionsEnum {
		None = 0,
		Northeast = 1,
		Midwest = 2,
		South = 3,
		West = 4,
	}

	export enum ViewModelFunctionStatusEnum {
		Success = 0,
		SectionKeyDoesNotExist = 1,
		NotDoubleEntry = 2,
		SubSectionIsFull = 3,
		GeneralFailure = 4,
		LineNumberDoesNotExist = 5,
		LinkedDoubleEntryCannotBeUnlinked = 6,
		LineNumberIsInUse = 7,
		SubSectionKeyDoesNotExist = 8,
		SubSectionKeyCounterpartDoesNotExist = 9,
		MainSubSectionCannotBeAltered = 10,
		ValueIsReadOnly = 11,
		NameIsReadOnly = 12,
		OtherCostNameStringIsNull = 13,
	}
}

