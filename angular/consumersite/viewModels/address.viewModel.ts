/// <reference path='../../../angular/ts/extendedViewModels/property.extendedViewModel.ts' />

module consumersite.vm {

    export class Address {

        private getProperty: () => cls.PropertyViewModel;

        mailingAddress: Property;

        constructor(property: cls.PropertyViewModel) {
            this.getProperty = () => property;
            this.mailingAddress = classFactory(cls.PropertyViewModel, Property, null);
        }
        
        get streetName() {
            return this.getProperty().streetName;
        }
        set streetName(streetName: string) {
            this.getProperty().streetName = streetName;
        }
        get zipCode() {
            return this.getProperty().zipCode;
        }
        set zipCode(zipCode: string) {
            this.getProperty().zipCode = zipCode;
        }

        get cityName() {
            return this.getProperty().cityName;
        }
        set cityName(cityName: string) {
            this.getProperty().cityName = cityName;
        }

        get yearsAtAddress() {
            return this.getProperty().timeAtAddressYears;
        }
        set yearsAtAddress(yearsAtAddress: number) {
            this.getProperty().timeAtAddressYears = yearsAtAddress;
        }

        get monthsAtAddress() {
            return this.getProperty().timeAtAddressMonths;
        }
        set monthsAtAddress(monthsAtAddress: number) {
            this.getProperty().timeAtAddressYears = monthsAtAddress;
        }

        //get currAddrSameAsMailingAddr() {
        //    return this.getProperty().currAddrSameAsMailingAddr;
        //}
        //set currAddrSameAsMailingAddr(currAddrSameAsMailingAddr: string) {
        //    this.getProperty().currAddrSameAsMailingAddr = currAddrSameAsMailingAddr;
        //}

    }
}