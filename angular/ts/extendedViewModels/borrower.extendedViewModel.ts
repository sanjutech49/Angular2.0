/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../ts/extendedViewModels/employmentinfo.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/asset.extendedViewModel.ts" />


module srv {

    export interface IBorrowerViewModel {
        loanUserAccountId?: number;
        //dependentsError?: boolean;
        confirmSsn?: string;
        //wrongSsn?: boolean;
        invalidEmail?: boolean;
        // loanApplication?: ILoanApplicationViewModel;
        accountStatus?: string;
        getOtherIncome?(): IIncomeInfoViewModel[];
        getAutomobiles?(): IAssetViewModel[];
        getFinancials?(): IAssetViewModel[];
        getLifeInsurance?(): IAssetViewModel[];
        populateBorrowerId?(collection: any[]): any[];
        getMiscDebts?(): IMiscellaneousDebtViewModel[];
        getLiabilities?(): ILiabilityViewModel[];
        getLiability?(): ILiabilityViewModel[];
        getCollections?(): ILiabilityViewModel[];
        getPledgedAssets?(): ILiabilityViewModel[];
        getPublicRecords?(): IPublicRecordViewModel[];
        getAssets?(): srv.ICollection<srv.IAssetViewModel>;
        getIncome?(): any;
        incomeTypes?: srv.IList<srv.ILookupItem>;
        addAssets?(asset: srv.IAssetViewModel): void;
        downPayment?: number;
        incomeTotal?: number;
        baseIncomeTotal?: number;
        otherIncomeTotal?: number;
        subjectPropertyNetRentalIncome?: number;
        nonSubjectPropertiesNetRentalIncome?: number;
        otherIncomeTotalNetRentalExcluded?: number;
        positiveCashFlow?: number;
        addressReferenced?: boolean;
        //getPropertyInfoForNetRentalIncome? (): srv.IPropertyViewModel[];
        filterDownPaymentAsset?(downPayment?: number): srv.IAssetViewModel[];
        prepareForSubmit?(): void;
        getFullName?: () => string;
        hasValidName?: () => boolean;
        //initializeLiability? (liability?: srv.ILiabilityViewModel, borrowerFullName?: string): srv.ILiabilityViewModel;
        //refreshLiabilities? (liabilities?: srv.ILiabilityViewModel[]): srv.ILiabilityViewModel[];
        getLiabilitesPayment?(): number;
        getCombinedCurrentAndAdditionalEmployments?(): srv.ICollection<srv.IEmploymentInfoViewModel>;

        //
        // @todo: push down to generated interfaces
        loanId?: string;
        //loanApplicationId?: string;

       
        getCurrentAddress?(): srv.IPropertyViewModel;
        getMailingAddress?(): srv.IPropertyViewModel;
        getPreviousAddress?(): srv.IPropertyViewModel;
        getLiabilities?(): srv.ILiabilityViewModel[];
        addLiability?(liability: srv.ILiabilityViewModel): void;
        getOtherIncomes?(): srv.IIncomeInfoViewModel[];
        //Employment? srv.IEmploymentInfoViewModel[];
        getCurrentEmploymentInfo?(): srv.IEmploymentInfoViewModel;
        setCurrentEmploymentInfo?(employmentInfo: srv.IEmploymentInfoViewModel): void;
        getAdditionalEmploymentInfo?(): srv.IEmploymentInfoViewModel[];
        setAdditionalEmploymentInfo?(additionalEmployment: srv.IEmploymentInfoViewModel[]): void;
        replaceAdditionalEmploymentInfo?(additionalEmployment: srv.IEmploymentInfoViewModel[]): void;
        reoPropertyList?: srv.IPropertyViewModel[];
        prepareSave?(): void;
    }
}

module cls {

    export enum LiablitityTypeEnum {
        REO = 1,
        Liability = 2,
        Collection = 3,
        PublicRecord = 4,
        MiscExpense = 5,
    }

    export class BorrowerViewModel extends srv.cls.BorrowerViewModel {
        private defaultName:string = 'New Application';

        // @todo: Review , why would this have been necessary?
        //private _firstName: string;
        //get firstName(): string {
        //    return this._firstName;
        //}
        //set firstName(firstName: string) {
        //    this._firstName = firstName;
        //}


        // @todo-cl: fwk/lib-ize
        private ticb: ITransactionInfoCallback;
        private hasTransactionalInfo = (): boolean => {
            return (!!this.ticb && !!this.ticb());
        }
        public getTransactionalInfo = (): cls.TransactionInfo => {
            if (this.hasTransactionalInfo())
                return this.ticb();
            else
                return null;
        }
        public setTransactionalInfo = (ti: cls.TransactionInfo): void => {
            this.ticb = () => ti;
        }

        //
        private hasTransactionalInfoLiability = (): boolean => {
            if (this.hasTransactionalInfo() && !!this.getTransactionalInfo().liability) {
                return true;
            }
            else {
                return false;
            }
        }
        private getTransactionInfoLiability = (): Map<srv.ILiabilityViewModel> => {
            if (this.hasTransactionalInfoLiability()) {
                return this.getTransactionalInfo().liability;
            }
            return new Map<srv.ILiabilityViewModel>();
        }
        getLiabilities = (): srv.ILiabilityViewModel[]=> {
            if (this.hasTransactionalInfoLiability()) {
                return lib.filter(this.getTransactionInfoLiability().getValues(), o => !o.isRemoved && o.borrowerId == this.borrowerId);
            }
            return [];
        }
        addLiability = (liability: srv.ILiabilityViewModel) => {
            if (!!liability && this.hasTransactionalInfoLiability()) {
                liability.borrowerId = this.borrowerId;
                this.getLiabilities().push(liability);
            }
        }

        //
        private hasTransactionalInfoOtherIncomes = (): boolean => {
            if (this.hasTransactionalInfo() && !!this.getTransactionalInfo().incomeInfo) {
                return true;
            }
            else {
                return false;
            }
        }
        private getTransactionInfoOtherIncome = (): Map<srv.IIncomeInfoViewModel> => {
            if (this.hasTransactionalInfoOtherIncomes()) {
                return this.getTransactionalInfo().incomeInfo;
            }
            return new Map<srv.IIncomeInfoViewModel>([], (o: srv.IIncomeInfoViewModel) => o.incomeInfoId);
        }

        private getTransactionInfoAddress = (): Map<srv.IPropertyViewModel> => {

            return new Map<srv.IPropertyViewModel>([], (o: srv.IPropertyViewModel) => o.borrowerId);
        }

        getOtherIncomes = (): srv.IIncomeInfoViewModel[] => {
            if (this.hasTransactionalInfoOtherIncomes()) {
                var incomes = lib.filter(this.getTransactionInfoOtherIncome().getValues(), o => o.borrowerId == this.borrowerId
                    && !o.isRemoved
                    && (!o.employmentInfoId || o.employmentInfoId == lib.getEmptyGuid()));
                return incomes;
            }
            return [];
        }
        setOtherIncomes = (incomes: srv.IIncomeInfoViewModel[]) => {
            if (!!incomes && this.hasTransactionalInfoOtherIncomes()) {
                incomes.forEach(o => {
                    o.borrowerId = this.borrowerId;
                    o.employmentInfoId = null;
                });
                this.getTransactionInfoOtherIncome().mapAll(incomes);
            }
        }

        public addOtherIncome = (): srv.IIncomeInfoViewModel => {
            var otherIncomeNew = new cls.IncomeInfoViewModel(this.getTransactionalInfo());
            otherIncomeNew.isCurrentlyAdded = true;
            this.setOtherIncomes([otherIncomeNew]);
            return otherIncomeNew;
        }
        private removeIncomeInfoViewModel = (incomeInfoViewModelVm: srv.IIncomeInfoViewModel): boolean => {
            return incomeInfoViewModelVm.isRemoved = true;
        }
        private deleteIncomeInfoViewModel = (incomeInfoViewModelVm: srv.IIncomeInfoViewModel): boolean => {
            var incomeInfoExisting = this.getTransactionInfoOtherIncome().remove(incomeInfoViewModelVm);
            return (!!incomeInfoExisting);
        }
        removeOrDeleteIncomeInfoViewModel = (incomeInfoViewModelVm: srv.IIncomeInfoViewModel): boolean => {
            if (!incomeInfoViewModelVm || incomeInfoViewModelVm.isNetRental)
                return false;
            else if (incomeInfoViewModelVm.isCurrentlyAdded)
                return this.deleteIncomeInfoViewModel(incomeInfoViewModelVm);
            else
                return this.removeIncomeInfoViewModel(incomeInfoViewModelVm);
        }


        public addNewAddress = (): srv.IIncomeInfoViewModel => {
            var otherIncomeNew = new cls.IncomeInfoViewModel(this.getTransactionalInfo());
            otherIncomeNew.isCurrentlyAdded = true;
            this.setOtherIncomes([otherIncomeNew]);
            return otherIncomeNew;
        }


        //
        private hasTransactionalInfoEmployment = (): boolean => {
            if (this.hasTransactionalInfo() && !!this.getTransactionalInfo().employmentInfo) {
                return true;
            }
            else {
                return false;
            }
        }
        private getTransactionInfoEmployment = (): Map<srv.IEmploymentInfoViewModel> => {
            if (this.hasTransactionalInfoEmployment()) {
                return this.getTransactionalInfo().employmentInfo;
            }
            return new Map<srv.IEmploymentInfoViewModel>();
        }

        private _employmentInfoes: srv.IEmploymentInfoViewModel[];
        getEmploymentInfoes = (): srv.IEmploymentInfoViewModel[] => {
            if (this.hasTransactionalInfoEmployment()) {
                if (!this._employmentInfoes || !this._employmentInfoes.length) {
                    this._employmentInfoes = lib.filter(this.getTransactionInfoEmployment().getValues(), o => !o.isRemoved && o.borrowerId == this.borrowerId);
                }
                return this._employmentInfoes;
            }
            return [];
        }
        setEmploymentInfoes = (employmentInfoes: srv.IEmploymentInfoViewModel[]) => {
            if (!!employmentInfoes && this.hasTransactionalInfoEmployment()) {
                employmentInfoes.forEach(o => {
                    o.borrowerId = this.borrowerId;
                    if (!o.employmentInfoId || o.employmentInfoId == lib.getEmptyGuid()) {
                        o.employmentInfoId = util.IdentityGenerator.nextGuid();
                    }
                });
                this.getTransactionInfoEmployment().mapAll(employmentInfoes);
                this.invalidateEmployeeInfoes();
            }
        }
        private removeEmploymentInfo = (employmentInfoVm: srv.IEmploymentInfoViewModel): boolean => {
            employmentInfoVm.isRemoved = true;
            this.invalidateEmployeeInfoes();
            return true;
        }
        private deleteEmploymentInfo = (employmentInfoVm: srv.IEmploymentInfoViewModel): boolean => {
            var employmentInfoExisting = this.getTransactionInfoEmployment().remove(employmentInfoVm);
            this.invalidateEmployeeInfoes();
            return (!!employmentInfoExisting);
        }
        removeOrDeleteEmploymentInfo = (employmentInfoVm: srv.IEmploymentInfoViewModel): boolean => {
            if (!employmentInfoVm)
                return false;
            else if (employmentInfoVm.isAdded)
                return this.deleteEmploymentInfo(employmentInfoVm);
            else
                return this.removeEmploymentInfo(employmentInfoVm);
        }
        invalidateEmployeeInfoes = (): void => {
            this._employmentInfoes = null;
            this.getEmploymentInfoes();
        }
        //currentEmploymentInfo: IEmploymentInfoViewModel;
        getCurrentEmploymentInfo = (): srv.IEmploymentInfoViewModel => {
            var cei = lib.findFirst(this.getEmploymentInfoes(), o => !o.isAdditional);
            return cei;
        }
        setCurrentEmploymentInfo = (employmentInfo: srv.IEmploymentInfoViewModel) => {
            if (!employmentInfo || !this.hasTransactionalInfoEmployment())
                return;
            var employmentInfoOrig = this.getCurrentEmploymentInfo();
            if (!!employmentInfoOrig) {
                this.deleteEmploymentInfo(employmentInfoOrig);
            }
            employmentInfo.isAdditional = false;
            employmentInfo.isPresent = true;
            this.setEmploymentInfoes([employmentInfo]);
        }
        
        //additionalEmploymentInfo: ICollection<IEmploymentInfoViewModel>;
        getAdditionalEmploymentInfo = (): srv.ICollection<srv.IEmploymentInfoViewModel> => {
            return this.getEmploymentInfoes().filter(o => o.isAdditional);
        }
        setAdditionalEmploymentInfo = (employmentInfoes: srv.ICollection<srv.IEmploymentInfoViewModel>): void => {
            if (!employmentInfoes || !this.hasTransactionalInfoEmployment())
                return;
            employmentInfoes.forEach(o => o.isAdditional = true);
            this.setEmploymentInfoes(employmentInfoes);
        }
        // @todo-cl: Generalize => Lib
        replaceAdditionalEmploymentInfo = (employmentInfoes: srv.ICollection<srv.IEmploymentInfoViewModel>): void => {
            if (!employmentInfoes || !this.hasTransactionalInfoEmployment())
                return;

            // remove existing
            var existing = this.getAdditionalEmploymentInfo();
            existing.forEach(o => this.getTransactionInfoEmployment().remove(o));

            // map new
            this.setAdditionalEmploymentInfo(employmentInfoes);
        }

        /**
        * @desc Additional employment collection.
        */
        get AdditionalEmploymentInfoCollection(): srv.ICollection<srv.IEmploymentInfoViewModel> {
            return this.getAdditionalEmploymentInfo();
        }

        addAdditionalEmploymentInfo = (isPrevious?: boolean): srv.IEmploymentInfoViewModel => {
            var employmentInfo = new cls.AdditionalEmploymentInfoViewModel(this.getTransactionalInfo(), null, isPrevious);
            employmentInfo.isAdded = true;
            this.setEmploymentInfoes([employmentInfo]);
            return employmentInfo;
        }

        //
        private hasTransactionalInfoProperty = (): boolean => {
            if (this.hasTransactionalInfo() && !!this.getTransactionalInfo().property) {
                return true;
            }
            else {
                return false;
            }
        }
        private getTransactionInfoProperty = (): Map<srv.IPropertyViewModel> => {
            if (this.hasTransactionalInfoProperty()) {
                return this.getTransactionalInfo().property;
            }
            return new Map<srv.IPropertyViewModel>();
        }
        private getProperty = (propertyId: string, bindAction: (p: srv.IPropertyViewModel) => void): srv.IPropertyViewModel => {          
            if (this.hasTransactionalInfoProperty()) {
                var property = this.getTransactionInfoProperty().lookup(propertyId);
                if (!property) {
                    // create new one , will have new ID
                    property = new cls.PropertyViewModel(this.getTransactionalInfo());
                    // belongs to me
                    property.borrowerId = this.borrowerId;
                    // if creating on the fly , must not be subject property
                    property.isSubjectProperty = false;
                    property.isSameAsPropertyAddress = false;
                    if (!property.loanId || property.loanId == lib.getEmptyGuid()) {
                        property.loanId = this.loanApplicationId;
                    }                   
                    bindAction(property);

                    this.getTransactionInfoProperty().map(property);
                }              
                return property;
            }
            return null;
        }

        getCurrentAddress = (): srv.IPropertyViewModel => {
            return this.getProperty(this.currentAddressId, p => { p.addressTypeId = srv.AddressType.Present; this.currentAddressId = p.propertyId; p.isSameAsPrimaryBorrowerCurrentAddress = angular.isDefined(p.isSameAsPrimaryBorrowerCurrentAddress) && p.isSameAsPrimaryBorrowerCurrentAddress != null ? p.isSameAsPrimaryBorrowerCurrentAddress : true; });
        }



        setCurrentAddress = (currentAddress: srv.IPropertyViewModel) => {
            if (!currentAddress) {
                this.getTransactionInfoAddress().map(currentAddress);
            }
        }




        public saveCurrentAddress = (): srv.IPropertyViewModel => {

            var caNew = new cls.PropertyViewModel(this.getTransactionalInfo());

            this.setCurrentAddress(caNew);
            return caNew;


        }



        get currentAddrBind(): srv.IPropertyViewModel {
            return this.getCurrentAddress();
        }
        set currentAddrBind(addr: srv.IPropertyViewModel) {
            /*Do Nothing*/
        }

        getMailingAddress = (): srv.IPropertyViewModel => {
            return this.getProperty(this.mailingAddressId, p => { p.addressTypeId = srv.AddressType.Mailing; this.mailingAddressId = p.propertyId; });
        }
        get mailingAddrBind(): srv.IPropertyViewModel {
            return this.getMailingAddress();
        }
        set mailingAddrBind(addr: srv.IPropertyViewModel) {
            /*Do Nothing*/
        }

        getPreviousAddress = (): srv.IPropertyViewModel => {
            return this.getProperty(this.previousAddressId, p => { p.addressTypeId = srv.AddressType.Former; this.previousAddressId = p.propertyId; });
        }
        get previousAddrBind(): srv.IPropertyViewModel {
            return this.getPreviousAddress();
        }
        set previousAddrBind(addr: srv.IPropertyViewModel) {
            /*Do Nothing*/
        }

        //
        loanId: string;
        loanApplicationId: string;
        loanUserAccountId: number;
        emailFieldDisabled: boolean = false;
        invalidEmail: boolean;
        confirmSsn: string;
        dependentsError: boolean;
        addressReferenced: boolean;
        //wrongSsn: boolean;
        usCitizen: boolean;
        accountStatus: string;
        getOccupancyTypeOfSubjectProperty: () => number;
        reoPropertyList: srv.IPropertyViewModel[];

        constructor(ti?: TransactionInfo, borrower?: srv.IBorrowerViewModel) {
            super();

            if (!!borrower) {
                lib.copyState(borrower, this);

                this.addressReferenced = false;
                this.confirmSsn = this.ssn || null;
                this.ssn = this.ssn || null;

                // @todo-cl: How can this have had any effect?
                // borrower['userAccount'].isCoBorrower = borrower.isCoBorrower;
            }

            if (!this.borrowerId || this.borrowerId == lib.getEmptyGuid())
                this.borrowerId = util.IdentityGenerator.nextGuid();

            if (!!ti) {
                this.setTransactionalInfo(ti);
                ti.borrower.map(this);
            }

            this.initialize(borrower);
        }

        get DependentsError(): boolean {

            if ((!this.numberOfDependents && !this.agesOfDependents) || (this.numberOfDependents == 0 && !this.agesOfDependents)) {
                this.dependentsError = false;
            }

            else if ((this.numberOfDependents != 0 && !this.agesOfDependents) || (this.agesOfDependents != '' && !this.numberOfDependents)) {
                this.dependentsError = true;
            }

            else if (this.numberOfDependents && this.numberOfDependents != 0 && this.agesOfDependents && this.agesOfDependents != '') {
                var ages = this.agesOfDependents.split(",").length;
                this.dependentsError = this.numberOfDependents != ages ? true : false;
            }

            return this.dependentsError;
        }

        set DependentsError(newDependentsError: boolean) {
            this.dependentsError = newDependentsError;
        }

        // todo - why does this get called some many times on the personal page?
        get wrongSsn(): boolean {
            return this.ssn != this.confirmSsn && !(!this.ssn && !this.confirmSsn);
        }

        getFullName = (): string => {
            return this.fullName;
        }

        public getCombinedCurrentAndAdditionalEmployments = (): srv.ICollection<srv.IEmploymentInfoViewModel> => {
            var combinedIncomes: srv.ICollection<srv.IEmploymentInfoViewModel> = [];
            var employmentCurrent = this.getCurrentEmploymentInfo();
            if (!!employmentCurrent) {
                combinedIncomes.push(employmentCurrent);
            }
            combinedIncomes = combinedIncomes.concat(this.getAdditionalEmploymentInfo());
            return combinedIncomes;
        }

        //private initializeIncome = (iborrower?: srv.IBorrowerViewModel) => {
        //    // @todo-cl: Should these be same value?
        //    //if (iborrower)
        //    //    this.getCurrentEmploymentInfo().EmploymentTypeId = iborrower.employmentStatusId;

        //    var borrower = <cls.BorrowerViewModel>iborrower;

        //    //if (!borrower || (borrower && (common.string.isEmptyGuid(borrower.borrowerId) || common.string.isNullOrWhiteSpace(borrower.borrowerId)))) {
        //    //    this.isEmployedTwoYears = true;
        //    //    this.getCurrentEmploymentInfo().EmploymentTypeId = this.employmentStatusId = 1;
        //    //}
        //}

        private initialize = (borrower?: srv.IBorrowerViewModel) => {

            //this.initializeIncome(borrower);

            if (borrower) {

                var publicRecords = [];
                if (borrower.publicRecords && borrower.publicRecords.length > 0) {
                    for (var i = 0, j = (borrower.publicRecords ? borrower.publicRecords.length : 0); i < j; i++) {
                        var publicRecord = new cls.PublicRecordViewModel(borrower.publicRecords[i], this.getFullName);
                        publicRecords.push(publicRecord);
                    }
                    this.publicRecords = publicRecords;
                }

                var miscellaneousDebts = [];
                if (borrower.miscellaneousDebt && borrower.miscellaneousDebt.length > 0) {
                    for (var i = 0, j = (borrower.miscellaneousDebt ? borrower.miscellaneousDebt.length : 0); i < j; i++) {
                        var miscDebt = new cls.MiscellaneousDebtViewModel(borrower.miscellaneousDebt[i], null, null, this.getFullName());
                        miscellaneousDebts.push(miscDebt);
                    }
                    this.miscellaneousDebt = miscellaneousDebts;
                }

                //this.initializeAllLiabilities();
                // filter out liabilitites, type liability with unpaid balance more than zero
                // @todo: update when enum is created
                //this.liabilities = this.liabilities.filter(function (liability) {
                //    return (liability.typeId == 2) ? !liability.isRemoved && !liability.isPledged && parseFloat(String(liability.unpaidBalance)) > 0 : !liability.isRemoved;
                //});

                var assets = [];
                if (borrower.assets && borrower.assets.length > 0) {
                    for (var i = 0; i < borrower.assets.length; i++) {
                        var asset = new cls.AssetViewModel(borrower.assets[i]);
                        assets.push(asset);
                    }
                    this.assets = assets;
                }

                this.getCurrentAddress().addressTypeId = 1; //Present
                this.getMailingAddress().addressTypeId = 3; //Mailing
                this.getPreviousAddress().addressTypeId = 2; //Previous
            }


            // Moved up inside for sure to get address Id's
            //this.getCurrentAddress().addressTypeId = 1; //Present
            //this.getMailingAddress().addressTypeId = 3; //Mailing
            //this.getPreviousAddress().addressTypeId = 2; //Previous

            if (!this.userAccount)
                this.userAccount = new cls.UserAccountViewModel();
            else
                this.userAccount = new cls.UserAccountViewModel(this.userAccount);

            if (!this.assets)
                this.assets = [];

            if (!this.publicRecords)
                this.publicRecords = [];

            if (!this.miscellaneousDebt)
                this.miscellaneousDebt = [];

            if (!this.reoPropertyList)
                this.reoPropertyList = [];

            if (!this.ficoScore)
                this.ficoScore = new srv.cls.FicoScoreViewModel();

            if (!this.preferredPhone) {
                this.preferredPhone = new cls.PhoneViewModel("preferred");
            }
            else if (!this.preferredPhone.type) {
                this.preferredPhone.type = "1";
                this.preferredPhone.isPrefrred = true;
            }

            if (!this.alternatePhone) {
                this.alternatePhone = new cls.PhoneViewModel("alternate");
            }
            else if (!this.alternatePhone.type) {
                this.alternatePhone.type = "2";
                this.alternatePhone.isPrefrred = false;
            }

            if (!this.declarationsInfo)
                this.declarationsInfo = new srv.cls.DeclarationInfoViewModel();

            if (this.maritalStatus == null || this.maritalStatus == undefined)
                this.maritalStatus = -1;

            if (this.usCitizen == null || this.usCitizen == undefined) {
                if (this.permanentAlien == null || this.permanentAlien == undefined) {
                    this.usCitizen = true;
                    this.permanentAlien = false;
                }
                else {
                    if (this.permanentAlien == true)
                        this.usCitizen = false;
                    if (this.permanentAlien == false)
                        this.usCitizen = true;
                }
            }
            else if (this.usCitizen != null && this.usCitizen != undefined && (this.permanentAlien == null || this.permanentAlien == undefined)) {
                if (this.usCitizen == true)
                    this.permanentAlien = false;
                if (this.usCitizen == false)
                    this.permanentAlien = true;
            }

            //if (this.uSCitizen == null || this.uSCitizen == undefined) {
            //    if (this.permanentAlien == null || this.permanentAlien == undefined) {
            //        this.uSCitizen = true;
            //        this.permanentAlien = false;
            //    }
            //    else {
            //        if (this.permanentAlien == true)
            //            this.uSCitizen = false;
            //        if (this.permanentAlien == false)
            //            this.uSCitizen = true;
            //    }
            //}
            //else if (this.uSCitizen != null && this.uSCitizen != undefined && (this.permanentAlien == null || this.permanentAlien == undefined)) {
            //    if (this.uSCitizen == true)
            //        this.permanentAlien = false;
            //    if (this.uSCitizen == false)
            //        this.permanentAlien = true;
            //}

        }

        get fullName(): string {
            var fullName = (this.firstName ? this.firstName.trim() : '') + (this.middleName ? (' ' + this.middleName.trim()): '') + " " + (this.lastName ? this.lastName.trim() : '');
            return fullName.trim() ? fullName : this.defaultName;
        }
        hasValidName(): boolean {
            return this.fullName != this.defaultName;
        }
        get incomeTypes(): srv.IList<srv.ILookupItem> {
            // @todo: Rename to 'other'
            return LoanViewModel.getLookups().incomeTypesOther.filter(i => i.value != "16");
        }

        /**
        * @desc Filters Down payment asset and if not exists adds one using provided downPayment amount. 
        */
        filterDownPaymentAsset = (downPayment?: number): srv.IAssetViewModel[]=> {
            var downPaymentAssets = this.getAssetsWithDownPayment();
            
            //If there are no Down payment assets, add new down payment asset.
            if (downPaymentAssets.length === 0) {
                var downPaymentAsset = new cls.DownPaymentAssetViewModel();
                downPaymentAsset.monthlyAmount = downPayment;
                this.addAssets(downPaymentAsset);
                downPaymentAssets = this.getAssetsWithDownPayment();
            }

            return downPaymentAssets;
        }

        private getAssetsWithDownPayment = (): srv.IAssetViewModel[] => {
            return lib.filter(this.getAssets(), a => a.isDownPayment);
        }

        /**
        * @desc Maps self employed income amount to base employment income amount, if self employed income exists.
        */
        private handleSelfEmployedIncome = (incomes: srv.IIncomeInfoViewModel[]): srv.IIncomeInfoViewModel[]=> {

            var selfEmployedIncomes = this.filterIncomeByType(incomes, 16); // SelfEmployedIncome = 16
            if (selfEmployedIncomes && selfEmployedIncomes.length > 0) {
                var selfEmployedIncome = selfEmployedIncomes[0];
                var index = common.indexOfItem(selfEmployedIncome, incomes);

                var baseEmploymentIncomes = this.filterIncomeByType(incomes, 0); // BaseEmploymentIncome = 0
                if (baseEmploymentIncomes && baseEmploymentIncomes.length > 0) {
                    var baseEmploymentIncome = baseEmploymentIncomes[0];

                    baseEmploymentIncome.amount = selfEmployedIncome.amount;
                    baseEmploymentIncome.calculatedMonthlyAmount = selfEmployedIncome.calculatedMonthlyAmount;
                    baseEmploymentIncome.canProvideDocumentation = true;
                    baseEmploymentIncome.preferredPaymentPeriodId = selfEmployedIncome.preferredPaymentPeriodId;

                    common.deleteItem(index, incomes);
                }

                return incomes;
            }
        }
     

        get baseIncomeTotal(): number {
            var total: number = 0;

            if (this.getCurrentEmploymentInfo() && angular.isDefined(this.getCurrentEmploymentInfo().EmploymentTypeId)) {

                // Calculate current income if type is not Retired or Other/Unemployed.
                if (!(this.getCurrentEmploymentInfo().EmploymentTypeId == 3 || this.getCurrentEmploymentInfo().EmploymentTypeId == 4))
                    total += this.calculateCurrentIncomeTotal();

                // Add additional income.
                total += this.calculateAdditionalIncomeTotal();
            }

            return total;
        }

        /**
        * @desc Calculates the total for the provided income info.
        */
        private calculateIncomeTotal = (incomeInformationVm: srv.IIncomeInfoViewModel[], performCalculation: boolean): number => {
            var total: number = 0;

            if (incomeInformationVm)
                for (var i = 0; i < incomeInformationVm.length; i++) {
                    var income = incomeInformationVm[i];
                    if (!income.isRemoved && performCalculation) {
                        var amount = income.amount;
                        if (income.preferredPaymentPeriodId == 2 /*enums.preferredPaymentPeriods.annual*/)
                            amount /= 12;

                        total += parseFloat(String(amount));
                    }
                }

            return total;
        }

        /**
        * @desc Calculates the total for the current income info.
        */
        private calculateCurrentIncomeTotal = (): number => {
            var total: number = 0;
            if (this.getCurrentEmploymentInfo())
                total += this.calculateIncomeTotal(this.getCurrentEmploymentInfo().getIncomeInformation(), this.getCurrentEmploymentInfo().EmploymentStatusId != 2);

            return total;
        }

        /**
        * @desc Calculates the total for additional income info.
        */
        private calculateAdditionalIncomeTotal = (): number => {
            var total: number = 0;
            if (this.getAdditionalEmploymentInfo()) {
                for (var i = 0; i < this.getAdditionalEmploymentInfo().length; i++) {
                    var employmentInfo = this.getAdditionalEmploymentInfo()[i];
                    if (!employmentInfo.isRemoved)
                        total += this.calculateIncomeTotal(employmentInfo.getIncomeInformation(), employmentInfo.EmploymentStatusId != 2);
                }
            }
            return total;
        }

        /**
        * @desc Add assets row.
        */
        addAssets = (asset: srv.IAssetViewModel): void => {
            asset.borrowerFullName = this.fullName;
            // @todo: review
            if (asset.accountNumber == null || asset.accountNumber.trim().length === 0) {
                asset.accountNumber = "";
            }
            this.assets.push(asset);
        }

        /**
        * @desc Delete assets row.
        */
        deleteAssets = (obj): void => {
            var itemPosition: number = common.indexOfItem(obj, this.assets);
            common.deleteItem(itemPosition, this.assets);
        }

        ///**
        //* @desc Adds liability into collection
        //*/
        //addLiability = (liability: srv.ILiabilityViewModel): void => {
        //    liability.borrowerFullName = this.fullName;
        //    this.Liabilities.push(liability);
        //}

        addMiscDebts = (miscDebt: srv.IMiscellaneousDebtViewModel): void => {
            this.miscellaneousDebt.push(miscDebt);
        }

        removeMiscDebts = (miscDept: srv.IMiscellaneousDebtViewModel): void => {
            var itemPostion: number = this.miscellaneousDebt.indexOf(miscDept);
            if (itemPostion >= 0)
                this.miscellaneousDebt[itemPostion].isRemoved = true;
        }

        /**
        * @desc Gets assets collection.
        */
        getAssets = (): srv.ICollection<srv.IAssetViewModel> => {
            this.populateBorrowerId(this.assets);

            return this.assets;
        }

        get isTotalEmploymentTwoYears() {
            var years = 0;
            if (!this.getCurrentEmploymentInfo())
                return (this.isEmployedTwoYears = false);
            else if (this.getCurrentEmploymentInfo().employmentStartDate == null)
                return;
            // Check if current employment is more than or equal to two years.
            years = this.getTotalEmploymentYears(this.getCurrentEmploymentInfo());
            this.getCurrentEmploymentInfo().yearsOnThisJob = parseInt(String(years));
            if (years >= 2)
                return (this.isEmployedTwoYears = true);

            // Check if any additional employment's start date sums up to two years up to the current employment's end date.
            if (this.getAdditionalEmploymentInfo() && this.getAdditionalEmploymentInfo().length > 0)
                for (var i = 0; i < this.getAdditionalEmploymentInfo().length; i++) {
                    var additionalEmploymentInfo = this.getAdditionalEmploymentInfo()[i];
                    if (!additionalEmploymentInfo.isRemoved) {
                        years = this.getTotalEmploymentYears(additionalEmploymentInfo);
                        additionalEmploymentInfo.yearsOnThisJob = parseInt(String(years));
                        if (years >= 2)
                            return (this.isEmployedTwoYears = true);
                    }
                }

            // Not employed for more than or equal to two years.
            return (this.isEmployedTwoYears = false);
        }

        private getTotalEmploymentYears = (employmentStart: srv.IEmploymentInfoViewModel): number => {
            var totalYears = 0;
            if (this.areEmploymentDatesValid(employmentStart))
                totalYears = moment.duration({ from: employmentStart.employmentStartDate, to: this.getCurrentEmploymentInfo().employmentEndDate }).asYears();

            return totalYears;
        }

        areEmploymentDatesValid = (employmentInfo: srv.IEmploymentInfoViewModel): boolean => {
            if (!employmentInfo || employmentInfo.employmentStartDate == null || employmentInfo.employmentEndDate == null)
                return false;

            var empInfoStartDate = moment(employmentInfo.employmentStartDate);
            var empInfoEndDate = moment(employmentInfo.employmentEndDate);
            var currentEmpInfoEndDate = moment(this.getCurrentEmploymentInfo().employmentEndDate);

            if (!empInfoStartDate.isValid() || !empInfoEndDate.isValid() || !currentEmpInfoEndDate.isValid())
                return false;

            var currentTime = moment();

            var isStartDateAfterCurrent = empInfoStartDate.isAfter(currentTime);
            var isStartDateAfterEndDate = empInfoStartDate.isAfter(empInfoEndDate);
            var isEndDateAfterCurrent = empInfoEndDate.isAfter(currentTime);

            if (isStartDateAfterCurrent || isEndDateAfterCurrent || isStartDateAfterEndDate)
                return false;

            return true;
        }

        ///**
        //* @desc Extends Collection class with liabilities from borrower
        //*/
        //getLiabilites = (): srv.ICollection<srv.ILiabilityViewModel> => {
        //    return this.Liabilities;
        //}

        //miscellaneousDebt.TypeId = 1;
        //liabilityInfo.TypeId = 2;
        //collection.TypeId = 3;

        /**
        * @desc Gets misc debts from liabilities
        */
        getMiscDebts = (): srv.IMiscellaneousDebtViewModel[]=> {
            return this.miscellaneousDebt;
        }

        /**
        * @desc Gets collections from liabilities
        */
        getCollections = (): srv.ILiabilityViewModel[]=> {
            return this.filterByLiabilityType(3);//TODO: Change it with enum(s)
        }

        /**
        * @desc Gets liabilities
        */
        getLiability = (): srv.ILiabilityViewModel[]=> {
            return this.filterByLiabilityType(2);//TODO: Change it with enum(s)
        }

        //refreshLiabilities = (liabilities: srv.ILiabilityViewModel[]): srv.ILiabilityViewModel[]=> {
        //    var liabilitiesWithProperty = [];
        //    if (liabilities)
        //        for (var i = 0, j = (liabilities ? liabilities.length : 0); i < j; i++) {
        //            var liability = this.initializeLiability(liabilities[i], this.fullName);
        //            if (liability.isPledged) {
        //                if (liability.property && liability.property.isSubjectProperty) {
        //                    angular.forEach(this.reoPropertyList, function (property) {
        //                        if (property.isSubjectProperty) {
        //                            if (!(property instanceof cls.PropertyViewModel))
        //                                property = new cls.PropertyViewModel(property);

        //                            cls.AdjustedNetRentalIncomeInfoViewModel.initializeProperty(property);

        //                            liability.property = property;
        //                        }
        //                    })
        //                }
        //            }
        //            liabilitiesWithProperty.push(liability);
        //        }
        //    return liabilitiesWithProperty;
        //}

        /**
        * @desc Gets pledged assets from liabilitis
        */
        getPledgedAssets = (): srv.ILiabilityViewModel[]=> {
            return this.getLiabilities().filter((liability: srv.ILiabilityViewModel) => {
                return liability.isPledged;
            });
        }


        /**
        * @desc Gets military incomes.
        */
        getMilitaryIncome = (): srv.IIncomeInfoViewModel[]=> {
            return this.filterIncomeByType(this.getOtherIncomes(), 1);
        }

        /**
        * @desc Gets public records
        */
        getPublicRecords = (): srv.IPublicRecordViewModel[]=> {
            return this.publicRecords;
        }

        /**
        * @desc Gets regular incomes.
        */
        getRegularIncome = (): srv.IIncomeInfoViewModel[]=> {
            return this.filterIncomeByType(this.getOtherIncomes(), 2);
        }   

        /**
        * @desc Gets other incomes.
        */
        getOtherIncome = (): srv.IIncomeInfoViewModel[]=> {
            return this.getOtherIncomes().filter((income: srv.IIncomeInfoViewModel) => {
                return (income.canProvideDocumentation == null || income.canProvideDocumentation == true) && (common.string.isNullOrWhiteSpace(income.employmentInfoId) || common.string.isEmptyGuid(income.employmentInfoId));
            });
        }

        //getPropertyInfoForNetRentalIncome = (): srv.IPropertyViewModel[]=> {
        //    var properties: Array<srv.IPropertyViewModel> = [];

        //    if (this.Liabilities)
        //        for (var i = 0; i < this.Liabilities.length; i++) {
        //            var liability = this.Liabilities[i];
        //            if (liability.property) {
        //                if (properties.filter(p => p.propertyId == liability.property.propertyId).length == 0)
        //                    properties.push(liability.property);
        //            }
        //        }

        //    return this.filterPropertiesByType(properties, srv.PropertyUsageTypeEnum.InvestmentProperty);
        //}

        /**
        * @desc Gets automobiles from assets.
        */
        getAutomobiles = (): srv.IAssetViewModel[]=> {
            return this.filterByAssetsType([15], false);
        }
        
        /**
        * @desc Gets financials from assets.
        */
        getFinancials = (): srv.IAssetViewModel[]=> {
            return this.filterByAssetsType([13, 15], true);
        }

        /**
        * @desc Gets life insurance from assets.
        */
        getLifeInsurance = (): srv.IAssetViewModel[]=> {
            return this.filterByAssetsType([13], false);
        }

        /**
        * @desc Adds borrower id to any provided collection
        */
        populateBorrowerId = (collection: any[]): any[]=> {
            for (var i in collection) {
                collection[i].borrowerId = this.borrowerId;
                collection[i].isCoBorrower = this.isCoBorrower;
            }

            return collection;
        }

        private buildNetRentalIncome = (property: srv.IPropertyViewModel, isSubjectProperty: boolean = false) => {
            var netRentalIncome: srv.IIncomeInfoViewModel;

            netRentalIncome.isSubjectProperty = isSubjectProperty;
            return netRentalIncome;
        }

        public filterByLiabilityType = (liabilityType: number): srv.ILiabilityViewModel[]=> {
            return this.getLiabilities().filter((liability: srv.ILiabilityViewModel) => {
                liability.companyData.companyName = (liability.typeId == 3 || liability.typeId == 2) && (liability.companyData.companyName == "" || !liability.companyData.companyName) && !liability.isNewRow ? "Not specified" : liability.companyData.companyName;
                return liability.typeId == liabilityType && !liability.isRemoved && !liability.isPledged;
            });
        }

        private filterIncomeByType = (incomeCollection: srv.IIncomeInfoViewModel[], incomeType: number): srv.IIncomeInfoViewModel[]=> {
            if (incomeCollection && incomeCollection.length > 0)
                return incomeCollection.filter((income: srv.IIncomeInfoViewModel) => {
                    // TODO: Implement business logic to find all enum values that are in the same enum category. 
                    // ref: MML.Contracts.IncomeTypeCategory,  MML.Web.LoanCenter.Services.Helpers.DataHelper.GetDefaultIncomeInfoList
                    return income.incomeTypeId == incomeType;
                });

            return [];
        }

        private filterPropertiesByType = (propertyCollection: srv.IPropertyViewModel[], propertyType: srv.PropertyUsageTypeEnum): srv.IPropertyViewModel[]=> {
            if (propertyCollection && propertyCollection.length > 0)
                return propertyCollection.filter((property: srv.IPropertyViewModel) => {
                    return property.occupancyType == propertyType;
                });

            return [];
        }

        private filterByAssetsType = (assetsType: number[], financials: boolean): srv.IAssetViewModel[]=> {

            if (this.assets.length === 0) return this.assets;

            return this.assets.filter((asset: srv.IAssetViewModel) => {

                if (!asset.borrowerFullName) asset.borrowerFullName = asset.jointAccount ? 'JointAccount' : this.fullName;

                // asset.assetType !== undefined to make sure that assetTyoe 0 will be added
                if (financials) {
                    return (asset.assetType !== undefined &&
                        assetsType[0] !== asset.assetType &&
                        assetsType[1] !== asset.assetType &&
                        asset.assetType !== -1 && // down payment indicator
                        !asset.isDownPayment &&
                        !asset.isRemoved)
                }

                return (asset.assetType !== undefined && assetsType[0] === asset.assetType && !asset.isDownPayment && !asset.isRemoved)

            });
        }

        /**
        * @desc Prepares the borrower for the save.
        */
        public prepareSave = (): void => {
            this.getCurrentAddress();
            this.getMailingAddress();
            this.getPreviousAddress();
        }

        public prepareForSubmit = (): void => {
            this.getCurrentEmploymentInfo().prepareForSubmit();
        }

        public getLiabilitesPayment = (): number => {
            var total = 0;
            angular.forEach(this.getLiability(), function (liability) {
                if (liability.includeInDTI && !liability.isRemoved && liability.minPayment) {
                    var amount = parseFloat(String(liability.minPayment));
                    if (!amount || isNaN(amount))
                        amount = 0;
                    total += amount;
                }
            });
            angular.forEach(this.getPledgedAssets(), function (pledgedAsset) {
                if ((pledgedAsset.getProperty() && pledgedAsset.getProperty().occupancyType == srv.PropertyUsageTypeEnum.SecondVacationHome) && !pledgedAsset.isRemoved && pledgedAsset.totalPaymentDisplayValue) {
                    var amount = parseFloat(String(pledgedAsset.totalPaymentDisplayValue));
                    if (!amount || isNaN(amount))
                        amount = 0;
                    total += amount;
                }
            });
            return total;
        }
    }
}

