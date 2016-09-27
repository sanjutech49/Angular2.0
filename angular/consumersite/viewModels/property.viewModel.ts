/// <reference path='../../../angular/ts/extendedViewModels/property.extendedViewModel.ts' />
/// <reference path='../../../angular/ts/generated/enums.ts' />

module consumersite.vm {

    export class Property {

        private getProperty: () => cls.PropertyViewModel;
        private buyingProcessStage: number;

        constructor(property: cls.PropertyViewModel) {
            this.getProperty = () => property;
        }


        get isMailingAddressDifferent() {
            return this.getProperty().isSameMailingAsBorrowerCurrentAddress;
        }
        set isMailingAddressDifferent(isMailingAddressDifferent: boolean) {
            this.getProperty().isSameMailingAsBorrowerCurrentAddress = isMailingAddressDifferent;
        }

        get borrowerId() {
            return this.getProperty().borrowerId;
        }
        set borrowerId(borrowerId: string) {
            this.getProperty().borrowerId = borrowerId;
        }

        get addressTypeId() {
            return this.getProperty().addressTypeId;
        }
        set addressTypeId(addressTypeId: srv.AddressType) {
            this.getProperty().addressTypeId = addressTypeId;
        }

        get isSameAsPropertyAddress() {
            return this.getProperty().isSameAsPropertyAddress;
        }
        set isSameAsPropertyAddress(isSameAsPropertyAddress: boolean) {
            this.getProperty().isSameAsPropertyAddress = isSameAsPropertyAddress;
        }

        get isSameMailingAsBorrowerCurrentAddress() {
            return this.getProperty().isSameMailingAsBorrowerCurrentAddress;
        }
        set isSameMailingAsBorrowerCurrentAddress(isSameMailingAsBorrowerCurrentAddress: boolean) {
            this.getProperty().isSameMailingAsBorrowerCurrentAddress = isSameMailingAsBorrowerCurrentAddress;
        }


        get isSameAsPrimaryBorrowerCurrentAddress() {
            return this.getProperty().isSameAsPrimaryBorrowerCurrentAddress;
        }
        set isSameAsPrimaryBorrowerCurrentAddress(isSameAsPrimaryBorrowerCurrentAddress: boolean) {
            this.getProperty().isSameAsPrimaryBorrowerCurrentAddress = isSameAsPrimaryBorrowerCurrentAddress;
        }


        get ownOrRent() {
            return this.getProperty().ownership;
        }
        set ownOrRent(ownOrRent: number) {
            this.getProperty().ownership = ownOrRent;
        }

        get timeAtAddressMonths() {
            return this.getProperty().timeAtAddressMonths;
        }
        set timeAtAddressMonths(timeAtAddressMonths: number) {
            this.getProperty().timeAtAddressMonths = timeAtAddressMonths;
        }

        get timeAtAddressYears() {
            return this.getProperty().timeAtAddressYears;
        }
        set timeAtAddressYears(timeAtAddressYears: number) {
            this.getProperty().timeAtAddressYears = timeAtAddressYears;
        }

        get whereAreYouInTheBuyingProcess() {
            return this.buyingProcessStage;
        }
        set whereAreYouInTheBuyingProcess(buyingProcessStage: number) {
            this.buyingProcessStage = buyingProcessStage;
        }

        get isCurrentAddressSameAsPropertyAddress() {
            return this.getProperty().isSameAsPrimaryBorrowerCurrentAddress;
        }
        set isCurrentAddressSameAsPropertyAddress(isCurrentAddressSameAsPropertyAddress: boolean) {
            this.getProperty().isSameAsPrimaryBorrowerCurrentAddress = isCurrentAddressSameAsPropertyAddress;
        }


        get fullAddress(): string {
            return (this.getProperty().fullAddressString);
        }
        get streetName() {
            return this.getProperty().streetName;
        }
        set streetName(streetName: string) {
            this.getProperty().streetName = streetName;
        }

        get cityName() {
            return this.getProperty().cityName;
        }
        set cityName(city: string) {
            this.getProperty().cityName = city;
        }

        get zipCode() {
            return this.getProperty().zipCode;
        }
        set zipCode(zipCode: string) {
            this.getProperty().zipCode = zipCode;
        }

        get stateName() {
            return this.getProperty().stateName;
        }
        set stateName(stateName: string) {
            this.getProperty().stateName = stateName;
        }

        get countyName() {
            return this.getProperty().countyName;
        }
        set countyName(countyName: string) {
            this.getProperty().countyName = countyName;
        }

        get occupancyType() {
            return this.getProperty().OccupancyType;
        }
        set occupancyType(occupancyType: srv.PropertyUsageTypeEnum) {
            this.getProperty().OccupancyType = occupancyType;
        }

        get propertyType() {
            return +this.getProperty().PropertyType;
        }
        set propertyType(propertyType: srv.PropertyTypeEnum) {
            this.getProperty().PropertyType = propertyType.toString();
        }

        get numberOfUnits() {
            return this.getProperty().numberOfUnits;
        }
        set numberOfUnits(numberOfUnits: number) {
            this.getProperty().numberOfUnits = numberOfUnits;
        }

        get NeedPreApproval() {
            return this.getProperty().needPreApproval;
        }
        set NeedPreApproval(needPreApproval: boolean) {
            this.getProperty().needPreApproval = needPreApproval;
        }

        get isCurrentAddressSame() {
            return this.getProperty().isCurrentAddressSame;
        }
        set isCurrentAddressSame(isCurrentAddressSame: boolean) {
            this.getProperty().isCurrentAddressSame = isCurrentAddressSame;
        }

        get purchasePrice() {
            return this.getProperty().purchasePrice;
        }
        set purchasePrice(purchasePrice: number) {
            this.getProperty().purchasePrice = purchasePrice;
        }

        get purchaseDate() {
            return this.getProperty().purchaseDate;
        }
        set purchaseDate(purchaseDate: Date) {
            this.getProperty().purchaseDate = purchaseDate;
        }

        get currentEstimatedValue() {
            return this.getProperty().currentEstimatedValue;
        }
        set currentEstimatedValue(estValue: number) {
            this.getProperty().currentEstimatedValue = estValue;
        }

        get downPayment() {
            return this.getProperty().downPayment;
        }
        set downPayment(downPayment: number) {
            this.getProperty().downPayment = downPayment;
        }

        get downPaymentSource() {
            return this.getProperty().downPaymentSource;
        }
        set downPaymentSource(downPaymentSource: number) {
            this.getProperty().downPaymentSource = downPaymentSource;
        }

        //The view doesn't want a zero if it is empty.  It wants null or ""
        get monthlyHOADues(): number {
            var amount = this.getProperty().monthlyHOAdues;
            if (!angular.isDefined(amount) || amount == 0) {
                amount = null;
            }
            return amount;
        }
        set monthlyHOADues(monthlyHOADues: number) {
            this.getProperty().monthlyHOAdues = monthlyHOADues;
        }

        get isCurrentAddressSameAsPrimary() {
            return this.getProperty().isSameAsPrimaryBorrowerCurrentAddress;
        }

        set isCurrentAddressSameAsPrimary(isCurrentAddressSameAsPrimary: boolean) {
            this.getProperty().isSameAsPrimaryBorrowerCurrentAddress = isCurrentAddressSameAsPrimary;
        }


    }
}