//<reference path='../../../angular/ts/extendedViewModels/hdma.extendedViewModel.ts' />
//<reference path='../../../angular/ts/generated/enums.ts' />
//TODO: Remove Facade, if we are creating the cls view model anyways we do not need a facade.
var cls;
(function (cls) {
    var GovernmentMonitoringDisclosure = (function () {
        function GovernmentMonitoringDisclosure(governmentMonitoring) {
            this.governmentMonitoring = governmentMonitoring;
            if (angular.isDefined(governmentMonitoring)) {
                lib.copyState(governmentMonitoring, this);
            }
            else {
                this.isMale = false;
                isNotDisclosing: false;
                isHispanicOrLatino: false;
                isWhite: false;
                isAsian: false;
                isNativeAmericanOrAlaskanNative: false;
                isBlackOrAfricanAmerican: false;
                isHawaiinNativeOrOtherPaficIslander: false;
            }
        }
        return GovernmentMonitoringDisclosure;
    })();
    cls.GovernmentMonitoringDisclosure = GovernmentMonitoringDisclosure;
})(cls || (cls = {}));
var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        var GovernmentMonitoringDisclosure = (function () {
            //{ isMale: boolean, isNotDisclosing: boolean, isHispanic: boolean, isWhite: boolean, isAsian: boolean, isNativeAmericanOrAlaskanNative: boolean, isBlackOrAfricanAmerican: boolean, isHawaiinNativeOrOtherPaficIslander: boolean };
            function GovernmentMonitoringDisclosure(governmentMonitoring) {
                this.getGovernmentMonitoring = function () { return governmentMonitoring; };
            }
            Object.defineProperty(GovernmentMonitoringDisclosure.prototype, "isNotDisclosing", {
                get: function () {
                    return this.getGovernmentMonitoring().isNotDisclosing;
                },
                set: function (value) {
                    this.getGovernmentMonitoring().isNotDisclosing = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GovernmentMonitoringDisclosure.prototype, "isNativeAmericanOrAlaskanNative", {
                get: function () {
                    return this.getGovernmentMonitoring().isNativeAmericanOrAlaskanNative;
                },
                set: function (value) {
                    this.getGovernmentMonitoring().isNativeAmericanOrAlaskanNative = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GovernmentMonitoringDisclosure.prototype, "isBlackOrAfricanAmerican", {
                get: function () {
                    return this.getGovernmentMonitoring().isBlackOrAfricanAmerican;
                },
                set: function (value) {
                    this.getGovernmentMonitoring().isBlackOrAfricanAmerican = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GovernmentMonitoringDisclosure.prototype, "isAsian", {
                get: function () {
                    return this.getGovernmentMonitoring().isAsian;
                },
                set: function (value) {
                    this.getGovernmentMonitoring().isAsian = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GovernmentMonitoringDisclosure.prototype, "isHawaiinNativeOrOtherPaficIslander", {
                get: function () {
                    return this.getGovernmentMonitoring().isHawaiinNativeOrOtherPaficIslander;
                },
                set: function (value) {
                    this.getGovernmentMonitoring().isHawaiinNativeOrOtherPaficIslander = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GovernmentMonitoringDisclosure.prototype, "isWhite", {
                get: function () {
                    return this.getGovernmentMonitoring().isWhite;
                },
                set: function (value) {
                    this.getGovernmentMonitoring().isWhite = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GovernmentMonitoringDisclosure.prototype, "isHispanicOrLatino", {
                get: function () {
                    return this.getGovernmentMonitoring().isHispanicOrLatino;
                },
                set: function (value) {
                    this.getGovernmentMonitoring().isHispanicOrLatino = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GovernmentMonitoringDisclosure.prototype, "isMale", {
                get: function () {
                    return this.getGovernmentMonitoring().isMale;
                },
                set: function (value) {
                    this.getGovernmentMonitoring().isMale = value;
                },
                enumerable: true,
                configurable: true
            });
            return GovernmentMonitoringDisclosure;
        })();
        vm.GovernmentMonitoringDisclosure = GovernmentMonitoringDisclosure;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=governmentMonitoringDisclosure.viewModel.js.map