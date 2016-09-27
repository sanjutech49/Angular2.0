/// <reference path='../../../angular/ts/extendedViewModels/borrower.extendedViewModel.ts' />
/// <reference path='employment.viewModel.ts' />
/// <reference path='otherIncome.viewModel.ts' />
/// <reference path='asset.viewModel.ts' />

module consumersite.vm {

    export class Borrower {

        private getBorrower: () => cls.BorrowerViewModel;

        declarations: vm.Declarations;
        currentAddress: Property;
        mailingAddress: Property;
        previousAddress: Property;
        needPreviousEmployment: boolean = true;
        employments: Employment[] = [];

        constructor(borrower: cls.BorrowerViewModel) {
            this.getBorrower = () => borrower;
            
            // Always active for all borrowers for now
            borrower.isActive = true;

            this.currentAddress = this.constructProperty(srv.AddressType.Present);

            this.mailingAddress = this.constructProperty(srv.AddressType.Mailing);
            this.mailingAddress.isSameMailingAsBorrowerCurrentAddress = true;

            this.previousAddress = this.constructProperty(srv.AddressType.Former);

            this.constructEmployment();

            this.constructDeclarations();

            this.constructeConsent();
        }

        private constructeConsent = () => {
            if (!this.getBorrower().eConsent) {
                this.getBorrower().eConsent = new srv.cls.EConsentViewModel();
                this.getBorrower().eConsent.consentStatus = srv.ConsentStatusEnum.None;
            }
        }

        private constructDeclarations = () => {
            var declarationsCls = this.getBorrower().declarationsInfo;

            if (!declarationsCls) {
                declarationsCls = new srv.cls.DeclarationInfoViewModel();
            }

            this.declarations = new Declarations(<srv.cls.DeclarationInfoViewModel>declarationsCls);
        }

        private constructEmployment = () => {
            angular.forEach(this.getBorrower().getEmploymentInfoes(), (employmentCls: cls.EmploymentInfoViewModel, idx) => {
                var employmentVm = new vm.Employment(employmentCls);
                this.employments.push(employmentVm);
            });
        }

        get eConsent(): srv.IEConsentViewModel {
            return this.getBorrower().eConsent;
        }
        set eConsent(eConsent: srv.IEConsentViewModel) {
            this.getBorrower().eConsent = eConsent;
        }

        get ficoScore() {
            return this.getBorrower().ficoScore;
        }

        set ficoScore(ficoScore: srv.IFicoScoreViewModel) {
            this.getBorrower().ficoScore = ficoScore;
        }

        // convenience
        private getTransactionInfo = () => {
            return this.getBorrower().getTransactionalInfo();
        }

        private constructProperty = (addressTypeId: srv.AddressType) => {
            var addrList = lib.filter(this.getTransactionInfo().property.getValues(), p => p.borrowerId == this.borrowerId && p.addressTypeId == addressTypeId);

            var addr: Property;
            if (addrList.length > 0) {
                // @todo-cc: Review , should always only ever be zero or one , not sure if we should try to validate
                var addrCls = addrList[0];
                addr = new Property(addrCls);
            }
            else {
                addr = classFactory(cls.PropertyViewModel, Property, this.getTransactionInfo());
                addr.borrowerId = this.borrowerId;
                addr.addressTypeId = addressTypeId;
            }

            return addr;
        }

        get assets(): srv.IAssetViewModel[] {
            if (!angular.isDefined(this.getBorrower().assets)) {
                this.getBorrower().assets = [];
            }
            return this.getBorrower().getAssets();
        }

        get reos(): srv.ILiabilityViewModel[] {
            var liabilities: srv.ILiabilityViewModel[] = this.getBorrower().getLiabilities();
            var reos = lib.filter(liabilities, l => l.isPledged);

            return reos;
        }

        get borrowerId() {
            return this.getBorrower().borrowerId;
        }
        set borrowerId(borrowerId: string) {
            /*Read Only*/
        }

        get isCoBorrower(): boolean {
            return this.getBorrower().isCoBorrower;
        }
        set isCoBorrower(isCoBorrower: boolean) {
            this.getBorrower().isCoBorrower = isCoBorrower;
        }

        get firstName(): string {
            return this.getBorrower().firstName;
        }
        set firstName(firstName: string) {
            this.getBorrower().firstName = firstName;
        }
        get middleName(): string {
            return this.getBorrower().middleName;
        }
        set middleName(middleName: string) {
            this.getBorrower().middleName = middleName;
        }
        get lastName(): string {
            return this.getBorrower().lastName;
        }
        set lastName(lastName: string) {
            this.getBorrower().lastName = lastName;
        }
        get fullName(): string {
            return (this.getBorrower().getFullName());
        }
        get suffix(): string {
            return this.getBorrower().suffix;
        }
        set suffix(suffix: string) {
            this.getBorrower().suffix = suffix;
        }

        // @todo-cc: Review , eliminate or move to common/lib
        // @todo-cc: Upgrade to TS 1.7 , use const
        private static STRING_EMPTY: string = "";

        // @todo-cc: Upgrade to TS 1.7 , use const
        private static EMAIL_PFX_NEWPROSPECT = "newprospect";

        // @todo-cc: Long term needs to fix , this is less than ideal
        private static isEmailNewProspect = (email: string): boolean => {
            if (!email || email.length < Borrower.EMAIL_PFX_NEWPROSPECT.length) {
                return false;
            }

            if (email.substr(0, Borrower.EMAIL_PFX_NEWPROSPECT.length) == Borrower.EMAIL_PFX_NEWPROSPECT) {
                return true;
            }

            return false;
        }

        get email(): string {
            var email = this.getBorrower().email;
            if (Borrower.isEmailNewProspect(email)) {
                return Borrower.STRING_EMPTY;
            }
            else {
                return email;
            }
        }

        set email(email: string) {
            this.getBorrower().email = email;
            if (!this.isCoBorrower) {
                this.getBorrower().userAccount.username = this.getBorrower().email;
            }
        }

        get preferredPhone() {
            return this.getBorrower().preferredPhone.number;
        }
        set preferredPhone(preferredPhone: string) {
            this.getBorrower().preferredPhone.number = preferredPhone;
        }

        get preferredPhoneType() {
            return this.getBorrower().preferredPhone.type;
        }
        set preferredPhoneType(preferredPhoneType: string) {
            this.getBorrower().preferredPhone.type = preferredPhoneType;
        }

        get maritalStatus() {
            return this.getBorrower().maritalStatus;
        }
        set maritalStatus(value: number) {
            this.getBorrower().maritalStatus = value;
        }

        get numberOfDependents() {
            return this.getBorrower().numberOfDependents;
        }
        set numberOfDependents(numberOfDependents: number) {
            this.getBorrower().numberOfDependents = numberOfDependents;
        }

        get agesOfDependents() {
            return this.getBorrower().agesOfDependents;
        }
        set agesOfDependents(agesOfDependents: string) {
            this.getBorrower().agesOfDependents = agesOfDependents;
        }

        get ssn() {
            return this.getBorrower().ssn;
        }
        set ssn(_ssn: string) {
            this.getBorrower().ssn = _ssn;
        }

        get dateOfBirth() {
            return this.getBorrower().dateOfBirth;
        }
        set dateOfBirth(_dateOfBirth: string) {
            this.getBorrower().dateOfBirth = _dateOfBirth;
        }

        get isPermanentAlien() {
            return this.getBorrower().permanentAlien;
        }
        set isPermanentAlien(permanentAlien: boolean) {
            this.getBorrower().permanentAlien = permanentAlien;
        }

        get isUsCitizen() {
            return this.getBorrower().usCitizen;
        }
        set isUsCitizen(usCitizen: boolean) {
            this.getBorrower().usCitizen = usCitizen;
        }

        get isEmploytwoyears(): boolean {
            return this.getBorrower().isEmployedTwoYears;
        }

        addEmployment = (isPrevious: boolean, isAdditional: boolean): number => {

            var ti = this.getBorrower().getTransactionalInfo();

            var employmentCls: cls.EmploymentInfoViewModel;
            if (isAdditional) {
                employmentCls = new cls.AdditionalEmploymentInfoViewModel(ti, null/*ViewModel*/, isPrevious);
            }
            else {
                employmentCls = new cls.CurrentEmploymentInfoViewModel(ti, null/*ViewModel*/);
            }

            employmentCls.borrowerId = this.borrowerId;

            var employmentVm = new vm.Employment(employmentCls);

            return this.employments.push(employmentVm);
        }

        removeEmployment = (index: number) => {
            this.removeAt(this.employments, index);
        }

        addOtherIncome = (loanApp: cls.LoanApplicationViewModel): OtherIncome => {
            var incomeCls = this.getBorrower().addOtherIncome();
            var incomeVm = new OtherIncome(loanApp, incomeCls);
            return incomeVm;
        }

        private removeAt = (coll: any[], index: number) => {
            if (index < coll.length) {
                coll.slice(index, 1);
            }
        }

        get isActive(): boolean {
            return this.getBorrower().isActive;
        }
        set isActive(isActive: boolean) {
            /*Read Only*/
        }

        get userAccountId(): number {
            return this.getBorrower().userAccount.userAccountId;
        }
        set userAccountId(val: number) {
            this.getBorrower().userAccount.userAccountId = val;
        }
    }
}
