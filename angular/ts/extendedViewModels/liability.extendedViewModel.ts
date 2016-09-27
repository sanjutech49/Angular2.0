/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/extendedViewModels/property.extendedviewmodel.ts" />
/// <reference path="../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../common/common.objects.ts" />

module srv {

    export interface ILiabilityViewModel {
        amountAlreadyAdded?: number;
        borrowerFullName?: string;
        isCoBorrower?: boolean;
        originalClientId?: number;
        isNewRow?: boolean;
        isNotMyLoan?: boolean;
        handleCommentChange? (): void;
        updateTotalPledgedAssetPayment? (): void;
        getTotalPayments?: () => number;

        hasProperty? (): boolean;
        getProperty? (): srv.IPropertyViewModel;
        setProperty? (propertyVm: srv.IPropertyViewModel): void;

        isValid? (): boolean;

        isAllocatedSubjProp? : boolean;
    }
}

module cls {
    export class LiabilityViewModel extends srv.cls.LiabilityViewModel {

        constructor(ti?: cls.TransactionInfo, liability?: srv.ILiabilityViewModel, public borrowerFullName?: string) {
            super();

            if (!!liability) {
                lib.copyState(liability, this);
                if (this.companyData || angular.isUndefined(this.companyData.hasChanges)) {
                    this.companyData.hasChanges = false;
                }
            }
            else {
                this.debtCommentId = 0;
                this.companyData = new CompanyDataViewModel();
                this.reoInfo = new REOInfoViewModel();
            }

            if (!this.liabilityInfoId || this.liabilityInfoId == lib.getEmptyGuid()) {
                this.liabilityInfoId = util.IdentityGenerator.nextGuid();
            }

            if (!!ti) {
                this.setTransactionInfo(ti);
                ti.liability.map(this);
            }

            if (!!borrowerFullName) {
                this.borrowerFullName = borrowerFullName;
            }

            this.setAccountsOwnershipType();

            // @todo-cc: Review to see about pushing up to [consumersite.vm]
            try {
                this.assignSubjectPropertyId();
            }
            catch (e) {
                // @todo-cc: Resolve
            }
        }

        // @todo-cc: Review to see about pushing up to [consumersite.vm]
        get isAllocatedSubjProp(): boolean {
            if (!this.propertyId) {
                return false;
            }
            else if (!this.subjectPropertyId) {
                return false;
            }
            else {
                return this.propertyId == this.subjectPropertyId;
            }
        }
        set isAllocatedSubjProp(isAllocatedSubjProp: boolean) {
            if (isAllocatedSubjProp) {
                if (!!this.subjectPropertyId) {
                    this.propertyId = this.subjectPropertyId;
                }
            }
            else {
                this.propertyId = null;

                // @todo-cc: Beware this side effect
                this.lienPosition = null;
            }
        }        

        // @todo-cc: Review to see about pushing up to [consumersite.vm]
        private subjectPropertyId: string;

        private assignSubjectPropertyId = () => {
            if (!this.ticb || !this.ticb()) {
                return;
            }
            
            var loanVm = this.ticb().getLoan();
            if (!loanVm) {
                return;
            }

            var subjectProperty = loanVm.getSubjectProperty();
            if (!subjectProperty) {
                return;
            }

            this.subjectPropertyId = subjectProperty.propertyId;
        }

        borrowerId: string;
        isRemoved = false;
        disablePrimaryResidence: boolean;

        public getTotalPayments = () => {
            var propertyExpensesExist = (this.getProperty() && this.getProperty().propertyExpenses);
            var isFirstLienPosition = this.lienPosition == 1;
            var isPledgedAssetPaidOff = this.borrowerDebtCommentId == srv.pledgedAssetCommentType.PaidOffFreeAndClear ||
                this.borrowerDebtCommentId == srv.pledgedAssetCommentType.NotMyLoan;

            if (isPledgedAssetPaidOff || !propertyExpensesExist || !isFirstLienPosition)
                return this.minPayment;

            if (this.getProperty().propertyExpenses.length > 0) {
                var filteredPropertyExpenses = this.getProperty().propertyExpenses.filter(e => !e.impounded && e.monthlyAmount != 0);
                if (filteredPropertyExpenses && filteredPropertyExpenses.length > 0)
                    for (var i = 0; i < filteredPropertyExpenses.length; i++)
                        this.minPayment += parseFloat(String(filteredPropertyExpenses[i].monthlyAmount));
            }

            return this.minPayment;
        }

        get isLenderSectionVisible() {
            return this.borrowerDebtCommentId != srv.pledgedAssetCommentType.PaidOffFreeAndClear;
        }


        get collectionColumnsDisabled(): boolean {
            return this.debtCommentId == <number>srv.collectionsDebtComment.Duplicate || this.debtCommentId == <number>srv.collectionsDebtComment.PaidOff || this.debtCommentId == <number>srv.collectionsDebtComment.PayoffAtClose;
        }


        /*
        * @desc Hnadles comment change on liablity item
        */
        handleCommentChange = (): void => {
            if (this.debtCommentId == srv.LiabilitiesDebtCommentEnum.NonBorrowingSpouse) {
                this.companyData.attn = 'Non-Borrowing Spouse Liability';
            }
            else {
                this.companyData.attn = '';
            }

            if (this.isSecondaryPartyRecord) {
                this.setDTIAndTotalLiabilityFlags(false, false);
                return;
            }
            if (this.debtCommentId == srv.LiabilitiesDebtCommentEnum.PayoffAtClose) {
                this.setDTIAndTotalLiabilityFlags(false, true);
                return;
            }
            if (this.debtCommentId == srv.LiabilitiesDebtCommentEnum.AcctNotMine ||
                this.debtCommentId == srv.LiabilitiesDebtCommentEnum.Duplicate ||
                this.debtCommentId == srv.LiabilitiesDebtCommentEnum.NotMyLoan ||
                this.debtCommentId == srv.LiabilitiesDebtCommentEnum.PaidOff ||
                this.debtCommentId == srv.LiabilitiesDebtCommentEnum.SomeoneElsePays) {
                this.setDTIAndTotalLiabilityFlags(false, false);
            }
            else {
                this.setDTIAndTotalLiabilityFlags(true, true);
            }
        }

        private setDTIAndTotalLiabilityFlags = (includeInDTI: boolean, includeInTotalLiabilites: boolean): void => {
            this.includeInDTI = includeInDTI;
            this.includeInLiabilitiesTotal = includeInTotalLiabilites;
            this.liabilityDisabled = !this.includeInLiabilitiesTotal || this.isSecondaryPartyRecord
        }


        /**
        *@desc loanAppItem level validation
        */
        public isValid = (): boolean => {


            if (this.borrowerDebtCommentId != srv.pledgedAssetCommentType.NotMyLoan) {

                if (!this.getProperty() || !this.getProperty().propertyId ||
                    !this.getProperty().isValid(false) ||
                    !this.getProperty().propertyType || !this.getProperty().currentEstimatedValue ||
                    !this.getProperty().occupancyType ||
                    (this.getProperty().occupancyType == srv.PropertyUsageTypeEnum.InvestmentProperty && (!this.getProperty().OwnershipPercentage || !this.getProperty().grossRentalIncome)))
                    return false;

                if (this.borrowerDebtCommentId != srv.pledgedAssetCommentType.PaidOffFreeAndClear) {

                    if (!this.lienPosition || !this.companyData.companyName ||    //lender name
                        !this.unpaidBalance ||
                        !this.minPayment ||
                        (this.pledgedAssetLoanType == srv.pledgedAssetLoanType.Heloc && !this.maximumCreditLine) ||
                        (this.lienPosition == srv.LienPosition.First && !this.getProperty().areExpensesValid()))
                        return false;
                }
            }
            return true;

        }


        /**
        * @desc srv.IPayOffSectionItemViewModel members
        */
        set creditor(value: string) {
            if (value != this.companyData.companyName) {
                this.payoffLender = value;
            }
            else {
                this.payoffLender = null
            }

        }
        get creditor(): string {
            if (this.payoffLender != undefined && this.payoffLender != null)
                return this.payoffLender;
            else
                return this.companyData.companyName;
        }

        set balance(value: number) {
            this.unpaidBalance = value;
        }
        get balance(): number {
            return this.unpaidBalance;
        }

        set payoffCommentId(value: string) {
            if (this.isPledged)
                this.borrowerDebtCommentId = parseInt(value);
            else
                this.debtCommentId = parseInt(value);

        }
        get payoffCommentId(): string {
            return this.isPledged ? String(this.borrowerDebtCommentId) : String(this.debtCommentId);
        }

        get isUserAdded(): boolean {
            return this.isUserEntry;
        }

        get isPublicRecord(): boolean {
            return false;
        }

        get isLiability(): boolean {
            return !this.isPledged;
        }

        get canEdit(): boolean {
            return true;
        }

        get isPayoffItem(): boolean {
            return false;
        }

        get lienPositionDisplayValue(): string {
            if (this.borrowerDebtCommentId && this.borrowerDebtCommentId == srv.pledgedAssetCommentType.Duplicate) {
                return "Duplicate";
            }
            if (this.lienPosition && this.lienPosition != -1 && this.lienPosition != 0) {
                switch (this.lienPosition) {
                    case 1:
                        return "First"
                    case 2:
                        return "Second"
                    case 3:
                        return "Third"
                    case 4:
                        return "Fourth"
                    case 5:
                        return "Fifth"
                };

                return "";
            }
        }

        get estimatedValueDisplayValue(): string {
            if (this.getProperty() && this.getProperty().currentEstimatedValue &&
                (!this.lienPosition || this.lienPosition == -1 || this.lienPosition == 1)) {
                return this.getProperty().currentEstimatedValue.toString();
            }
            return "";
        }

        get payoffDisplayValue(): boolean {

            return this.borrowerDebtCommentId == srv.pledgedAssetCommentType.PayoffAtClose ||
                this.borrowerDebtCommentId == srv.pledgedAssetCommentType.PayoffAtClosingAndCloseAccount ||
                this.borrowerDebtCommentId == srv.pledgedAssetCommentType.PayoffAtClosingAndDontCloseAccount;
        }

        get excludeDisplayValue(): boolean {

            return this.borrowerDebtCommentId == srv.pledgedAssetCommentType.Duplicate;
        }

        get propertyAddressDisplayValue(): string {

            var propertyAddress = "";
            if (this.getProperty()) {
                if (this.borrowerDebtCommentId != 6)
                    propertyAddress = this.getProperty().fullAddressString;
                else
                    propertyAddress = "Not my loan";
            }
            else {
                propertyAddress = "Not specified"
            }

            return propertyAddress;
        }

        get isNotMyLoan(): boolean {
            return this.borrowerDebtCommentId == 6;
        }

        get includeInTotalPayment(): boolean {

            return this.borrowerDebtCommentId != srv.pledgedAssetCommentType.PayoffAtClose &&
                this.borrowerDebtCommentId != srv.pledgedAssetCommentType.PayoffAtClosingAndCloseAccount &&
                this.borrowerDebtCommentId != srv.pledgedAssetCommentType.PayoffAtClosingAndDontCloseAccount &&
                this.borrowerDebtCommentId != srv.pledgedAssetCommentType.NotMyLoan &&
                this.borrowerDebtCommentId != srv.pledgedAssetCommentType.Duplicate;
        }

        hidden: boolean = false;

        /**
        * @desc Includes collection into sum of total amount
        */
        includeCollectionInLiabilitesTotalAmount = (collection: srv.ILiabilityViewModel): void => {
            if (collection.debtCommentId === 1) { //TODO: replace this with enum
                collection.includeInLiabilitiesTotal = true;
            }
            else if (collection.debtCommentId === 4) { //TODO: replace this with enum
                collection.includeInLiabilitiesTotal = false;
            }
        }

        private _debtsAccountOwnershipType: string;
        get debtsAccountOwnershipType(): string {
            return this._debtsAccountOwnershipType;
        }
        set debtsAccountOwnershipType(debtsAccountOwnershipType: string) {
            this._debtsAccountOwnershipType = debtsAccountOwnershipType;
            this.setAccountsOwnershipType();
        }

        /**
        *@desc Used to keep other properties in sync
        *       @todo-cl: Remove
        */
        get DebtsAccountOwnershipType(): string {
            return this.debtsAccountOwnershipType;
        }
        set DebtsAccountOwnershipType(newVal: string) {
            this.debtsAccountOwnershipType = newVal;
        }

        protected setAccountsOwnershipType() {
            switch (this.liabilitiesAccountOwnershipType) {
                case String(srv.LiabilitiesAccountOwnershipType.AuthorizedUser):
                    this.accountOwnershipTypeToolTipText = "Authorized User";
                    this.accountOwnershipTypeIndicator = "a";
                    break;
                case String(srv.LiabilitiesAccountOwnershipType.Individual):
                    if (this.isSecondaryPartyRecord) {
                        this.accountOwnershipTypeToolTipText = "Authorized User";
                        this.accountOwnershipTypeIndicator = "a";
                    }
                    else {
                        this.accountOwnershipTypeToolTipText = "";
                        this.accountOwnershipTypeIndicator = "";
                    }
                    break;
                case String(srv.LiabilitiesAccountOwnershipType.JointContractualLiability):
                case String(srv.LiabilitiesAccountOwnershipType.JointParticipating):
                    this.accountOwnershipTypeToolTipText = this.isJointWithSingleBorrowerID ? "Joint Account w/ Someone Else" : "Joint Account w/ Co-Borrower";
                    this.accountOwnershipTypeIndicator = this.isJointWithSingleBorrowerID ? "j-other" : "j";
                    break;
                case String(srv.LiabilitiesAccountOwnershipType.None):
                default:
                    this.accountOwnershipTypeToolTipText = "";
                    this.accountOwnershipTypeIndicator = "";
                    break;
            }
        }
        // }

        //// LiablitySnapshot is used to save the state of a LiabilityViewModel without external references

        //export class LiablitySnapshot extends LiabilityViewModelBase {

        //    disablePrimaryResidence: boolean;
        //    borrowerFullName: string;
        //    amountAlreadyAdded: number;
        //    isCoBorrower: boolean;
        //    originalClientId: number;
        //    isNewRow: boolean;
        //    isNotMyLoan: boolean;

        //    constructor(liability: LiabilityViewModel) {
        //        super();

        //        common.objects.automap(this, liability);
        //        if (liability.property) {
        //            this.property = new PropertySnapshot(<cls.PropertyViewModel>liability.property);
        //        }
        //    }

        //    get DebtsAccountOwnershipType(): string {

        //        return this.debtsAccountOwnershipType;
        //    }

        //    set DebtsAccountOwnershipType(debtsAccountOwnershipType: string) {

        //        this.debtsAccountOwnershipType = debtsAccountOwnershipType;
        //    }
        //}

        //
        // @todo-cl: fwk/lib-ize
        //
        private ticb: ITransactionInfoCallback;
        private hasTransactionInfo = (): boolean => {
            return (!!this.ticb && !!this.ticb());
        }
        public getTransactionInfo = (): cls.TransactionInfo => {
            if (this.hasTransactionInfo())
                return this.ticb();
            else
                return null;
        }
        public setTransactionInfo = (ti: cls.TransactionInfo): void => {
            this.ticb = () => ti;
        }

        //
        private getHasTransactionalInfoProperty = (): boolean => {
            if (this.hasTransactionInfo() && !!this.getTransactionInfo().property) {
                return true;
            }
            else {
                return false;
            }
        }
        private getTransactionInfoProperty = (): Map<srv.IPropertyViewModel> => {
            if (this.getHasTransactionalInfoProperty()) {
                return this.getTransactionInfo().property;
            }
            return new Map<srv.IPropertyViewModel>();
        }

        public hasProperty = (): boolean => {
            return !!this.getProperty();
        }
        
        // property
        getProperty = (): srv.IPropertyViewModel => {
            if (!!this.propertyId && this.getHasTransactionalInfoProperty()) {
                var item = this.getTransactionInfoProperty().lookup(this.propertyId);
                return item;
            }
            return null;
        }
        setProperty = (property: srv.IPropertyViewModel) => {
            if (!!property && this.getHasTransactionalInfoProperty()) {
                this.propertyId = property.propertyId;
                this.getTransactionInfoProperty().map(property);
            }
            else {
                this.propertyId = null;
            }
        }

        public bindProperty = (propertyVm: srv.IPropertyViewModel): srv.IPropertyViewModel => {
            if (angular.isDefined(propertyVm)) {
                this.setProperty(propertyVm);
            }
            return this.getProperty();
        }

        // @todo-cl: Remove ; backwards compbadiblity
        public get property(): srv.IPropertyViewModel {
            return this.getProperty();
        }
        public set property(propertyVm: srv.IPropertyViewModel) {
            /*Read-Only*/
            console.warn("LiabilityViewModel::<set property> should not be called ; use setProperty() instead.");
        }
    }
}
