/// <reference path='../../../angular/ts/extendedViewModels/loanApplication.extendedViewModel.ts' />
/// <reference path='borrower.viewModel.ts' />

module consumersite.vm {

    export class LoanApplication {

        private getLoanApp: () => cls.LoanApplicationViewModel;
        borrower: Borrower;
        coBorrower: Borrower;
        assets: Asset[] = [];
        otherIncomes: OtherIncome[] = [];
        hasOtherIncome = false;
        previousHasCoBorrowerState: boolean;
        initialHasCoBorrowerState: boolean;

        constructor(loanApp: cls.LoanApplicationViewModel) {
            this.getLoanApp = () => loanApp;
            this.getLoanApp().isSpouseOnTheLoan = false;
            this.constructBorrowers();
        }

        private constructBorrowers = () => {
            // Borrower
            this.constructBorrower(false);
            // Co-Borrower
            this.constructBorrower(true);
        }

        private constructBorrower = (isCoBorrower: boolean) => {
            // getter/setters
            var getCls: () => cls.BorrowerViewModel;
            var setCsvm: (csvmBorrower: Borrower) => void;
            if (isCoBorrower) {
                getCls = this.getLoanApp().getCoBorrower;
                setCsvm = b => this.coBorrower = b;
            }
            else {
                getCls = this.getLoanApp().getBorrower;
                setCsvm = b => this.borrower = b;
            }

            // implementation
            var clsBorrower = getCls();
            var csvmBorrower: Borrower;
            if (!!clsBorrower) {
                csvmBorrower = new Borrower(clsBorrower);
            }
            else {
                csvmBorrower = classFactory(cls.BorrowerViewModel, Borrower, this.getLoanApp().getTransactionInfo());
                csvmBorrower.isCoBorrower = isCoBorrower;
            }
            setCsvm(csvmBorrower);
        }

        get loanApplicationId(): string {
            var loanApplication = this.getLoanApp();
            if (!!loanApplication) {
                return loanApplication.loanApplicationId;
            }
            else {
                return "";
            }
        }

        get documents(): srv.IDocumentsViewModel[] {
            return this.getLoanApp().documents;
        }
        set documents(documents: srv.IDocumentsViewModel[]) {
            this.getLoanApp().documents = documents;
        }

        get howDidYouHearAboutUs() {
            return this.getLoanApp().howDidYouHearAboutUs;
        }
        set howDidYouHearAboutUs(howDidYouHearAboutUs: string) {
            this.getLoanApp().howDidYouHearAboutUs = howDidYouHearAboutUs;
        }

        private _coBorrowerHasDifferentCurrentAddress = false;
        get coBorrowerHasDifferentCurrentAddress() {
            return this._coBorrowerHasDifferentCurrentAddress;
        }
        set coBorrowerHasDifferentCurrentAddress(coBorrowerHasDifferentCurrentAddress: boolean) {
            this._coBorrowerHasDifferentCurrentAddress = coBorrowerHasDifferentCurrentAddress;
        }

        private _doesBorrowerOrCoBorrowerHaveOtherEmployment = false;
        get doesBorrowerOrCoBorrowerHaveOtherEmployment() {
            return this._doesBorrowerOrCoBorrowerHaveOtherEmployment;
        }
        set doesBorrowerOrCoBorrowerHaveOtherEmployment(doesBorrowerOrCoBorrowerHaveOtherEmployment: boolean) {
            this._doesBorrowerOrCoBorrowerHaveOtherEmployment = doesBorrowerOrCoBorrowerHaveOtherEmployment;
        }

        get hasCoBorrower(): boolean {
            return this.getLoanApp().isSpouseOnTheLoan;
        }
        set hasCoBorrower(hasCoBorrower: boolean) {
            if (hasCoBorrower && !this.coBorrower) {
                this.coBorrower = classFactory(cls.BorrowerViewModel, Borrower, this.getLoanApp().getTransactionInfo());
            }
            this.getLoanApp().isSpouseOnTheLoan = hasCoBorrower;
        }

        addAsset = (): number => {
            return this.assets.push(new Asset(this.getLoanApp(), new cls.AssetViewModel()));
        }

        removeAsset = (index: number) => {
            this.assets[index].isRemoved = true;
            this.removeAt(this.assets, index);
        }

        addOtherIncome = (): OtherIncome => {
            var income = this.borrower.addOtherIncome(this.getLoanApp());
            this.otherIncomes.push(income);
            return income;
        }

        removeOtherIncome = (index: number) => {
            this.removeAt(this.otherIncomes, index);
        }

        private removeAt = (coll: any[], index: number) => {
            if (index < coll.length) {
                coll.slice(index, 1);
            }
        }
    }
} 