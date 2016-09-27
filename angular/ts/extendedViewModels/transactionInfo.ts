//

/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/moment/moment.d.ts" />
/// <reference path="../../../scripts/typings/underscore/underscore.d.ts" />

/// <reference path="../../ts/generated/enums.ts" />	
/// <reference path="../../ts/generated/viewModelBaseClasses.ts" />	
/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../ts/extendedViewModels/genericTypes.ts" />	
/// <reference path="../../ts/extendedViewModels/extendedViewModels.ts" />
/// <reference path="../../ts/extendedViewModels/enums.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/loanApplication.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/housingExpenses.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/liability.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/property.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/borrower.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/loanapplication.extendedviewmodel.ts" />
/// <reference path="../../ts/extendedViewModels/loan.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/employmentInfo.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/incomeInfo.extendedViewModel.ts" />

/// <reference path="../../common/common.objects.ts" />
/// <reference path="../../common/common.string.ts" />
/// <reference path="../../common/common.collections.ts" />
/// <reference path="../../ts/lib/underscore.extended.ts" />

module srv {
    //export interface ITransactionInfo {
    //    properties: srv.IPropertyViewModel[];
    //    loanApplications: srv.ILoanApplicationViewModel[];
    //    borrowers: srv.IBorrowerViewModel[];
    //    liabilities: srv.ILiabilityViewModel[];
    //    incomes: srv.IIncomeInfoViewModel[];
    //    employments: srv.IEmploymentInfoViewModel[];
    //}
}

module cls {

    export class TransactionInfoRef {
        constructor(ti: TransactionInfo) {
            this.ticb = () => ti;
        }

        private ticb: ITransactionInfoCallback;

        public getRef = (): cls.TransactionInfo => {
            return this.ticb();
        }
    }

    export class Map<T> {
        private _map = new Object();

        constructor(map: Array<T> = [], private keySelector: (value: T) => string = s => null) {
            if (map) {
                this.mapAll(map);
            }
        }

        private invalidateValues = (): void => {
            this.values = null;
        }

        lookup = (key: string): T => {
            return this._map[key];
        }

        map = (value: T) => {
            if (!value) {
                return;
            }

            this.invalidateValues();

            var key = this.keySelector(value);
            this._map[key] = value;
        }

        replace = (value: T) => {
            var key = this.keySelector(value);
            var valueExisting = this.lookup(key);
            this.map(value);
            this.invalidateValues();

            return valueExisting;
        }

        mapAll = (values: T[]): void => {

            this.invalidateValues();

            for (var i = 0; i < values.length; i++) {
                var value = values[i];
                var key = this.keySelector(value);
                this._map[key] = value;
            }
        }

        remove = (value: T): T => {
            var key = this.keySelector(value);
            var valueRemoved = this.lookup(key);
            delete this._map[key];
            this.invalidateValues();

            return valueRemoved;
        }

        private values: T[] = null;

        getValues = (): T[]=> {

            if (this.values != null)
                return this.values;

            var values = [];
            for (var k in this._map) {
                // if (k instanceof String && this._map.hasOwnProperty(k)) {
                if (this._map.hasOwnProperty(k)) {
                    values.push(this._map[k]);
                }
            }

            this.values = values;
            return values;
        }
    }

    export class TransactionInfo implements srv.ITransactionInfoGlobal {
        constructor() {
            this.property = new Map<PropertyViewModel>([],(o: srv.IPropertyViewModel) => o.propertyId);
            this.liability = new Map<LiabilityViewModel>([],(o: LiabilityViewModel) => o.liabilityInfoId);
            this.incomeInfo = new Map<IncomeInfoViewModel>([],(o: srv.IIncomeInfoViewModel) => o.incomeInfoId);
            this.loanApplication = new Map<LoanApplicationViewModel>([],(o: srv.ILoanApplicationViewModel) => o.loanApplicationId);
            this.employmentInfo = new Map<EmploymentInfoViewModel>([],(o: srv.IEmploymentInfoViewModel) => o.employmentInfoId);
            this.borrower = new Map<BorrowerViewModel>([],(o: srv.IBorrowerViewModel) => o.borrowerId);
        }

        appraisal: srv.IAppraisalViewModel;
        get borrowers(): srv.IList<srv.IBorrowerViewModel> {
            return this.borrower.getValues();
        }

        get employments(): srv.IList<srv.IEmploymentInfoViewModel> {
            return this.employmentInfo.getValues();
        }

        get incomes(): srv.IList<srv.IIncomeInfoViewModel> {
            return this.incomeInfo.getValues();
        }

        get liabilities(): srv.IList<srv.ILiabilityViewModel> {
            return this.liability.getValues();
        }
        get loanApplications(): srv.IList<srv.ILoanApplicationViewModel> {
            return this.loanApplication.getValues();
        }

        get properties(): srv.IList<srv.IPropertyViewModel> {
            return this.property.getValues();
        }

        property: Map<PropertyViewModel>;
        loanApplication: Map<LoanApplicationViewModel>;
        borrower: Map<BorrowerViewModel>;
        liability: Map<LiabilityViewModel>;
        // incomeInfo: Map<IncomeInfoViewModel>;
        private _incomeInfo: Map<IncomeInfoViewModel>;
        get incomeInfo(): Map<IncomeInfoViewModel> {
            return this._incomeInfo;
        }
        set incomeInfo(map: Map<IncomeInfoViewModel>) {
            this._incomeInfo = map;
        }
        employmentInfo: Map<EmploymentInfoViewModel>;

        getLoan = (): cls.LoanViewModel => {
            return this.loanCallback();
        }

        private loanCallback: cls.ILoanCallback;

        prepareSave = (): void => {
            var loan = <srv.ILoanViewModel>this.loanCallback();

            // @todo-cc: Need to sort out creation services and TS
            if (!loan.transactionInfo) {
                loan.transactionInfo = new srv.cls.TransactionInfo();
            }

            if (this.loanApplication) {
                loan.transactionInfo.loanApplications = this.loanApplication.getValues();
                lib.forEach(loan.transactionInfo.loanApplications, la => la.prepareForSubmit());
            }
            if (this.borrower) {
                loan.transactionInfo.borrowers = this.borrower.getValues();
                lib.forEach(loan.transactionInfo.borrowers, b => b.prepareSave());
            }
            if (this.property)
                loan.transactionInfo.properties = lib.filter(this.property.getValues(), o => (!!o.loanId && o.loanId != lib.getEmptyGuid()));
            if (this.liability)
                loan.transactionInfo.liabilities = this.liability.getValues();
            if (this.incomeInfo)
                loan.transactionInfo.incomes = this.incomeInfo.getValues();
            if (this.employmentInfo)
                loan.transactionInfo.employments = this.employmentInfo.getValues();
        }


        public cloneTransactionInfo = (): TransactionInfo => {
            //
            // @todo-cl: This needs to be cleaned-up once all of the TS constructors are straightened out
            //

            var tiCopy = new cls.TransactionInfo();

            var loanCopyBuff: any = {};
            lib.copyState(this.loanCallback(), loanCopyBuff);
            loanCopyBuff.$filter = this.loanCallback()['$filter'];
            loanCopyBuff.transactionInfo = tiCopy;
            tiCopy.loanCallback = () => loanCopyBuff;
            TransactionInfo.populateImpl(<srv.ITransactionInfo>this, this, tiCopy);
            tiCopy.prepareSave();
            var loanCopy = new cls.LoanViewModel(loanCopyBuff, null, this.loanCallback().isWholeSale);
            tiCopy.loanCallback = () => loanCopy;
            loanCopy.getTransactionInfo = () => tiCopy;

            return tiCopy;
        }

        public populate(loanCallBack: cls.ILoanCallback, transactionInfo: srv.ITransactionInfo) {

            this.loanCallback = loanCallBack;

            if (!!transactionInfo) {
                TransactionInfo.populateImpl(transactionInfo, null, this);
            }
        }

        private static populateImpl(srcLst: srv.ITransactionInfo, srcMap: TransactionInfo, dst: TransactionInfo) {
            var coll: Object[];
            
            // IPropertyViewModel
            coll= this.selectSourceList<srv.IPropertyViewModel>(srcLst,(s: srv.ITransactionInfo) => s.properties, srcMap,(s: TransactionInfo) => s.property.getValues());
            coll.forEach((p: srv.IPropertyViewModel) => new PropertyViewModel(dst, p /* , loanCallBack().homeBuyingType */));

            // ILiabilityViewModel
            coll = this.selectSourceList<srv.ILiabilityViewModel>(srcLst,(s: srv.ITransactionInfo) => s.liabilities, srcMap,(s: TransactionInfo) => s.liability.getValues());
            coll.forEach((p: srv.ILiabilityViewModel) => new LiabilityViewModel(dst, p));

            // IBorrowerViewModel
            coll = this.selectSourceList<srv.IBorrowerViewModel>(srcLst,(s: srv.ITransactionInfo) => s.borrowers, srcMap,(s: TransactionInfo) => s.borrower.getValues());
            coll.forEach((p: srv.IBorrowerViewModel) => new BorrowerViewModel(dst, p));

            // IIncomeInfoViewModel
            coll = this.selectSourceList<srv.IIncomeInfoViewModel>(srcLst,(s: srv.ITransactionInfo) => s.incomes, srcMap,(s: TransactionInfo) => s.incomeInfo.getValues());
            coll.forEach((p: srv.IIncomeInfoViewModel) => new IncomeInfoViewModel(dst, p));

            // IEmploymentInfoViewModel
            coll = this.selectSourceList<srv.IEmploymentInfoViewModel>(srcLst,(s: srv.ITransactionInfo) => s.employments, srcMap,(s: TransactionInfo) => s.employmentInfo.getValues());
            coll.forEach((p: srv.IEmploymentInfoViewModel) => cls.EmploymentInfoViewModelFactory.create(dst, p));

            // ILoanApplicationViewModel
            coll = this.selectSourceList<srv.ILoanApplicationViewModel>(srcLst,(s: srv.ITransactionInfo) => s.loanApplications, srcMap,(s: TransactionInfo) => s.loanApplication.getValues());
            coll.forEach((p: srv.ILoanApplicationViewModel) => new LoanApplicationViewModel(dst, p));
        }

        private static selectSourceList<T>(srcLst: srv.ITransactionInfo, selectorList: (ti: srv.ITransactionInfo) => T[],
            srcMap: TransactionInfo, selectorMap: (ti: TransactionInfo) => T[]): T[]{

            var rslt: T[];

            if (!!srcLst)
                rslt = selectorList(srcLst);
            else if (!!srcMap)
                rslt = selectorMap(srcMap);
            else
                throw new Error("selectSourceList() requires either List or Map source param");

            return (!!rslt) ? rslt : [];
        }
    }
}
