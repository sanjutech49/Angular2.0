module srv {
    export interface IPropertyViewModel {
        //downPaymentPercent?: number;
        monthlyHOAdues?: number;
        downPaymentPercent?: number;
        isPropertyOwned?: boolean;
        homeOwnerExpense?: srv.IPropertyExpenseViewModel;
        propertyTaxExpense?: srv.IPropertyExpenseViewModel;
        floodInsuranceExpense?: srv.IPropertyExpenseViewModel;
        hoaDuesExpense?: srv.IPropertyExpenseViewModel;
        mortgageInsuranceExpense?: srv.IPropertyExpenseViewModel;
        OccupancyType?: srv.PropertyUsageTypeEnum;
        //netRentalIncome?: srv.IIncomeInfoViewModel;
        getNetRentalIncome?(): srv.IIncomeInfoViewModel;
        OwnershipPercentage?: number;
        fullAddressString?: string;
        isAddressEqual?(property: IPropertyViewModel): boolean;
        isEmpty?(): boolean;
        clearAddress?(isSomething: boolean): boolean;
        isValid?(validateCounty?: boolean): boolean;
        areExpensesValid?(): boolean;
        isOwnershipValid?(): boolean;
        isOwnedPrimaryResidence?(): boolean;
        formatAddress?(): string;
    }
}

module cls {

    class PropertyViewModelBase extends srv.cls.PropertyViewModel {

        protected static propertyExpenseDefaults: srv.IPropertyExpenseViewModel[] = [

            { type: (srv.PropertyExpenseType.propertyTax).toString(), preferredPayPeriod: (srv.PropertyTaxPayPeriods.Annual).toString(), monthlyAmount: 0, impounded: true },
            { type: (srv.PropertyExpenseType.homeOwnerInsurance).toString(), preferredPayPeriod: (srv.PropertyTaxPayPeriods.Annual).toString(), monthlyAmount: 0, impounded: true },
            { type: (srv.PropertyExpenseType.mortgageInsurance).toString(), preferredPayPeriod: (srv.PropertyTaxPayPeriods.Monthly).toString(), monthlyAmount: 0, impounded: true },
            { type: (srv.PropertyExpenseType.hOADues).toString(), preferredPayPeriod: (srv.PropertyTaxPayPeriods.Monthly).toString(), monthlyAmount: 0, impounded: false },
            { type: (srv.PropertyExpenseType.floodInsurance).toString(), preferredPayPeriod: (srv.PropertyTaxPayPeriods.Monthly).toString(), monthlyAmount: 0, impounded: true },

        ];

        /**
        * @desc Shared method for finding active loan application from TransactionInfo.
        * Needed to be static, instead of base class method, because of incorrect TransactionInfo management. 
        */
        protected static findActiveLoanApplication = (ti: TransactionInfo) => {
            var active: srv.ILoanApplicationViewModel = ti.getLoan().active;
            if (!!active) {
                var loanApplicationId = active.loanApplicationId;
                var currentActive = lib.findSingle(ti.loanApplications, la => la.loanApplicationId == loanApplicationId);
            }
            return currentActive;
        }

        /**
        * @desc Setter for ownership percentage. 
        * Needed to be static, instead of base property, because of incorrect TransactionInfo management. 
        */
        protected static setOwnershipPercentage = (ownershipPercentage: number, isSubjectProperty: boolean, getTi: () => TransactionInfo) => {
            if (isSubjectProperty && !!getTi) {
                var ownershipPercentageTemp = ownershipPercentage;
                if (ownershipPercentage > getTi().getLoan().remainingOwnershipCalculation() || ownershipPercentage > 100) {
                    ownershipPercentageTemp = getTi().getLoan().remainingOwnershipCalculation();
                }

                var active = PropertyViewModelBase.findActiveLoanApplication(getTi());
                if (!!active) {
                    active.ownershipPercentage = ownershipPercentageTemp;
                }
            }

            return ownershipPercentage;
        }

        /**
        * @desc Getter for ownership percentage. 
        * Needed to be static, instead of base property, because of incorrect TransactionInfo management. 
        */
        protected static getOwnershipPercentage = (defaultOwnershipPercentage: number, isSubjectProperty: boolean, getTi: () => TransactionInfo) => {
            if (isSubjectProperty && getTi) {
                var active = PropertyViewModelBase.findActiveLoanApplication(getTi());
                if (!!active) {
                    return active.ownershipPercentage;
                }
            }
            else {
                return defaultOwnershipPercentage;
            }
        }

        constructor() {
            super();

            // Set default for properties created on client side (multi-1003).
            this.occupancyType = srv.PropertyUsageTypeEnum.PrimaryResidence;
        }

        get fullAddressString(): string {
            var fullAddress = '';
            if (this.isSubjectProperty) {
                fullAddress = fullAddress.concat("*");
            }
            fullAddress = fullAddress.concat(this.streetName ? this.streetName : "").concat(", ");
            if (this && this.unitNumber) {
                fullAddress += "#" + this.unitNumber + ", ";
            }
            fullAddress = fullAddress.concat(this.cityName ? this.cityName : "").
                concat(", ").concat(this.stateName ? this.stateName : "").
                concat(" ").concat(this.zipCode ? this.zipCode : '');

            return fullAddress;
        }

        formatAddress(): string {
            var fullAddress = '';
            fullAddress = fullAddress.concat(this.streetName ? this.streetName : "").concat(", ").concat(this.cityName ? this.cityName : "");
            return fullAddress
        }
        protected initializePropertyExpenses = () => {

            if (!this.propertyExpenses || this.propertyExpenses.length == 0) {

                this.propertyExpenses = [];

                lib.forEach(PropertyViewModel.propertyExpenseDefaults, pe => {
                    this.propertyExpenses.push(new cls.PropertyExpenseViewModel(pe.type, pe.preferredPayPeriod, pe.monthlyAmount, pe.impounded));
                });
            }
            else if (this.propertyExpenses.length < 5) { // this nasty code is a workaround for only getting two property expenses initialize server side for new prospects

                lib.forEach(PropertyViewModel.propertyExpenseDefaults, pe => {

                    var index = lib.findIndex(this.propertyExpenses, existingPE => pe.type == existingPE.type, -1);
                    if (index == -1) {
                        this.propertyExpenses.push(new cls.PropertyExpenseViewModel(pe.type, pe.preferredPayPeriod, pe.monthlyAmount, pe.impounded));
                    }
                    else {

                        var inputPE = this.propertyExpenses[index];

                        if (!inputPE.monthlyAmount || inputPE.monthlyAmount == 0) {
                            lib.replace(this.propertyExpenses, new cls.PropertyExpenseViewModel(pe.type, pe.preferredPayPeriod, pe.monthlyAmount, pe.impounded), pe => pe.type == inputPE.type);
                        }
                        else if (!(inputPE instanceof (cls.PropertyExpenseViewModel))) {
                            lib.replace(this.propertyExpenses, new cls.PropertyExpenseViewModel(inputPE.type, inputPE.preferredPayPeriod, inputPE.monthlyAmount, inputPE.impounded), pe => pe.type == inputPE.type);
                        }
                    }
                });
            }
        }
    }

    // LiablitySnapshot is used to save the state of a PropertyViewModel without external references
    export class PropertySnapshot extends PropertyViewModelBase {
        private ticb: ITransactionInfoCallback;
        private hasTransactionInfo = (): boolean => {
            return (!!this.ticb && !!this.ticb());
        }
        public getTransactionInfo = (): cls.TransactionInfo => {
            if (this.hasTransactionInfo())
                return this.ticb();
            else {
                throw new Error("TransactionInfo not available");
            }
        }
        public setTransactionInfo = (ti: cls.TransactionInfo): void => {
            this.ticb = () => ti;
        }

        monthlyHOAdues: number;
        downPaymentPercent: number;
        isPropertyOwned: boolean;
        homeOwnerExpense: srv.IPropertyExpenseViewModel;
        propertyTaxExpense: srv.IPropertyExpenseViewModel;
        floodInsuranceExpense: srv.IPropertyExpenseViewModel;
        hoaDuesExpense: srv.IPropertyExpenseViewModel;
        mortgageInsuranceExpense: srv.IPropertyExpenseViewModel;

        constructor(property?: PropertyViewModel, ti?: cls.TransactionInfo) {
            super();
            if (property) {
                lib.copyState(property, this);
                this.propertyExpenses = angular.copy(property.propertyExpenses);

                this.occupancyType = property.occupancyType;
                this.OccupancyType = property.OccupancyType;
            }
            else {
                this.propertyId = util.IdentityGenerator.nextGuid();
                this.initializePropertyExpenses();
            }
            if (!!ti) {
                this.setTransactionInfo(ti);
                if (property) {
                    ti.property.map(property);
                }
            }
        }

        get OccupancyType(): srv.PropertyUsageTypeEnum {
            return this.occupancyType;
        }

        set OccupancyType(occupancyType: srv.PropertyUsageTypeEnum) {
            this.occupancyType = occupancyType;
        }

        get OwnershipPercentage(): number {
            return PropertyViewModelBase.getOwnershipPercentage(this.ownershipPercentage, this.isSubjectProperty, this.getTransactionInfo);
        }

        set OwnershipPercentage(ownershipPercentage: number) {
            this.ownershipPercentage = PropertyViewModelBase.setOwnershipPercentage(ownershipPercentage, this.isSubjectProperty, this.getTransactionInfo);
        }
    }

    export class PropertyViewModel extends PropertyViewModelBase {
        private ticb: ITransactionInfoCallback;
        private hasTransactionInfo = (): boolean => {
            return (!!this.ticb && !!this.ticb());
        }
        public getTransactionInfo = (): cls.TransactionInfo => {
            if (this.hasTransactionInfo())
                return this.ticb();
            else {
                throw new Error("TransactionInfo not available");
            }
        }
        public setTransactionInfo = (ti: cls.TransactionInfo): void => {
            this.ticb = () => ti;
        }

        //
        private getHasTransactionalInfoIncome = (): boolean => {
            if (this.hasTransactionInfo() && !!this.getTransactionInfo().incomeInfo) {
                return true;
            }
            else {
                return false;
            }
        }
        private getTransactionInfoIncome = (): Map<srv.IIncomeInfoViewModel> => {
            if (this.getHasTransactionalInfoIncome()) {
                return this.getTransactionInfo().incomeInfo;
            }
            return new Map<srv.IIncomeInfoViewModel>();
        }
        getIncome = (): srv.IIncomeInfoViewModel => {
            if (this.getHasTransactionalInfoIncome()) {
                var item = lib.findFirst(this.getTransactionInfoIncome().getValues(), o => o.propertyId == this.propertyId);
                return item;
            }
            return null;
        }
        setIncome = (income: srv.IIncomeInfoViewModel) => {
            if (this.getHasTransactionalInfoIncome()) {
                income.propertyId = this.propertyId;
                this.getTransactionInfoIncome().map(income);
            }
        }
        //
        private getHasTransactionalInfoLiability = (): boolean => {
            if (this.hasTransactionInfo() && !!this.getTransactionInfo().liability) {
                return true;
            }
            else {
                return false;
            }
        }
        private getTransactionInfoLiability = (): Map<srv.ILiabilityViewModel> => {
            if (this.getHasTransactionalInfoLiability()) {
                return this.getTransactionInfo().liability;
            }
            return new Map<srv.ILiabilityViewModel>();
        }
        getLiability = (): srv.ILiabilityViewModel[]=> {
            if (this.getHasTransactionalInfoLiability()) {
                return lib.filter(this.getTransactionInfoLiability().getValues(), o => o.propertyId == this.propertyId);
            }
            return [];
        }
        setLiability = (liability: srv.ILiabilityViewModel[]) => {
            if (!!liability && this.getHasTransactionalInfoLiability()) {
                this.getTransactionInfoLiability().mapAll(liability);
            }
        }

        downPaymentPercent: number;
        needPreApproval: boolean;
        //fullAddress: string;
        isCurrentAddressSame: boolean;

        get fullAddress(): string {
            var fullAddress = (this.streetName ? this.streetName.trim() : '') + (this.cityName ? (' ' + this.cityName.trim()) : '') + " " + (this.stateName ? this.stateName.trim() : '') + " " + (this.zipCode ? this.zipCode.trim() : '');
            return fullAddress.trim();
        }

        getfullAddress = (): string => {
            return this.fullAddress;
        }

        get isPropertyOwned(): boolean {
            return this.ownership == srv.OwnershipStatusTypeEnum.Own;
        }
        set isPropertyOwned(isPropertyOwned: boolean) {
            /*Read Only*/
        }

        isAddressEqual = (property: srv.IPropertyViewModel) => {
            if (!property)
                return false;
            if (property.propertyId == this.propertyId)
                return true;

            // to support 2.0 only compare these fields (unit and county are only saved for subject property in 2.0)
            return this.cityName == property.cityName && this.stateName == property.stateName && this.streetName == property.streetName && this.zipCode == property.zipCode;
        }

        isOwnedPrimaryResidence = (): boolean => {

            return this.OccupancyType == srv.PropertyUsageTypeEnum.PrimaryResidence && this.isPropertyOwned;
        }

        // @todo-cl::PROPERTY-ADDRESS
        isEmpty = () => false;

        // @todo-cl::PROPERTY-ADDRESS
        clearAddress = (b: boolean) => {
            this.streetName = "";
            this.cityName = "";
            this.stateId = null;
            this.stateName = "";
            this.countyName = "";
            this.unitNumber = "";
            this.zipCode = "";
            this.timeAtAddressMonths = null;
            this.timeAtAddressYears = null;


            return true;
        }
        // non-subject property - address on the Credit tab is without county
        isValid = (validateCounty: boolean = true): boolean => {
            var isValid: boolean = true;

            if (validateCounty) {
                isValid = !common.string.isNullOrWhiteSpace(this.countyName);
            }

            if (isValid && !common.string.isNullOrWhiteSpace(this.cityName) &&
                !common.string.isNullOrWhiteSpace(this.stateName) && !common.string.isNullOrWhiteSpace(this.streetName) &&
                !common.string.isNullOrWhiteSpace(this.zipCode)) {
                return true;
            }
            return false;

        }
        // PROPERTY-EXPENSES
        areExpensesValid = (): boolean => {

            return (this.propertyTaxExpense.monthlyAmount && this.propertyTaxExpense.monthlyAmount != 0 &&
                (this.homeOwnerExpense.monthlyAmount || this.homeOwnerExpense.monthlyAmount == 0) &&
                ((this.propertyType == String(srv.PropertyTypeEnum.Condominium) || this.propertyType == String(srv.PropertyTypeEnum.PUD)) && this.monthlyHOAdues != 0 ||
                    this.propertyType != String(srv.PropertyTypeEnum.Condominium) && this.propertyType != String(srv.PropertyTypeEnum.PUD)));
        }

        isOwnershipValid = (): boolean => {

            if ((!common.string.isNullOrWhiteSpace(String(this.ownership)) && !(this.timeAtAddressMonths > 0 || this.timeAtAddressYears > 0)))
                return false;

            if (this.ownership == srv.OwnershipStatusTypeEnum.Rent)
                return this.monthlyRent > 0;

            return true;
        }

        constructor(ti?: TransactionInfo, property?: srv.IPropertyViewModel, homeBuyingType?: number) {

            super();

            if (!!property)
                lib.copyState(property, this);

            if (!this.propertyId || this.propertyId == lib.getEmptyGuid()) {
                this.propertyId = util.IdentityGenerator.nextGuid();
            }

            if (!!ti) {
                this.setTransactionInfo(ti);
                ti.property.map(this);
            }

            this.initialize(property, homeBuyingType);
        }

        private initialize = (property?: srv.IPropertyViewModel, homeBuyingType?: number) => {

            //set address street name to TBD when home buying type is GetPreapproved
            if (homeBuyingType && homeBuyingType == srv.HomeBuyingType.GetPreApproved && this.isSubjectProperty && this && this.streetName == "") {
                this.streetName = "TBD";
            }

            if (this.isSubjectProperty) {
                //Initialize default values for SubjectProperty
                if (!this.grossRentalIncome)
                    this.grossRentalIncome = 0;
                if (!this.vacancyPercentage)
                    this.vacancyPercentage = 75;
                if (!this.downPaymentSource)
                    this.downPaymentSource = 19;
            }

            if (!this.propertyId || this.propertyId == lib.getEmptyGuid())
                this.propertyId = util.IdentityGenerator.nextGuid();
            if (!angular.isDefined(this.isSubjectProperty))
                this.isSubjectProperty = false;

            this.initializePropertyExpenses();
        }

        get PropertyType(): string {
            return this.propertyType;
        }

        set PropertyType(pType: string) {
            if (pType == '1') {
                this.numberOfStories = 1;
            }
            else if (pType == '0' || pType == '6' || pType == '14') {
                this.numberOfUnits = 1;
            }

            this.propertyType = pType;
        }

        get NeedPreApproval(): boolean {
            return this.needPreApproval;
        }

        set NeedPreApproval(needPreApproval: boolean) {
            this.needPreApproval = needPreApproval;
        }

        get monthlyHOAdues(): number {
            return this.hoaDuesExpense.monthlyAmount;
        }

        set monthlyHOAdues(value: number) {
            this.hoaDuesExpense.monthlyAmount = value;
        }

        getHOADisplayAmount = () => this.getPropertyExpenseDisplayAmount(this.hoaDuesExpense);

        get propertyTaxExpense(): srv.IPropertyExpenseViewModel {
            return lib.findFirst(this.propertyExpenses, pe => +pe.type == srv.propertyExpensesType.Tax);
        }

        getPropertyTaxDisplayAmount = () => this.getPropertyExpenseDisplayAmount(this.propertyTaxExpense);

        get hoaDuesExpense(): srv.IPropertyExpenseViewModel {
            return lib.findFirst(this.propertyExpenses, pe => +pe.type == srv.propertyExpensesType.HOA);
        }

        get homeOwnerExpense(): srv.IPropertyExpenseViewModel {
            return lib.findFirst(this.propertyExpenses, pe => +pe.type == srv.propertyExpensesType.HOI);
        }

        getHomeOwnerDisplayAmount = () => this.getPropertyExpenseDisplayAmount(this.homeOwnerExpense);

        get mortgageInsuranceExpense(): srv.IPropertyExpenseViewModel {
            return lib.findFirst(this.propertyExpenses, pe => +pe.type == srv.propertyExpensesType.PMI);
        }

        getMortgageInsuranceDisplayAmount = () => this.getPropertyExpenseDisplayAmount(this.mortgageInsuranceExpense);

        get floodInsuranceExpense(): srv.IPropertyExpenseViewModel {
            return lib.findFirst(this.propertyExpenses, pe => +pe.type == srv.propertyExpensesType.FloodInsurance);
        }

        getFloodInsuranceDisplayAmount = () => this.getPropertyExpenseDisplayAmount(this.floodInsuranceExpense);

        private getPropertyExpenseDisplayAmount = (propertyExpense: srv.IPropertyExpenseViewModel) => {
            return +propertyExpense.preferredPayPeriod == srv.PreferredPaymentPeriod.Monthly ? propertyExpense.monthlyAmount : propertyExpense.monthlyAmount * 12;
        }

        getDownPaymentSourceText = (downPaymentSourceValue: number, downPaymentSourceList: srv.IList<srv.ILookupItem>): string => {
            for (var i = 0; i < downPaymentSourceList.length; i++) {
                if (downPaymentSourceList[i].value == downPaymentSourceValue.toString())
                    return downPaymentSourceList[i].text;
            }
        }


        //}

        //export class PropertyViewModel extends PropertyViewModelBase {


        //constructor(protected loanCallBack: cls.ILoanCallback, property?: srv.IPropertyViewModel, homeBuyingType?: number) {

        //    super(property, homeBuyingType, loanCallBack);

        //}

        ///**
        //* @desc Retrieves the net rental of the active loan application tied to the property.
        //*/
        public getNetRentalIncome = (): srv.IIncomeInfoViewModel => {
            if (!this.hasTransactionInfo())
                return null;
            if (this.OccupancyType != srv.PropertyUsageTypeEnum.InvestmentProperty)
                return null;

            if (this.getHasTransactionalInfoIncome()) {
                var nri = this.getNetRentalIncomeExisting(this.getActiveBorrower().borrowerId);
                if (nri == null) {
                    nri = this.createNetRentalIncome();
                }
                return nri;
            }
            else {
                return null;
            }
        }

        //Sum Property Expenses
        public sumPropertyExpenses = () => {
            var total = 0;
            if (this.propertyExpenses) {
                for (var k = 0; k < this.propertyExpenses.length; k++) {
                    total += this.roundToFourDecimalPlaces(this.propertyExpenses[k].monthlyAmount);
                }
            }
            return total;
        }
        
        //Round to Four Decimal Places
        private roundToFourDecimalPlaces = (value: number) => { 
            return value ? Math.round(value * 10000) / 10000 : 0;
        }

        /**
        * @desc Gets the currently active loan application instance.
        */
        private getActiveLoanApplication = (): srv.ILoanApplicationViewModel => {
            return this.getTransactionInfo().getLoan().active;
        }

        /**
        * @desc Gets the currently active borrower instance.
        */
        private getActiveBorrower = (): srv.IBorrowerViewModel => {
            return this.getTransactionInfo().getLoan().active.getBorrower();
        }

        /**
        * @desc Gets the existing net rental income instance for the specified borrower.
        */
        private getNetRentalIncomeExisting = (borrowerId: string): srv.IIncomeInfoViewModel => {
            if (!this.hasTransactionInfo())
                return null;
            var nri = lib.findSingle(this.getTransactionInfoIncome().getValues(), o => o.propertyId == this.propertyId && o.borrowerId == borrowerId);
            return nri;
        }

        private createNetRentalIncome = (): srv.IIncomeInfoViewModel => {
            if (!this.getHasTransactionalInfoIncome()) {
                return null;
            }

            //
            // @todo-cl: Eventually all create everywhere will be done server-side ...
            //

            // Create
            var nri: cls.IncomeInfoViewModel = new cls.IncomeInfoViewModel(this.getTransactionInfo());

            // IncomeViewModel defaults
            this.assignIncomeViewModelDefaultsForNewlyCreatedNetRentalIncome(nri);

            // PropertyViewModel defaults
            this.assignPropertyViewModelDefaultsForNewlyCreatedNetRentalIncome();

            return nri;
        }

        private assignIncomeViewModelDefaultsForNewlyCreatedNetRentalIncome = (nri: srv.IIncomeInfoViewModel): void => {
            // Find the right borrower
            var borrowerPredId: (b: srv.IBorrowerViewModel) => boolean;
            if (this.isSubjectProperty)
                borrowerPredId = (b: srv.IBorrowerViewModel) => !b.isCoBorrower && b.loanApplicationId == this.getActiveLoanApplication().loanApplicationId;
            else
                borrowerPredId = (b: srv.IBorrowerViewModel) => b.borrowerId == this.getActiveBorrower().borrowerId;
            var borrowerPred = (b: srv.IBorrowerViewModel) => borrowerPredId(b);
            var borrowerLoanApp = lib.findSingle(this.getTransactionInfo().borrower.getValues(), o => borrowerPred(o));

            // assignments
            nri.isNetRental = true;
            nri.incomeTypeId = srv.incomeTypeEnum.netRentalIncome;
            nri.manualChange = false;
            nri.isNegativeIncome = false;
            nri.propertyId = this.propertyId;
            nri.isSubjectProperty = this.isSubjectProperty;
            nri.isRemoved = false;
            nri.Amount = 0.00; // Will get overritten soon enough , but let's start off in a good state
            if (!!borrowerLoanApp) {
                nri.borrowerId = borrowerLoanApp.borrowerId;
            }
        }

        private assignPropertyViewModelDefaultsForNewlyCreatedNetRentalIncome = (): void => {
            //
            // @todo-cl: Eventually all defaults everywhere will be done server-side ...
            //

            if (angular.isUndefined(this.grossRentalIncome)) {
                this.grossRentalIncome = 0.00;
            }

            if (angular.isUndefined(this.OwnershipPercentage)) {
                this.OwnershipPercentage = 100;
            }

            if (angular.isUndefined(this.vacancyPercentage)) {
                this.vacancyPercentage = 75;
            }
        }


        // the occupancy type is at the loan application level, even if the subjectProperty is at the loan level 
        get OccupancyType(): srv.PropertyUsageTypeEnum {

            return this.isSubjectProperty ? this.getTransactionInfo().getLoan().active.occupancyType : this.occupancyType;
        }

        set OccupancyType(occupancyType: srv.PropertyUsageTypeEnum) {

            if (this.isSubjectProperty) {
                // during initializtion this may not be setup yet , but during that phase we can skip this anyhow
                var active = this.getTransactionInfo().getLoan().active;
                if (!!active) {
                    active.OccupancyType = occupancyType;
                }
            }
            else {
                this.occupancyType = occupancyType;
            }
            if (this.isSubjectProperty) {
                if (occupancyType == srv.PropertyUsageTypeEnum.InvestmentProperty && !this.ownershipPercentage)
                    this.OwnershipPercentage = 100;
                else if (occupancyType != srv.PropertyUsageTypeEnum.InvestmentProperty) {
                    this.OwnershipPercentage = 0;
                }
            }

            this.manageNetRentalIncome();
        }

        get OwnershipPercentage(): number {
            return PropertyViewModelBase.getOwnershipPercentage(this.ownershipPercentage, this.isSubjectProperty, this.getTransactionInfo);
        }

        set OwnershipPercentage(ownershipPercentage: number) {
            this.ownershipPercentage = PropertyViewModelBase.setOwnershipPercentage(ownershipPercentage, this.isSubjectProperty, this.getTransactionInfo);
        }

        private manageNetRentalIncome = (): void => {
            if (this.OccupancyType == srv.PropertyUsageTypeEnum.InvestmentProperty) {
                // accessing will create if not exists (lazy)
                var nri = this.getNetRentalIncome();
                // re-instate in case was deleted in same session
                nri.isRemoved = false;
            }
            else {
                var nri = this.getNetRentalIncomeExisting(this.getActiveBorrower().borrowerId);
                if (!!nri) {
                    //
                    // In case it is re-instated later , let's put things back to newly created state
                    //
                    
                    // IncomeViewModel defaults
                    this.assignIncomeViewModelDefaultsForNewlyCreatedNetRentalIncome(nri);

                    // PropertyViewModel defaults
                    this.assignPropertyViewModelDefaultsForNewlyCreatedNetRentalIncome();

                    // Remove it
                    var nriCls = <cls.IncomeInfoViewModel>nri;
                    nriCls.remove();
                }
            }
        }

    }

    export class PropertyExpenseViewModel extends srv.cls.PropertyExpenseViewModel {

        constructor(typeExpense: string, preferredPayPeriod: string, monthlyAmount: number, impound: boolean = false) {
            super();
            this.type = typeExpense;
            this.preferredPayPeriod = preferredPayPeriod;
            this.monthlyAmount = monthlyAmount;
            this.impounded = impound;
        }
    }

    //export class SendEmailReportViewModel extends srv.SendEmailReportViewModel {

    //    constructor(firstName: string, lastName: string, emailAddress: string, emailAddressRecipients: srv.ICollection<string>) {

    //        super();

    //        this.firstName = firstName;
    //        this.lastName = lastName;
    //        this.emailAddress = emailAddress;
    //        this.emailAddressRecipients = emailAddressRecipients;
    //    }
    //}

}
