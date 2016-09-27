// This file (viewModelClasses.ts - ver 1.0) has been has been automatically generated, do not modify!
// To extend an interface, create a file that exports the same interface name within the same module name with ONLY the ADDITIONAL properties.
// TypeScript will automatically merge both interfaces together.
 

/// <reference path="enums.ts" />	
/// <reference path="../extendedViewModels/genericTypes.ts" />	
/// <reference path="viewModels.ts" />	
/// <reference path="viewModelBaseClasses.ts" />	

module srv.cls  {

	export class AddressViewModel_OBSOLETE implements srv.IAddressViewModel_OBSOLETE  {
		addressId: string;
		addressTypeId: number;
		cityName: string;
		countyName: string;
		isLicensedStates: boolean;
		stateId: number;
		stateName: string;
		streetName: string;
		unitNumber: string;
		zipCode: string;
	}

	export class AdjustmentsViewModel implements srv.IAdjustmentsViewModel  {
		adjustmentSectionType: number;
		adjustmentTypeId: number;
		description: string;
		identityKey: number;
		isDeleted: boolean;
		isEditable: boolean;
		lastModifiedBy: string;
		loanId: string;
		loanPricingAdjustmentId: number;
		note: string;
		paidBy: number;
		rate: number;
		value: number;
	}

	export class AdjustmentTypeDescViewModel extends LookupItem implements srv.IAdjustmentTypeDescViewModel  {
		constructor() {
		super();
	}

	type: number;
	}

	export class AdjustmentTypesViewModel extends LookupItem implements srv.IAdjustmentTypesViewModel  {
		constructor() {
		super();
	}

	isEditable: boolean;
	}

	export class AdverseReasonViewModel implements srv.IAdverseReasonViewModel  {
		adverseReasonId: string;
		reason: string;
		reasonType: number;
		timestamp: Date;
	}

	export class AgentContactViewModel implements srv.IAgentContactViewModel  {
		alternatePhone: string;
		alternatePhoneId: string;
		alternatePhoneType: number;
		company: string;
		email: string;
		emailId: string;
		firstname: string;
		isDeleted: boolean;
		lastname: string;
		legalEntityId: string;
		loanContactId: string;
		preferedPhone: string;
		preferedPhoneType: number;
		preferredPhoneId: string;
		sellerType: number;
		sendPreApprovalLetterToAgent: boolean;
	}

	export class AntiSteeringOptionsViewModel implements srv.IAntiSteeringOptionsViewModel  {
		firstInterestRate: number;
		firstTotalPoints: number;
		loanAntiSteeringOptionsId: string;
		secondInterestRate: number;
		secondTotalPoints: number;
		thirdInterestRate: number;
		thirdTotalPoints: number;
	}

	export class AppraisalContactViewModel implements srv.IAppraisalContactViewModel  {
		contactRelation: string;
		email: string;
		firstName: string;
		lastName: string;
		phone: string;
		phoneType: string;
		specialInstructions: string;
	}

	export class AppraisalProductViewModel implements srv.IAppraisalProductViewModel  {
		amount: string;
		name: string;
	}

	export class AppraisalViewModel implements srv.IAppraisalViewModel  {
		appraisalContact: IAppraisalContactViewModel;
		appraisalProducts: ICollection<IAppraisalProductViewModel>;
		creditCardInfo: IPaymentViewModel;
	}

	export class AppraisedValueHistoryItemViewModel implements srv.IAppraisedValueHistoryItemViewModel  {
		dateOfChange: string;
		user: string;
		value: number;
	}

	export class AssetViewModel implements srv.IAssetViewModel  {
		accountNumber: string;
		assetId: string;
		assetType: number;
		assetValue: number;
		automobileMake: string;
		automobileYear: number;
		borrowerFullName: string;
		description: string;
		financialInstitutionAddress: IPropertyViewModel;
		financialInstitutionName: string;
		identityKey: string;
		institiutionContactInfo: ICompanyDataViewModel;
		isDownPayment: boolean;
		isRemoved: boolean;
		jointAccount: boolean;
		lifeInsuranceFaceValue: number;
		liquidAsset: boolean;
		monthlyAmount: number;
		unpaidBalance: number;
	}

	export class AusViewModel implements srv.IAusViewModel  {
		serviceTrackings: ICollection<IServiceTrackingViewModel>;
		serviceValidations: ICollection<IServiceValidationViewModel>;
	}

	export class BasicCost extends CostBase implements srv.IBasicCost  {
		constructor() {
		super();
	}

	costName: LedgerEntryNameEnum;
		costNameString: string;
		displayLineNumber: number;
		from: Date;
		isApportioned: boolean;
		isDoubleEntryMember: boolean;
		lineNumber: number;
		loanInfoRequestKey: LoanInfoRequestEnum;
		mutableLineNumber: boolean;
		mutableName: boolean;
		relatedCost: IDoubleEntryCost;
		sectionKey: SectionTypeEnum;
		subSectionKey: SubSectionTypeEnum;
		to: Date;
		useLoanInfoRequestKey: boolean;
	}

	export class BorrowerNamesViewModel implements srv.IBorrowerNamesViewModel  {
		borrowerFirstName: string;
		borrowerFlag: string;
		borrowerLastName: string;
		coBorrowerFirstName: string;
		coBorrowerLastName: string;
		isCoBorrowerExists: boolean;
	}

	export class BorrowerWithAdditionalInfoViewModel extends BorrowerViewModel implements srv.IBorrowerWithAdditionalInfoViewModel  {
		constructor() {
		super();
	}

	incomeTypes: IList<ILookupItem>;
	}

	export class BranchAbridgedViewModel implements srv.IBranchAbridgedViewModel  {
		branchId: string;
		city: string;
		name: string;
		phone: string;
		state: string;
		street: string;
		street2: string;
		zip: string;
	}

	export class BranchesAbridgedViewModel implements srv.IBranchesAbridgedViewModel  {
		branchesAbridgedList: IList<IBranchAbridgedViewModel>;
	}

	export class BranchViewModel implements srv.IBranchViewModel  {
		branchId: string;
		branchManager: number;
		defaultBrokerCompensationAmount: number;
		defaultBrokerCompensationPercent: number;
		displayName: string;
		excludeFromBranchListing: boolean;
		fax: string;
		hudBranchNumber: string;
		irPassword: string;
		irUsername: string;
		isInactive: boolean;
		licenses: IList<ILicenseViewModel>;
		loWebsite: boolean;
		maxCompensation: number;
		minCompensation: number;
		name: string;
		phone: string;
		theme: string;
	}

	export class CalculatedCashToCloseViewModel implements srv.ICalculatedCashToCloseViewModel  {
		isDisclosureAvailable: boolean;
		loanEstimates: ILoanEstimatesViewModel;
	}

	export class CalculatorCostViewModel implements srv.ICalculatorCostViewModel  {
		amount: number;
		costId: string;
		factor: number;
		hudLineNumber: number;
		impounded: boolean;
		monthlyAmount: number;
		name: string;
		noOfMonthlyReserves: number;
		paymentType: string;
		totalEstimatedReserves: number;
	}

	export class CalculatorRequest implements srv.ICalculatorRequest  {
		allowableBorrowerPaidClosingCosts: number;
		annualInterestRate: number;
		applicationDate: Date;
		baseLoanAmount: number;
		calculateAggregateAdjustment: boolean;
		clientContextIdentifier: number;
		closingDate: Date;
		costs: IList<ICostViewModel>;
		defaultBrokerCompensationPercent: number;
		existingSecondMortgageType: number;
		fhaCountyLoanLimit: number;
		fico: number;
		firstPaymentDate: Date;
		fixedTerm: number;
		includeVAFee: boolean;
		incomes: IList<IIncomeInfoViewModel>;
		isShoppingForALoan: boolean;
		lenderCreditforClosingCostsAndPrepaids: number;
		liabilities: IList<ILiabilityViewModel>;
		loan: ILoanViewModel;
		loanAmortizationFullTermNumberOfMonths: number;
		loanAmount: number;
		loanApplicationDate: Date;
		loanApplicationId: string;
		loanTerm: number;
		loanType: LoanPurposeTypeEnum;
		lockDate: Date;
		lockDays: number;
		lockRequestDate: Date;
		maximumCreditLine: number;
		monthlyInterestRatePercent: number;
		monthsOfCushion: number;
		mortgageType: number;
		negativeCashFlowInfos: IList<INegativeCashFlowInfoViewModel>;
		ntbBenefitActivationRequest: INtbBenefitActivationRequest;
		ntbRequiredRequest: INtbRequiredRequest;
		openDate: Date;
		outstandingBalance: number;
		pledgedLiabilities: IList<ILiabilityViewModel>;
		points: number;
		prepaidExpenses: number;
		productCost: number;
		productRate: number;
		propertyAppraisedValue: number;
		propertyHMIAmount: number;
		propertyTaxAmount: number;
		purchasePrice: number;
		recoupmentPeriodRequest: IRecoupmentPeriodRequest;
		secondMortgageAmount: number;
		secondMortgageRefiCommentType: number;
		stateImpoundLimit: number;
		subordinateFinancing: ISubordinateFinancingDetailsViewModel;
		totalClosingCostsBorrower: number;
		yearsStayingInTheProperty: number;
	}

	export class CalculatorResponse implements srv.ICalculatorResponse  {
		agregateAdjustment: number;
		apr: number;
		calculatedValueTypes: IList<CalculatedValueTypeEnum>;
		clientContextIdentifier: number;
		cltv: number;
		detailsOfTransaction: IDetailsOfTransactionCalculatedViewModel;
		dtiAndHousingRatio: ICombinedDTIandHousingRatioCalculatedViewModel;
		fhaCalculatorResponse: IFHACalculatorResponse;
		firstPaymentDate: Date;
		fullyIndexedRate: number;
		hcltv: number;
		housingExpenses: IHousingExpensesViewModel;
		hud801And802Costs: IList<ICostViewModel>;
		interestAmountPerDiem: number;
		loanDecisionScore: number;
		ltv: number;
		monthlyPayment: number;
		netRentalIncomes: IList<IIncomeInfoViewModel>;
		newMonthlyPayment: number;
		ntbBenefitActivationResponse: INtbBenefitActivationResponse;
		ntbRequiredResponse: INtbRequiredResponse;
		qmCertification: IQMCertificationViewModel;
		recalculatedCosts: IList<ICostViewModel>;
		recoupmentPeriodResponse: IRecoupmentPeriodResponse;
		stateLtvLimit: number;
		subordinateFee: ICostViewModel;
		vaFeeLimitsExceeded: boolean;
	}

	export class CashoutRuleResultCalculatedViewModel implements srv.ICashoutRuleResultCalculatedViewModel  {
		askCashoutQuestion: boolean;
		cashoutAmount: number;
		cltv: number;
		hcltv: number;
		isConventionalCashout: boolean;
		isFhaCashout: boolean;
		isSuperJumbo: boolean;
		isSuperJumboCashout: boolean;
		ltv: number;
		message: string;
		refinancePurposeType: number;
		showMessage: boolean;
		subTitle: string;
		title: string;
	}

	export class ChannelViewModel implements srv.IChannelViewModel  {
		activateOrderAppraisalActivity: boolean;
		activityStatus: string;
		borrowerSiteURL: string;
		channelId: number;
		channelManagerId: number;
		digitalDocsCode: string;
		disclosuresLenderName: string;
		displayName: string;
		divisions: IList<IDivisionViewModel>;
		enableManageBranchListing: boolean;
		exportToVelocify: boolean;
		exportToVelocifyFromMobileApp: boolean;
		freeConsultEmailList: string;
		irClientId: string;
		isRetail: boolean;
		isWholesale: boolean;
		loJobTitleOnLoanApplication: boolean;
		name: string;
		phone: string;
		theme: string;
	}

	export class ClosingCostViewModel extends BaseViewModel implements srv.IClosingCostViewModel  {
		constructor() {
		super();
	}

	calculatedCashToClose: ICalculatedCashToCloseViewModel;
		costs: IList<ICostViewModel>;
		disclosuresDetailsViewModel: IList<IDisclosuresDetailsViewModel>;
		loanCostTypes: IDictionary<number, IList<ISelectCostTypeListItem>>;
		otherCostTypes: IDictionary<number, IList<ISelectCostTypeListItem>>;
		payOffSection: IPayOffSectionViewModel;
		smartGFEId: string;
		totalLenderRebate: number;
	}

	export class CollectionsViewModel implements srv.ICollectionsViewModel  {
		collections: IList<IDebtViewModel>;
		comments: IList<ILookupItem>;
		visible: boolean;
	}

	export class CombinedDTIandHousingRatioCalculatedViewModel implements srv.ICombinedDTIandHousingRatioCalculatedViewModel  {
		combinedDTIDU: number;
		combinedDTIFHA: number;
		combinedDTILP: number;
		combinedHousingRatioDU: number;
		combinedHousingRatioFHA: number;
		combinedHousingRatioLP: number;
		dti: number;
		housingRatio: number;
		qualCombinedDTIDU: number;
		qualCombinedDTIFHA: number;
		qualCombinedDTILP: number;
	}

	export class CompanyDataViewModel implements srv.ICompanyDataViewModel  {
		addressViewModel: IPropertyViewModel;
		assetId: string;
		attn: string;
		companyId: string;
		companyName: string;
		email: string;
		fax: string;
		liabillityFor: string;
		phone: string;
		streetAddress1: string;
		streetAddress2: string;
	}

	export class CompanyEmployeeUserAccountViewModel extends BaseViewModel implements srv.ICompanyEmployeeUserAccountViewModel  {
		constructor() {
		super();
	}

	branchId: string;
		channelId: number;
		divisionId: number;
		emailAddress: string;
		firstName: string;
		isActivated: boolean;
		lastName: string;
		licenses: ICollection<ILicenseViewModel>;
		loaId: number;
		loanProcessorId: number;
		loTitle: string;
		middleName: string;
		nmlsNumber: string;
		phones: ICollection<IPhoneViewModel>;
		roles: ICollection<IRoleViewModel>;
		salesManagerId: number;
		signatureId: string;
		teamLeaderId: number;
		userAccountId: number;
		username: string;
	}

	export class CompanyProfileViewModel implements srv.ICompanyProfileViewModel  {
		adjustmentStep: number;
		alertPhoneNumber: string;
		channels: IList<IChannelViewModel>;
		companyCity: string;
		companyCopyrightName: string;
		companyFax: string;
		companyIdentifier: string;
		companyLicensingInformation: string;
		companyName: string;
		companyNameShort: string;
		companyPhone: string;
		companyProfileId: string;
		companyResourceFile: string;
		companyState: string;
		companyStreetAddress: string;
		companyTheme: string;
		companyURL: string;
		companyZip: string;
		disclosuresLenderName: string;
		ein: string;
		fhaLenderId: string;
		fhaSponsorId: string;
		isCurrent: boolean;
		lenderName: string;
		maximumAdjustmentRebate: number;
		nmlsNumber: string;
		pricingAdjustmentsAllowed: boolean;
		smsKeywordToUse: string;
		smsShortCode: string;
		vaLenderId: string;
	}

	export class ComparisonViewModel implements srv.IComparisonViewModel  {
		sentEmailItems: ICollection<ISentEmailItemViewModel>;
	}

	export class ComplianceCheckErrorViewModel implements srv.IComplianceCheckErrorViewModel  {
		active: boolean;
		complianceCheckErrorId: string;
		errorId: number;
		timestamp: Date;
	}

	export class ComplianceEaseRequestViewModel implements srv.IComplianceEaseRequestViewModel  {
		branchId: string;
		channelId: number;
		companyId: string;
		divisionId: number;
		loanId: string;
		submitedBy: string;
		userAccountId: number;
	}

	export class ComplianceResultDetailViewModel implements srv.IComplianceResultDetailViewModel  {
		code: string;
		complianceResultDetailId: string;
		description: string;
		detailType: ComplianceResultDetailTypeEnum;
	}

	export class ComplianceResultViewModel implements srv.IComplianceResultViewModel  {
		ceid: string;
		complianceResultId: string;
		details: IList<IComplianceResultDetailViewModel>;
		doddFrank: string;
		exceptions: string;
		hoepa: string;
		lastUpdated: Date;
		policies: string;
		predatory: string;
		repositoryId: string;
		respa: string;
		riskIndicator: string;
		stateRegs: string;
		submittedBy: string;
		tila: string;
		timeStamp: Date;
		trid: string;
		vendorId: number;
	}

	export class ConditionConfigurationViewModel extends BaseViewModel implements srv.IConditionConfigurationViewModel  {
		constructor() {
		super();
	}

	categoryCdId: number;
		code: string;
		conditionConfigurationId: string;
		curativeRoleCdId: string;
		dateCreated: Date;
		externallyVisible: boolean;
		gateCdId: number;
		itemConfigurations: IList<ICurativeItemConfigurationViewModel>;
		statusCdId: number;
		title: string;
		versionNumber: number;
	}

	export class ConditionItemViewModel implements srv.IConditionItemViewModel  {
		commentHistoryExists: boolean;
		curativeItemId: string;
		dateCreated: Date;
		description: string;
		document: IConditionsDocumentViewModel;
		dueDate: Date;
		for: IForConditionMenuModel;
		historyExists: boolean;
		isRemoved: boolean;
		item: IEnumerationValueViewModel;
		lastUpdated: string;
		notes: IList<ICurativeItemNoteViewModel>;
		previouslyAdded: boolean;
		repositoryId: string;
		status: IEnumerationValueViewModel;
		updatedBy: IUserInfoViewModel;
		updatedDate: string;
		userAccountCreatedId: number;
	}

	export class ConditionPrivileges implements srv.IConditionPrivileges  {
		changeItemStatus: boolean;
		delete: boolean;
		viewTab: boolean;
	}

	export class ConditionsDocumentViewModel implements srv.IConditionsDocumentViewModel  {
		accountNumber: string;
		bankName: string;
		borrowerNames: string;
		category: string;
		categoryId: number;
		categorySortName: string;
		description: string;
		documentId: string;
		documentTypeId: number;
		excluded: boolean;
		lastUpdated: string;
		name: string;
		namingConvention: string;
		originalCategory: string;
		originalDocumentTypeId: number;
		rejected: boolean;
		repositoryId: string;
		sortOrder: number;
		uploadedBy: string;
		uploadedDate: string;
	}

	export class ConditionsMainViewModel extends BaseViewModel implements srv.IConditionsMainViewModel  {
		constructor() {
		super();
	}

	conditionFilter: IList<IEnumerationValueViewModel>;
		conditionsDocuments: IList<IConditionsDocumentViewModel>;
		conditionsSub: IConditionsSubViewModel;
		currentUser: IUserInfoViewModel;
		currentUserRoles: IEnumerable<IRoleViewModel>;
		error: boolean;
		investorWebSiteUrl: string;
		isOwnerOccupied: boolean;
		lastChange: ILoanDecisionStatusHistoryViewModel;
		privileges: IConditionPrivileges;
	}

	export class ConditionsSubViewModel implements srv.IConditionsSubViewModel  {
		assignedToList: IList<IRoleViewModel>;
		borrowerConditionList: IList<number>;
		categoryList: IList<IEnumerationValueViewModel>;
		codesList: IList<IConditionConfigurationViewModel>;
		conditions: IList<IConditionViewModel>;
		decisionsList: IList<IEnumerationValueViewModel>;
		documentList: IList<IEnumerationValueViewModel>;
		dueList: IList<IEnumerationValueViewModel>;
		forList: IList<IForConditionMenuModel>;
		itemsList: IList<IEnumerationValueViewModel>;
		newCondition: IConditionViewModel;
		previousConditions: IList<IConditionViewModel>;
		propertyConditionList: IList<number>;
		signedOffList: IList<IRoleViewModel>;
		sourceList: IList<IEnumerationValueViewModel>;
		statusList: IList<IEnumerationValueViewModel>;
	}

	export class ConditionViewModel implements srv.IConditionViewModel  {
		assignedTo: IRoleViewModel;
		categoryDescription: string;
		categoryId: number;
		code: IConditionConfigurationViewModel;
		comment: string;
		commentHistoryExists: boolean;
		conditionComment: string;
		conditionId: string;
		conditionSource: IEnumerationValueViewModel;
		configurationViewModelCode: IConditionConfigurationViewModel;
		curativeItems: IList<IConditionItemViewModel>;
		curativeItemsVisible: boolean;
		dateCreated: Date;
		due: IEnumerationValueViewModel;
		gate: string;
		gateId: number;
		internalOnly: boolean;
		isOwnerOccupied: boolean;
		isRemoved: boolean;
		isSignedOff: boolean;
		newCondition: boolean;
		openitemsCount: number;
		ownerNames: string;
		readyForReviewItemsCount: number;
		sectionName: string;
		signOff: IRoleViewModel;
		signOffDate: string;
		status: string;
		statusId: number;
		userAccountCreatedId: number;
		userSignedOff: IUserInfoViewModel;
	}

	export class ConfigurationViewModel implements srv.IConfigurationViewModel  {
		borrowerSiteUrl: string;
		conciergeHome: string;
		loanCenterHome: string;
		pricingEngine: string;
		signOutPath: string;
		systemAdmin: string;
	}

	export class CopyLoanViewModel implements srv.ICopyLoanViewModel  {
		borrowerIds: IList<string>;
		copySubjectPropertyFlag: boolean;
		creditReportIds: IList<string>;
		creditReportIncluded: IList<string>;
		loanApplicationIds: IList<string>;
		loanId: string;
		loanNumber: string;
		newClosingDate: string;
		newLienPosition: number;
		newLoanPurpose: number;
		newMainApplicationId: string;
		subjectPropertyId: string;
		userAccountId: number;
	}

	export class CostCalcCalculatedViewModel implements srv.ICostCalcCalculatedViewModel  {
		monthlyAmount: number;
		reserveAmount: number;
		totalAmount: number;
	}

	export class CostPaidViewModel implements srv.ICostPaidViewModel  {
		atClosing: number;
		beforeClosing: number;
		id: string;
		paidBy: number;
		paidByDisplayValue: string;
	}

	export class CostViewModel implements srv.ICostViewModel  {
		amount: number;
		amountForYear: number;
		amountMethod: AmountMethodEnum;
		amountPerMonth: number;
		autoRecalculate: boolean;
		borrowerPaid: ICostPaidViewModel;
		canBeLocked: boolean;
		canDelete: boolean;
		canEdit: boolean;
		closingDate: Date;
		closingDateEnd: Date;
		costContainer: CostContainer;
		costId: string;
		costSection: string;
		costType: number;
		costTypeGroupCategory: string;
		costTypeId: string;
		description: string;
		editMode: boolean;
		encompassLineItemId: string;
		feeCategory: FeeCategoryEnum;
		financedAmount: number;
		hudLineNumber: number;
		identityKey: string;
		impounded: boolean;
		includeInTotal: number;
		interestDays: number;
		interestRate: number;
		isAprCost: boolean;
		isLocked: boolean;
		isRemoved: boolean;
		isUserCalculated: boolean;
		itemizedPropertyTaxes: ICollection<IItemizedPropertyTaxViewModel>;
		loanEstimateFeeAmount: number;
		loanId: string;
		loanTransactionType: number;
		monthsToBePaid: number;
		mortgageType: MortgageTypeEnum;
		mustBeUnique: boolean;
		name: string;
		orderNo: number;
		originalHUDLineNumber: number;
		originalMonthsToBePaid: number;
		originalSubHUDLineNumber: string;
		otherPaid: ICostPaidViewModel;
		paidBy: string;
		paidTo: string;
		percent: number;
		periodPaymentMonths: ICollection<IPeriodPaymentMonthViewModel>;
		preferredPaymentPeriod: PeriodTypeEnum;
		provider: string;
		sectionId: number;
		sectionName: string;
		sellerPaid: ICostPaidViewModel;
		serviceProvider: ServiceProviderEnum;
		subHUDLineNumber: string;
		templateId: number;
		templateUrl: string;
		titleCostIncludedType: number;
		titleCostIncludedTypeDescription: string;
		toleranceLevel: number;
		totalRow: string;
		uniqueCostTypeId: string;
		upfrontPreferredPaymentPeriod: UpfrontPreferredPaymentPeriodEnum;
		useLoanEstimateFee: boolean;
		userAdded: boolean;
		vaAllowableType: VaAllowableTypeEnum;
	}

	export class CreditTabViewModel extends BaseViewModel implements srv.ICreditTabViewModel  {
		constructor() {
		super();
	}

	borrower: IBorrowerViewModel;
		borrowerDebtAccountOwnershipTypes: IList<ILookupItem>;
		borrowersForDropDown: IList<ILookupItem>;
		coBorrower: IBorrowerViewModel;
		coBorrowerDebtAccountOwnershipTypes: IList<ILookupItem>;
		coborrowerExists: boolean;
		collectionsViewModel: ICollectionsViewModel;
		creditDataAvailable: boolean;
		creditExceptionsResolved: boolean;
		creditFileStoreItemId: string;
		creditReportMessage: string;
		creditReportMessageVisible: boolean;
		creditReportTimeout: number;
		debtAccountOwnershipTypes: IList<ILookupItem>;
		disableFields: boolean;
		disableReRunCreditButton: boolean;
		enableMoRentalIncome: boolean;
		ficoScoreInformation: IFicoScoreViewModel;
		isLoanHarp: boolean;
		isMultiBorrowerChildLoan: boolean;
		liabilitiesViewModel: ILiabilitiesViewModel;
		loanType: number;
		miscellaneousExpensesViewModel: IMiscellaneousExpensesViewModel;
		primaryBorrowerLoanid: string;
		publicRecordsViewModel: IPublicRecordsViewModel;
		realEstateViewModel: IRealEstateViewModel;
		states: IList<ILookupItem>;
		totalAssetsAmount: number;
		totalOwnershipPercentage: number;
	}

	export class CreditViewModel implements srv.ICreditViewModel  {
		creditDataAvailable: boolean;
		creditExceptionsResolved: boolean;
		creditFileStoreItemId: string;
		creditReportDate: Date;
		creditReportId: string;
		creditReportMessage: string;
		creditReportTimeout: number;
		creditStatus: number;
		totalOwnershipPercentage: number;
	}

	export class CriteriaDictionaryViewModel implements srv.ICriteriaDictionaryViewModel  {
		enumValue: string;
		name: string;
		value: boolean;
	}

	export class CurativeItemConfigurationViewModel implements srv.ICurativeItemConfigurationViewModel  {
		curativeItemConfigurationId: string;
		dateCreated: Date;
		docTypeId: number;
		sourceRoleCdId: number;
		statusCdId: number;
	}

	export class CurativeItemNoteViewModel implements srv.ICurativeItemNoteViewModel  {
		addNoteToFile: boolean;
		content: string;
		curativeItemId: string;
		curativeItemNoteId: string;
		dateCreated: string;
		markAsUnread: boolean;
		userAccountCreatedId: number;
		userAccountCreatedUserName: string;
	}

	export class DebtViewModel extends LiabilityInfoViewModel implements srv.IDebtViewModel  {
		constructor() {
		super();
	}

	accountOwnershipTypeIndicator: string;
		accountOwnershipTypeToolTipText: string;
		includeInDTI: boolean;
		includeInLiabilitiesTotal: boolean;
	}

	export class DeclarationInfoViewModel implements srv.IDeclarationInfoViewModel  {
		additionalInformationCheckboxIndicator: boolean;
		additionalInformationPreviouslyProvided: boolean;
		alimonyChildSupportObligation: number;
		applicationTakenBy: number;
		bankrupcyIndicator: number;
		certificationId: CertificationIdEnum;
		dateExpired: Date;
		dateIssued: Date;
		downPaymentIndicator: number;
		ethnicityId: number;
		identityKey: string;
		infoId: string;
		noteEndorserIndicator: number;
		numberId: string;
		obligatedLoanIndicator: number;
		otherInformation: string;
		outstandingJudgmentsIndicator: number;
		ownershipInterestLastThreeYears: number;
		partyToLawsuitIndicator: number;
		permanentResidentAlienIndicator: number;
		presentlyDelinquentIndicator: number;
		priorPropertyTitleType: number;
		propertyAsPrimaryResidence: number;
		propertyForeclosedIndicator: number;
		race: number;
		sexId: number;
		stateId: US_StateEnum;
		typeOfProperty: number;
		usCitizenIndicator: number;
	}

	export class DeclarationViewModel implements srv.IDeclarationViewModel  {
		loanOriginatorSource: number;
	}

	export class DetailedClosingCost implements srv.IDetailedClosingCost  {
		baseLoanAmount: number;
		lenderCost: IList<ICostViewModel>;
		prepaidCosts: IList<ICostViewModel>;
		prepaidDescriptions: IList<string>;
		reservesAndPrepaids: number;
		reservesCosts: IList<ICostViewModel>;
		reservesDescriptions: IList<string>;
		thirdPartyAndPrepaids: number;
		thirdPartyCosts: IList<ICostViewModel>;
		thirdPartyPrepaidsAndReserves: number;
		totalEstimatedClosingCosts: number;
		totalLenderCosts: number;
		totalLoanAmount: number;
		totalPrepaids: number;
		totalReserves: number;
		totalThirdPartyCosts: number;
		ufmipAddedToLoan: number;
		usdaAddedToLoan: number;
		usdaGFeeAddedToLoan: number;
		vaffAddedToLoan: number;
	}

	export class DetailsOfTransactionCalculatedViewModel implements srv.IDetailsOfTransactionCalculatedViewModel  {
		alternationsImprovementsRepairs: number;
		borrowerClosingCostPaidBySeller: number;
		castFromToBorrower: number;
		discount: number;
		estimatedClosingCosts: number;
		estimatedPrepaidItems: number;
		land: number;
		mLoanAmount: number;
		oLoanAmount: number;
		otherCredits: ICollection<IOtherCreditViewModel>;
		pmI_MIP_FundingFeeFinanced: number;
		pmI_MPI_FundingFee: number;
		purchasePrice: number;
		refinance: number;
		refinanceWithDebts: number;
		subordinateFinancing: number;
		totalCosts: number;
		totalLoanAmount: number;
	}

	export class DetailsOfTransactionViewModel implements srv.IDetailsOfTransactionViewModel  {
		alterationImprovementsRepairs: number;
		borrowerClosingCostPaidBySeller: number;
		cashFromToBorrower: number;
		discount: number;
		estimatedClosingCosts: number;
		estimatedPrepaidItems: number;
		land: number;
		mLoanAmount: number;
		oLoanAmount: number;
		otherCredits: ICollection<IOtherCreditViewModel>;
		pmiMipFundingFee: number;
		pmiMipFundingFeeFinanced: number;
		purchasePrice: number;
		refinance: number;
		refinanceWithDebts: number;
		subordinateFinancing: number;
		totalCosts: number;
		totalLoanAmount: number;
	}

	export class DisclosuresDetailsViewModel implements srv.IDisclosuresDetailsViewModel  {
		active: boolean;
		apr: number;
		closingCostsPaidBeforeClosing: number;
		coc: string;
		costs: ICollection<ICostViewModel>;
		dateTime: Date;
		disclosureDetailsId: string;
		disclosureDocumentId: string;
		identityKey: string;
		loanAmount: number;
		mdia: boolean;
		sentBy: number;
		status: number;
		totalClosingCosts: number;
		totalPayoffs: number;
		totalTenPercentTolerance: number;
		totalZeroPercentTolerance: number;
		trackingNumber: string;
		type: string;
	}

	export class DisclosureStatusDetailsViewModel implements srv.IDisclosureStatusDetailsViewModel  {
		disclosureStatus: DisclosureStatusEnum;
		disclosureStatusReasons: IList<string>;
		disclosureStatusText: string;
	}

	export class DivisionViewModel implements srv.IDivisionViewModel  {
		branches: IList<IBranchViewModel>;
		displayName: string;
		divisionId: number;
		divisionManagerId: number;
		divisionName: string;
		email: string;
		nmlsNumber: string;
		phone: string;
		theme: string;
		vicePresidentName: string;
	}

	export class DocumentCategoryViewModel implements srv.IDocumentCategoryViewModel  {
		categoryId: number;
		commentType: string;
		creditRecord: string;
		description: string;
		display: boolean;
		displayOrder: string;
		documentClassId: number;
		isAppraisalDocument: boolean;
		isUserDefined: boolean;
		name: string;
	}

	export class DocumentClassViewModel implements srv.IDocumentClassViewModel  {
		approvalRequired: boolean;
		documentClassId: number;
		documentGroup: number;
		isRequired: boolean;
		isVisible: boolean;
		name: string;
		upperClass: number;
	}

	export class DocumentMappingViewModel implements srv.IDocumentMappingViewModel  {
		documentCategoryDocVaultTypeMappingId: number;
		documentCategoryId: number;
		documentTypeId: number;
	}

	export class DocumentsViewModel implements srv.IDocumentsViewModel  {
		addressId: string;
		borrowerId: string;
		dateCreated: Date;
		description: string;
		documentCategoryId: number;
		documentId: string;
		documentNotification: string;
		isDeleted: boolean;
		loanId: string;
		name: string;
		received: Date;
		status: number;
		uploadedFiles: IList<IUploadedFileViewModel>;
	}

	export class DocVaultDocumentMetadataModel implements srv.IDocVaultDocumentMetadataModel  {
		key: string;
		value: string;
	}

	export class DocVaultDocumentViewModel implements srv.IDocVaultDocumentViewModel  {
		category: string;
		categoryId: number;
		categorySortName: string;
		classId: string;
		classified: boolean;
		contentType: string;
		deleted: boolean;
		description: string;
		documentCategory: string;
		documentHistory: IList<IDocVaultHistoryModel>;
		documentId: string;
		documentTypeId: string;
		excluded: boolean;
		exportDocumentToEncompassStatus: number;
		hasHistory: boolean;
		lastUpdated: string;
		loanId: string;
		metadata: IList<IDocVaultDocumentMetadataModel>;
		modified: boolean;
		name: string;
		namingConvention: string;
		new: boolean;
		originalCategory: string;
		originalDocumentTypeId: string;
		rejected: boolean;
		rejectReason: string;
		removed: boolean;
		repositoryId: string;
		shouldImport: boolean;
		sortOrder: number;
		status: number;
		submitToEdgeMac: boolean;
		updatedBy: string;
		uploadedBy: number;
		uploadedDate: string;
		uploadedFileId: string;
	}

	export class DocVaultHistoryModel implements srv.IDocVaultHistoryModel  {
		modifiedBy: string;
		modifiedDate: string;
		statusChange: string;
	}

	export class DocVaultViewModel implements srv.IDocVaultViewModel  {
		documentsLoaded: boolean;
		docVaultDocuments: ICollection<IDocVaultDocumentViewModel>;
	}

	export class DoubleEntryCost implements srv.IDoubleEntryCost  {
		costId: string;
		hasNoCounterpart: boolean;
		ledgerLinkId: string;
		lineNumber: number;
		sectionKey: SectionTypeEnum;
		subSectionKey: SubSectionTypeEnum;
	}

	export class EApprovalConfirmationViewModel implements srv.IEApprovalConfirmationViewModel  {
		borrowerId: string;
		confirmationCode: string;
		confirmationCodeConfirmed: boolean;
		eApprovalConfirmationId: string;
		insertedFlag: boolean;
		isModified: boolean;
		statusId: number;
		timeStamp: Date;
	}

	export class EConsentViewModel implements srv.IEConsentViewModel  {
		consentStatus: ConsentStatusEnum;
		statusAt: Date;
	}

	export class EmploymentInfoViewModel extends LoanMember implements srv.IEmploymentInfoViewModel  {
		constructor() {
		super();
	}

	address: IPropertyViewModel;
		borrowerId: string;
		branchOfService: string;
		businessPhone: string;
		employmentEndDate: Date;
		employmentInfoId: string;
		employmentStartDate: Date;
		employmentStatusId: number;
		employmentTypeId: number;
		identityKey: string;
		isAdditional: boolean;
		isMilitary: boolean;
		isPresent: boolean;
		isRemoved: boolean;
		isRetirement: boolean;
		isSelfEmployed: boolean;
		name: string;
		positionDescription: string;
		totalMonthlyAmount: number;
		typeOfBusiness: string;
		yearsInThisProfession: number;
		yearsOnThisJob: number;
	}

	export class EntryLocator implements srv.IEntryLocator  {
	}

	export class EnumerationValueViewModel implements srv.IEnumerationValueViewModel  {
		code: string;
		description: string;
		enumerationClassId: number;
		enumerationValueId: number;
	}

	export class ESignViewModel implements srv.IESignViewModel  {
		signingStatus: SigningStatusEnum;
		statusAt: Date;
	}

	export class FHACalculatorRequest implements srv.IFHACalculatorRequest  {
		allowableBorrowerPaidClosingCosts: number;
		baseLoanAmount: number;
		countyLoanLimit: number;
		fhaScenario: IFHAScenarioViewModel;
		lenderCreditforClosingCostsAndPrepaids: number;
		prepaidExpenses: number;
		userAccountId: number;
	}

	export class FHACalculatorResponse implements srv.IFHACalculatorResponse  {
		existingDebt: number;
		isEligible: boolean;
		ltvLimit: number;
		maxBaseMortgage: number;
		maxUFMIP: number;
		newEstimatedUFMIP: number;
		newUFMIP: number;
		totalLoanAmountUnpaidBalanceMinValue: number;
		totalNewMortgageAmount: number;
	}

	export class FHAInformationViewModel implements srv.IFHAInformationViewModel  {
		isCurrentLoanFHA: boolean;
		isfhaLoan: boolean;
		isFinanceUfmip: boolean;
		isHudOwned: boolean;
	}

	export class FHAScenarioViewModel implements srv.IFHAScenarioViewModel  {
		appraisalValue: number;
		borrowerPaidRepairs: number;
		endorsmentDate: Date;
		fhaCalculatorResults: IFHACalculatorResponse;
		fhaLoanOnSubjectProperty: boolean;
		fhaProductId: FHAProductsEnum;
		inducementOfPurchaseWithExcessContribution: number;
		isPropertyAdjacent: boolean;
		isPurchaseMoneyOrOverAYear: boolean;
		leadPaintPoisoningInfoReceived: boolean;
		loanPurpose: VALoanPurposeEnum;
		minDownPaymentApprovedByHud: number;
		moreThenFourDwellingsOwned: boolean;
		originalMortgageAmount: number;
		originalTotalLoanAmount: number;
		propertyOccupiedFor: number;
		propertyOwnedLessThanOneYear: boolean;
		propertyPurchasedInLast12Months: boolean;
		propertyToBeSold: boolean;
		propertyToBeSoldAddressViewModel: IPropertyViewModel;
		purchasePrice: number;
		purchasePriceWithDocumentedImprovements: number;
		reOwnOrSoldPast60MonthsWithHudFha: boolean;
		salesPrice: number;
		subordinateLiensOver12Months: number;
		unearnedUFMIPRefund: number;
		unpaidPrincipleBalance: number;
	}

	export class FicoScoreViewModel implements srv.IFicoScoreViewModel  {
		decisionScore: number;
		equifax: number;
		experian: number;
		transunion: number;
	}

	export class Field implements srv.IField  {
		name: string;
		value: string;
	}

	export class FilterByLoanNumberResultsViewModel implements srv.IFilterByLoanNumberResultsViewModel  {
		filterResults: IList<IFilterByLoanNumberResultViewModel>;
	}

	export class FilterByLoanNumberResultViewModel implements srv.IFilterByLoanNumberResultViewModel  {
		borrowerId: string;
		borrowerName: string;
		loanApplicationIds: IList<string>;
		loanId: string;
		loanNumber: string;
	}

	export class ForConditionMenuModel implements srv.IForConditionMenuModel  {
		forValue: string;
		id: string;
		isCoborrower: boolean;
		jointId: string;
		section: string;
		sectionName: string;
		sourceDescription: string;
		sourceId: number;
		value: string;
	}

	export class GeneralSettingViewModel implements srv.IGeneralSettingViewModel  {
		enabledByDefault: boolean;
		id: number;
		order: number;
		settingName: string;
		status: boolean;
		value: string;
	}

	export class GetDropdownDictionary extends TransactionSummaryViewModelReSTOpEnvelopeBase implements srv.IGetDropdownDictionary  {
		constructor() {
		super();
	}

	validLedgerEntryNames: ILedgerEntryNames[];
	}

	export class GlobalContactsAddCompanyContactOpEnvelope extends GlobalContactsViewModelReSTOpEnvelopeBase implements srv.IGlobalContactsAddCompanyContactOpEnvelope  {
		constructor() {
		super();
	}

	company: IBasicCompany<string>;
		companyContact: IBasicCompanyContact<string>;
		isPreferred: boolean;
	}

	export class GlobalContactsGetContactsSubListOpEnvelope extends GlobalContactsViewModelReSTOpEnvelopeBase implements srv.IGlobalContactsGetContactsSubListOpEnvelope  {
		constructor() {
		super();
	}

	companyTypeMask: LegalEntityTypeMask;
		partialCompanyName: string;
		viewModel: IGlobalContactsViewModel;
	}

	export class GlobalContactsViewModel implements srv.IGlobalContactsViewModel  {
		dropdownDictionary: ILegalEntityNames[];
		globalContacts: IList<IBasicCompany<string>>;
		stateLookupList: IList<IEnumLookupRecord<US_StateEnum>>;
	}

	export class HousingExpensesViewModel implements srv.IHousingExpensesViewModel  {
		addlMortgagees: number;
		firstMtgPi: number;
		floodInsurance: number;
		hazardInsurance: number;
		hoa: number;
		housingExpensesTotal: number;
		mtgInsurance: number;
		newFirstMtgPi: number;
		newFloodInsurance: number;
		newHazardInsurance: number;
		newHoa: number;
		newHousingExpensesTotal: number;
		newMtgInsurance: number;
		newSecondMtgPi: number;
		newTaxes: number;
		other: string;
		paymentWithMI: number;
		rent: number;
		secondMtgPi: number;
		taxes: number;
		totalMonthlyMortgageObligation: number;
	}

	export class ImpoundDataCalculatedViewModel implements srv.IImpoundDataCalculatedViewModel  {
		floodInsurance: number;
		homeOwnerAssociationDues: number;
		homeOwnersInsurance: number;
		mortgageInsurance: number;
		payment: number;
		propertyTaxes: number;
		proposed: boolean;
		rent: number;
		secondPayment: number;
	}

	export class ImpoundScheduleViewModel implements srv.IImpoundScheduleViewModel  {
		closingMonth: string;
		cushion: number;
		dueDate1: number;
		dueDate2: number;
		dueDate3: number;
		dueDate4: number;
		editable: boolean;
		firstPayment: string;
		hudLine: number;
		impoundsNotOpen: number;
		impoundsOpen: number;
		month: number;
		state: string;
		subHUDLine: string;
		taxMessageNotOpen: string;
		taxMessageOpen: string;
	}

	export class IncomeInfoHistoryViewModel implements srv.IIncomeInfoHistoryViewModel  {
		changes: string;
		historyId: string;
		modifiedBy: string;
		modifiedDate: Date;
	}

	export class IncomeInfoViewModel extends LoanMember implements srv.IIncomeInfoViewModel  {
		constructor() {
		super();
	}

	amount: number;
		borrowerId: string;
		calculatedMonthlyAmount: number;
		canProvideDocumentation: boolean;
		description: string;
		employmentInfoId: string;
		identityKey: string;
		incomeHistory: ICollection<IIncomeInfoHistoryViewModel>;
		incomeInfoId: string;
		incomeType: string;
		incomeTypeDisabled: boolean;
		incomeTypeId: number;
		isRemoved: boolean;
		isSubjectProperty: boolean;
		loanType: string;
		manualChange: boolean;
		originalAmount: number;
		preferredPaymentPeriodId: number;
		propertyId: string;
	}

	export class IncomeTabViewModel extends BaseViewModel implements srv.IIncomeTabViewModel  {
		constructor() {
		super();
	}

	additionalEmploymentTypes: IList<ILookupItem>;
		amountPeriods: IList<ILookupItem>;
		borrower: IBorrowerWithAdditionalInfoViewModel;
		borrowers: IList<ILookupItem>;
		branches: IList<ILookupItem>;
		coBorrower: IBorrowerWithAdditionalInfoViewModel;
		coBorrowerExists: boolean;
		disableFields: boolean;
		employmentStatuses: IList<ILookupItem>;
		employmentTypes: IList<ILookupItem>;
		emptyMilitaryIncomeInfo: IList<IIncomeInfoViewModel>;
		emptyRegularIncomeInfo: IList<IIncomeInfoViewModel>;
		otherIncomeInfo: IList<IIncomeInfoViewModel>;
		rentalIncomeTypes: IList<ILookupItem>;
	}

	export class IneligibleItemViewModel implements srv.IIneligibleItemViewModel  {
		productName: string;
		reasons: IList<string>;
	}

	export class InitEmptyCreditOrDebit extends TransactionSummaryViewModelReSTOpEnvelopeBase implements srv.IInitEmptyCreditOrDebit  {
		constructor() {
		super();
	}

	isDoubleEntry: boolean;
		lineNumber: number;
	}

	export class IntegrationItemViewModel implements srv.IIntegrationItemViewModel  {
		eventName: string;
		logItemId: number;
	}

	export class IntegrationLogFolderViewModel implements srv.IIntegrationLogFolderViewModel  {
		items: ICollection<IIntegrationLogItemViewModel>;
	}

	export class IntegrationLogItemViewModel implements srv.IIntegrationLogItemViewModel  {
		contentXml: string;
		data: string;
		dateCreated: string;
		documents: IDictionary<string, string>;
		eventId: string;
		eventType: string;
		folderName: string;
		id: string;
		name: string;
		requestRepositoryId: string;
		responseRepositoryId: string;
		status: string;
	}

	export class IntegrationsSettingViewModel implements srv.IIntegrationsSettingViewModel  {
		activeConfiguration: number;
		affordabilityQualifyingRateShow: boolean;
		allBorrowersMustAcceptEConsent: boolean;
		allBorrowersMustESign: boolean;
		applicationDateTrigger: number;
		autoDiscloseDay: number;
		autoDiscloseTime: Date;
		automatedUnderwritingSystemName: string;
		borrowerLastName: string;
		client: string;
		comment: string;
		contact: string;
		crmDefaultCampaignMobileApp: string;
		crmDefaultConciergeUserId: number;
		day: number;
		defaultCampaign: string;
		digitalDocsPasswordProduction: string;
		digitalDocsPasswordQA: string;
		digitalDocsRequestSigneablePackages: boolean;
		digitalDocsURIProduction: string;
		digitalDocsURIQA: string;
		digitalDocsUsernameProduction: string;
		digitalDocsUsernameQA: string;
		email: string;
		enableiMPIntegrationForDigitalDocs: boolean;
		enableIntegration: boolean;
		feeProviderEnableIntegration: boolean;
		integrationsSettingsId: number;
		mailRoom: string;
		phone: string;
		pricingComment: string;
		pricingContact: string;
		pricingEmail: string;
		pricingEnableIntegration: boolean;
		pricingPhone: string;
		pricingTimeout: number;
		pricingUrl: string;
		pricingVendorName: string;
		provider: string;
		testModeProductPopup: boolean;
		time: Date;
		url: string;
		vendorName: string;
	}

	export class InvestorExtensionViewModel implements srv.IInvestorExtensionViewModel  {
		day: number;
		exPolicyNthTime: number;
		investorExtensionId: number;
		investorId: number;
		value: number;
	}

	export class InvestorViewModel implements srv.IInvestorViewModel  {
		active: boolean;
		cutOff: Date;
		extensions: IList<IInvestorExtensionViewModel>;
		investorId: number;
		name: string;
		webSiteUrl: string;
	}

	export class ItemizedPropertyTaxViewModel implements srv.IItemizedPropertyTaxViewModel  {
		amount: number;
		costId: string;
		descriptionDisplaValue: string;
		descriptionId: number;
		itemizedPropertyTaxId: string;
		month: number;
	}

	export class LeadModel implements srv.ILeadModel  {
		apiKey: string;
		assignTo: string;
		fields: IList<IField>;
		id: string;
		referenceId: string;
		source: string;
	}

	export class LedgerEntryAttribute implements srv.ILedgerEntryAttribute  {
		acceptsDateRange: boolean;
		acceptsFreeFormText: boolean;
		isDoubleEntry: boolean;
		isSingleOrDoubleEntry: boolean;
		ledgerEntryNameKey: LedgerEntryNameEnum;
		sectionKey: SectionTypeEnum;
		subSectionKey: SubSectionTypeEnum;
	}

	export class LedgerEntryInit implements srv.ILedgerEntryInit  {
		isReadOnly: boolean;
		ledgerEntryName: LedgerEntryNameEnum;
		ledgerEntryType: LedgerEntryTypeEnum;
		lineNumber: number;
		loanInfoRequestKey: LoanInfoRequestEnum;
		mutableLineNumber: boolean;
		mutableName: boolean;
		sectionKey: SectionTypeEnum;
		sectionTwinKey: SectionTypeEnum;
		subSectionKey: SubSectionTypeEnum;
		useLoanInfoRequestKey: boolean;
	}

	export class LedgerEntryNames implements srv.ILedgerEntryNames  {
	}

	export class LegalEntityNames implements srv.ILegalEntityNames  {
	}

	export class LiabilitiesViewModel implements srv.ILiabilitiesViewModel  {
		comments: IList<ILookupItem>;
		liabilities: IList<IDebtViewModel>;
		systemCalculatedMinPaymentVisible: boolean;
		types: IList<ILookupItem>;
	}

	export class LiabilityViewModel extends LoanMember implements srv.ILiabilityViewModel  {
		constructor() {
		super();
	}

	accountNumber: string;
		accountOpenDate: Date;
		accountOwnershipTypeIndicator: string;
		accountOwnershipTypeToolTipText: string;
		amount: number;
		borrowerDebtCommentId: number;
		borrowerId: string;
		calculatedMonthlyAmount: number;
		clientId: number;
		companyData: ICompanyDataViewModel;
		currentratingType: string;
		debtCommentId: number;
		debtsAccountOwnershipType: string;
		debtType: string;
		identityKey: string;
		includeInDTI: boolean;
		includeInLiabilitiesTotal: boolean;
		includeInTotalPayment: boolean;
		isJoint: boolean;
		isJointWithSingleBorrowerID: boolean;
		isLastUserModifiedRecord: boolean;
		isLenderSectionVisible: boolean;
		isPledged: boolean;
		isRemoved: boolean;
		isSecondaryPartyRecord: boolean;
		isUserEntry: boolean;
		liabilitiesAccountOwnershipType: string;
		liabilityDisabled: boolean;
		liabilityInfoId: string;
		liabilityInfoType: string;
		lienPosition: number;
		loanOriginationDate: Date;
		maximumCreditLine: number;
		minPayment: number;
		monthsLeft: number;
		notMyLoan: boolean;
		originalLiabilityInfoId: string;
		originalMinAmount: number;
		originalUnpaidBalance: number;
		payee: string;
		payoffDisplayValue: boolean;
		payoffLender: string;
		pledgedAssetLoanType: number;
		priorAdverseRatings: ICollection<IPriorAdverseRatingViewModel>;
		property: IPropertyViewModel;
		propertyAddressDisplayValue: string;
		propertyId: string;
		reoInfo: IREOInfoViewModel;
		selectedImpound: number;
		systemCalculatedMinPayment: boolean;
		totalPaymentDisplayValue: number;
		typeDisplayValue: string;
		typeId: number;
		unpaidBalance: number;
		userEntryNotSavedInDatabaseYet: boolean;
	}

	export class LicenseViewModel implements srv.ILicenseViewModel  {
		branchId: string;
		expireDate: Date;
		stateId: number;
		userAccountId: number;
	}

	export class Loan implements srv.ILoan  {
		amortizationType: AmortizationTypeEnum;
		dti: number;
		floodInsurance: number;
		fullyIndexedRate: number;
		hasPrepaymentPenalty: boolean;
		haveNegativeAmortization: boolean;
		hazardInsurance: number;
		interestRate: number;
		isBalloon: boolean;
		isqm: boolean;
		lienPosition: number;
		lienTotalPayment: number;
		loanAmount: number;
		monthlyMortgageInsurance: number;
		monthlyPrincipleInterest: number;
		monthlyTaxes: number;
		mortgageType: MortgageTypeEnum;
		noteRate: number;
		paymentTotalObligation: number;
		payoffsTotal: number;
		prepaids: number;
		prepaymentPenaltyAmount: number;
		recoupmentTime: number;
		term: number;
		totalCashout: number;
		totalClosingCosts: number;
		totalClosingCostsWithoutG: number;
		totalPaymentByLiability: number;
		totalReosPayment: number;
		unpaidBalance: number;
	}

	export class LoanApplicationViewModel extends LoanMember implements srv.ILoanApplicationViewModel  {
		constructor() {
		super();
	}

	applicationDate: Date;
		appplicationCompletedDate: Date;
		appraisedValueHistories: ICollection<IAppraisedValueHistoryItemViewModel>;
		chosenDecisionScore: number;
		complianceCheckErrors: IList<IComplianceCheckErrorViewModel>;
		complianceCheckStatus: ComplianceCheckStatusEnum;
		credit: ICreditViewModel;
		creditAuthorizationDate: Date;
		declarations: IDeclarationViewModel;
		disclosureStatusDetails: IDisclosureStatusDetailsViewModel;
		docDelivery: number;
		documents: ICollection<IDocumentsViewModel>;
		encompassBorrowerPairId: string;
		eSign: IESignViewModel;
		howDidYouHearAboutUs: string;
		identityKey: string;
		isCompleted: boolean;
		isCreditRunning: boolean;
		isPrimary: boolean;
		isRunCreditAuthorized: boolean;
		isSpouseOnTheLoan: boolean;
		isSpouseOnTheTitle: boolean;
		loanApplicationId: string;
		occupancyType: PropertyUsageTypeEnum;
		openDate: Date;
		ownershipPercentage: number;
		payment: IPaymentViewModel;
		realEstate: IRealEstateViewModel;
		remainingOwnershipPercentage: number;
		snoozeOrder: number;
		switchCoBorrowerToBorrower: boolean;
		titleInfo: ITitleInformationViewModel;
	}

	export class LoanControlStatus implements srv.ILoanControlStatus  {
		controlId: number;
		isAcquired: boolean;
		lockAcquiredAt: Date;
		lockOwnerId: number;
		lockOwnerUserName: string;
	}

	export class LoanDateHistoryViewModel implements srv.ILoanDateHistoryViewModel  {
		dateHistoryId: string;
		dateOfChange: Date;
		dateValue: Date;
		isActive: boolean;
		userName: string;
	}

	export class LoanDateViewModel implements srv.ILoanDateViewModel  {
		currentDate: Date;
		dateHistory: IList<ILoanDateHistoryViewModel>;
		dateType: number;
		dateValue: Date;
		originalDate: Date;
		title: string;
	}

	export class LoanDecisionStatusHistoryViewModel implements srv.ILoanDecisionStatusHistoryViewModel  {
		date: string;
		status: string;
		updatedBy: string;
	}

	export class LoanEstimatesViewModel implements srv.ILoanEstimatesViewModel  {
		closingCostsPaidBeforeClosing: number;
		loanAmount: number;
		totalClosingCosts: number;
		totalPayoffsAndPayments: number;
	}

	export class LoanExternalReferenceViewModel implements srv.ILoanExternalReferenceViewModel  {
		dateUpdated: Date;
		expirationDate: Date;
		name: string;
		userAccountID: number;
		value: string;
	}

	export class LoanFinancialInfoViewModel implements srv.ILoanFinancialInfoViewModel  {
		adjustedInterestRate: number;
		adjustedPoints: number;
		adjustmentPeriod: number;
		amortizationType: number;
		apr: number;
		baseInterestRate: number;
		brokerCompensationFlatAmount: number;
		brokerCompensationMaxAmount: number;
		brokerCompensationMinAmount: number;
		brokerCompensationPercent: number;
		cashOut: string;
		cashOutAmount: number;
		conforming: boolean;
		costIncludedInLoanAmount: number;
		discountPoints: number;
		downPaymentTypeCode: number;
		dti: number;
		dtiDu: number;
		dtiFha: number;
		dtiLp: number;
		ficoScore: number;
		finalDisbursementDate: Date;
		firstPaymentAdjustmentMonths: number;
		fixedRateTerm: number;
		floodFee: number;
		floorRate: number;
		housingRatioDu: number;
		housingRatioFha: number;
		housingRatioLp: number;
		indexType: string;
		indexValue: number;
		initialAdjustedPoints: number;
		initialApr: number;
		initialPrice: number;
		isBaloonPayment: boolean;
		isNoCost: boolean;
		liquidAssetReserves: number;
		margin: number;
		mip: number;
		monthlyPayment: number;
		monthlySaving: number;
		mortgageAmount: number;
		mortgageInsuranceType: number;
		mortgageType: number;
		noteRate: number;
		qualifyingDtiDu: number;
		qualifyingDtiFha: number;
		qualifyingDtiLp: number;
		qualifyingRate: number;
		rateAdjustmentFirstChangeCapRate: number;
		rateAdjustmentLifetimeCapPercent: number;
		rateAdjustmentSubsequentCapPercent: number;
		ratesAsOf: string;
		rateTable: string;
		refinanceOriginalCost: number;
		term: number;
		totalCost: number;
		totalPriceAdjustment: number;
		variance: number;
	}

	export class LoanLienPositionViewModel implements srv.ILoanLienPositionViewModel  {
		checked: boolean;
		identityKey: number;
		lienPosition: number;
		loanId: string;
		loanLienPositionId: number;
	}

	export class LoanLockHistoryDataViewModel implements srv.ILoanLockHistoryDataViewModel  {
		expiresOn: Date;
		lockedOn: Date;
		modifiedBy: string;
		period: number;
	}

	export class LoanLockHistoryViewModel implements srv.ILoanLockHistoryViewModel  {
		loanLockHistoryList: IList<ILoanLockHistoryDataViewModel>;
	}

	export class LoanLockViewModel implements srv.ILoanLockViewModel  {
		armAdjustmentPeriod: number;
		enterpriceRate: number;
		extendedDays: number;
		finalLoanOfficerRate: number;
		finalPurchaseRate: number;
		id: string;
		investorPurchaseRate: number;
		investorRate: number;
		loanId: string;
		loanOfficerRate: number;
		lockCancelledDate: Date;
		lockDeniedDate: Date;
		newMonthlyPayment: number;
		productSearchDate: Date;
		reasonGiven: number;
		roundingIncrement: number;
		roundingValue: number;
		totalLoanAmount: number;
	}

	export class LoanOfficerAbridgedViewModel implements srv.ILoanOfficerAbridgedViewModel  {
		branchId: string;
		email: string;
		first: string;
		id: string;
		last: string;
		nmls: string;
		phone: string;
		picture: number[];
		title: string;
		webPage: string;
	}

	export class LoanOfficersAbridgedViewModel implements srv.ILoanOfficersAbridgedViewModel  {
		loanOfficersAbridgedList: IList<ILoanOfficerAbridgedViewModel>;
	}

	export class LoanParticipantsViewModel implements srv.ILoanParticipantsViewModel  {
		dropdownDictionary: ILegalEntityNames[];
		loanId: string;
		loanParticipants: IList<IBasicCompanyContact<string>>;
		stateLookupList: IList<IEnumLookupRecord<US_StateEnum>>;
	}

	export class LoanViewModel implements srv.ILoanViewModel  {
		adverseReason: IAdverseReasonViewModel;
		antiSteeringOptions: IAntiSteeringOptionsViewModel;
		applicationDate: Date;
		appraisal: IAppraisalViewModel;
		appraisalContingencyDate: ILoanDateViewModel;
		approvalContingencyDate: ILoanDateViewModel;
		aus: IAusViewModel;
		bonaFidePersonalReasonId: number;
		branchId: string;
		buyersAgentContact: IAgentContactViewModel;
		callCenterId: number;
		channelId: number;
		closingCost: IClosingCostViewModel;
		closingDate: ILoanDateViewModel;
		companyId: string;
		conciergeFullName: string;
		conciergeId: number;
		controlStatus: ILoanControlStatus;
		costs: ICollection<ICalculatorCostViewModel>;
		createDocumentsBorrowerNeeds: boolean;
		currentMilestone: number;
		detailsOfTransaction: IDetailsOfTransactionViewModel;
		divisionId: number;
		documents: IDocVaultViewModel;
		enableDigitalDocsCall: boolean;
		fhaScenarioViewModel: IFHAScenarioViewModel;
		financialInfo: ILoanFinancialInfoViewModel;
		firstPaymentDate: Date;
		genRefLiabilityInfoViewModel: ILiabilityInfoViewModel;
		govermentEligibility: GovermentEligibilityEnum;
		hearAboutUs: string;
		homeBuyingType: number;
		housingExpenses: IHousingExpensesViewModel;
		investor: IInvestorViewModel;
		isImportToFNMInProgress: boolean;
		isMilestoneStatusManual: boolean;
		isOwnerOccupied: boolean;
		isWholeSale: boolean;
		lastRepriced: number;
		leadManagerId: string;
		leadSource: string;
		leadStatus: number;
		loaFullName: string;
		loaId: number;
		loanAmount: number;
		loanExternalReferences: ICollection<ILoanExternalReferenceViewModel>;
		loanId: string;
		loanIsHarp: boolean;
		loanLienPositions: ICollection<ILoanLienPositionViewModel>;
		loanLock: ILoanLockViewModel;
		loanNumber: string;
		loanParticipants: ILoanParticipantsViewModel;
		loanPurposeType: number;
		lockHistory: IList<ILoanLockHistoryDataViewModel>;
		lockingInformation: ILockingInformationViewModel;
		lookup: ILookupViewModel;
		losFolderId: number;
		mannerTitleHeld: string;
		maxNumberOfLoanApplications: number;
		negativeAmortization: boolean;
		ntbBenefitActivations: IList<INtbActivationViewModel>;
		ntbRequired: boolean;
		originalMilestoneStatus: number;
		otherInterviewData: IOtherInterviewDataViewModel;
		prePaymentAmount: number;
		prePaymentPenalty: boolean;
		pricingAdjustments: IPricingAdjustmentsViewModel;
		pricingRequired: boolean;
		pricingResults: IPricingResultsViewModel;
		product: IProductViewModel;
		properties: IList<IPropertyViewModel>;
		qualifyingRate: number;
		salesManagerId: number;
		selectedAppIndex: number;
		sellersAgentContact: IAgentContactViewModel;
		sellersContact: IAgentContactViewModel;
		sentPreApprovalLetterHistories: ICollection<ISentPreApprovalLetterHistoryViewModel>;
		smartGFEEnabled: boolean;
		status: number;
		stipsAndConditions: IConditionsMainViewModel;
		subordinateFinancingDetails: ISubordinateFinancingDetailsViewModel;
		teamLeaderId: number;
		titleInName: string;
		titleInNameValue: string;
		totalAggregateAdjustment: number;
		transactionInfo: ITransactionInfo;
		transactionSummary: ITransactionSummaryViewModel;
		vaInformation: IVAInformationViewModel;
	}

	export class LockingConfigurationViewModel implements srv.ILockingConfigurationViewModel  {
		active: boolean;
		description: string;
		explanation: string;
		lockingConfigurationId: number;
		lockingConfigurationKey: number;
		type: number;
		value: string;
	}

	export class LockingInformationViewModel implements srv.ILockingInformationViewModel  {
		isLocked: boolean;
		isLockExpired: boolean;
		lockExpirationDate: Date;
		lockExpirationNumber: string;
		lockExpirationText: string;
		lockFullfilled: Date;
		lockPeriod: number;
		lockRequested: Date;
		lockStatus: number;
	}

	export class LockingPricingLookupViewModel implements srv.ILockingPricingLookupViewModel  {
		investorAdjustmentTypes: IList<IAdjustmentTypesViewModel>;
		investorPurchaseAdjustmentTypes: IList<IAdjustmentTypesViewModel>;
		investors: IList<ILookupItem>;
		loAdjustmentTypes: IList<IAdjustmentTypesViewModel>;
		servicingTypes: IList<ILookupItem>;
	}

	export class LookupViewModel implements srv.ILookupViewModel  {
		accountTypes: IList<ILookupItem>;
		additionalEmploymentTypes: IList<ILookupItem>;
		adverseReasons: IList<ILookupItem>;
		allStates: IList<ILookupItem>;
		amortizationTypes: IList<ILookupItem>;
		amountPeriods: IList<ILookupItem>;
		armIdentifiers: ICollection<ILookupItem>;
		armIndexType: IList<ILookupItem>;
		armTerms: IList<ILookupItem>;
		assetTypes: IList<ILookupItem>;
		ausTypes: IList<ILookupItem>;
		bankStatementsIncomeTypes: IList<ILookupItem>;
		basePurchaseAdjustmentTypes: IList<ILookupItem>;
		bonaFidePersonalReason: IList<ILookupItem>;
		borrowerDebtAccountOwnershipTypes: IList<ILookupItem>;
		borrowers: IList<ILookupItem>;
		branches: IList<ILookupItem>;
		branchOfService: IList<ILookupItem>;
		calculationOptions: IList<ILookupItem>;
		cashoutDropdownOptions: IList<ILookupItem>;
		certificationIds: IList<ILookupItem>;
		coBorrowerDebtAccountOwnershipTypes: IList<ILookupItem>;
		collectionComments: IList<ILookupItem>;
		comments: IList<ILookupItem>;
		complianceCheckErrors: IList<ILookupItem>;
		concurentSecondMortgage: IList<ILookupItem>;
		contextualTypes: IList<ILookupItem>;
		costAmountMethodsMI: IList<ILookupItem>;
		costAmountMethodsPurchaseHoi: IList<ILookupItem>;
		costAmountMethodsPurchaseTax: IList<ILookupItem>;
		costAmountMethodsRefiTax: IList<ILookupItem>;
		creditLienCommentsRed: IList<ILookupItem>;
		debtAccountOwnershipTypes: IList<ILookupItem>;
		debtComments: IList<ILookupItem>;
		documentStatus: IList<ILookupItem>;
		downPaymentSourcesTypes: IList<ILookupItem>;
		downPaymentTypes: IList<ILookupItem>;
		employmentStatuses: IList<ILookupItem>;
		employmentTypes: IList<ILookupItem>;
		ethnicities: ICollection<ILookupItem>;
		fhaProducts: IList<ILookupItem>;
		ficoScore: IList<ILookupItem>;
		hedgeLoanType: IList<ILookupItem>;
		homeBuyingTypesList: IList<ILookupItem>;
		howDidYouHearAboutUsList: IList<ILookupItem>;
		impoundList: IList<ILookupItem>;
		impoundListGrid: IList<ILookupItem>;
		incomeTypesMilitary: IList<ILookupItem>;
		incomeTypesNetRental: IList<ILookupItem>;
		incomeTypesOther: IList<ILookupItem>;
		incomeTypesRegular: IList<ILookupItem>;
		interestOnlyTypes: IList<ILookupItem>;
		investorAdjustmentTypes: IList<ILookupItem>;
		leadStatuses: IList<ILookupItem>;
		lenderCreditsTypes: IList<ILookupItem>;
		lenderPaidBy: IList<ILookupItem>;
		liabilityComments: IList<ILookupItem>;
		liabilityDebtComments: IList<ILookupItem>;
		liabilityTypes: IList<ILookupItem>;
		lienPosition: IList<ILookupItem>;
		lienPositions: IList<ILookupItem>;
		lifeofLoanSavings: IList<ILookupItem>;
		loAdjustmentTypes: IList<ILookupItem>;
		loanLockRoundingType: IList<ILookupItem>;
		loanPurposes: IList<ILookupItem>;
		loanTerms: IList<ILookupItem>;
		loanTransactionTypes: IList<ILookupItem>;
		loanTypes: IList<ILookupItem>;
		lockingAdjustmentType: IList<ILookupItem>;
		lockingConfigurationType: IList<ILookupItem>;
		lockStatus: IList<ILookupItem>;
		lockType: IList<ILookupItem>;
		loPricePaidBy: IList<ILookupItem>;
		mannerOfPaymentRatings: IList<ILookupItem>;
		mannerTitleHeldTypes: IList<ILookupItem>;
		maritalStatuses: IList<ILookupItem>;
		milestonestatuses: IList<ILookupItem>;
		militaryBranch: IList<ILookupItem>;
		militaryService: IList<ILookupItem>;
		militaryServiceStatus: IList<ILookupItem>;
		miscellaneousDebtTypes: IList<ILookupItem>;
		mortgageInsuranceTermination: IList<ILookupItem>;
		mortgageInsuranceTypes: IList<ILookupItem>;
		mortgageType: IList<ILookupItem>;
		myListDropdownOptions: IList<ILookupItem>;
		nonSubjectPropertyTypes: IList<ILookupItem>;
		ntbBenefit: IList<ILookupItem>;
		numberOfUnits: IList<ILookupItem>;
		occupancyTypeList: IList<ILookupItem>;
		occupancyTypeListGrid: IList<ILookupItem>;
		occupancyTypeListShort: IList<ILookupItem>;
		offeringIdentifiers: ICollection<ILookupItem>;
		ownershipTypesList: IList<ILookupItem>;
		paidBy: IList<ILookupItem>;
		paymentPeriodOptions: IList<ILookupItem>;
		periodPaymentMonths: IList<ILookupItem>;
		phoneNumberTypes: IList<ILookupItem>;
		pledgedAssetsLoanTypes: IList<ILookupItem>;
		pledgetAssetComments: IList<ILookupItem>;
		priorPropertyTitle: IList<ILookupItem>;
		propertyExpensesPayPeriods: IList<ILookupItem>;
		propertyRights: IList<ILookupItem>;
		propertyTaxPayPeriods: IList<ILookupItem>;
		publicRecordComments: IList<ILookupItem>;
		publicRecordTypes: ICollection<ILookupItem>;
		races: IList<ILookupItem>;
		realEstateComments: IList<ILookupItem>;
		rentalIncomeTypes: IList<ILookupItem>;
		secondMortgageInsurancePayOffTypes: IList<ILookupItem>;
		secondMortgageInsuranceTypes: IList<ILookupItem>;
		securityQuestions: IList<ILookupItem>;
		sellerTypesList: IList<ILookupItem>;
		sendingMethods: IList<ILookupItem>;
		serviceProviderTypes: IList<ILookupItem>;
		servicingTransferStatusType: IList<ILookupItem>;
		servicingType: IList<ILookupItem>;
		sexTypes: IList<ILookupItem>;
		states: IList<ILookupItem>;
		statesForCurrentUser: IList<ILookupItem>;
		statesForSkyline: IList<ILookupItem>;
		subjectPropertyTypes: IList<ILookupItem>;
		timeToCloseOptions: IList<ILookupItem>;
		titleCostIncludedTypeList: IList<ILookupItem>;
		titleHeldInTypes: IList<ILookupItem>;
		titleVestedAs: IList<ILookupItem>;
		tpoAdminFeeTypes: IList<ILookupItem>;
		tpoCompensationTypes: IList<ILookupItem>;
		tpoEstimatedThirdPartyCosts: IList<ILookupItem>;
		typeOfProperty: IList<ILookupItem>;
		upfrontPreferredPaymentPeriod: IList<ILookupItem>;
		vaCalculators: IList<ILookupItem>;
		vaLoanPurposes: IList<ILookupItem>;
		vaRegions: IList<ILookupItem>;
		whenWasSecondOpenedTypes: IList<ILookupItem>;
		withdrawnFromHELOCInPastTypes: IList<ILookupItem>;
		yesNo: IList<ILookupItem>;
	}

	export class LosFolderViewModel implements srv.ILosFolderViewModel  {
		cascadePriority: number;
		folderName: string;
		isActive: boolean;
		isDefault: boolean;
		losFolderId: number;
	}

	export class ManageUserAccountsViewModel implements srv.IManageUserAccountsViewModel  {
		manageUserAccountsList: IList<IManageUserAccountViewModel>;
	}

	export class ManageUserAccountViewModel implements srv.IManageUserAccountViewModel  {
		borrowerFirstName: string;
		borrowerLastName: string;
		coBorrowerFirstName: string;
		coBorrowerLastName: string;
		loanApplicationId: string;
		recentSubjectPropertyAddress: IPropertyViewModel;
		saveAccount: boolean;
		sendActivationEmail: boolean;
		sendVerificationEmail: boolean;
		userAccount: IUserAccountViewModel;
	}

	export class MICalculatorRequest implements srv.IMICalculatorRequest  {
		amortizationType: number;
		amountMethod: number;
		currentEstimatedValue: number;
		fico: number;
		fixedRateTerm: number;
		loanAmount: number;
		loanPurposeType: number;
		ltvBoundary: number;
		mortgageInsuranceType: number;
		mortgageType: number;
		occupancyType: number;
		percent: number;
		purchasePrice: number;
		rate: number;
		refinancePurposeType: number;
		state: string;
		term: number;
		totalLoanAmount: number;
		upfrontPreferredPaymentPeriod: number;
	}

	export class MICalculatorResponse implements srv.IMICalculatorResponse  {
		amount: number;
		percent: number;
	}

	export class MiscellaneousDebtViewModel implements srv.IMiscellaneousDebtViewModel  {
		amount: number;
		borrowerId: string;
		clientId: number;
		identityKey: string;
		isRemoved: boolean;
		isUserEntry: boolean;
		miscellaneousDebtId: string;
		monthsLeft: number;
		payee: string;
		typeDisplayValue: string;
		typeId: number;
	}

	export class MiscellaneousExpensesViewModel implements srv.IMiscellaneousExpensesViewModel  {
		miscellaneousDebts: IList<IMiscellaneousDebtViewModel>;
		miscellaneousDebtTypes: IList<ILookupItem>;
	}

	export class NegativeCashFlowInfoViewModel implements srv.INegativeCashFlowInfoViewModel  {
		borrowerId: string;
		loanId: string;
		manualChange: boolean;
		negativeCashFlowAmount: number;
		negativeCashFlowInfoId: string;
		preferredPaymentPeriod: number;
		propertyId: string;
	}

	export class NtbActivationViewModel implements srv.INtbActivationViewModel  {
		active: boolean;
		explanation: string;
		isManual: boolean;
		loanId: string;
		ntbBenefitEnumId: number;
	}

	export class NtbBenefitActivation implements srv.INtbBenefitActivation  {
		active: boolean;
		ntbBenefit: NtbBenefitEnum;
	}

	export class NtbBenefitActivationRequest implements srv.INtbBenefitActivationRequest  {
		debtTotalMonthlyPayments: number;
		existingLoans: IList<ILoan>;
		geoStateUS: US_StateEnum;
		proposedLoan: ILoan;
	}

	export class NtbBenefitActivationResponse implements srv.INtbBenefitActivationResponse  {
		ntbBenefitActivations: IList<INtbBenefitActivation>;
	}

	export class NtbBenefitConfigurationViewModel implements srv.INtbBenefitConfigurationViewModel  {
		description: string;
		hasExplanation: boolean;
		isCostRelated: boolean;
		isDisabled: boolean;
		ntbBenefitConfigurationId: string;
		ntbBenefitEnumId: number;
		order: number;
		state: string;
	}

	export class NtbRequiredRequest implements srv.INtbRequiredRequest  {
		accountOpenDate: Date;
		closingDate: Date;
		geoStateUS: US_StateEnum;
		loanAmount: number;
		loanPurposeType: LoanPurposeTypeEnum;
		propertyUsageType: PropertyUsageTypeEnum;
	}

	export class NtbRequiredResponse implements srv.INtbRequiredResponse  {
		ntbRequired: boolean;
	}

	export class OtherCreditViewModel implements srv.IOtherCreditViewModel  {
		amount: number;
		description: string;
		manual: boolean;
		otherCreditType: string;
	}

	export class OtherInterviewDataViewModel implements srv.IOtherInterviewDataViewModel  {
		borrowerIncome: number;
		brokerCompAmount: number;
		brokerCompPercent: number;
		coBorrowerIncome: number;
		disclaimerETPCValue: number;
		enableTPO: boolean;
		existingSecondMortgage: string;
		fhaInformation: IFHAInformationViewModel;
		firstMortgage: number;
		firstPayment: number;
		firstTimeHomebuyer: boolean;
		interviewId: string;
		lockDays: number;
		maximumCreditLine: number;
		monthlyDebt: number;
		outstandingBalance: number;
		overThousandWithdrawnFromHeloc: string;
		percentETPCValue: number;
		searchCriteria: ISearchCriteriaViewModel;
		secondMortgageRefinanceComment: string;
		secondPayment: number;
		selectedBorrowerIncomeType: string;
		selectedBuyoutOption: string;
		selectedCoBorrowerIncomeType: string;
		selectedCompensationOption: string;
		selectedDecisionScoreRange: string;
		selectedDTIOption: string;
		selectedETPCOption: string;
		selectedImpoundsOption: string;
		totalDebt: number;
		usdaInformation: IUSDAInformationViewModel;
		whenWasSecondOpened: string;
	}

	export class PaymentBreakdownModalViewModel implements srv.IPaymentBreakdownModalViewModel  {
		apr: number;
		hoa: number;
		insuranceMonthlyAmount: number;
		insuranceMonthlyAmountPercent: number;
		isMI: boolean;
		mip: number;
		mipPercent: number;
		principalAndInterest: number;
		taxesMonthlyAmount: number;
		taxesMonthlyAmountPercent: number;
		totalMonthlyPayment: number;
	}

	export class PaymentViewModel implements srv.IPaymentViewModel  {
		billingAddress: IAddressViewModel_OBSOLETE;
		ccvNumber: string;
		creditCardExpirationMonth: string;
		creditCardExpirationYear: string;
		creditCardNumber: string;
		creditCardType: string;
		nameOnCreditCard: string;
	}

	export class PayOffItemViewModel implements srv.IPayOffItemViewModel  {
		balance: number;
		canEdit: boolean;
		comment: ILookupItem;
		creditor: string;
		hidden: boolean;
		id: string;
		identityKey: string;
		isLiability: boolean;
		isPayoffItem: boolean;
		isPublicRecord: boolean;
		isRemoved: boolean;
		isUserAdded: boolean;
		type: number;
	}

	export class PayOffSectionViewModel implements srv.IPayOffSectionViewModel  {
		payOffItems: IList<IPayOffItemViewModel>;
	}

	export class PeriodPaymentMonthViewModel implements srv.IPeriodPaymentMonthViewModel  {
		costId: string;
		isRemoved: boolean;
		month: number;
		order: number;
		periodPaymentMonthId: string;
	}

	export class PhoneViewModel implements srv.IPhoneViewModel  {
		isPrefrred: boolean;
		number: string;
		type: string;
	}

	export class PledgedAssetViewModel extends LiabilityInfoViewModel implements srv.IPledgedAssetViewModel  {
		constructor() {
		super();
	}

	amountAlreadyAdded: boolean;
		borrowerCommentId: number;
		disablePrimaryResidence: boolean;
		disableTaxesAndInsurance: boolean;
		estimatedValueDisplayValue: string;
		includeInTotalPayment: boolean;
		isDownPayment: boolean;
		isLastUserModifiedRecord: boolean;
		isLenderSectionVisible: boolean;
		lienPosition: number;
		lienPositionDisplayValue: string;
		monthlyAmount: number;
		notMyLoan: boolean;
		payoffDisplayValue: boolean;
		pledgedAssetLoanType: number;
		property: IPropertyViewModel;
		propertyAddressDisplayValue: string;
		selectedImpound: number;
		totalPaymentDisplayValue: string;
	}

	export class PreApprovalLettersViewModel implements srv.IPreApprovalLettersViewModel  {
		borrowersForDistribution: string;
		borrowerUrl: string;
		brandDisplayName: string;
		brandThemeName: string;
		date: string;
		disclosed: string;
		distributeToBorrower: boolean;
		distributeToBuyersAgent: boolean;
		distributeToSellersAgent: boolean;
		downPayment: number;
		email: string;
		expirationDate: string;
		expirationPeriodInSeconds: number;
		fileStoreItemId: string;
		firstName: string;
		lastName: string;
		letterLoanAmount: number;
		letterPurchasePrice: number;
		letterTemplateId: number;
		loanId: string;
		preApprovalLetterHistoryId: string;
		propertyId: string;
		selectedBorrowersForDistribution: IList<string>;
		status: number;
		userAccountId: number;
	}

	export class PreApprovalLetterTemplateViewModel implements srv.IPreApprovalLetterTemplateViewModel  {
		active: boolean;
		id: number;
		templateName: string;
		templateValue: string;
	}

	export class PricingAdjustmentsViewModel implements srv.IPricingAdjustmentsViewModel  {
		adjustments: IList<IAdjustmentsViewModel>;
		enterprisePrice: number;
		finalLoanOfficerPrice: number;
		finalLoanOfficerPriceByCompany: number;
		finalLoanOfficerPriceByDivision: number;
		finalLoanOfficerPriceByLo: number;
		finalPurchasePrice: number;
		investorPrice: number;
		investorPurchasePrice: number;
		loanOfficerPrice: number;
		sellSideInformation: ISellSideInformationViewModel;
	}

	export class PricingResultsViewModel implements srv.IPricingResultsViewModel  {
		productListViewModel: IProductListViewModel;
	}

	export class PriorAdverseRatingViewModel implements srv.IPriorAdverseRatingViewModel  {
		code: string;
		date: Date;
		liabilityInfoId: string;
		mannerOfPaymentRating: MannerOfPaymentRatingEnum;
		priorAdverseRatingId: string;
	}

	export class ProductAdjustmentViewModel implements srv.IProductAdjustmentViewModel  {
		adjustmentType: string;
		reason: string;
		typeDescription: string;
		value: string;
	}

	export class ProductItemViewModel implements srv.IProductItemViewModel  {
		adjustedPoints: number;
		adjustmentPeriod: number;
		adjustments: IList<IProductAdjustmentViewModel>;
		adjustmentSum: string;
		amortizationType: number;
		baseLoanAmount: number;
		breakEven: number;
		cashToFrom: number;
		closeDate: Date;
		closingCosts: number;
		compare: boolean;
		costDetails: IDetailedClosingCost;
		days: number;
		effectiveRate: number;
		fifteenYrSavings: number;
		firstPaymentAdjustmentMonths: number;
		fiveYrSavings: number;
		floorRate: number;
		indexType: string;
		indexValue: number;
		investorName: string;
		investorPointsAdjustment: number;
		isExpired: boolean;
		lifeOfLoanSavings: number;
		loanAmortizationFixedTerm: number;
		loanAmortizationTerm: number;
		loanOptionType: number;
		loanPurpose: number;
		margin: number;
		minLenderCompCredit: number;
		monthlySavings: number;
		mortgageInsuranceType: number;
		mortgageType: number;
		notes: IList<string>;
		originalPricingQuery: string;
		paymentBreakdownModalVM: IPaymentBreakdownModalViewModel;
		paymentFrequency: number;
		priceAmount: number;
		pricePercentage: number;
		pricePoints: number;
		principalAndInterest: number;
		productId: string;
		productIdentifier: string;
		productIndex: number;
		productName: string;
		productType: string;
		rate: number;
		rateAdjustmentFirstChangeCapRate: number;
		rateAdjustmentLifetimeCapPercent: number;
		rateAdjustmentSubsequentCapPercent: number;
		recoupTime: number;
		register: boolean;
		sevenYrSavings: number;
		tenYrSavings: number;
		threeYrSavings: number;
		totalLoanAmount: number;
		twentyFiveYrSavings: number;
	}

	export class ProductListViewModel implements srv.IProductListViewModel  {
		allProducts: IList<IProductItemViewModel>;
		closingCorpIntegrationLogItems: IList<IIntegrationItemViewModel>;
		eligibleProducts: IList<IProductItemViewModel>;
		feeProvider: number;
		ineligibleProducts: IList<IIneligibleItemViewModel>;
		originalPricingQuery: string;
		pricingIntegrationLogItems: IList<IIntegrationItemViewModel>;
		rateTable: string;
	}

	export class ProductViewModel implements srv.IProductViewModel  {
		armIdentifier: string;
		conforming: boolean;
		hedgeFlag: boolean;
		investorName: string;
		loanAusTypes: ICollection<string>;
		name: string;
		offeringIdentifier: string;
		programName: string;
		ruCode: string;
	}

	export class PropertyExpenseViewModel implements srv.IPropertyExpenseViewModel  {
		impounded: boolean;
		monthlyAmount: number;
		preferredPayPeriod: string;
		type: string;
	}

	export class PropertyViewModel extends LoanMember implements srv.IPropertyViewModel  {
		constructor() {
		super();
	}

	addressTypeId: number;
		appraisedValue: number;
		borrowerId: string;
		buyingStage: string;
		cityName: string;
		cltv: string;
		counties: IList<ILookupItem>;
		countyName: string;
		cpmProjectID: string;
		currentEstimatedValue: number;
		currentMortgageBalance: number;
		downPayment: number;
		downPaymentSource: number;
		downPaymentType: number;
		doYouPayMortgageInsurance: boolean;
		firstMortgageAmount: number;
		firstMortgageHolder: string;
		formNumber: string;
		fullLegal: string;
		grossRentalIncome: number;
		hasAppraisedValueHistory: boolean;
		hcltv: string;
		identityKey: string;
		includeTaxes: boolean;
		isChildProperty: boolean;
		isLicensedStates: boolean;
		isRemoved: boolean;
		isSameAsPrimaryBorrowerCurrentAddress: boolean;
		isSameAsPropertyAddress: boolean;
		isSameMailingAsBorrowerCurrentAddress: boolean;
		isSubjectProperty: boolean;
		loanApplicationId: string;
		loanId: string;
		ltv: string;
		monthlyRent: number;
		negativeCashFlowAmount: number;
		numberOfStories: number;
		numberOfUnits: number;
		occupancyType: PropertyUsageTypeEnum;
		ownership: OwnershipStatusTypeEnum;
		ownershipPercentage: number;
		projectId: string;
		projectName: string;
		projectType: string;
		propertyExpenses: ICollection<IPropertyExpenseViewModel>;
		propertyFormType: string;
		propertyId: string;
		propertyReview: string;
		propertyRights: string;
		propertyType: string;
		purchaseDate: Date;
		purchasePrice: number;
		secondMortgageAmount: number;
		shortLegal: string;
		stateId: number;
		stateName: string;
		streetName: string;
		timeAtAddressMonths: number;
		timeAtAddressYears: number;
		totalAmount: number;
		unitNumber: string;
		vacancyPercentage: number;
		yearAcquired: number;
		yearBuilt: number;
		zipCode: string;
	}

	export class PublicRecordsViewModel implements srv.IPublicRecordsViewModel  {
		comments: IList<ILookupItem>;
		liabilityTypes: IList<ILookupItem>;
		publicRecords: IList<IPublicRecordViewModel>;
		visible: boolean;
	}

	export class PublicRecordViewModel implements srv.IPublicRecordViewModel  {
		amount: number;
		attorneyName: string;
		borrowerId: string;
		borrowerName: string;
		companyData: ICompanyDataViewModel;
		courtName: string;
		dateFiled: Date;
		debtAccountOwnershipType: string;
		docketCase: string;
		identityKey: string;
		includeInTotal: boolean;
		isUserEntry: boolean;
		originalAmount: number;
		payoffLender: string;
		plaintiffName: string;
		publicRecordComment: string;
		publicRecordId: string;
		releasedDate: Date;
		reportedDate: Date;
		type: string;
	}

	export class QMCertificationViewModel implements srv.IQMCertificationViewModel  {
		monthlyDecrease: number;
		mortPaymentHistory6MonthsClear: boolean;
		recoupmentPeriodLessThan36Months: boolean;
		recoupmentPeriodMonths: number;
		safeHarborReqsFulfilled: boolean;
		seasoningRequirementConfirmed: boolean;
	}

	export class QueueItemViewModel implements srv.IQueueItemViewModel  {
		adverseReason: string;
		adverseReasonDate: Date;
		appraisalAge: number;
		appraisalCondition: string;
		appraisalDeliveredDate: Date;
		appraisalExpectedDeliveryDate: Date;
		appraisalInspectionDate: Date;
		appraisalOrderedDate: Date;
		appraisalOrderId: string;
		appraisalOrderStatusDate: Date;
		appraisalRequestedDate: Date;
		appraisalRush: string;
		appraisalStatus: string;
		appraisedValue: number;
		borrowerActivity: string;
		borrowerFirstName: string;
		borrowerLastName: string;
		borrowerMailingAddress: string;
		borrowerNames: IList<IBorrowerNamesViewModel>;
		borrowerOnlineStatus: boolean;
		branch: string;
		buyingStageStatus: string;
		channel: string;
		closingDate: Date;
		company: string;
		conciergeFullName: string;
		conformingNonConforming: string;
		creditExpirationDate: Date;
		dateCreated: Date;
		dateModified: string;
		decisionScore: number;
		disclosureDate: Date;
		disclosureDueDate: Date;
		disclosureStatus: string;
		division: string;
		docDelivery: string;
		docs: number;
		eConsentDate: Date;
		email: string;
		employmentStatus: string;
		estimatedValue: number;
		isMilestoneStatusManual: boolean;
		isMultiBorrowerLoan: boolean;
		itpDate: Date;
		leadStatus: string;
		loanAmount: number;
		loanApplicationDate: Date;
		loanId: string;
		loanNumber: string;
		loanProgram: string;
		loanPurpose: string;
		loanType: string;
		lockExpireDate: Date;
		milestoneStatus: string;
		modifiedBy: string;
		occupancyType: string;
		parentLoanId: string;
		preApprovalLetter: string;
		prefferedPhone: string;
		propertyType: string;
		purchaseAmt: number;
		rate: number;
		sellerName: string;
		state: string;
		streetAddress: string;
		termAmort: string;
	}

	export class RealEstateViewModel implements srv.IRealEstateViewModel  {
		addressForDropDown: IList<ILookupItem>;
		enableMoRentalIncome: boolean;
		loanType: number;
		propertyList: IList<IPropertyViewModel>;
		repriceLoanOnSaveAndExit: boolean;
		showInvestmentProperty: boolean;
		showSecondVacationHome: boolean;
	}

	export class RecoupmentPeriodRequest implements srv.IRecoupmentPeriodRequest  {
		costOfNewLoan: number;
		currentPaymentAndMI: number;
		prepaymentPenaltyAmount: number;
		proposedPaymentAndMI: number;
	}

	export class RecoupmentPeriodResponse implements srv.IRecoupmentPeriodResponse  {
		costOfNewLoan: number;
		monthlySavingsFromNewLoan: number;
		recoupmentPeriod: number;
		totalCostOfNewLoan: number;
	}

	export class RemoveCreditOrDebit extends TransactionSummaryViewModelReSTOpEnvelopeBase implements srv.IRemoveCreditOrDebit  {
		constructor() {
		super();
	}

	lineNumber: number;
	}

	export class REOInfoViewModel implements srv.IREOInfoViewModel  {
		amortizationType: AmortizationTypeEnum;
		dti: number;
		fullyIndexedRate: number;
		interestRate: number;
		liabilityInfoId: string;
		loanPurpose: number;
		loanTerm: number;
		ltv: number;
		negativeAmortizationFeature: boolean;
		prePaymentAmount: number;
		prePaymentPenalty: boolean;
		prePaymentPercentage: number;
	}

	export class RolePrivilegeViewModel implements srv.IRolePrivilegeViewModel  {
		category: number;
		name: string;
		privilegeId: string;
		privilegeType: PrivilegeType;
	}

	export class RoleViewModel implements srv.IRoleViewModel  {
		isActive: boolean;
		privileges: ICollection<IRolePrivilegeViewModel>;
		roleDefaultPage: RoleDefaultPage;
		roleId: string;
		roleName: string;
		rolePriority: number;
	}

	export class SearchCriteriaViewModel implements srv.ISearchCriteriaViewModel  {
		amortizationTypeList: ICollection<ICriteriaDictionaryViewModel>;
		armTermsList: ICollection<ICriteriaDictionaryViewModel>;
		aus: string;
		bankStatementsIncome: string;
		interestOnly: string;
		loanTermsList: ICollection<ICriteriaDictionaryViewModel>;
		loanTypeList: ICollection<ICriteriaDictionaryViewModel>;
		mortgageInsurance: string;
	}

	export class SectionContainer implements srv.ISectionContainer  {
		accountId: string;
		formId: string;
		sectionKey: SectionTypeEnum;
		sectionKeyString: string;
		sectionNameString: string;
		subSectionList: IList<ISubSectionContainer>;
	}

	export class SecureLinkAuthenticationViewModel implements srv.ISecureLinkAuthenticationViewModel  {
		borrower: ISecureLinkBorrowerViewModel;
		coBorrower: ISecureLinkBorrowerViewModel;
		isBorrowerContinueWithout: boolean;
		isContinueWithoutLogin: boolean;
		loanApplicationId: string;
		loanId: string;
		loEmail: string;
		token: string;
	}

	export class SecureLinkBorrowerViewModel implements srv.ISecureLinkBorrowerViewModel  {
		borrowerId: string;
		email: string;
		fullName: string;
		inputPIN: string;
		isAuthenticated: boolean;
		userAccountId: number;
	}

	export class SecureLinkEmailTemplate implements srv.ISecureLinkEmailTemplate  {
		emailBody: string;
		emailSubject: string;
		previewLine: string;
		title: string;
	}

	export class SecureLinkEmailViewModel implements srv.ISecureLinkEmailViewModel  {
		emailBody: string;
		emailSubject: string;
		loanApplicationId: string;
		loanId: string;
		securelinkDocs: string[];
	}

	export class SecureLinkSigningRoom implements srv.ISecureLinkSigningRoom  {
		envelopeId: string;
		errorCode: number;
		message: string;
		sessionId: string;
		signingRoomAuthCode: string;
		url: string;
	}

	export class SecureLinkSigningRoomCompleted implements srv.ISecureLinkSigningRoomCompleted  {
		actionTaken: boolean;
		envelopeId: string;
		errorCode: number;
		hasError: boolean;
		message: string;
	}

	export class SecureLinkSigningRoomSent implements srv.ISecureLinkSigningRoomSent  {
		envelopeId: string;
		hasError: boolean;
		loanApplicationId: string;
		message: string;
	}

	export class SecureLinkUrlResponse implements srv.ISecureLinkUrlResponse  {
		secureLinkUrl: string;
	}

	export class SelectCostTypeListItem extends LookupItem implements srv.ISelectCostTypeListItem  {
		constructor() {
		super();
	}

	costGroupId: string;
		costTypeGroupCategory: string;
		feeCategory: FeeCategoryEnum;
		hudLineNumber: number;
		isAprCost: boolean;
		mustBeUnique: boolean;
		orderNo: number;
		subHUDLineNumber: string;
		templateId: number;
		templateUrl: string;
		toleranceLevel: number;
		totalRow: string;
		vaAllowableType: VaAllowableTypeEnum;
	}

	export class SellSideInformationViewModel implements srv.ISellSideInformationViewModel  {
		commitmentNumber: string;
		deliverySettlementDate: Date;
		gFeeBuyUp: number;
		hedgeLoan: number;
		investorId: number;
		investorLoanNumber: string;
		investorName: string;
		lockType: number;
		mapCredit: number;
		minimumGFee: number;
		poolNumber: string;
		registeredWithInvestorDate: Date;
		securityCoupon: string;
		securityCouponValue: number;
		sellSideInformationId: number;
		servicingFee: number;
		servicingTransferStatusId: number;
		servicingTypeId: number;
		srpMsr: number;
		targetDeliveryDate: Date;
	}

	export class SentEmailItemViewModel implements srv.ISentEmailItemViewModel  {
		apr: number;
		cashout: number;
		cltv: number;
		contactId: number;
		dateCreated: Date;
		downPayment: number;
		dti: number;
		emailAddress: string;
		estimatedValue: number;
		fico: number;
		htmlContent: string;
		id: number;
		impounds: number;
		isWhatIfRateOption: boolean;
		loanAmount: number;
		ltv: number;
		notes: string;
		occupancyType: number;
		points: number;
		productName: string;
		propertyType: number;
		purchasePrice: number;
		rate: number;
		reportRepositoryItemId: string;
	}

	export class SentPreApprovalLetterHistoryViewModel implements srv.ISentPreApprovalLetterHistoryViewModel  {
		borrowersForDistribution: string;
		borrowerUrl: string;
		brandDisplayName: string;
		brandThemeName: string;
		date: Date;
		disclosed: Date;
		distributeToBorrower: boolean;
		distributeToBuyersAgent: boolean;
		distributeToSellersAgent: boolean;
		downPayment: number;
		email: string;
		expirationDate: Date;
		expirationPeriodInSeconds: number;
		fileStoreItemId: string;
		firstName: string;
		lastName: string;
		letterLoanAmount: number;
		letterPurchasePrice: number;
		letterTemplateId: number;
		loanId: string;
		preApprovalLetterHistoryId: string;
		propertyId: string;
		selectedBorrowersForDistribution: IList<string>;
		status: number;
		userAccountId: number;
	}

	export class ServiceTrackingViewModel implements srv.IServiceTrackingViewModel  {
		caseId: string;
		date: Date;
		endTime: Date;
		errorMessage: string;
		filestoreId: string;
		isError: boolean;
		item: string;
		serviceTrackingId: string;
		startTime: Date;
		status: string;
		submittedBy: string;
		transactionId: string;
		vendorLoanId: string;
	}

	export class ServiceValidationViewModel implements srv.IServiceValidationViewModel  {
		code: string;
		description: string;
		importance: string;
		link: string;
		requestDate: Date;
		responseDate: Date;
		serviceValidationId: string;
		solution: string;
	}

	export class SubordinateFinancingDetailsViewModel implements srv.ISubordinateFinancingDetailsViewModel  {
		creditLineCap: number;
		interestRate: number;
		loanAmount: number;
		monthlyPayment: number;
		secondMortgageType: Concurrent2ndMortgageEnum;
		termInMonths: number;
	}

	export class SubSectionContainer implements srv.ISubSectionContainer  {
		dropdownDictionary: ILedgerEntryNames[];
		isSubSectionDisplayed: boolean;
		limit: number;
		records: IList<IBasicCost>;
		subSectionKey: SubSectionTypeEnum;
		subSectionNameString: string;
		total: number;
	}

	export class TitleInformationViewModel implements srv.ITitleInformationViewModel  {
		mannerTitleHeld: string;
		nameOfPartner: string;
		namesOnTitle: string;
		titleHeldIn: number;
	}

	export class ToleranceCalculatedViewModel implements srv.IToleranceCalculatedViewModel  {
		status: number;
		tenPercentTolerance: number;
		zeroPercentTolerance: number;
	}

	export class TransactionInfo implements srv.ITransactionInfo  {
		appraisal: IAppraisalViewModel;
		borrowers: IList<IBorrowerViewModel>;
		employments: IList<IEmploymentInfoViewModel>;
		incomes: IList<IIncomeInfoViewModel>;
		liabilities: IList<ILiabilityViewModel>;
		loanApplications: IList<ILoanApplicationViewModel>;
		properties: IList<IPropertyViewModel>;
	}

	export class TransactionSummarySubSectionInit implements srv.ITransactionSummarySubSectionInit  {
		endLine: number;
		isDisplayed: boolean;
		sectionKey: SectionTypeEnum;
		start: number;
		subSectionKey: SubSectionTypeEnum;
	}

	export class TransactionSummaryViewModel implements srv.ITransactionSummaryViewModel  {
		borrowerCredits: ISectionContainer;
		borrowerDebits: ISectionContainer;
		formId: string;
		ledgerEntryAttributesList: IList<ILedgerEntryAttribute>;
		ledgerEntryInitList: IList<ILedgerEntryInit>;
		ledgerEntryNameHelperList: IList<IGenericEnumStringConverterHelper<LedgerEntryNameEnum>>;
		loanId: string;
		sectionTypeHelperList: IList<IGenericEnumStringConverterHelper<SectionTypeEnum>>;
		sellerCredits: ISectionContainer;
		sellerDebits: ISectionContainer;
		subSectionTypeHelperList: IList<IGenericEnumStringConverterHelper<SubSectionTypeEnum>>;
		transactionSubSectionInitList: IList<ITransactionSummarySubSectionInit>;
	}

	export class UnlinkDoubleEntry extends TransactionSummaryViewModelReSTOpEnvelopeBase implements srv.IUnlinkDoubleEntry  {
		constructor() {
		super();
	}

	lineNumber: number;
	}

	export class UpdateCreditOrDebit extends TransactionSummaryViewModelReSTOpEnvelopeBase implements srv.IUpdateCreditOrDebit  {
		constructor() {
		super();
	}

	amount: number;
		endDate: Date;
		isApportioned: boolean;
		isConvertToDoubleEntry: boolean;
		ledgerEntryName: LedgerEntryNameEnum;
		ledgerEntryNameString: string;
		lineNumber: number;
		startDate: Date;
	}

	export class UploadedFileViewModel implements srv.IUploadedFileViewModel  {
		contentTypeId: number;
		dateCreated: Date;
		deleted: boolean;
		fileName: string;
		fileNotification: string;
		relatedDocumentId: string;
		repositoryItemId: string;
		status: number;
		uploadedById: number;
		uploadedFileId: string;
	}

	export class USDAInformationViewModel implements srv.IUSDAInformationViewModel  {
		addUSDAGFeeToLoanAmount: boolean;
		financedAmount: number;
		isBorrowersIncomeEligible: boolean;
		isusdaEligible: boolean;
		isusdaLoan: boolean;
	}

	export class UserAccountViewModel extends BaseViewModel implements srv.IUserAccountViewModel  {
		constructor() {
		super();
	}

	branchId: string;
		channelId: number;
		divisionId: number;
		firstName: string;
		interviewId: string;
		isActivated: boolean;
		isCoBorrower: boolean;
		isOnlineUser: boolean;
		jointAccountId: number;
		lastName: string;
		loaId: number;
		loanProcessorId: number;
		middleName: string;
		nmlsNumber: string;
		ownedPrivileges: ICollection<IRolePrivilegeViewModel>;
		privileges: ICollection<IRolePrivilegeViewModel>;
		resetPassword: boolean;
		roles: ICollection<IRoleViewModel>;
		salesManagerId: number;
		securityAnswer: string;
		securityQuestion: number;
		securityQuestionId: number;
		teamLeaderId: number;
		userAccountId: number;
		username: string;
	}

	export class UserInfoViewModel implements srv.IUserInfoViewModel  {
		userAccountId: number;
		userName: string;
	}

	export class UserSelectedProductCategoriesViewModel implements srv.IUserSelectedProductCategoriesViewModel  {
		additionalRecipients: IList<string>;
		borrowerUserAccountId: number;
		branchId: string;
		cashout: number;
		channelId: number;
		cltv: number;
		companyProfileId: string;
		conciergeId: number;
		decisionScore: string;
		divisionId: number;
		dti: number;
		email: string;
		estimatedValue: number;
		firstName: string;
		hearAboutUs: string;
		impounds: number;
		lastName: string;
		loanAmount: number;
		loanId: string;
		ltv: number;
		numberOfStories: number;
		numberOfUnits: number;
		occupancyType: number;
		products: IList<IProductItemViewModel>;
		propertyType: number;
		purchasePrice: number;
		refinancePurpose: number;
		sendEmail: boolean;
		stateName: string;
	}

	export class VACalculatorRequest implements srv.IVACalculatorRequest  {
		discountPoints: number;
		eehiCosts: number;
		existingVALoanBalance: number;
		originationFee: number;
		totalClosingCosts: number;
		vaFundingFee: number;
		veteranPaymentCash: number;
	}

	export class VACalculatorResponse implements srv.IVACalculatorResponse  {
		allowableBorrowerPaidClosingCosts: number;
		discountSectionI: number;
		discountSectionII: number;
		fundingFeeSubtotal: number;
		initialComputation: number;
		preliminaryLoanAmount: number;
		subtotal: number;
		totalMaxLoanAmount: number;
		vaFeeLimitExceededResults: IList<IVaFeesLimitExceededResult>;
	}

	export class VaFeesLimitExceededResult implements srv.IVaFeesLimitExceededResult  {
		fees: IList<ICostViewModel>;
		reason: VAFeeLimitExceededReasonEnum;
	}

	export class VAInformationViewModel implements srv.IVAInformationViewModel  {
		cashPaymentFromVeteran: number;
		costOfImprovements: number;
		disabilityBenefits: boolean;
		familySize: number;
		includeVAFee: boolean;
		iNowOccupy: boolean;
		iOccupied: boolean;
		isCurrentLoanVA: boolean;
		isvaLoan: boolean;
		isVaUsedInPast: boolean;
		isVeteran: boolean;
		militaryBranch: string;
		militaryService: string;
		qmCertification: IQMCertificationViewModel;
		serviceStatus: string;
		spouseOnDutyDependentChildOccupies: boolean;
		spouseOnDutyIOccupy: boolean;
		spouseWasOnDutyDependentChildOccupied: boolean;
		spouseWasOnDutyIOccupied: boolean;
		titleVestedAs: TitleVestedAsEnum;
		vaCalculator: string;
		vaLoanPaidOff: boolean;
		vaLoanPurpose: VALoanPurposeEnum;
		vaRegion: VARegionsEnum;
		veteranInformationForId: string;
	}

	export class VmOpResult implements srv.IVmOpResult  {
		ok: boolean;
	}
}

