var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        var activationCode = (function () {
            function activationCode(activationCode) {
                this.getActivationCode = function () { return activationCode; };
            }
            Object.defineProperty(activationCode.prototype, "key", {
                get: function () {
                    return this.getActivationCode().key;
                },
                set: function (value) {
                    this.getActivationCode().key = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(activationCode.prototype, "value", {
                get: function () {
                    return this.getActivationCode().value;
                },
                set: function (value) {
                    this.getActivationCode().value = value;
                },
                enumerable: true,
                configurable: true
            });
            return activationCode;
        })();
        vm.activationCode = activationCode;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=activationCode.viewModel..js.map