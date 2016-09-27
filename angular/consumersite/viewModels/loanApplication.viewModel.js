/// <reference path='../../../angular/ts/extendedViewModels/loanApplication.extendedViewModel.ts' />
/// <reference path='borrower.viewModel.ts' />
var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        var LoanApplication = (function () {
            function LoanApplication(loanApp) {
                var _this = this;
                this.assets = [];
                this.otherIncomes = [];
                this.hasOtherIncome = false;
                this.constructBorrowers = function () {
                    // Borrower
                    _this.constructBorrower(false);
                    // Co-Borrower
                    _this.constructBorrower(true);
                };
                this.constructBorrower = function (isCoBorrower) {
                    // getter/setters
                    var getCls;
                    var setCsvm;
                    if (isCoBorrower) {
                        getCls = _this.getLoanApp().getCoBorrower;
                        setCsvm = function (b) { return _this.coBorrower = b; };
                    }
                    else {
                        getCls = _this.getLoanApp().getBorrower;
                        setCsvm = function (b) { return _this.borrower = b; };
                    }
                    // implementation
                    var clsBorrower = getCls();
                    var csvmBorrower;
                    if (!!clsBorrower) {
                        csvmBorrower = new vm.Borrower(clsBorrower);
                    }
                    else {
                        csvmBorrower = consumersite.classFactory(cls.BorrowerViewModel, vm.Borrower, _this.getLoanApp().getTransactionInfo());
                        csvmBorrower.isCoBorrower = isCoBorrower;
                    }
                    setCsvm(csvmBorrower);
                };
                this._coBorrowerHasDifferentCurrentAddress = false;
                this._doesBorrowerOrCoBorrowerHaveOtherEmployment = false;
                this.addAsset = function () {
                    return _this.assets.push(new vm.Asset(_this.getLoanApp(), new cls.AssetViewModel()));
                };
                this.removeAsset = function (index) {
                    _this.assets[index].isRemoved = true;
                    _this.removeAt(_this.assets, index);
                };
                this.addOtherIncome = function () {
                    var income = _this.borrower.addOtherIncome(_this.getLoanApp());
                    _this.otherIncomes.push(income);
                    return income;
                };
                this.removeOtherIncome = function (index) {
                    _this.removeAt(_this.otherIncomes, index);
                };
                this.removeAt = function (coll, index) {
                    if (index < coll.length) {
                        coll.slice(index, 1);
                    }
                };
                this.getLoanApp = function () { return loanApp; };
                this.getLoanApp().isSpouseOnTheLoan = false;
                this.constructBorrowers();
            }
            Object.defineProperty(LoanApplication.prototype, "loanApplicationId", {
                get: function () {
                    var loanApplication = this.getLoanApp();
                    if (!!loanApplication) {
                        return loanApplication.loanApplicationId;
                    }
                    else {
                        return "";
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LoanApplication.prototype, "documents", {
                get: function () {
                    return this.getLoanApp().documents;
                },
                set: function (documents) {
                    this.getLoanApp().documents = documents;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LoanApplication.prototype, "howDidYouHearAboutUs", {
                get: function () {
                    return this.getLoanApp().howDidYouHearAboutUs;
                },
                set: function (howDidYouHearAboutUs) {
                    this.getLoanApp().howDidYouHearAboutUs = howDidYouHearAboutUs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LoanApplication.prototype, "coBorrowerHasDifferentCurrentAddress", {
                get: function () {
                    return this._coBorrowerHasDifferentCurrentAddress;
                },
                set: function (coBorrowerHasDifferentCurrentAddress) {
                    this._coBorrowerHasDifferentCurrentAddress = coBorrowerHasDifferentCurrentAddress;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LoanApplication.prototype, "doesBorrowerOrCoBorrowerHaveOtherEmployment", {
                get: function () {
                    return this._doesBorrowerOrCoBorrowerHaveOtherEmployment;
                },
                set: function (doesBorrowerOrCoBorrowerHaveOtherEmployment) {
                    this._doesBorrowerOrCoBorrowerHaveOtherEmployment = doesBorrowerOrCoBorrowerHaveOtherEmployment;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LoanApplication.prototype, "hasCoBorrower", {
                get: function () {
                    return this.getLoanApp().isSpouseOnTheLoan;
                },
                set: function (hasCoBorrower) {
                    if (hasCoBorrower && !this.coBorrower) {
                        this.coBorrower = consumersite.classFactory(cls.BorrowerViewModel, vm.Borrower, this.getLoanApp().getTransactionInfo());
                    }
                    this.getLoanApp().isSpouseOnTheLoan = hasCoBorrower;
                },
                enumerable: true,
                configurable: true
            });
            return LoanApplication;
        })();
        vm.LoanApplication = LoanApplication;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=loanApplication.viewModel.js.map