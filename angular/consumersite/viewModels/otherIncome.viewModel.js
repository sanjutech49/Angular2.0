/// <reference path='../../../angular/ts/extendedViewModels/incomeInfo.extendedViewModel.ts' />
var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        var OtherIncome = (function () {
            function OtherIncome(loanApplication, otherIncome) {
                this._borrowerFullName = "";
                this.getLoanApplication = function () { return loanApplication; };
                this.getIncome = function () { return otherIncome; };
            }
            Object.defineProperty(OtherIncome.prototype, "borrowerFullName", {
                get: function () {
                    switch (this.currentOwnerType) {
                        case 1 /* Borrower */:
                            this._borrowerFullName = this.getLoanApplication().getBorrower().getFullName();
                            break;
                        case 2 /* CoBorrower */:
                            this._borrowerFullName = this.getLoanApplication().getCoBorrower().getFullName();
                            break;
                    }
                    return this._borrowerFullName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OtherIncome.prototype, "borrowerId", {
                get: function () {
                    return this.getIncome().borrowerId;
                },
                set: function (borrowerId) {
                    this.getIncome().borrowerId = borrowerId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OtherIncome.prototype, "ownerType", {
                get: function () {
                    return this.currentOwnerType;
                },
                set: function (ownerType) {
                    var _this = this;
                    if (ownerType == 2 /* CoBorrower */ && this.currentOwnerType == 1 /* Borrower */) {
                        lib.removeFirst(this.getLoanApplication().getBorrower().getOtherIncomes(), function (income) { return income.incomeInfoId == _this.getIncome().incomeInfoId; });
                    }
                    else if ((ownerType == 1 /* Borrower */) && this.currentOwnerType == 2 /* CoBorrower */) {
                        lib.removeFirst(this.getLoanApplication().getCoBorrower().getOtherIncomes(), function (income) { return income.incomeInfoId == _this.getIncome().incomeInfoId; });
                    }
                    if (ownerType == 2 /* CoBorrower */) {
                        this.getLoanApplication().getCoBorrower().setOtherIncomes([this.getIncome()]);
                    }
                    else {
                        this.getLoanApplication().getBorrower().setOtherIncomes([this.getIncome()]);
                    }
                    this.currentOwnerType = ownerType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OtherIncome.prototype, "incomeType", {
                //Test this after we are saving.
                get: function () {
                    return this.getIncome().incomeTypeId;
                },
                set: function (incomeType) {
                    this.getIncome().incomeTypeId = incomeType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OtherIncome.prototype, "incomeTypeName", {
                get: function () {
                    return this._incomeTypeName;
                },
                enumerable: true,
                configurable: true
            });
            OtherIncome.prototype.setIncomeTypeName = function (lookupArray, typeVal) {
                for (var i = 0; i < lookupArray.length; i++) {
                    if (lookupArray[i].value == typeVal)
                        this._incomeTypeName = lookupArray[i].text;
                }
            };
            Object.defineProperty(OtherIncome.prototype, "incomeValue", {
                //The view doesn't want a zero if it is empty.  It wants null or ""
                //This is done to ensure the cls.IncomeInfoViewModel does not change the value of the amount to be zero if it is undefined/null/empty.
                get: function () {
                    var amount = this.getIncome().amount;
                    if (!angular.isDefined(amount) || amount == 0) {
                        amount = null;
                    }
                    return amount;
                },
                set: function (incomeValue) {
                    this.getIncome().amount = incomeValue;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OtherIncome.prototype, "preferredPaymentPeriodId", {
                get: function () {
                    return this.getIncome().PreferredPaymentPeriodId;
                },
                set: function (id) {
                    this.getIncome().PreferredPaymentPeriodId = id;
                },
                enumerable: true,
                configurable: true
            });
            return OtherIncome;
        })();
        vm.OtherIncome = OtherIncome;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=otherIncome.viewModel.js.map