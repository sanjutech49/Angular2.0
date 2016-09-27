/// <reference path='../../../angular/ts/extendedViewModels/borrower.extendedViewModel.ts' />
/// <reference path='employment.viewModel.ts' />
/// <reference path='otherIncome.viewModel.ts' />
/// <reference path='asset.viewModel.ts' />
var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        var summaryEmp = (function () {
            function summaryEmp() {
                this.empSalary = 10000;
                this.positionDescription = "Artist";
            }
            return summaryEmp;
        })();
        vm.summaryEmp = summaryEmp;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=summaryEmp.viewModel.js.map