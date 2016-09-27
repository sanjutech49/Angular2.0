/// <reference path='../../../angular/ts/extendedViewModels/property.extendedViewModel.ts' />
/// <reference path='../../../angular/ts/generated/enums.ts' />
var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        var Property = (function () {
            function Property(property) {
                this.getProperty = function () { return property; };
            }
            Object.defineProperty(Property.prototype, "isMailingAddressDifferent", {
                get: function () {
                    return this.getProperty().isSameMailingAsBorrowerCurrentAddress;
                },
                set: function (isMailingAddressDifferent) {
                    this.getProperty().isSameMailingAsBorrowerCurrentAddress = isMailingAddressDifferent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "borrowerId", {
                get: function () {
                    return this.getProperty().borrowerId;
                },
                set: function (borrowerId) {
                    this.getProperty().borrowerId = borrowerId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "addressTypeId", {
                get: function () {
                    return this.getProperty().addressTypeId;
                },
                set: function (addressTypeId) {
                    this.getProperty().addressTypeId = addressTypeId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "isSameAsPropertyAddress", {
                get: function () {
                    return this.getProperty().isSameAsPropertyAddress;
                },
                set: function (isSameAsPropertyAddress) {
                    this.getProperty().isSameAsPropertyAddress = isSameAsPropertyAddress;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "isSameMailingAsBorrowerCurrentAddress", {
                get: function () {
                    return this.getProperty().isSameMailingAsBorrowerCurrentAddress;
                },
                set: function (isSameMailingAsBorrowerCurrentAddress) {
                    this.getProperty().isSameMailingAsBorrowerCurrentAddress = isSameMailingAsBorrowerCurrentAddress;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "isSameAsPrimaryBorrowerCurrentAddress", {
                get: function () {
                    return this.getProperty().isSameAsPrimaryBorrowerCurrentAddress;
                },
                set: function (isSameAsPrimaryBorrowerCurrentAddress) {
                    this.getProperty().isSameAsPrimaryBorrowerCurrentAddress = isSameAsPrimaryBorrowerCurrentAddress;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "ownOrRent", {
                get: function () {
                    return this.getProperty().ownership;
                },
                set: function (ownOrRent) {
                    this.getProperty().ownership = ownOrRent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "timeAtAddressMonths", {
                get: function () {
                    return this.getProperty().timeAtAddressMonths;
                },
                set: function (timeAtAddressMonths) {
                    this.getProperty().timeAtAddressMonths = timeAtAddressMonths;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "timeAtAddressYears", {
                get: function () {
                    return this.getProperty().timeAtAddressYears;
                },
                set: function (timeAtAddressYears) {
                    this.getProperty().timeAtAddressYears = timeAtAddressYears;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "whereAreYouInTheBuyingProcess", {
                get: function () {
                    return this.buyingProcessStage;
                },
                set: function (buyingProcessStage) {
                    this.buyingProcessStage = buyingProcessStage;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "isCurrentAddressSameAsPropertyAddress", {
                get: function () {
                    return this.getProperty().isSameAsPrimaryBorrowerCurrentAddress;
                },
                set: function (isCurrentAddressSameAsPropertyAddress) {
                    this.getProperty().isSameAsPrimaryBorrowerCurrentAddress = isCurrentAddressSameAsPropertyAddress;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "fullAddress", {
                get: function () {
                    return (this.getProperty().fullAddressString);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "streetName", {
                get: function () {
                    return this.getProperty().streetName;
                },
                set: function (streetName) {
                    this.getProperty().streetName = streetName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "cityName", {
                get: function () {
                    return this.getProperty().cityName;
                },
                set: function (city) {
                    this.getProperty().cityName = city;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "zipCode", {
                get: function () {
                    return this.getProperty().zipCode;
                },
                set: function (zipCode) {
                    this.getProperty().zipCode = zipCode;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "stateName", {
                get: function () {
                    return this.getProperty().stateName;
                },
                set: function (stateName) {
                    this.getProperty().stateName = stateName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "countyName", {
                get: function () {
                    return this.getProperty().countyName;
                },
                set: function (countyName) {
                    this.getProperty().countyName = countyName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "occupancyType", {
                get: function () {
                    return this.getProperty().OccupancyType;
                },
                set: function (occupancyType) {
                    this.getProperty().OccupancyType = occupancyType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "propertyType", {
                get: function () {
                    return +this.getProperty().PropertyType;
                },
                set: function (propertyType) {
                    this.getProperty().PropertyType = propertyType.toString();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "numberOfUnits", {
                get: function () {
                    return this.getProperty().numberOfUnits;
                },
                set: function (numberOfUnits) {
                    this.getProperty().numberOfUnits = numberOfUnits;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "NeedPreApproval", {
                get: function () {
                    return this.getProperty().needPreApproval;
                },
                set: function (needPreApproval) {
                    this.getProperty().needPreApproval = needPreApproval;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "isCurrentAddressSame", {
                get: function () {
                    return this.getProperty().isCurrentAddressSame;
                },
                set: function (isCurrentAddressSame) {
                    this.getProperty().isCurrentAddressSame = isCurrentAddressSame;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "purchasePrice", {
                get: function () {
                    return this.getProperty().purchasePrice;
                },
                set: function (purchasePrice) {
                    this.getProperty().purchasePrice = purchasePrice;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "purchaseDate", {
                get: function () {
                    return this.getProperty().purchaseDate;
                },
                set: function (purchaseDate) {
                    this.getProperty().purchaseDate = purchaseDate;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "currentEstimatedValue", {
                get: function () {
                    return this.getProperty().currentEstimatedValue;
                },
                set: function (estValue) {
                    this.getProperty().currentEstimatedValue = estValue;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "downPayment", {
                get: function () {
                    return this.getProperty().downPayment;
                },
                set: function (downPayment) {
                    this.getProperty().downPayment = downPayment;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "downPaymentSource", {
                get: function () {
                    return this.getProperty().downPaymentSource;
                },
                set: function (downPaymentSource) {
                    this.getProperty().downPaymentSource = downPaymentSource;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "monthlyHOADues", {
                //The view doesn't want a zero if it is empty.  It wants null or ""
                get: function () {
                    var amount = this.getProperty().monthlyHOAdues;
                    if (!angular.isDefined(amount) || amount == 0) {
                        amount = null;
                    }
                    return amount;
                },
                set: function (monthlyHOADues) {
                    this.getProperty().monthlyHOAdues = monthlyHOADues;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Property.prototype, "isCurrentAddressSameAsPrimary", {
                get: function () {
                    return this.getProperty().isSameAsPrimaryBorrowerCurrentAddress;
                },
                set: function (isCurrentAddressSameAsPrimary) {
                    this.getProperty().isSameAsPrimaryBorrowerCurrentAddress = isCurrentAddressSameAsPrimary;
                },
                enumerable: true,
                configurable: true
            });
            return Property;
        })();
        vm.Property = Property;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=property.viewModel.js.map