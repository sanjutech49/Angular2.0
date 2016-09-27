/// <reference path="../generated/viewModels.ts" />
/// <reference path="../generated/viewModelClasses.ts" />
/// <reference path="genericTypes.ts" />
/// <reference path="../../ts/extendedViewModels/incomeInfo.extendedViewModel.ts" />

module srv {
    export interface IEmploymentInfoViewModel {
        prepareForSubmit? (): void;
        EmploymentStatusId?: number;
        EmploymentTypeId?: number;
        isAdded?: boolean;
        incomeInfoByTypeId? (typeId: number): any;
        isCompleted? (): boolean;
        getIncomeInformation? (): srv.IIncomeInfoViewModel[];
        setIncomeInformation? (incomeInformationVm: srv.IIncomeInfoViewModel[]): void;
    }
}

module cls {
    export class EmploymentInfoViewModelFactory {
        public static create = (dst: TransactionInfo, p: srv.IEmploymentInfoViewModel): srv.IEmploymentInfoViewModel => {
            if (!p.isAdditional)
                return new CurrentEmploymentInfoViewModel(dst, p);

            return new AdditionalEmploymentInfoViewModel(dst, p);
        }
    }

    export class EmploymentInfoViewModel extends srv.cls.EmploymentInfoViewModel {
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

        private hasTransactionalInfoIncomes = (): boolean => {
            if (this.hasTransactionInfo() && !!this.getTransactionInfo().incomeInfo) {
                return true;
            }
            else {
                return false;
            }
        }
        private getTransactionInfoIncomes = (): Map<srv.IIncomeInfoViewModel> => {
            if (this.hasTransactionalInfoIncomes()) {
                return this.getTransactionInfo().incomeInfo;
            }
            return new Map<srv.IIncomeInfoViewModel>();
        }

        private _incomeMatrix: srv.IIncomeInfoViewModel[];

        getIncomeInformation = (): srv.IIncomeInfoViewModel[]=> {
            if (this.hasTransactionalInfoIncomes()) {

                //
                //return lib.filter(this.getTransactionInfoIncomes().getValues(), o => o.employmentInfoId == this.employmentInfoId);

                //
                if (!this._incomeMatrix) {
                    var incomeMatrix = lib.filter(this.getTransactionInfoIncomes().getValues(), o => o.employmentInfoId == this.employmentInfoId);
                    incomeMatrix = this.buildIncomeInformation(incomeMatrix);
                    for (var i = 0; i < incomeMatrix.length; i++) {
                        incomeMatrix[i] = new cls.IncomeInfoViewModel(this.getTransactionInfo(), incomeMatrix[i]);
                    }
                    this.setIncomeInformation(incomeMatrix);
                    this._incomeMatrix = incomeMatrix;
                }
                return this._incomeMatrix;
            }
            return [];
        }
        setIncomeInformation = (incomes: srv.IIncomeInfoViewModel[]) => {
            if (!!incomes && this.hasTransactionalInfoIncomes()) {
                incomes.forEach(o => o.employmentInfoId = this.employmentInfoId);
                this.getTransactionInfoIncomes().mapAll(incomes);
                this._incomeMatrix = null;
            }
        }

        constructor(ti?: cls.TransactionInfo, employmentInfo?: srv.IEmploymentInfoViewModel) {
            super();

            if (!!employmentInfo) {
                lib.copyState(employmentInfo, this);
            }

            if (!this.employmentInfoId || this.employmentInfoId == lib.getEmptyGuid()) {
                this.employmentInfoId = util.IdentityGenerator.nextGuid();
            }

            if (!!ti) {
                this.setTransactionInfo(ti);
                ti.employmentInfo.map(this);
            }

            this.initialize(employmentInfo);
        }

        get EmploymentStatusId() {
            return this.employmentStatusId;
        }
        set EmploymentStatusId(value) {
            this.employmentStatusId = value;
            this.isPresent = (this.employmentStatusId == 1);
        }

        get totalMonthlyAmount() {
            var total: number = 0;
            if (this.getIncomeInformation())
                for (var i = 0; i < this.getIncomeInformation().length; i++) {
                    var income = this.getIncomeInformation()[i];
                    if (!income.isRemoved)
                        total += parseFloat(String(income.calculatedMonthlyAmount));
                }
            return total;
        }

        public static getIncomeTypes(): srv.IList<srv.ILookupItem> {
            var lookups = LoanViewModel.getLookups();
            var incomeTypes = lookups.incomeTypesRegular.concat(lookups.incomeTypesMilitary);

            var selfEmployedIncome = LoanViewModel.getLookups().incomeTypesOther.filter(i => i.value == "16");
            if (selfEmployedIncome && selfEmployedIncome.length > 0)
                incomeTypes = incomeTypes.concat(selfEmployedIncome);
            
            return incomeTypes;
        }

        public incomeInfoByTypeId = (typeId: number): srv.IIncomeInfoViewModel  => {
            var incomeInfos = this.incomeInformationCollection.filter(i => i.incomeTypeId == typeId);
            return incomeInfos.length > 0 ? incomeInfos[0] : null;
        }

        //completion rules
        public isCompleted = (): boolean => {
            switch (String(this.employmentTypeId)) {
                case String(srv.EmploymentType.Retired):
                    return this.validateRetired();
                case String(srv.EmploymentType.ActiveMilitaryDuty):
                    return this.validateActiveMilitaryDuty();
                case String(srv.EmploymentType.SalariedEmployee):
                    return this.validateSelfOrSalariedEmployee();
                case String(srv.EmploymentType.SelfEmployed):
                    return this.validateSelfOrSalariedEmployee(); 
                case String(srv.EmploymentType.OtherUnemployed):
                    return true;             
            }
        }

        private validateRetired = (): boolean => {
            return !common.objects.isNullOrUndefined(this.employmentStartDate);
        }

        private validateActiveMilitaryDuty = (): boolean => {
            //11- military base pay
            //13 - part time
            var basePay = this.incomeInfoByTypeId(11);
            return this.validateJointRules() && basePay && basePay.amount && this.branchOfService != "-1";
        }

        private validateSelfOrSalariedEmployee = (): boolean => {
            //0 - base pay for salaried employed
            //16 - base pay for self employed
            //13 - part time
            var basePay = this.EmploymentTypeId == srv.EmploymentType.SelfEmployed ? this.incomeInfoByTypeId(16) : this.incomeInfoByTypeId(0);
            var partTime = this.incomeInfoByTypeId(13);
            var retVal = this.validateJointRules() && (basePay && basePay.amount || partTime && partTime.amount) &&
                !common.string.isNullOrWhiteSpace(this.name) && !common.string.isNullOrWhiteSpace(this.typeOfBusiness);
            //employment status previous
            return this.EmploymentStatusId == 2 ? retVal && !common.objects.isNullOrUndefined(this.employmentEndDate) : retVal;
        }

        private validateJointRules = (): boolean => {
            return !common.string.isNullOrWhiteSpace(this.positionDescription) && !common.objects.isNullOrUndefined(this.employmentStartDate) &&
                !common.string.isNullOrWhiteSpace(this.businessPhone) && !common.string.isNullOrWhiteSpace(this.address.cityName) && !common.string.isNullOrWhiteSpace(this.address.stateName) &&
                !common.string.isNullOrWhiteSpace(this.address.streetName) && !common.string.isNullOrWhiteSpace(this.address.zipCode) && !!this.yearsInThisProfession;
        }

        private buildIncomeInformation = (incomeInformationVm: srv.ICollection<srv.IIncomeInfoViewModel>): srv.IList<srv.IIncomeInfoViewModel> => {
            var dict = [];
            for (var i = 0; i < incomeInformationVm.length; i++) {
                dict[incomeInformationVm[i].incomeTypeId.toString()] = incomeInformationVm[i];
            }

            var list = [];
            var incomeTypes = EmploymentInfoViewModel.getIncomeTypes();
            for (var i = 0; i < incomeTypes.length; i++) {
                var k = incomeTypes[i].value;
                var incomeInfo: srv.IIncomeInfoViewModel = dict[k] ? dict[k] : IncomeInfoViewModel.newIncomeInfo(this.getTransactionInfo(), parseInt(k));
                incomeInfo.incomeType = incomeTypes[i].text;
                
                var baseIncomes = incomeTypes.filter(i => i.value == "0");

                if (baseIncomes && baseIncomes.length > 0) {
                    var baseIncome = baseIncomes[0];

                    if (incomeInfo.incomeTypeId == 16)
                        incomeInfo.incomeType = baseIncome.text;
                }

                list.push(incomeInfo);
            }
            return list;
        }

        get EmploymentTypeId() {
            return this.employmentTypeId;
        }
        set EmploymentTypeId(value) {
            this.employmentTypeId = value;
            this.isMilitary = this.employmentTypeId == 0;
        }

        //
        // @todo-cc: Review for copy , 2-way databind , etc.
        //
        get incomeInformationCollection(): srv.ICollection<srv.IIncomeInfoViewModel> {
            if (!this.getIncomeInformation())
                return [];
                        
            var incomeTypes : srv.IList<srv.ILookupItem>;
            if (this.isMilitary) {
                incomeTypes = LoanViewModel.getLookups().incomeTypesMilitary;
            }
            else {               
                incomeTypes = LoanViewModel.getLookups().incomeTypesRegular;
            }

            if (this.EmploymentTypeId == 2) {
                var selfEmployedIncome = LoanViewModel.getLookups().incomeTypesOther.filter(i => i.value == "16");
                if(selfEmployedIncome && selfEmployedIncome.length>0)
                incomeTypes = incomeTypes.concat(selfEmployedIncome);
            }

            var dict: Array<srv.ILookupItem> = [];

            if (incomeTypes && incomeTypes.length > 0) {
                var filteredIncomes = incomeTypes.filter(i => i.value == "16");
                var filteredBaseIncome = incomeTypes.filter(i => i.value == "0");

                if (filteredIncomes && filteredIncomes.length > 0)
                    var selfEmployed = filteredIncomes[0];

                if (filteredBaseIncome && filteredBaseIncome.length > 0)
                    var baseIncome = filteredBaseIncome[0];
            }

            for (var i = 0; i < incomeTypes.length; i++) {
                var income = incomeTypes[i];
                if (income.value == "0" && this.EmploymentTypeId == 2) {
                    income = selfEmployed;
                }
                dict[incomeTypes[i].value] = income;
            }

            for (var i = 0; i < this.getIncomeInformation().length; i++)
                this.getIncomeInformation()[i].isRemoved = true;
            var list = this.getIncomeInformation().filter(i => {
                if (dict[i.incomeTypeId.toString()] && i.incomeTypeId == dict[i.incomeTypeId.toString()].value) {
                    i.isRemoved = false;
                    return true;
                }
                else {
                    return false;
                }
            });
           
            list.sort((a, b) => {
                if ((a.incomeTypeId == 16) != (b.incomeTypeId == 16))
                    return a.incomeTypeId == 16 ? -1 : 1;
            });

            return list;
        }
                        
        private convertIncomeZeroToRemovedForSubmit = (): void => {
            if (!this.getIncomeInformation())
                return;
            this.getIncomeInformation().filter(i => i.amount === 0).map(i => {
                i.isRemoved = true;
            });
            }

        private filterIncomeInfoForSubmit = (): void => {
            if (this.EmploymentTypeId == srv.EmploymentType.Retired) {
                this.resetIncomeAmounts(this.getIncomeInformation());
            }
            else {
                var diff = lib.diff(this.getIncomeInformation(), this.incomeInformationCollection,(i, j) => i.incomeTypeId == j.incomeTypeId);
                this.resetIncomeAmounts(diff);
            }
            // @todo-cl: Elevate to Transaction Info
            //this.incomeInformation = this.incomeInformationCollection.filter(i => {
            //    return i.amount > 0 && !common.string.isNullOrWhiteSpace(i.incomeInfoId) && !common.string.isEmptyGuid(i.incomeInfoId);
            //});
        }

        private resetIncomeAmounts = (incomeCollection: srv.IIncomeInfoViewModel[]) => {
            if (!!incomeCollection) {
                lib.forEach(incomeCollection, i => i.Amount = 0);
            }
        }

        private cleanUpRetirementData = () => {
            if (this.EmploymentTypeId == srv.EmploymentType.Retired) {
                this.businessPhone = null;
                this.positionDescription = null;
                this.name = null;
                this.typeOfBusiness = null;
                this.yearsInThisProfession = null;
                this.initializeAddress();
            }
        }

        public prepareForSubmit = (): void => {
            this.convertIncomeZeroToRemovedForSubmit();
            this.filterIncomeInfoForSubmit();
            this.cleanUpRetirementData();
        }

        private initialize = (employmentInfo?: srv.IEmploymentInfoViewModel) => {
            this.initializeAddress(employmentInfo);
        }

        private initializeAddress = (employmentInfo?: srv.IEmploymentInfoViewModel) => {
            var address: srv.IPropertyViewModel;
            if (!!employmentInfo)
                address = employmentInfo.address;
            else
                address = null;
            this.address = new PropertyViewModel(this.getTransactionInfo(), address);         
        }
    }

    export class CurrentEmploymentInfoViewModel extends EmploymentInfoViewModel {
        constructor(ti: TransactionInfo, employmentInfo?: srv.IEmploymentInfoViewModel) {
            super(ti, employmentInfo);
            this.EmploymentStatusId = 1;
            if(!employmentInfo)
            this.EmploymentTypeId = 1;
            this.isAdditional = false;
        }

        get isRetiredOrUnemployed() {
            return this.EmploymentTypeId == 3 || this.EmploymentTypeId == 4;
        }
        get isSalariedEmployeeOrSelfEmployed() {
            //1 - salariedEmployment, 2 - selfEmployed
            return this.EmploymentTypeId == 1 || this.EmploymentTypeId == 2;
        }
        get isRetired() {
            return this.EmploymentTypeId == srv.EmploymentType.Retired;
        }
        get isOtherOrUnemployed() {
            return this.EmploymentTypeId == srv.EmploymentType.OtherUnemployed;
        }
        get isActiveMilitaryDuty() {
            return this.EmploymentTypeId == srv.EmploymentType.ActiveMilitaryDuty;
        }
    }

    export class AdditionalEmploymentInfoViewModel extends EmploymentInfoViewModel {

        isAdded: boolean;

        constructor(ti: TransactionInfo, additionalEmploymentInfo?: srv.IEmploymentInfoViewModel, isPrevious?: boolean) {
            super(ti, additionalEmploymentInfo);
            if (!additionalEmploymentInfo) {
                this.EmploymentTypeId = 1;
                this.isAdditional = true;
            }

            if (isPrevious)
                this.EmploymentStatusId = 2;
        }

        // Override the base getter and setter.
        // this.isAdditional = true; is required for LC 2.0 and LC 3.0 to play together nicely.
        get EmploymentStatusId() {
            return this.employmentStatusId;
        }
        set EmploymentStatusId(value) {
            this.employmentStatusId = value;
            this.isPresent = (this.employmentStatusId == 1);
            this.isAdditional = true;
        }
        get isSalariedEmployeeOrSelfEmployed() {
            //1 - salariedEmployment, 2 - selfEmployed
            return this.EmploymentTypeId == 1 || this.EmploymentTypeId == 2;
        }
    }
}