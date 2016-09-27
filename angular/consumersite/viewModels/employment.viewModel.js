/// <reference path='../../../angular/ts/extendedViewModels/employmentInfo.extendedViewModel.ts' />
/// <reference path='../../../angular/ts/extendedViewModels/incomeInfo.extendedViewModel.ts' />
var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        var Employment = (function () {
            function Employment(employment) {
                var _this = this;
                this.getBaseIncomeInfo = function () {
                    var baseEmployment = _this.getEmployment().incomeInfoByTypeId(0 /* BaseEmployment */);
                    if (!baseEmployment) {
                        baseEmployment = new cls.IncomeInfoViewModel(_this.getEmployment().getTransactionInfo());
                        baseEmployment.incomeTypeId = 0 /* BaseEmployment */;
                        _this.getEmployment().getIncomeInformation().push(baseEmployment);
                    }
                    return baseEmployment;
                };
                this.isMonthlySalary = function () {
                    return _this.getBaseIncomeInfo().preferredPaymentPeriodId == 1 /* Monthly */;
                };
                this.getEmployment = function () {
                    return employment;
                };
            }
            Object.defineProperty(Employment.prototype, "startingDate", {
                get: function () {
                    return this.getEmployment().employmentStartDate;
                },
                set: function (startingDate) {
                    this.getEmployment().employmentStartDate = startingDate;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Employment.prototype, "endingDate", {
                get: function () {
                    if (!angular.isDefined(this.getEmployment().employmentEndDate)) {
                        this.getEmployment().employmentEndDate = new Date();
                    }
                    return this.getEmployment().employmentEndDate;
                },
                set: function (endingDate) {
                    this.getEmployment().employmentEndDate = endingDate;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Employment.prototype, "employmentType", {
                get: function () {
                    return this.getEmployment().employmentTypeId;
                },
                set: function (employmentType) {
                    this.getEmployment().employmentTypeId = employmentType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Employment.prototype, "positionDescription", {
                get: function () {
                    return this.getEmployment().positionDescription;
                },
                set: function (positionDescription) {
                    this.getEmployment().positionDescription = positionDescription;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Employment.prototype, "typeOfBusiness", {
                get: function () {
                    return this.getEmployment().typeOfBusiness;
                },
                set: function (typeOfBusiness) {
                    this.getEmployment().typeOfBusiness = typeOfBusiness;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Employment.prototype, "yearsInTheSameField", {
                get: function () {
                    return this.getEmployment().yearsInThisProfession;
                },
                set: function (yearsInTheSameField) {
                    this.getEmployment().yearsInThisProfession = yearsInTheSameField;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Employment.prototype, "companyName", {
                get: function () {
                    return this.getEmployment().name;
                },
                set: function (companyName) {
                    this.getEmployment().name = companyName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Employment.prototype, "businessPhone", {
                get: function () {
                    return this.getEmployment().businessPhone;
                },
                set: function (businessPhone) {
                    this.getEmployment().businessPhone = businessPhone;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Employment.prototype, "companyFullAddress", {
                get: function () {
                    return this.getEmployment().address.fullAddressString;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Employment.prototype, "companyStreet", {
                get: function () {
                    return this.getEmployment().address.streetName;
                },
                set: function (companyStreet) {
                    this.getEmployment().address.streetName = companyStreet;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Employment.prototype, "companyCity", {
                get: function () {
                    return this.getEmployment().address.cityName;
                },
                set: function (companyCity) {
                    this.getEmployment().address.cityName = companyCity;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Employment.prototype, "companyState", {
                get: function () {
                    return this.getEmployment().address.stateName;
                },
                set: function (companyState) {
                    this.getEmployment().address.stateName = companyState;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Employment.prototype, "companyZip", {
                get: function () {
                    return this.getEmployment().address.zipCode;
                },
                set: function (companyZip) {
                    this.getEmployment().address.zipCode = companyZip;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Employment.prototype, "preferredPaymentPeriodId", {
                get: function () {
                    return this.getBaseIncomeInfo().preferredPaymentPeriodId;
                },
                set: function (preferredPaymentPeriodType) {
                    this.getBaseIncomeInfo().preferredPaymentPeriodId = preferredPaymentPeriodType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Employment.prototype, "baseSalary", {
                //The view doesn't want a zero if it is empty.  It wants null or ""
                get: function () {
                    var amount = this.getBaseIncomeInfo().amount;
                    if (!angular.isDefined(amount) || amount == 0) {
                        amount = null;
                    }
                    return amount;
                },
                set: function (baseSalary) {
                    this.getBaseIncomeInfo().amount = baseSalary;
                },
                enumerable: true,
                configurable: true
            });
            return Employment;
        })();
        vm.Employment = Employment;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=employment.viewModel.js.map