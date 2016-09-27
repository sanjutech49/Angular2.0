var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        var BorrowerDeclarations = (function () {
            function BorrowerDeclarations(declarations) {
                this.getDeclarations = function () { return declarations; };
            }
            return BorrowerDeclarations;
        })();
        vm.BorrowerDeclarations = BorrowerDeclarations;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=borrowerDeclarations.viewmodel.js.map