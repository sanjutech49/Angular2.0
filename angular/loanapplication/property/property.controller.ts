/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../loanevents/loanEvents.service.ts" />
/// <reference path="../../ts/extendedViewModels/loan.extendedViewModel.ts" />
/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/lib/referenceWrapper.ts" />
/// <reference path="../../ts/lib/referenceWrapper.ts" />
/// <reference path="../../common/common.date.ts" />

module loanCenter {

    class PropertyController {

        showLoader = true;
        disableFields = false;
        message = '';
        isAgentSectionVisible = false;
        downPaymentValue = 0;
        isCoBorrowerAddressDifferent = false;
        enums = [];        

        indicators = {
            doesYourAgentAlsoRepresentsSeller: false,
            downPaymentPercentageToFixed: 0,
            downPaymentPercentageOriginal: 0,
        };

        private defaultSellersAgentContact: srv.IAgentContactViewModel;

        coBorrowerCurrentAddressEffective: srv.IPropertyViewModel;        

        static $inject = ['propertySvc', 'BroadcastSvc', 'simpleModalWindowFactory', 'wrappedLoan', 'applicationData', 'commonCalculatorSvc', 'loanEvent', 'commonService'];

        constructor(private propertySvc, private BroadcastSvc, private simpleModalWindowFactory, private wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>, private applicationData, private commonCalculatorSvc, private loanEvent, private commonService: common.services.ICommonService) {

            this.enums['LoanPurposeType'] = srv.LoanPurposeTypeEnum;
            this.enums['OccupancyType'] = srv.OccupancyType;
            this.enums['OwnershipType'] = srv.OwnershipStatusTypeEnum;        

            this.indicators = {
                doesYourAgentAlsoRepresentsSeller: wrappedLoan.ref.checkAgentsDifferences(),
                downPaymentPercentageToFixed: 0,
                downPaymentPercentageOriginal: 0,
            };
            var borrowerCurrentAddress = this.wrappedLoan.ref.active.getBorrower().getCurrentAddress();
            borrowerCurrentAddress.isSameAsPropertyAddress=this.borrowerCurrentAddressIsSameAsPropertyAddress;
            this.defaultSellersAgentContact = this.wrappedLoan.ref.sellersAgentContact;

            if (this.wrappedLoan.ref.loanPurposeType === 1) {
                this.onLoanAmountBlur();
            }
            if (this.wrappedLoan.ref.loanPurposeType === srv.LoanPurposeTypeEnum.Refinance && this.wrappedLoan.ref.active.OccupancyType == srv.PropertyUsageTypeEnum.PrimaryResidence)
                borrowerCurrentAddress.isSameAsPropertyAddress = true;

            this.applicationData.lookup.currentLoanLicensedStatesForLO = this.wrappedLoan.ref.getLicencedStates(this.applicationData);

            if (this.wrappedLoan.ref.loanPurposeType === srv.LoanPurposeTypeEnum.Purchase &&  this.wrappedLoan.ref.homeBuyingType == srv.HomeBuyingTypeEnum.GetPreApproved &&
                common.string.isNullOrWhiteSpace(wrappedLoan.ref.getSubjectProperty().streetName))
                this.wrappedLoan.ref.getSubjectProperty().streetName = 'TBD';
        }

        get subjectProperty(): srv.IPropertyViewModel {
            return this.wrappedLoan.ref.getSubjectProperty();
        }
        set subjectProperty(subjProp: srv.IPropertyViewModel) {
            /*Read-Only*/
        }

        get netRentalIncome(): srv.IIncomeInfoViewModel {
            return this.subjectProperty.getNetRentalIncome();
        }
        set netRentalIncome(nri: srv.IIncomeInfoViewModel) {
            /*Read-Only*/
        }

        getFHACountyLoanLimit = (): void => {
            this.wrappedLoan.ref.fhaCountyLoanLimit = this.commonService.getFHAOrVALoanLimit(this.applicationData.fhaLoanLimits, this.wrappedLoan.ref.getSubjectProperty().stateName, this.wrappedLoan.ref.getSubjectProperty().countyName, this.wrappedLoan.ref.getSubjectProperty().numberOfUnits);
        }

        ownershipCurrentResidence = (ownership: string) => {
            if (angular.isDefined(ownership)) {
                this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().ownership = +ownership;
            }
            return this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().ownership;
        }

        onOwnershipPercentageChanged = (ownership: number) => {
            if (ownership > 100) {
                this.wrappedLoan.ref.active.ownershipPercentage = this.wrappedLoan.ref.remainingOwnershipCalculation(true);
            }               
        }
        onOccupancyTypeChanged = (occupancyType: srv.PropertyUsageTypeEnum) => {
            if (occupancyType != srv.PropertyUsageTypeEnum.PrimaryResidence) {
                this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().isSameAsPropertyAddress = false; 
            }
            this.loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.todo);
        }

        public triggerLoanCalculator = () => {
            if (!this.wrappedLoan.ref.active.ownershipPercentage) {
                this.wrappedLoan.ref.active.ownershipPercentage = 0;
            }   
            // accessing will create if not exists (lazy)             
            var nri = this.netRentalIncome;
            this.loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.todo);
        }

        public isValidDate = (value) => {
            return common.date.isValidDate(value);
        }

        get occupancyType(): srv.PropertyUsageTypeEnum {
            return this.wrappedLoan.ref.getSubjectProperty().OccupancyType;
        }
        set occupancyType(occupancyType: srv.PropertyUsageTypeEnum) {
            this.wrappedLoan.ref.getSubjectProperty().OccupancyType = occupancyType;

            // cascade ; @todo-cl: The implementation of the following functions (and subsequent call stack) is in question ?
            // accessing will create if not exists (lazy)
            var nri = this.netRentalIncome;
            this.loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.PropertyOccupancyTypeChanged, this.wrappedLoan.ref.getSubjectProperty());
        }

        public onHomeByingTypeChange = (item) => {
            if (!isNaN(Number(item)))
                this.wrappedLoan.ref.homeBuyingType = Number(item);

            if (item == 3) {
                this.wrappedLoan.ref.getSubjectProperty().streetName = 'TBD';
            }
            else {
                this.wrappedLoan.ref.getSubjectProperty().streetName = '';
                this.wrappedLoan.ref.sellersAgentContact = this.indicators.doesYourAgentAlsoRepresentsSeller ? this.wrappedLoan.ref.buyersAgentContact : this.defaultSellersAgentContact;
            }

            this.wrappedLoan.ref.areSixPiecesAcquiredForAllLoanApplications();
        }

        public onBuyerRepresentSellerChange = () => {
            this.wrappedLoan.ref.sellersAgentContact = this.indicators.doesYourAgentAlsoRepresentsSeller ? this.wrappedLoan.ref.buyersAgentContact : <srv.IAgentContactViewModel>this.defaultSellersAgentContact;
        }

        public onDownPaymentBlur = () => {
            this.loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.downPaymentValue, this.wrappedLoan.ref.downPayment);
             this.calculateDownPayment("DownPayment");
        }

        public onPurchasePriceBlur = () => {

            this.loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.PurchasePrice, this.wrappedLoan.ref.getSubjectProperty().purchasePrice);

            if (this.wrappedLoan.ref.loanPurposeType === 1)
                this.calculateDownPayment("PurchasePrice");
        }


        public onCurrentEstimatedValue = () => {

            this.loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.EstimatedValue, this.wrappedLoan.ref.getSubjectProperty().currentEstimatedValue);

            //if (this.wrappedLoan.ref.loanPurposeType === 2)
               //    calculateDownPayment("currentEstimatedValue");
        }

        public onLoanAmountBlur = () => {

            this.wrappedLoan.ref.financialInfo.mortgageAmount = this.wrappedLoan.ref.loanAmount;
            this.loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LoanAmount, this.wrappedLoan.ref.loanAmount);

            if (this.wrappedLoan.ref.loanPurposeType === 1)
                this.calculateDownPayment("LoanAmount");
        }

        public onDownPaymentPercentageBlur = () => {
            this.loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.downPaymentPercentageToFixed, this.indicators.downPaymentPercentageToFixed);
            this.calculateDownPayment("DownPaymentPercentage");
        }

        public calculateDownPayment = (base) => {

            var purchasePrice = this.wrappedLoan.ref.getSubjectProperty().purchasePrice;
            var loanAmount = this.wrappedLoan.ref.loanAmount;
            var downPayment = this.downPaymentValue;
            var downPaymentPercentage = this.indicators.downPaymentPercentageToFixed;
            var result = this.commonCalculatorSvc.recalculateDownPayment(purchasePrice, loanAmount, downPayment, downPaymentPercentage, 0, base);
            this.wrappedLoan.ref.downPaymentAmount(result.downPayment);
            this.downPaymentValue = result.downPayment;
            this.wrappedLoan.ref.loanAmount = result.loanAmount;
            this.indicators.downPaymentPercentageToFixed = result.downPaymentPercentage;
            this.wrappedLoan.ref.getSubjectProperty().purchasePrice = result.purchasePrice;
        }

        public collapseExpand = () => {
            this.isAgentSectionVisible = !this.isAgentSectionVisible;
        }

        public getLabelText = (key, value) => {
            return this.propertySvc.getLabelText(key, value);
        }

        public showPreviousAddressPerBorrower = (btyp: srv.BorrowerType = srv.BorrowerType.OtherBorrower) => {
            // use [srv.BorrowerType.OtherBorrower] to calculate both
            if (btyp == srv.BorrowerType.OtherBorrower) {
                return this.showPreviousAddressPerBorrower(srv.BorrowerType.CoBorrower) || this.showPreviousAddressPerBorrower(srv.BorrowerType.Borrower);
            }

            if (btyp == srv.BorrowerType.CoBorrower
                && this.wrappedLoan.ref.active.isSpouseOnTheLoan && !this.coBorrowerCurrentAddressIsDifferentFromBorrower) {
                return false;
            }

            var addr: srv.IPropertyViewModel;
            switch (btyp) {
                case srv.BorrowerType.CoBorrower:
                    addr = this.wrappedLoan.ref.active.getCoBorrower().getCurrentAddress();
                    break;
                case srv.BorrowerType.Borrower:
                    addr = this.wrappedLoan.ref.active.getBorrower().getCurrentAddress();
                    break;
                default:
                    addr = null;
                    break;
            }

            if (addr == null) {
                return false;
            }
            else {
                var isShow = this.propertySvc.showPreviousAddress(addr.timeAtAddressYears, addr.timeAtAddressMonths);
                return isShow;
            }
        }

        public isDownPaymentCompletionRuleSatisfy = () => {
            return (this.wrappedLoan.ref.sixPiecesAcquiredForAllLoanApplications && !(this.downPaymentValue == 0 || this.downPaymentValue));
        }

        get addressEffectiveBorrowerCurrent(): srv.IPropertyViewModel {
            var addr: srv.IPropertyViewModel;
            if (this.borrowerCurrentAddressIsSameAsPropertyAddress)
                addr = this.wrappedLoan.ref.getSubjectProperty();
            else
                addr = this.wrappedLoan.ref.active.getBorrower().getCurrentAddress();
            return addr;
        }
        set addressEffectiveBorrowerCurrent(addr: srv.IPropertyViewModel) {
            /* Read-Only */
        }

        get addressEffectiveBorrowerMailing(): srv.IPropertyViewModel {
            var addr: srv.IPropertyViewModel;
            if (!this.borrowerMailingAddressIsDifferentFromCurrentAddress)
                addr = this.addressEffectiveBorrowerCurrent;
            else
                addr = this.wrappedLoan.ref.active.getBorrower().getMailingAddress();
            return addr;
        }
        set addressEffectiveBorrowerMailing(addr: srv.IPropertyViewModel) {
            /* Read-Only */
        }

        get borrowerCurrentAddressIsSameAsPropertyAddressIsDisabled(): boolean {
            var loanVm = this.wrappedLoan.ref;
            return loanVm.loanPurposeType == srv.LoanPurposeTypeEnum.Refinance
                    && loanVm.getSubjectProperty().OccupancyType == srv.PropertyUsageTypeEnum.PrimaryResidence;
        }
        set borrowerCurrentAddressIsSameAsPropertyAddressIsDisabled(isDisabled: boolean) {
            /*Read-Only*/
        }

        get borrowerCurrentAddressIsSameAsPropertyAddress(): boolean {
            if (this.borrowerCurrentAddressIsSameAsPropertyAddressIsDisabled) {
                // Always true in this case , assign and and return [true]
                return this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().isSameAsPropertyAddress = true;
            }
            else {
                return this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().isSameAsPropertyAddress;
            }
        }
        set borrowerCurrentAddressIsSameAsPropertyAddress(areSame: boolean) {
            this.toggleAddressIsSameAs(this.wrappedLoan.ref.active.getBorrower().getCurrentAddress(), this.gsSubj, areSame);
        }

        get borrowerMailingAddressIsDifferentFromCurrentAddress(): boolean {
            var areSame = this.wrappedLoan.ref.active.getBorrower().getMailingAddress().isSameMailingAsBorrowerCurrentAddress;
            return !areSame;
        }
        set borrowerMailingAddressIsDifferentFromCurrentAddress(areDifferent: boolean) {
            this.toggleAddressIsSameAs(this.wrappedLoan.ref.active.getBorrower().getMailingAddress(), this.gsMail, !areDifferent);
        }

        get addressEffectiveCoBorrowerCurrent(): srv.IPropertyViewModel {
            var addr: srv.IPropertyViewModel;
            if (this.coBorrowerCurrentAddressIsDifferentFromBorrower)
                addr = this.wrappedLoan.ref.active.getCoBorrower().getCurrentAddress();
            else
                addr = this.addressEffectiveBorrowerCurrent;
            return addr;
        }
        set addressEffectiveCoBorrowerCurrent(addr: srv.IPropertyViewModel) {
            /* Read-Only */
        }

        get addressEffectiveCoBorrowerMailing(): srv.IPropertyViewModel {
            var addr: srv.IPropertyViewModel;
            if (!this.coBorrowerMailingAddressIsDifferentFromCurrentAddress)
                addr = this.addressEffectiveCoBorrowerCurrent;
            else
                addr = this.wrappedLoan.ref.active.getCoBorrower().getMailingAddress();
            return addr;
        }
        set addressEffectiveCoBorrowerMailing(addr: srv.IPropertyViewModel) {
            /* Read-Only */
        }

        get coBorrowerCurrentAddressIsDifferentFromBorrower(): boolean {
            // @todo-cl: Consider a conjunction with [this.wrappedLoan.ref.active.isSpouseOnTheLoan] as well
            var areSame = this.wrappedLoan.ref.active.getCoBorrower().getCurrentAddress().isSameAsPrimaryBorrowerCurrentAddress;
            return !areSame;
        }
        set coBorrowerCurrentAddressIsDifferentFromBorrower(areDifferent: boolean) {
            this.toggleAddressIsSameAs(this.wrappedLoan.ref.active.getCoBorrower().getCurrentAddress(), this.gsPrim, !areDifferent);
        }

        get coBorrowerMailingAddressIsDifferentFromCurrentAddress(): boolean {
            var areSame = this.wrappedLoan.ref.active.getCoBorrower().getMailingAddress().isSameMailingAsBorrowerCurrentAddress;
            return !areSame;
        }
        set coBorrowerMailingAddressIsDifferentFromCurrentAddress(areDifferent: boolean) {
            this.toggleAddressIsSameAs(this.wrappedLoan.ref.active.getCoBorrower().getMailingAddress(), this.gsMail, !areDifferent);
        }

        private toggleAddressIsSameAs = (addr: srv.IPropertyViewModel, gs: cls.IGSS<srv.IPropertyViewModel, boolean>, areSame: boolean): void => {
            //
            // manage state transition , it is not necessary to maintain state an address when [@areSame==true]
            //

            addr.isSameAsPropertyAddress = areSame;
           
            if (gs.g(addr) == areSame) {
                // nothing to mutate
                return;
            }

            if (!areSame) {
                // transition from same to different , clear out any previous address values
                addr.clearAddress(false);
            }

            if (areSame) {
                // transition from different to same, nothing to do
            }

            // assign updated value
            gs.s(addr, areSame);
        }

        private gsSubj = new GSSubj();

        private gsMail = new GSMail();

        private gsPrim = new GSPrim();
    }

    class GSSubj implements cls.IGSS<srv.IPropertyViewModel, boolean> {
        g = (addr: srv.IPropertyViewModel) => addr.isSameAsPropertyAddress;
        s = (addr: srv.IPropertyViewModel, b: boolean) => addr.isSameAsPropertyAddress = b;
    }

    class GSMail implements cls.IGSS<srv.IPropertyViewModel, boolean> {
        g = (addr: srv.IPropertyViewModel) => addr.isSameMailingAsBorrowerCurrentAddress;
        s = (addr: srv.IPropertyViewModel, b: boolean) => addr.isSameMailingAsBorrowerCurrentAddress = b;
    }

    class GSPrim implements cls.IGSS<srv.IPropertyViewModel, boolean> {
        g = (addr: srv.IPropertyViewModel) => addr.isSameAsPrimaryBorrowerCurrentAddress;
        s = (addr: srv.IPropertyViewModel, b: boolean) => {
            addr.isSameAsPrimaryBorrowerCurrentAddress = b; addr.isSameMailingAsBorrowerCurrentAddress = b;
        }
    }

    angular.module('loanApplication').controller('propertyController', PropertyController);
}
