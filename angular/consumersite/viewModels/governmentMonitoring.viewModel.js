//<reference path='../../../angular/ts/extendedViewModels/hdma.extendedViewModel.ts' />
//<reference path='../../../angular/ts/generated/enums.ts' />
var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        var GovernmentMonitoringDisclosure = (function () {
            function GovernmentMonitoringDisclosure(governmentMonitoring) {
                this.governmentMonitoring = function () { return governmentMonitoring; };
            }
            Object.defineProperty(GovernmentMonitoringDisclosure.prototype, "isNotDisclosing", {
                get: function () {
                    return this.governmentMonitoring().isNotDisclosing;
                },
                set: function (isNotDisclosing) {
                    this.governmentMonitoring().isNotDisclosing = isNotDisclosing;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GovernmentMonitoringDisclosure.prototype, "isNativeAmericanOrAlaskanNative", {
                get: function () {
                    return this.governmentMonitoring().isNativeAmericanOrAlaskanNative;
                },
                set: function (value) {
                    this.governmentMonitoring().isNativeAmericanOrAlaskanNative = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GovernmentMonitoringDisclosure.prototype, "isBlackOrAfricanAmerican", {
                get: function () {
                    return this.governmentMonitoring().isBlackOrAfricanAmerican;
                },
                set: function (value) {
                    this.governmentMonitoring().isBlackOrAfricanAmerican = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GovernmentMonitoringDisclosure.prototype, "isAsian", {
                get: function () {
                    return this.governmentMonitoring().isAsian;
                },
                set: function (value) {
                    this.governmentMonitoring().isAsian = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GovernmentMonitoringDisclosure.prototype, "isHawaiinNativeOrOtherPaficIslander", {
                get: function () {
                    return this.governmentMonitoring().isHawaiinNativeOrOtherPaficIslander;
                },
                set: function (value) {
                    this.governmentMonitoring().isHawaiinNativeOrOtherPaficIslander = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GovernmentMonitoringDisclosure.prototype, "isWhite", {
                get: function () {
                    return this.governmentMonitoring().isWhite;
                },
                set: function (value) {
                    this.governmentMonitoring().isWhite = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GovernmentMonitoringDisclosure.prototype, "isHispanic", {
                get: function () {
                    return this.governmentMonitoring().isHispanic;
                },
                set: function (value) {
                    this.governmentMonitoring().isHispanic = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GovernmentMonitoringDisclosure.prototype, "isNonHispanic", {
                get: function () {
                    return this.governmentMonitoring().isNonHispanic;
                },
                set: function (value) {
                    this.governmentMonitoring().isNonHispanic = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GovernmentMonitoringDisclosure.prototype, "isMale", {
                get: function () {
                    return this.governmentMonitoring().isMale;
                },
                set: function (isMale) {
                    this.governmentMonitoring().isMale = isMale;
                },
                enumerable: true,
                configurable: true
            });
            return GovernmentMonitoringDisclosure;
        })();
        vm.GovernmentMonitoringDisclosure = GovernmentMonitoringDisclosure;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=governmentMonitoring.viewModel.js.map