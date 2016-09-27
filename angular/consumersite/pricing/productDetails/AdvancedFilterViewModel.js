var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        var AdvancedFilterViewModel = (function () {
            function AdvancedFilterViewModel() {
            }
            Object.defineProperty(AdvancedFilterViewModel.prototype, "Show30Fixed", {
                get: function () {
                    return AdvancedFilterViewModel._show30Fixed;
                },
                set: function (value) {
                    AdvancedFilterViewModel._show30Fixed = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AdvancedFilterViewModel.prototype, "Show25Fixed", {
                get: function () {
                    return AdvancedFilterViewModel._show25Fixed;
                },
                set: function (value) {
                    AdvancedFilterViewModel._show25Fixed = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AdvancedFilterViewModel.prototype, "Show20Fixed", {
                get: function () {
                    return AdvancedFilterViewModel._show20Fixed;
                },
                set: function (value) {
                    AdvancedFilterViewModel._show20Fixed = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AdvancedFilterViewModel.prototype, "Show15Fixed", {
                get: function () {
                    return AdvancedFilterViewModel._show15Fixed;
                },
                set: function (value) {
                    AdvancedFilterViewModel._show15Fixed = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AdvancedFilterViewModel.prototype, "Show10Fixed", {
                get: function () {
                    return AdvancedFilterViewModel._show10Fixed;
                },
                set: function (value) {
                    AdvancedFilterViewModel._show10Fixed = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AdvancedFilterViewModel.prototype, "Show10Arm", {
                get: function () {
                    return AdvancedFilterViewModel._show10Arm;
                },
                set: function (value) {
                    AdvancedFilterViewModel._show10Arm = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AdvancedFilterViewModel.prototype, "Show7Arm", {
                get: function () {
                    return AdvancedFilterViewModel._show7Arm;
                },
                set: function (value) {
                    AdvancedFilterViewModel._show7Arm = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AdvancedFilterViewModel.prototype, "Show5Arm", {
                get: function () {
                    return AdvancedFilterViewModel._show5Arm;
                },
                set: function (value) {
                    AdvancedFilterViewModel._show5Arm = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AdvancedFilterViewModel.prototype, "Show3Arm", {
                get: function () {
                    return AdvancedFilterViewModel._show3Arm;
                },
                set: function (value) {
                    AdvancedFilterViewModel._show3Arm = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AdvancedFilterViewModel.prototype, "SortField", {
                get: function () {
                    return AdvancedFilterViewModel._sortField;
                },
                set: function (value) {
                    AdvancedFilterViewModel._sortField = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AdvancedFilterViewModel.prototype, "SortAsc", {
                get: function () {
                    return AdvancedFilterViewModel._sortAsc;
                },
                set: function (value) {
                    AdvancedFilterViewModel._sortAsc = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AdvancedFilterViewModel.prototype, "isVAEligible", {
                get: function () {
                    return this._isVAEligible;
                },
                set: function (value) {
                    this._isVAEligible = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AdvancedFilterViewModel.prototype, "wasVAUsedBefore", {
                get: function () {
                    return this._wasVAUsedBefore;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AdvancedFilterViewModel.prototype, "onVADisability", {
                get: function () {
                    return this._onVADisablity;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AdvancedFilterViewModel.prototype, "onVADisablity", {
                set: function (value) {
                    this._onVADisablity = value;
                },
                enumerable: true,
                configurable: true
            });
            AdvancedFilterViewModel._show30Fixed = true;
            AdvancedFilterViewModel._show25Fixed = true;
            AdvancedFilterViewModel._show20Fixed = true;
            AdvancedFilterViewModel._show15Fixed = true;
            AdvancedFilterViewModel._show10Fixed = true;
            //
            AdvancedFilterViewModel._show10Arm = true;
            AdvancedFilterViewModel._show7Arm = true;
            AdvancedFilterViewModel._show5Arm = true;
            AdvancedFilterViewModel._show3Arm = true;
            return AdvancedFilterViewModel;
        })();
        vm.AdvancedFilterViewModel = AdvancedFilterViewModel;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=AdvancedFilterViewModel.js.map