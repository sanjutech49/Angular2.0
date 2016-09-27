/// <reference path='../../../angular/ts/extendedViewModels/incomeInfo.extendedViewModel.ts' />

module consumersite.vm {
    
    export class OtherIncome {

        private currentOwnerType;
        private _incomeTypeName;
        private _borrowerFullName = "";
        private getLoanApplication: () => cls.LoanApplicationViewModel;
        private getIncome: () => srv.IIncomeInfoViewModel;

        constructor(loanApplication: cls.LoanApplicationViewModel, otherIncome: srv.IIncomeInfoViewModel) {
            this.getLoanApplication = () => loanApplication;
            this.getIncome = () => otherIncome;
        }
        
        get borrowerFullName(): string {
            switch (this.currentOwnerType) {
                case OwnerTypeEnum.Borrower:
                    this._borrowerFullName = this.getLoanApplication().getBorrower().getFullName();
                    break;
                case OwnerTypeEnum.CoBorrower:
                    this._borrowerFullName = this.getLoanApplication().getCoBorrower().getFullName();
                    break;
            }
            return this._borrowerFullName;
        }

        get borrowerId(): string {
            return this.getIncome().borrowerId;
        }
        set borrowerId(borrowerId: string) {
            this.getIncome().borrowerId = borrowerId;
        }

        get ownerType(): number {
            return this.currentOwnerType;
        }

        set ownerType(ownerType: number) {
            if (ownerType == OwnerTypeEnum.CoBorrower && this.currentOwnerType == OwnerTypeEnum.Borrower) {
                lib.removeFirst(this.getLoanApplication().getBorrower().getOtherIncomes(), income => income.incomeInfoId == this.getIncome().incomeInfoId);
            }
            else if ((ownerType == OwnerTypeEnum.Borrower) && this.currentOwnerType == OwnerTypeEnum.CoBorrower) {
                lib.removeFirst(this.getLoanApplication().getCoBorrower().getOtherIncomes(), income => income.incomeInfoId == this.getIncome().incomeInfoId);
            }

            if (ownerType == OwnerTypeEnum.CoBorrower) {
                this.getLoanApplication().getCoBorrower().setOtherIncomes([this.getIncome()]);
            }
            else {
                this.getLoanApplication().getBorrower().setOtherIncomes([this.getIncome()]);
            }

            this.currentOwnerType = ownerType;
        }
        
        //Test this after we are saving.
        get incomeType(): number {
            return this.getIncome().incomeTypeId;
        }
        set incomeType(incomeType: number) {
            this.getIncome().incomeTypeId = incomeType;                
        }

        get incomeTypeName(): string {
            return this._incomeTypeName;
        }
        setIncomeTypeName(lookupArray: any[], typeVal: number): void {

            for (var i = 0; i < lookupArray.length; i++) {
                if (lookupArray[i].value == typeVal)
                    this._incomeTypeName = lookupArray[i].text;
            }
        }

        //The view doesn't want a zero if it is empty.  It wants null or ""
        //This is done to ensure the cls.IncomeInfoViewModel does not change the value of the amount to be zero if it is undefined/null/empty.
        get incomeValue(): number {
            var amount = this.getIncome().amount;
            if (!angular.isDefined(amount) || amount == 0) {
                amount = null;
            }
            return amount;
        }
        set incomeValue(incomeValue: number) {
            this.getIncome().amount = incomeValue;
        }

        get preferredPaymentPeriodId(): number {
            return this.getIncome().PreferredPaymentPeriodId;
        }
        set preferredPaymentPeriodId(id: number) {
            this.getIncome().PreferredPaymentPeriodId = id;
        }
    }
}
