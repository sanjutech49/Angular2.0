/// <reference path='../../../angular/ts/extendedViewModels/property.extendedViewModel.ts' />
var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        var Account = (function () {
            function Account(property) {
                this.getProperty = function () { return property; };
            }
            Object.defineProperty(Account.prototype, "streetName", {
                get: function () {
                    return this.getProperty().streetName;
                },
                set: function (streetName) {
                    this.getProperty().streetName = streetName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Account.prototype, "zipCode", {
                get: function () {
                    return this.getProperty().zipCode;
                },
                set: function (zipCode) {
                    this.getProperty().zipCode = zipCode;
                },
                enumerable: true,
                configurable: true
            });
            return Account;
        })();
        vm.Account = Account;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=account.viewModel.js.map