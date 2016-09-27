// This file (viewModelBaseClasses.ts - ver 1.0) has been has been automatically generated, do not modify!
// To extend an interface, create a file that exports the same interface name within the same module name with ONLY the ADDITIONAL properties.
// TypeScript will automatically merge both interfaces together.
 

/// <reference path="enums.ts" />	
/// <reference path="../extendedViewModels/genericTypes.ts" />	
/// <reference path="viewModels.ts" />	

module srv.cls  {

	export class BaseViewModel implements IBaseViewModel  {
				currentUserAccountId: number;
		loanId: string;
		loanUserAccountId: number;
	}

	export class GlobalContactsViewModelReSTOpEnvelopeBase implements IGlobalContactsViewModelReSTOpEnvelopeBase  {
				result: IVmOpResult;
	}

	export class LedgerEntryBase implements ILedgerEntryBase  {
				accountId: string;
		amount: number;
		formId: string;
		isRemoved: boolean;
		ledgerEntryType: LedgerEntryTypeEnum;
	}

	export class LiabilityInfoViewModel implements ILiabilityInfoViewModel  {
				accountNumber: string;
		amount: number;
		borrowerId: string;
		borrowerName: string;
		calculatedMonthlyAmount: number;
		clientId: number;
		companyData: ICompanyDataViewModel;
		currentratingType: string;
		debtComment: string;
		debtsAccountOwnershipType: string;
		debtType: string;
		isJoint: boolean;
		isJointWithSingleBorrowerID: boolean;
		isRemoved: boolean;
		isSecondaryPartyRecord: boolean;
		isUserEntry: boolean;
		liabilitiesAccountOwnershipType: string;
		liabilityDisabled: boolean;
		liabilityInfoId: string;
		liabilityInfoType: string;
		maximumCreditLine: number;
		minPayment: number;
		monthsLeft: number;
		originalLiabilityInfoId: string;
		originalMinAmount: number;
		originalUnpaidBalance: number;
		payee: string;
		systemCalculatedMinPayment: boolean;
		typeDisplayValue: string;
		typeId: number;
		unpaidBalance: number;
		userEntryNotSavedInDatabaseYet: boolean;
	}

	export class LoanMember implements ILoanMember  {
			}

	export class LookupItem implements ILookupItem  {
				contextFlags: number;
		description: string;
		disabled: boolean;
		selected: boolean;
		stringValue: string;
		text: string;
		value: string;
	}

	export class TransactionSummaryViewModelReSTOpEnvelopeBase implements ITransactionSummaryViewModelReSTOpEnvelopeBase  {
				result: IVmOpResult;
		sectionKey: SectionTypeEnum;
		subSectionKey: SubSectionTypeEnum;
		viewModel: ITransactionSummaryViewModel;
	}

	export class BorrowerViewModel extends LoanMember implements IBorrowerViewModel  {
			constructor() {
		super();
	}

		agesOfDependents: string;
		alternatePhone: IPhoneViewModel;
		assets: ICollection<IAssetViewModel>;
		borrowerId: string;
		currentAddressId: string;
		dateOfBirth: string;
		declarationsInfo: IDeclarationInfoViewModel;
		eApprovalConfirmation: IEApprovalConfirmationViewModel;
		eConsent: IEConsentViewModel;
		email: string;
		employmentStatusId: number;
		ficoScore: IFicoScoreViewModel;
		firstName: string;
		fullName: string;
		identityKey: string;
		isActive: boolean;
		isCoBorrower: boolean;
		isEmployedTwoYears: boolean;
		isPrimaryBorrower: boolean;
		lastName: string;
		loanApplicationId: string;
		mailingAddressId: string;
		maritalStatus: number;
		middleName: string;
		miscellaneousDebt: ICollection<IMiscellaneousDebtViewModel>;
		numberOfDependents: number;
		permanentAlien: boolean;
		preferredPhone: IPhoneViewModel;
		previousAddressId: string;
		publicRecords: IList<IPublicRecordViewModel>;
		socialSecurityNumber: string;
		ssn: string;
		suffix: string;
		usCitizen: boolean;
		userAccount: IUserAccountViewModel;
		yearsOfSchool: number;
	}

	export class CostBase extends LedgerEntryBase implements ICostBase  {
			constructor() {
		super();
	}

		costId: string;
		formInfoId: string;
		hasValue: boolean;
		isReadOnly: boolean;
	}
}

