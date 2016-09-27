/// <reference path='../../../angular/ts/extendedViewModels/property.extendedViewModel.ts' />
var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        var SendReport = (function () {
            function SendReport(property) {
                this.getProperty = function () { return property; };
                this.emailAddress = consumersite.classFactory(cls.PropertyViewModel, vm.Property, null);
            }
            Object.defineProperty(SendReport.prototype, "streetName", {
                get: function () {
                    return this.getProperty().streetName;
                },
                set: function (streetName) {
                    this.getProperty().streetName = streetName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SendReport.prototype, "zipCode", {
                get: function () {
                    return this.getProperty().zipCode;
                },
                set: function (zipCode) {
                    this.getProperty().zipCode = zipCode;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SendReport.prototype, "cityName", {
                get: function () {
                    return this.getProperty().cityName;
                },
                set: function (cityName) {
                    this.getProperty().cityName = cityName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SendReport.prototype, "yearsAtAddress", {
                get: function () {
                    return this.getProperty().yearsAtAddress;
                },
                set: function (yearsAtAddress) {
                    this.getProperty().yearsAtAddress = yearsAtAddress;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SendReport.prototype, "monthsAtAddress", {
                get: function () {
                    return this.getProperty().monthsAtAddress;
                },
                set: function (monthsAtAddress) {
                    this.getProperty().monthsAtAddress = monthsAtAddress;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SendReport.prototype, "currAddrSameAsMailingAddr", {
                get: function () {
                    return this.getProperty().currAddrSameAsMailingAddr;
                },
                set: function (currAddrSameAsMailingAddr) {
                    this.getProperty().currAddrSameAsMailingAddr = currAddrSameAsMailingAddr;
                },
                enumerable: true,
                configurable: true
            });
            return SendReport;
        })();
        vm.SendReport = SendReport;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=sendReport.js.map