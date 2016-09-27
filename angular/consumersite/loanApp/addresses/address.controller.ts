/// <reference path="../otherincome/otherincome.controller.ts" />
/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class AddressController {
        static className = "addressController";

        public static $inject = ['loan', 'loanAppPageContext', 'consumerLoanService'];

        isBorrower = true;

        constructor(public loan: vm.Loan, private loanAppPageContext: LoanAppPageContext, private consumerLoanService: ConsumerLoanService) {
            this.isBorrower = !loanAppPageContext.isCoBorrowerState;

            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }

        get hasCoBorrower(): boolean {
            return this.loan.loanApp.hasCoBorrower;
        }
        set hasCoBorrower(hasCoBorrower: boolean) {
            /*Read Only*/
        }

        get borrowerName(): string {
            return this.loan.loanApp.borrower.fullName;
        }
        set borrowerName(borrowerName: string) {
            /*Read-Only*/
        }

        get coBorrowerName(): string {
            if (this.loan.loanApp.hasCoBorrower) {
                return this.loan.loanApp.coBorrower.fullName;
            }
            else {
                return "";
            }
        }
        set coBorrowerName(coBorrowerName: string) {
            /*Read-Only*/
        }

        get borrower() {
            var borrower = this.isBorrower ? this.loan.loanApp.borrower : this.loan.loanApp.coBorrower;
            return borrower;
        }
        set borrower(borrower: vm.Borrower) {
            /*Read Only*/
        }

        get addressCurrent() {
            var addressCurrent: vm.Property;
            if (this.borrower.currentAddress.isSameAsPropertyAddress) {
                addressCurrent = this.loan.property;
            }
            else {
                addressCurrent = this.borrower.currentAddress;
            }
            return addressCurrent;
        }
        set addressCurrent(addressCurrent: vm.Property) {
            /*Read-Only*/
        }

        get isSameMailingAsBorrowerCurrentAddress() {
            return this.borrower.mailingAddress.isSameMailingAsBorrowerCurrentAddress;
        }
        set isSameMailingAsBorrowerCurrentAddress(isSameMailingAsBorrowerCurrentAddress: boolean) {
            this.borrower.mailingAddress.isSameMailingAsBorrowerCurrentAddress = isSameMailingAsBorrowerCurrentAddress;
        }

        get addressMailing() {
            if (this.isSameMailingAsBorrowerCurrentAddress) {
                return this.addressCurrent;
            }
            else {
                return this.borrower.mailingAddress;
            }
        }
        set addressMailing(addressMailing: vm.Property) {
            /*Read-Only*/
        }

        get isPreviousAddressRequired(): boolean {
            if (!this.borrower.currentAddress.timeAtAddressYears && !this.borrower.currentAddress.timeAtAddressMonths) {
                return false;
            }

            var years = lib.getNumericValue(this.borrower.currentAddress.timeAtAddressYears);
            var months = lib.getNumericValue(this.borrower.currentAddress.timeAtAddressMonths);
            var monthsTotal = (years * 12) + months;
            return monthsTotal < 25;
        }
        set isPreviousAddressRequired(isPreviousAddressRequired: boolean) {
            /*Read-Only*/
        }

        get addressPrevious() {
            return this.borrower.previousAddress;
        }
        set addressPrevious(addressPrevious: vm.Property) {
            /*Read-Only*/
        }

        get isCoborrowerAddressSame(): boolean {
            return this.loan.loanApp.coBorrowerHasDifferentCurrentAddress;
        }
        set isCoborrowerAddressSame(isCoborrowerAddressSame: boolean) {
            this.loan.loanApp.coBorrowerHasDifferentCurrentAddress = isCoborrowerAddressSame;
        }
    }

    // @todo-cc: REMOVE
    export class AddressControllerVx {

        static className = "addressControllerVx";

        public static $inject = ['loan', 'loanAppPageContext', 'consumerLoanService'];

        // IS BIND
        borrower: vm.Borrower;

        // NOT BIND
        isBorrower: boolean;

        // NOT BIND
        isCurrentAddressSame: boolean;

        // IS BIND
        isSameAddress: boolean;

        constructor(public loan: vm.Loan, private loanAppPageContext: LoanAppPageContext, private consumerLoanService: ConsumerLoanService) {
            //this.isBorrower = !this.loanAppPageContext.isCoBorrowerState;
            //this.borrower = !this.isBorrower ? this.loan.loanApp.coBorrower : this.loan.loanApp.borrower;
            //this.isSameAddress = true;
            //this.isCurrentAddressSame = false;
            //if (this.loan.property.isCurrentAddressSame == true)
            //    this.populateAddressFromProperty();
            //else
            //    this.clearAddress();
        }

        populateAddressFromProperty = () => {
            this.borrower.currentAddress.streetName = this.loan.property.streetName;
            this.borrower.currentAddress.stateName = this.loan.property.stateName;
            this.borrower.currentAddress.zipCode = this.loan.property.zipCode;
            this.borrower.currentAddress.cityName = this.loan.property.cityName;
            this.borrower.currentAddress.isSameMailingAsBorrowerCurrentAddress = this.loan.property.isSameMailingAsBorrowerCurrentAddress;
        }

        rbAddressClicked = () => {
            //  alert('hello');
         
        }

        clearAddress = () => {
            this.borrower.currentAddress.streetName = undefined;
            this.borrower.currentAddress.stateName = undefined;
            this.borrower.currentAddress.zipCode = undefined;
            this.borrower.currentAddress.cityName = undefined;

        }

        saveAddress = () => {
            var borrowerAddress = new cls.PropertyViewModel();
            borrowerAddress.streetName = this.borrower.currentAddress.streetName;
            borrowerAddress.zipCode = this.borrower.currentAddress.zipCode;
            borrowerAddress.cityName = this.borrower.currentAddress.cityName;
            borrowerAddress.stateName = this.borrower.currentAddress.stateName;
            borrowerAddress.timeAtAddressMonths = this.borrower.currentAddress.timeAtAddressMonths;
            borrowerAddress.timeAtAddressYears = this.borrower.currentAddress.timeAtAddressYears;
            //this.consumerLoanService.saveAddress(this.loan, borrowerAddress);
        }

        get hasCoBorrower() {
            return this.loan.loanApp.hasCoBorrower;
        }
        set hasCoBorrower(hasCoBorrower: boolean) {
            this.loan.loanApp.hasCoBorrower = hasCoBorrower;
        }

        //get isCurrentAddressSame() {

        //    return this.isCurrentAddressSame;
        //}
        //set isCurrentAddressSame(isCurrentAddressSame: boolean) {
        //    this.isCurrentAddressSame = isCurrentAddressSame;
        //}


    }
    moduleRegistration.registerController(consumersite.moduleName, AddressController);

} 
 