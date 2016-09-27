module srv {
    export interface IIncomeInfoViewModel {
        isNegativeIncome?: boolean;
        Amount?: number;
        manualAmount?: number;
        PreferredPaymentPeriodId?: number;
        isCurrentlyAdded?: boolean;
        getProperty?(): IPropertyViewModel;
        setProperty? (address: IPropertyViewModel): void;
        isNetRental?: boolean;
    }
}

module cls {

    export class IncomeInfoViewModel extends srv.cls.IncomeInfoViewModel {
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
        getProperty = (): srv.IPropertyViewModel => {
            if (this.getHasTransactionalInfoProperty()) {
                var item = this.getTransactionInfoProperty().lookup(this.propertyId);
                return item;
            }
            return null;
        }
        setProperty = (property: srv.IPropertyViewModel) => {
            if (this.getHasTransactionalInfoProperty()) {
                this.getTransactionInfoProperty().map(property);
            }
        }

        // @todo-cc: Generalize => lib/fwk
        public remove = (): void => {
            this.isRemoved = true;
            if (this.isCurrentlyAdded && this.hasTransactionInfo()) {
                this.getTransactionInfo().incomeInfo.remove(this);
            }
        }

        constructor(ti?: TransactionInfo, incomeInfo?: srv.IIncomeInfoViewModel) {
            super();
            this.setDefaults();
            if (!!incomeInfo)
                lib.copyState(incomeInfo, this);

            if (!this.incomeInfoId || this.incomeInfoId == lib.getEmptyGuid()) {
                this.incomeInfoId = util.IdentityGenerator.nextGuid();
                this.isCurrentlyAdded = true;
            }

            if (!!ti) {
                this.setTransactionInfo(ti);
                ti.incomeInfo.map(this);
            }

            this.initialize(incomeInfo);
        }

        isNegativeIncome: boolean = false;
        isNetRental: boolean = false;        
        isCurrentlyAdded: boolean;

        getNetRentalDisplayName = (loanPurposeType: string, isAdjusted: boolean, properties: srv.IPropertyViewModel[], propertyId : string) => {
            var properties = properties.filter((property) => { return property.propertyId == propertyId});
            var property: srv.IPropertyViewModel;
            if (properties.length > 0)
                property = properties[0];

            isAdjusted = isAdjusted || (property && (property.OwnershipPercentage != 100 || property.vacancyPercentage != 75));

            if (isAdjusted) {
                if (String(loanPurposeType) == "1" && this.isSubjectProperty)
                    return "Adjusted Anticipated Net Rental Income";

                // Todo: Retrieve from lookup?
                return "Adjusted Net Rental Income ";
            }

            if (String(loanPurposeType) == "1" && this.isSubjectProperty)
                return "Anticipated Net Rental Income";
            
            // Todo: Retrieve from lookup?
            return "Net Rental Income ";
        }     

        /**
        * @desc Sets default property values for new item.
        */
        private setDefaults = (): void => {
            // Default to monthly payment period.
            this.PreferredPaymentPeriodId = 1;
        }

        private _amount: number;
        get amount(): number {
            return this._amount;
        }
        set amount(amount: number) {
            if (!angular.isDefined(amount))
                amount = 0; 
            this._amount = amount;
        }

        get manualAmount(): number {
            return this._amount;
        }
        set manualAmount(manualAmount: number) {
            this.amount = manualAmount;

            if (this.isNetRental) {
                this.manualChange = true;

                // @todo-cl: Manage negative
                //        if (otherIncome.amount == "-") {
                //            otherIncome.amount = 0;
                //            vm.isminus = true;
                //        }
            }
        }

        get calculatedAmount(): number {
            return this.amount;
        }
        set calculatedAmount(calculatedAmount: number) {
            if (!this.manualChange) {
                this.amount = calculatedAmount;
            }
        }

        // @todo-cl: Remove
        get Amount() {
            return this.amount;
        }
        // @todo-cl: Remove
        set Amount(value: number) {
            this.amount = value;           
        }

        get PreferredPaymentPeriodId() {
            return this.preferredPaymentPeriodId;
        }
        set PreferredPaymentPeriodId(value) {
            this.preferredPaymentPeriodId = value;
        }

        get calculatedMonthlyAmount() {
            var amount: number = 0;
            if (!this.isRemoved)
                amount = this.PreferredPaymentPeriodId == srv.preferredPaymentPeriodsTypeEnum.Annual ? parseFloat((this.Amount / 12).toFixed(4)) : this.Amount;
            return amount;
        }

        get fullAddressString() {
            if (this.getProperty()) {
                return this.getProperty().fullAddressString;
            }
            else {
                return "";
            }
        }          

        public static newIncomeInfo(ti: TransactionInfo, typeid: number): srv.IIncomeInfoViewModel {

            var incomeInfo = new cls.IncomeInfoViewModel(ti);

            incomeInfo.amount = 0;
            incomeInfo.incomeTypeId = typeid;

            return incomeInfo;
        }

        private initialize = (incomeInfo?: srv.IIncomeInfoViewModel) => {
            if (!!this.getProperty()) {
                this.setProperty(new cls.PropertyViewModel(this.getTransactionInfo(), null));
            }

            if (this.incomeTypeId == srv.incomeTypeEnum.netRentalIncome) {
                // convenience properties
                this.isNetRental = true;
                this.canProvideDocumentation = null;
                this.isNegativeIncome = this.amount < 0;
            }
        }
    } 

    export class OtherIncomeInfoViewModel extends IncomeInfoViewModel {
        constructor(ti: TransactionInfo, otherIncome?: srv.IIncomeInfoViewModel) {
            super(ti);
            if (otherIncome)
                common.objects.automap(this, otherIncome);
            else {
                this.amount = 0;
                this.preferredPaymentPeriodId = 1;
            }

            this.canProvideDocumentation = true;
        }
    }

    export class NetRentalIncomeInfoViewModel extends IncomeInfoViewModel {
        constructor(netRentalIncome?: srv.IIncomeInfoViewModel) {
            super();

            if (netRentalIncome)
                common.objects.automap(this, netRentalIncome);
            else {
                this.amount = 0;
                this.preferredPaymentPeriodId = 1;
                this.isRemoved = false;
            } 
                     
            this.isNetRental = true;
            this.incomeTypeId = srv.incomeTypeEnum.netRentalIncome;
            this.canProvideDocumentation = null;
        }
    }
}