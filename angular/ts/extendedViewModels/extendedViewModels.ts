/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/extendedViewModels/property.extendedviewmodel.ts" />
/// <reference path="../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../common/common.objects.ts" />

module angular {

    export interface IScope {
        userAccountId: any;
        selectedLoanId: any;
    }

    export interface IRootScopeService {
        SelectedLoan: any;
        ContextualType: any;
    }
}


// extend the generated view models here...
module srv {

    export interface ISecureLinkEmailTemplateViewModel {
        title: string;
        previewLine: string;
        emailSubject: string;
        emailBody: any;
    }

    export interface ISecureLinkEmailViewModel {
        toEmail?: string;
        ccEmail?: string;
        fromEmail?: string;
        activeTemplate?: ISecureLinkEmailTemplateViewModel;
    }

    export interface IClosingCostViewModel {
        activeTab?: string;
        totals?: any;
        disableFields?: boolean;
    }

    export interface IEnumLookupRecord<T> {
        value: T;
        name: string;
        orderValue: number;
        stringValue: string;
    }

    export interface IVaultDocumentType {
        borrowerProvides?: boolean;
        metadata?: any;
        documentTypeId?: number;
        fullDescription?: string;
    }

    export interface IUserAccount {
        sendVerificationEmail?: boolean;
        saveAccount?: boolean;
    }

    export interface ICountyLoanLimitViewModel {
        stateName: string;
        countyName: string;
        oneFamilyUnit: number;
        twoFamilyUnit: number;
        threeFamilyUnit: number;
        fourFamilyUnit: number;
    }

    //export interface IUserAccount {
    //    confirmEmail?: string;
    //    isCoBorrower?: boolean;
    //    securityQuestion?: string;
    //    loanId?: string;
    //    originalUsername?: string;
    //    originalSecurityQuestionId?: number;
    //    currentUserAccountId?: number;
    //    resetPassword?: boolean;
    //    originalSecurityAnswer?: string;
    //    sendActivationEmail?: boolean;
    //}

    // todo - this should be defined on the actual interface
    export interface IManageUserAccountsViewModel {
        userAccount?: srv.IUserAccount;
    }

    export interface IBasicCompanyContact<T> {
    }

    export interface IBasicCompany<T> {
    }

    export interface IGenericEnumStringConverterHelper<T> {
    }

    export interface IBorrowerLiabilities {
        borrowerFullName: string;
        isBorrower: boolean;
        liabilities: srv.ILiabilityViewModel[];
    }

    export interface ICompanyDataViewModel {
        hasChanges?: boolean;
        isEmailAddressNotValid?: boolean;
    }

    export interface IDeclarationViewModel {     
    }

    export interface IUserAccountViewModel {
        originalUsername?: string;
        originalSecurityQuestionId?: number;
        originalSecurityAnswer?: string;

        emailFieldDisabled?: boolean;
        confirmEmail?: string;
        usernameTaken?: boolean;

        isEmailChanged?: boolean;
        isEmailValid?: boolean;
        invalidEmails?: boolean;
        invalidConfirm?: boolean;
        isEmailAddressNotValid?: boolean;
        hasPrivilege? (privilegeName: string): boolean;

        sendActivationEmail?: boolean;
        sendVerificationEmail?: boolean;
        saveAccount?: boolean;
    }

    export interface ICreditViewModel {
        creditReportMessageVisible?: boolean;
        disableReRunCreditButton?: boolean;
        isCreditReportValid?(): boolean;
    }
    export interface ISellSideInformationViewModel {
        sellSideInvestorPurchasePrice?: number;
        isDisabledSellSide?: boolean;
    }

    export interface IPricingAdjustmentsViewModel {
        defaultAdjustmentTypeId?: number;
        isDisabled?: boolean;
        disableFields?: boolean;
        totalLoanPrice?: number;
    }

    //export interface ILiabilityViewModel {
    //    amountAlreadyAdded?: number;
    //    borrowerFullName?: string;
    //    isCoBorrower?: boolean;
    //    originalClientId?: number;
    //    isNewRow?: boolean;
    //    isNotMyLoan?: boolean;
    //    handleCommentChange? (): void;
    //    updateTotalPledgedAssetPayment? (): void;
    //    getTotalPayments?: () => number;
    //}
    export interface IAgentContactViewModel {
        isEmailAddressNotValid?: boolean;
    }
    export interface IMiscellaneousDebtViewModel {
        clientIdForOrder?: number;
    }
    export interface IRemovable {
        isRemoved: boolean;
    }

    export interface IAdjustmentsViewModel {
        calculateValue?: number;
    }

    export interface IMilestoneStatus {
        setStatus?: (isWholeSale: boolean, allLoanAppsCompleted: boolean, sixPiecesAcquired: boolean, homebuyingType: srv.HomeBuyingType) => srv.milestoneStatus;      
        setDefault?: (isWholeSale: boolean, homebuyingType: srv.HomeBuyingType) => srv.milestoneStatus;
    }
   
    //export interface ISecureLinkAuthenticationViewModel {
    //    hasCoBorrower: boolean;
    //}

    //export interface ISecureLinkBorrowerViewModel {
    //    showContinueWithoutLink: boolean;
    //    continueWithoutText: string;
    //}
}


module srv.cls {
    export class SecureLinkEmailTemplateViewModel implements srv.ISecureLinkEmailTemplateViewModel {
        title: string;
        previewLine: string;
        emailSubject: string;
        emailBody: any;
    }
}

module cls {
    export interface IGS<T> {
        g(): T;
        s(t: T): void;
    }

    export interface IGSS<TSource, TResult> {
        g(s: TSource): TResult;
        s(s: TSource, t: TResult): void;
    }

    export enum TitleHeldInType {
        InMyNamesAsIndividuals = 0,
        InATrust = 1,
        InACorporation = 2
    }

    export class CreditViewModel extends srv.cls.CreditViewModel {
        creditReportMessageVisible: boolean;
        disableReRunCreditButton: boolean;

        constructor(credit?: srv.ICreditViewModel) {
            super();
            if (credit) {
                common.objects.automap(this, credit);
            }
        }


        isCreditReportValid = (): boolean => {

            if (!this.creditReportDate || this.creditStatus != srv.CreditReportStatus.retrieved)
                return false;

            if(moment(this.creditReportDate).format("YYYY-MM-DD") < moment().subtract('89', 'days').format("YYYY-MM-DD"))
                return false;
            else
                return true;
        }
    }

    export class CountyLoanLimitViewModel implements srv.ICountyLoanLimitViewModel {
        stateName: string;
        countyName: string;
        oneFamilyUnit: number;
        twoFamilyUnit: number;
        threeFamilyUnit: number;
        fourFamilyUnit: number;
    }

    export class DeclarationViewModel extends srv.cls.DeclarationViewModel {
        
        constructor(declaration?: srv.IDeclarationViewModel) {
            super();
            if (declaration) {
                common.objects.automap(this, declaration);
            }

            if ((!angular.isDefined(this.loanOriginatorSource) || this.loanOriginatorSource == null) && !declaration)
                this.loanOriginatorSource = srv.LoanOriginationInterviewTypeEnum.Telephone;           
        }
    }

    export class DeclarationInfoViewModel extends srv.cls.DeclarationInfoViewModel {

        constructor(declarationInfo?: srv.IDeclarationInfoViewModel) {
            super();
            if (declarationInfo) {
                common.objects.automap(this, declarationInfo);
            }
        }

        expiredAfterIssued = (): boolean => {

            if (this.dateIssued != null) {
                if (this.dateExpired == null) return true;
                var dateBefore = moment(this.dateIssued).format('MM/DD/YYYY');
                var dateAfter = moment(this.dateExpired).format('MM/DD/YYYY');
                return new Date(dateBefore) < new Date(dateAfter);
            }
            else return true;
        }
    }

    export class REOInfoViewModel extends srv.cls.REOInfoViewModel {
        constructor(reoInfo?: srv.IREOInfoViewModel) {
            super();
            if (reoInfo) {
                common.objects.automap(this, reoInfo);
            }
        }

        get NegativeAmortizationFeature(): string {
            return common.objects.boolToString(this.negativeAmortizationFeature);
        }
        set NegativeAmortizationFeature(value: string) {
            this.negativeAmortizationFeature = common.string.toBool(value);
        }

        get PrePaymentPenalty(): string {
            return common.objects.boolToString(this.prePaymentPenalty);
        }
        set PrePaymentPenalty(value: string) {
            this.prePaymentPenalty = common.string.toBool(value);
        }
        get FullyIndexedRate(): number {
            this.fullyIndexedRate = this.amortizationType == srv.AmortizationTypeEnum.ARM ? this.fullyIndexedRate : this.interestRate;
            return this.fullyIndexedRate;
        }
        set FullyIndexedRate(value: number) {
            this.fullyIndexedRate = value;
        }
    }

    export class CompanyDataViewModel extends srv.cls.CompanyDataViewModel {
        hasChanges: boolean;
        isEmailAddressNotValid: boolean;

        // @todo-cl::PROPERTY-ADDRESS
        constructor(companyData?: srv.ICompanyDataViewModel, public getBorrowerFullName?: () => string) {
            super();
            if (companyData) {
                common.objects.automap(this, companyData);
                this.addressViewModel = new cls.PropertyViewModel(null, companyData.addressViewModel);
            }
            else
                this.addressViewModel = new cls.PropertyViewModel(null);

            this.hasChanges = false;
        }
                
        //get AddressViewModel(): srv.IAddressViewModel {
        //    return (this.addressViewModel ? this.addressViewModel : (this.addressViewModel = new cls.AddressViewModel()));
        //}
        //set AddressViewModel(newAddress: srv.IAddressViewModel) {
        //    this.addressViewModel = newAddress;
        //}

        //
        // @todo: Remove from CreditHelpers
        //
        isCompanyDataFilledIn = (): boolean => {
            return this.hasVal(this.companyName)
                || this.hasVal(this.attn)
                || this.hasVal(this.phone)
                || this.hasVal(this.fax)
                || this.hasVal(this.streetAddress1)
                || this.hasVal(this.streetAddress2)
                || this.hasVal(this.addressViewModel && this.addressViewModel.cityName)
                || this.hasVal(this.addressViewModel && this.addressViewModel.stateName)
                || this.hasVal(this.addressViewModel && this.addressViewModel.zipCode);
        }

        // Util? // @todo: lambda
        private hasVal = (s: String): boolean => {
            if (s == undefined || s == null || s.trim().length == 0) {
                return false;
            }
            else {
                return true;
            }
        }
    }

    export interface IPayOffSectionItemViewModel {
        creditor: string;
        balance: number;
        payoffCommentId: string;
        isUserAdded: boolean;
        isPublicRecord: boolean;
        isLiability: boolean;
        isRemoved: boolean;
        canEdit: boolean;
        isPayoffItem: boolean;
        hidden: boolean;
    }

    export class MiscellaneousDebtViewModel extends srv.cls.MiscellaneousDebtViewModel {
        constructor(miscDebt?: srv.IMiscellaneousDebtViewModel, debtType?: number, userEntry?: boolean, borrowerFullName?: string) {
            super();
            if (miscDebt)
                common.objects.automap(this, miscDebt);
            else {
                this.typeId = debtType || srv.MiscellaneousDebtTypes.ChildCareExpensesForVALoansOnly; // optional param, by default child aliomny
                this.isUserEntry = (userEntry || userEntry === undefined); // optional paramteter, by default set userEntry to true
                this.monthsLeft = null; //Bug 18562
                this.amount = 0;
                this.payee = "";
                this.isRemoved = false;
            }

            //
            //if (!this.borrowerFullName && this.getBorrowerFullName != undefined)
            //    this.borrowerFullName = this.getBorrowerFullName();
            this.borrowerFullName = borrowerFullName;

            //if (!this.miscellaneousDebtId || this.miscellaneousDebtId == lib.getEmptyGuid()) {
            //    this.miscellaneousDebtId = util.IdentityGenerator.nextGuid();
            //}
        }
        borrowerFullName: string;

        get Amount(): number {
            return this.amount;
        }

        set Amount(newAmount: number) {
            if (newAmount != 0) {
                this.isRemoved = false;
            }
            this.amount = newAmount;
        }
    }

    export class UserAccountViewModel extends srv.cls.UserAccountViewModel {

        constructor(userAccount?: srv.IUserAccountViewModel) {
            super();
            if (userAccount) {
                common.objects.automap(this, userAccount);
                if (userAccount.userAccountId == undefined) {
                    this.userAccountId = 0;
                }
                this.originalUsername = userAccount.username;
            } else {
                this.isOnlineUser = false;
            }
            if (!this.securityQuestionId)
            {
                this.securityQuestionId = 0;
            }
        }

        originalUsername: string;
        originalSecurityQuestionId: number;
        originalSecurityAnswer: string;

        emailFieldDisabled: boolean;
        confirmEmail: string;
        invalidConfirm: boolean;
        usernameTaken: boolean;
        preferredPaymentPeriodId: number;
        isEmailValid: boolean;
        isConfirmEmailValid: boolean;

        securityQuestionId: number;
        securityAnswer: string;
        isEmailAddressNotValid: boolean;
        sendActivationEmail: boolean;

        get isEmailChanged(): boolean {

            return this.username != this.originalUsername;
        }

        get isSecurityQuestionChanged(): boolean {

            return this.securityQuestionId != this.originalSecurityQuestionId;
        }

        get isSecurityAnswerChanged(): boolean {

            return this.securityAnswer != this.originalSecurityAnswer;
        }

        get IsOnlineUser(): boolean {
            return this.isOnlineUser;
        }

        set IsOnlineUser(newIsOnlineUser: boolean) {
            this.isOnlineUser = newIsOnlineUser;
            if (!newIsOnlineUser) {
                this.securityQuestionId = 0;
                this.securityAnswer = '';
                this.resetPassword = false;
                this.sendActivationEmail = !this.isActivated;
            }
        }

        get InvalidEmail(): boolean {

            return this.isEmailValid = this.username == null || this.username.trim() === '';
        }



        get invalidConfirmEmail(): boolean {

            var isInvalidConfirmEmail = this.confirmEmail == null || this.confirmEmail.trim() === '';
            if (!isInvalidConfirmEmail)
                isInvalidConfirmEmail = this.username.trim().toLowerCase() !== this.confirmEmail.trim().toLowerCase();

            return isInvalidConfirmEmail;
        }


        get InvalidEmails(): boolean {

            return this.isEmailValid || this.isConfirmEmailValid;
        }

        get isResetPasswordDisabled(): boolean {

            return this.sendActivationEmail || !this.isActivated || this.loanUserAccountId == 0
                || this.isEmailChanged || this.isSecurityQuestionChanged || this.isSecurityAnswerChanged;
        }

        get invalidSecurityAnswer(): boolean {
            return this.securityAnswer == null || this.securityAnswer.trim() === '';
        }

        get isModelValid(): boolean {
            return this.isOnlineUser ? !this.InvalidEmails && !this.invalidSecurityAnswer : !this.InvalidEmails;
        }

        isInRole = (role: string): boolean => {

            for (var i = 0; i < this.roles.length; i++) {
                if (this.roles[i].roleName === role)
                    return true;
            }

            return false;
        }

        hasPrivilege = (privilegeName: string): boolean => {
            var privilegeList = this.privileges.filter(item => item.name.toLowerCase().trim() == privilegeName.toLowerCase().trim());

            return privilegeList.length > 0;
        }

        get fullName(): string {
            var fullName = (this.firstName ? this.firstName.trim() : '') + ' ' + (this.middleName ? this.middleName.trim() + " " : '') + (this.lastName ? this.lastName.trim() : '');
            return fullName.trim() ? fullName : '';
        }

        //set IsCoBorrower(newIsCoborrower: boolean) {
        //    this.isCoBorrower = newIsCoborrower;
        //}

        //get IsCoBorrower(): boolean {
        //    return this.isCoBorrower;
        //}


        get FilterUsername(): string {

            if (!common.string.isNullOrWhiteSpace(this.username) && lib.startsWith('newprospect', this.username))
                return '';
            return this.username;
        }


    }

    export class PublicRecordViewModel extends srv.cls.PublicRecordViewModel implements IPayOffSectionItemViewModel {
        constructor(publicRecord?: srv.IPublicRecordViewModel, public getBorrowerFullName?: () => string) {
            super();
            this.initialize(publicRecord);
        }

        initialize = (publicRecord?: srv.IPublicRecordViewModel) => {
            if (publicRecord)
                common.objects.automap(this, publicRecord);

            if (this.companyData)
                this.companyData = new CompanyDataViewModel(this.companyData, this.getBorrowerFullName);
        }

        /**
        * @desc srv.IPayOffSectionItemViewModel members
        */
        set creditor(value: string) {
            this.companyData.companyName = value;
        }
        get creditor(): string {
            return this.companyData.companyName;
        }

        set balance(value: number) {
            this.amount = value;
        }
        get balance(): number {
            return this.amount;
        }

        set payoffCommentId(value: string) {
            this.publicRecordComment = value;
        }
        get payoffCommentId(): string {
            return this.publicRecordComment;
        }

        get isUserAdded(): boolean {
            return this.isUserEntry;
        }

        get isPublicRecord(): boolean {
            return true;
        }

        get isLiability(): boolean {
            return false;
        }

        get isRemoved(): boolean {
            return false;
        }
        //added a benign setter because angular.extend method will break when trying to map a property that has only a getter
        set isRemoved(value: boolean)
        { }


        get canEdit(): boolean {
            return true;
        }

        get isPayoffItem(): boolean {
            return false;
        }

        hidden: boolean = false;

        /**
        * @desc Includes public record into sum of total amount
        */
        includeInTotalAmount = (publicRecord: srv.IPublicRecordViewModel): void => {
            if (publicRecord.publicRecordComment === '4' && (publicRecord.type.indexOf('lien') > -1 || publicRecord.type.indexOf('judgment') > -1)) { //TODO: replace this with enum
                publicRecord.includeInTotal = true;
            }
            else {
                publicRecord.includeInTotal = false;
            }
        }
    }

    export class LookupItem extends srv.cls.LookupItem {
        constructor(text: string, value: string) {
            super();
            this.text = text;
            this.value = value;
        }

        public static fromLookupItem = (src: srv.ILookupItem): srv.ILookupItem => {
            var li = new LookupItem(src.text, src.value);

            li.selected = src.selected;
            li.disabled = src.disabled;
            li.contextFlags = src.contextFlags;

            return li;
        }
    }

    export class TitleInformationViewModel extends srv.cls.TitleInformationViewModel {

        constructor(titleInfo?: srv.ITitleInformationViewModel) {
            super();
            if (titleInfo)
                common.objects.automap(this, titleInfo);
            else {
                if (!this.titleHeldIn)
                    this.titleHeldIn = TitleHeldInType.InMyNamesAsIndividuals;  // set default to 'In my/our name(s) as individuals'
            }

            if (!this.mannerTitleHeld || this.mannerTitleHeld == "-1")
                //set default value of field - "To Be Decided in Escrow"
                this.mannerTitleHeld = "9";
        }
    }

    export class PricingAdjustmentsViewModel extends srv.cls.PricingAdjustmentsViewModel {

        defaultAdjustmentTypeId: number;
        isDisabled: boolean;
        disableFields: boolean;


        constructor(pricingAdjustments?: srv.IPricingAdjustmentsViewModel) {
            super();
            if (pricingAdjustments) {
                common.objects.automap(this, pricingAdjustments);

            }
        }

        get InvestorPrice(): number {
            return this.investorPrice;
        }

        set InvestorPrice(value: number) {
            this.investorPrice = (!this.isAmountValid(value)) ? 0 : value;
            this.calculateTotals(srv.pricingAdjustmentSectionType.investor);
        }

        get LoanOfficerPrice(): number {
            return this.loanOfficerPrice;
        }

        set LoanOfficerPrice(value: number) {
            this.loanOfficerPrice = (!this.isAmountValid(value)) ? 0 : value;
            this.calculateTotals(srv.pricingAdjustmentSectionType.loanOfficer);
        }

        get InvestorPurchasePrice(): number {
            return this.investorPurchasePrice;
        }

        set InvestorPurchasePrice(value: number) {
            this.investorPurchasePrice = (!this.isAmountValid(value)) ? 0 : value;
            this.calculateTotals(srv.pricingAdjustmentSectionType.investorBasePurchase);
        }

        get EnterprisePrice(): number {
            return this.enterprisePrice;
        }

        set EnterprisePrice(value: number) {
            this.enterprisePrice = value;
        }

        get FinalLoanOfficerPrice(): number {
            return this.finalLoanOfficerPrice;
        }

        set FinalLoanOfficerPrice(value: number) {
            this.finalLoanOfficerPrice = value;
        }

        get FinalLoanOfficerPriceByLo(): number {
            return this.finalLoanOfficerPriceByLo;
        }

        set FinalLoanOfficerPriceByLo(value: number) {
            this.finalLoanOfficerPriceByLo = value;
        }

        get FinalLoanOfficerPriceByDivision(): number {
            return this.finalLoanOfficerPriceByDivision;
        }

        set FinalLoanOfficerPriceByDivision(value: number) {
            this.finalLoanOfficerPriceByDivision = value;
        }

        get FinalLoanOfficerPriceByCompany(): number {
            return this.finalLoanOfficerPriceByCompany;
        }

        set FinalLoanOfficerPriceByCompany(value: number) {
            this.finalLoanOfficerPriceByCompany = value;
        }

        get FinalPurchasePrice(): number {
            return this.finalPurchasePrice;
        }

        set FinalPurchasePrice(value: number) {
            this.finalPurchasePrice = value;
        }

        get Adjustments() {
            if (this.adjustments != null && this.adjustments.length != 0) {
                var len = this.adjustments.length;
                for (var i = 0; i < len; i++) {
                    this.adjustments[i].value = this.isAmountValidOrMinus(this.adjustments[i].value) ? this.adjustments[i].value : 0;
                }
            }
            this.calculateTotals(srv.pricingAdjustmentSectionType.adjustment);
            return this.adjustments;
        }

        set Adjustments(adj) {
            if (adj != null && adj.length != 0) {
                var len = adj.length;
                for (var i = 0; i < len; i++) {
                    adj[i].value = this.isAmountValidOrMinus(adj[i].value) ? adj[i].value : 0;
                }
            }
            this.adjustments = adj;
            this.calculateTotals(srv.pricingAdjustmentSectionType.adjustment);
        }

        calculateTotals(secType: number) {

            if (secType == srv.pricingAdjustmentSectionType.adjustment) {
                this.calculateTotals(srv.pricingAdjustmentSectionType.investor);
                this.calculateTotals(srv.pricingAdjustmentSectionType.loanOfficer);
                this.calculateTotals(srv.pricingAdjustmentSectionType.investorBasePurchase);
            }


            var calcTotal = 0;
            var calcTotalByLo = 0;
            var calcTotalByDivision = 0;
            var calcTotalByCompany = 0;
            if (this.adjustments != null && this.adjustments.length != 0) {
                var len = this.adjustments.length;
                for (var i = 0; i < len; i++) {
                    if (this.adjustments[i].adjustmentSectionType == secType) {
                        if (!this.adjustments[i].isDeleted) {
                            if (this.isAmountValid(this.adjustments[i].value)) {
                                calcTotal += Number(this.adjustments[i].value);

                                if (secType == srv.pricingAdjustmentSectionType.loanOfficer) {
                                    if (this.adjustments[i].paidBy == srv.LoanPricingAdjustmentPaidByTypeEnum.LoanOfficer) {
                                        calcTotalByLo += (!this.isAmountValid(this.adjustments[i].value)) ? 0 : Number(this.adjustments[i].value);
                                    }
                                    if (this.adjustments[i].paidBy == srv.LoanPricingAdjustmentPaidByTypeEnum.Division) {
                                        calcTotalByDivision += (!this.isAmountValid(this.adjustments[i].value)) ? 0 : Number(this.adjustments[i].value);
                            }
                                    if (this.adjustments[i].paidBy == srv.LoanPricingAdjustmentPaidByTypeEnum.Company) {
                                        calcTotalByCompany += (!this.isAmountValid(this.adjustments[i].value)) ? 0 : Number(this.adjustments[i].value);
                        }
                    }
                }
            }
                    }
                }
            }
            if (secType == srv.pricingAdjustmentSectionType.investor) {
                calcTotal += (!this.isAmountValid(this.investorPrice)) ? 0 : Number(this.investorPrice);
                this.enterprisePrice = calcTotal;
                this.loanOfficerPrice = this.enterprisePrice;
            }
            if (secType == srv.pricingAdjustmentSectionType.loanOfficer) {
                calcTotal += (!this.isAmountValid(this.loanOfficerPrice)) ? 0 : Number(this.loanOfficerPrice);
                this.finalLoanOfficerPrice = calcTotal;
                this.finalLoanOfficerPriceByLo = calcTotalByLo;  
                this.finalLoanOfficerPriceByDivision = calcTotalByDivision; 
                this.finalLoanOfficerPriceByCompany = calcTotalByCompany;          
            }
            if (secType == srv.pricingAdjustmentSectionType.investorBasePurchase) {
                calcTotal += (!this.isAmountValid(this.investorPurchasePrice)) ? 0 : Number(this.investorPurchasePrice);
                this.finalPurchasePrice = calcTotal;
            }
        }


        isAmountValidOrMinus(amount): boolean {

            return this.isAmountValid(amount) || (amount.toString() == '-');
        }

        isAmountValid(amount): boolean {
            return amount != null && !isNaN(parseFloat(amount));
        }
    }

    export class AdjustmentsViewModel extends srv.cls.AdjustmentsViewModel {
        editMode: boolean;
        hoverClick: boolean;
        hoverEdit: boolean;
        description: string;
        calculateValue: number;
        totalLoanAmount: number;
        firstLoad: boolean = true;
        orderBy: number = 0;
        newAdjustment: boolean = false;
        hasSubType: boolean = false;
        hasPaidByType: boolean = false;
        adjustmentCounter: string;
        orderAdjustmentSet: boolean = false;
        sortingNotRequired: boolean = false;

        constructor(adjustment?: srv.IAdjustmentsViewModel) {
            super();
            if (adjustment) {
                common.objects.automap(this, adjustment);
            }
            else {
                this.value = 0;
                this.calculateValue = 0;
            }
        }
        get CalculateValue(): number {
            return this.calculateValue;
        }

        set CalculateValue(newValue: number) {
            this.value = ((!this.isAmountValid(newValue)) ? 0 : newValue) * 100 / this.totalLoanAmount;

            this.calculateValue = newValue;
        }

        isAmountValid(amount): boolean {
            return amount != null && !isNaN(parseFloat(amount));
        }
    }


    export class SellSideViewModel extends srv.cls.SellSideInformationViewModel {
        sellSideInvestorPurchasePrice: number;
        isDisabledSellSide: boolean;
    }

    export class LockingPricingLookupViewModel extends srv.cls.LockingPricingLookupViewModel {
        loPricePaidBy: srv.ILookupItem[];
    }

    export class PhoneViewModel extends srv.cls.PhoneViewModel {
        constructor(phoneType?: string) {
            super();
            if (phoneType) {
                if (phoneType == "preferred") {
                    this.type = "1";
                    this.isPrefrred = true;
                }
                else if (phoneType == "alternate") {
                    this.type = "2";
                    this.isPrefrred = false;
                }
            }
            else {
                if ((this.type == null || this.type == undefined || this.type == "") && this.isPrefrred) {
                    this.type = "1";
                }

                else if ((this.type == null || this.type == undefined || this.type == "") && !this.isPrefrred) {
                    this.type = "2";
                }
            }
        }
    }

    export class RealEstateViewModel extends srv.cls.RealEstateViewModel {
        constructor(realEstate?: srv.IRealEstateViewModel) {
            super();
            if (realEstate)
                common.objects.automap(this, realEstate);

            this.initialize();
        }

        private initialize() {
            this.addressForDropDown = [];
        }
    }
    export class AgentContactViewModel extends srv.cls.AgentContactViewModel {
        constructor(agentContact?: srv.IAgentContactViewModel) {
            super();
            if (agentContact) {
                common.objects.automap(this, agentContact);
            }
        }
        isEmailAddressNotValid: boolean;
    }

    export class SecureLinkAuthenticationViewModel extends srv.cls.SecureLinkAuthenticationViewModel {
        borrower: SecureLinkBorrowerViewModel;
        coBorrower: SecureLinkBorrowerViewModel;
        hasCoBorrower: boolean;
        isContinueWithoutLogin: boolean;
        isBorrowerContinueWithout: boolean;
        isCoBorrowerContinueWithout: boolean;
    }

    export class SecureLinkBorrowerViewModel extends srv.cls.SecureLinkBorrowerViewModel {
        showContinueWithoutLink: boolean;
        continueWithoutText: string;
    }

    export class DocumentsViewModel extends srv.cls.DocumentsViewModel {
        isInEditMode: boolean = false;
        isItemClicked: boolean = false;
        isDeleted: boolean = false;
        isUserEntry: boolean = false;
        isAdded: boolean = false;
        isCompleted: boolean = false;

        constructor(document?: srv.IDocumentsViewModel) {
            super();
            if (document) {
                common.objects.automap(this, document);
            }

        }

    }

    export class DocVaultDocumentViewModel extends srv.cls.DocVaultDocumentViewModel {

        shouldImport: boolean = false;

        constructor(docVaultDocument?: srv.IDocVaultDocumentViewModel) {
            super();
            if (docVaultDocument) {
                common.objects.automap(this, docVaultDocument);
            }

        }
    }


    export class MilestoneStatus implements srv.IMilestoneStatus {
        constructor() {        

        }

        setDefault = (isWholeSale: boolean, homebuyingType: srv.HomeBuyingType): srv.milestoneStatus => {
            //preApproval
            if (homebuyingType == srv.HomeBuyingType.GetPreApproved) {
                return srv.milestoneStatus.preApproved;
            }
            else {
                if (isWholeSale)
                    return srv.milestoneStatus.unsubmitted;
                else
                return srv.milestoneStatus.prospect;
            }
        }
     
        setStatus = (isWholeSale: boolean, allLoanAppsCompleted: boolean, sixPiecesAcquired: boolean, homeBuyingType: srv.HomeBuyingType): srv.milestoneStatus => {            
         
            if (sixPiecesAcquired) {
                if (allLoanAppsCompleted)
                    return srv.milestoneStatus.appCompleted;           
                else 
                    return srv.milestoneStatus.incomplete;
            }
            //six pieces flag is turned off, return milestone status to previous value
            else {
                return this.setDefault(isWholeSale, homeBuyingType);
            }
        }
    }

    export class ManageUserAccountsViewModel extends srv.cls.ManageUserAccountsViewModel {
        //moved from manageaccount.service.ts ctrl object
        public userAccount: srv.IUserAccountViewModel;
        public isJointAccount: boolean;
        public isSeparateAccount: boolean;
        public coBorrowerAccountOptionId: number;
        public isSecurityVisible: boolean;
        public sendVerification: boolean;
        public saveAccount: boolean;
        public securityQuestions: srv.IList<srv.ILookupItem>;
        public accountOptions: srv.IList<srv.ILookupItem>;
        public recentSubjectPropertyAddress: srv.IPropertyViewModel;
        public automaticallyOpen: boolean;     
        public originalUserAccountId: number;  
        public borrowerFirstName: string;
        public borrowerLastName: string;
        public coBorrowerFirstName: string;
        public coBorrowerLastName: string;
        public borrowerUsername: string;
        public borrowerUserAccountId: number;  
        public loanApplicationId: string;       
        
        //properties for verification of existing activated account
        public verifyBorrowerName: boolean;
        public verifyCoBorrowerName: boolean;
        public verifySubjectPropertyAddress: boolean;
        public verifySecurityQuestion: boolean;        
                
        constructor(manageUserAccount?: srv.IManageUserAccountViewModel) {
            super();
            if (manageUserAccount) {
                common.objects.automap(this, manageUserAccount);
            }

            this.verifyBorrowerName = false;
            this.verifyCoBorrowerName = false;
            this.verifySubjectPropertyAddress = false;
            this.verifySecurityQuestion = false;
        }

        get isEmailVisible(): boolean {
            return !(this.isJointAccount && this.userAccount.isCoBorrower && !this.isSeparateAccount) || this.coBorrowerAccountOptionId != srv.accountOption.JointWithBorrower;
        }
        get isConfirmEmailVisible(): boolean {
            return this.isEmailVisible;
        }

        get isJointAccountMessageVisible(): boolean {
            return this.isJointAccount && this.userAccount.isCoBorrower && !this.isSeparateAccount && this.coBorrowerAccountOptionId == srv.accountOption.JointWithBorrower;
        }

        get isOnlineUserVisible(): boolean {
            return this.isEmailVisible;
        }

        get isPasswordVisible(): boolean {
            return false;
        }

        get isQuestionAndAnswerVisible (): boolean {
            return this.isSecurityVisible || (this.userAccount.userAccountId == 0 && !(this.isJointAccount && this.userAccount.isCoBorrower)) ||
                (this.userAccount.isCoBorrower && this.isSeparateAccount &&
                ((this.userAccount.jointAccountId != 0 && this.userAccount.jointAccountId != null && this.userAccount.jointAccountId == this.borrowerUserAccountId) && this.userAccount.userAccountId != 0 ||
                    this.userAccount.userAccountId == 0)
                    )
         }

        get isResendActivationVisible(): boolean {
            return (this.userAccount.userAccountId != 0 && !this.userAccount.isCoBorrower || (this.userAccount.isCoBorrower && !this.isQuestionAndAnswerVisible && this.isSeparateAccount)) &&
                !this.userAccount.isActivated && !this.isSecurityVisible;
        }

        get isResendValidationVisible(): boolean {
            return this.userAccount.userAccountId != 0 && this.userAccount.isActivated && this.sendVerification;
        }

        get isActionButtonVisible(): boolean {
            return this.isEmailVisible;
        }

        get isVerifyAccountInformationVisible(): boolean {            
            return this.userAccount.isActivated && this.automaticallyOpen && this.isEmailVisible && this.userAccount.isOnlineUser;
        }

        get isVerifyBorrowerNameVisible(): boolean {
            return this.userAccount.username && this.userAccount.confirmEmail && this.userAccount.username.toLowerCase() == this.userAccount.confirmEmail.toLowerCase();
        }

        get isVerifyCoBorrowerNameVisible(): boolean {
            return this.verifyBorrowerName && !common.string.isNullOrWhiteSpace(this.coBorrowerFirstName) && !common.string.isNullOrWhiteSpace(this.coBorrowerLastName);
        }

        get isVerifySubjectPropertyAddressVisible(): boolean {
            return this.recentSubjectPropertyAddress.zipCode != null && ((this.isVerifyCoBorrowerNameVisible && this.verifyCoBorrowerName) || (!this.isVerifyCoBorrowerNameVisible && this.verifyBorrowerName));
        }

        get isVerifySecurityQuestionVisible(): boolean {
            return this.isVerifySubjectPropertyAddressVisible && this.verifySubjectPropertyAddress && !common.string.isNullOrWhiteSpace(this.userAccount.securityAnswer);
        }

        set VerifyBorrowerName(value: boolean) {
            if (!value)
                this.VerifyCoBorrowerName = value;

            this.verifyBorrowerName = value;
        }

        set VerifyCoBorrowerName(value: boolean) {
            if (!value)
                this.VerifySubjectPropertyAddress = value;

            this.verifyCoBorrowerName = value;
        }

        set VerifySubjectPropertyAddress(value: boolean) {
            if (!value)
                this.VerifySecurityQuestion = value;

            this.verifySubjectPropertyAddress = value;
        }
         
        set VerifySecurityQuestion(value: boolean) {
            this.verifySecurityQuestion = value;
        }


        get VerifyBorrowerName(): boolean {
            return this.verifyBorrowerName;
        }
        
        get VerifyCoBorrowerName(): boolean {
            return this.verifyCoBorrowerName;
        }

        get VerifySubjectPropertyAddress(): boolean {
            return this.verifySubjectPropertyAddress;
        }

        get VerifySecurityQuestion(): boolean {
            return this.verifySecurityQuestion;
        }

        get securityQuestion(): string {
            var self = this;
            return this.securityQuestions.filter(function (item) { return item.value == new String(self.userAccount.securityQuestion); })[0].text;
        }

        get isEmailDisabled(): boolean {
            return this.userAccount.userAccountId == this.originalUserAccountId && this.userAccount.isActivated;
        }

        get actionButtonText(): string {
            if (this.isVerifyAccountInformationVisible)
                return srv.manageUserAccountButtonActions.connectAccount;
            else
                return  (!this.userAccount.userAccountId || this.userAccount.userAccountId == 0) && !this.isJointAccount || (this.isJointAccount && this.userAccount.isCoBorrower) ? srv.manageUserAccountButtonActions.createAccount : srv.manageUserAccountButtonActions.updateAccount;
        }
    }
    export class DisclosureStatusDetailsViewModel extends srv.cls.DisclosureStatusDetailsViewModel {
        constructor(disclosureStatusDetailsViewModel?: srv.IDisclosureStatusDetailsViewModel) {
            super();
            if (disclosureStatusDetailsViewModel) {
                common.objects.automap(this, disclosureStatusDetailsViewModel);
            }
        }

        public disclosureStatusDetailsMessageBody: string;
    }

    export class FHACalculatorRequestViewModel extends srv.cls.FHACalculatorRequest {
        constructor(FHAScenarioViewModel?: srv.IFHAScenarioViewModel, allowableBorrowerPaidClosingCosts?: number, prepaidExpenses?: number, lenderCreditforClosingCostsAndPrepaids?: number, countyLoanLimit?: number, baseLoanAmount? : number, userAccountId?: number) {
            super();
            this.fhaScenario = FHAScenarioViewModel;
            this.allowableBorrowerPaidClosingCosts = allowableBorrowerPaidClosingCosts;
            this.prepaidExpenses = prepaidExpenses;
            this.lenderCreditforClosingCostsAndPrepaids = lenderCreditforClosingCostsAndPrepaids;
            this.countyLoanLimit = countyLoanLimit;
            this.baseLoanAmount = baseLoanAmount;

            this.userAccountId;
        }
    }

    export class VACalculatorRequestViewModel extends srv.cls.VACalculatorRequest {
        constructor(existingVALoanBalance?: number, eehiCosts?: number, veteranPaymentCash?: number, discountPoints?: number, originationFee?: number, vaFundingFee?: number, totalClosingCosts?: number) {
            super();
            this.existingVALoanBalance = existingVALoanBalance;
            this.eehiCosts = eehiCosts;
            this.veteranPaymentCash = veteranPaymentCash;
            this.discountPoints = discountPoints;
            this.originationFee = originationFee;
            this.vaFundingFee = vaFundingFee;
            this.totalClosingCosts = totalClosingCosts;
        }
    }

    export class LoanDateHistoryViewModel extends srv.cls.LoanDateHistoryViewModel {
        public userCurrentlyEditing: boolean;
        constructor(dateHistory?: srv.ILoanDateHistoryViewModel) {
            super();
            if (dateHistory) {
                common.objects.automap(this, dateHistory);
            }
        }
    }

    export class CopyLoanViewModel extends srv.cls.CopyLoanViewModel {

        constructor(_borrowerIds: srv.IList<string>, _copySubjectPropertyFlag: boolean, _creditReportIds: srv.IList<string>, _creditReportIncluded: srv.IList<string>,
            _loanApplicationIds: srv.IList<string>, _loanId: string, _loanNumber: string, _newClosingDate: string, _newLienPositon: number, _newLoanPurpose: number,
            _newMainApplicationId: string, _subjectPropertyId: string, _userAccountId: number) {
            super();
            this.borrowerIds = _borrowerIds;
            this.copySubjectPropertyFlag = _copySubjectPropertyFlag;
            this.creditReportIds = _creditReportIds;
            this.creditReportIncluded = _creditReportIncluded;
            this.loanApplicationIds = _loanApplicationIds;
            this.loanId = _loanId;
            this.loanNumber = _loanNumber;
            this.newClosingDate = _newClosingDate;
            this.newLienPosition = _newLienPositon;
            this.newLoanPurpose = _newLoanPurpose;
            this.newMainApplicationId = _newMainApplicationId;
            this.subjectPropertyId = _subjectPropertyId;
            this.userAccountId = _userAccountId;
        }
    }
   
}
