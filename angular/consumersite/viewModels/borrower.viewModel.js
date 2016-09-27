/// <reference path='../../../angular/ts/extendedViewModels/borrower.extendedViewModel.ts' />
/// <reference path='employment.viewModel.ts' />
/// <reference path='otherIncome.viewModel.ts' />
/// <reference path='asset.viewModel.ts' />
var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        var Borrower = (function () {
            function Borrower(borrower) {
                var _this = this;
                this.needPreviousEmployment = true;
                this.employments = [];
                this.constructeConsent = function () {
                    if (!_this.getBorrower().eConsent) {
                        _this.getBorrower().eConsent = new srv.cls.EConsentViewModel();
                        _this.getBorrower().eConsent.consentStatus = 0 /* None */;
                    }
                };
                this.constructDeclarations = function () {
                    var declarationsCls = _this.getBorrower().declarationsInfo;
                    if (!declarationsCls) {
                        declarationsCls = new srv.cls.DeclarationInfoViewModel();
                    }
                    _this.declarations = new vm.Declarations(declarationsCls);
                };
                this.constructEmployment = function () {
                    angular.forEach(_this.getBorrower().getEmploymentInfoes(), function (employmentCls, idx) {
                        var employmentVm = new vm.Employment(employmentCls);
                        _this.employments.push(employmentVm);
                    });
                };
                // convenience
                this.getTransactionInfo = function () {
                    return _this.getBorrower().getTransactionalInfo();
                };
                this.constructProperty = function (addressTypeId) {
                    var addrList = lib.filter(_this.getTransactionInfo().property.getValues(), function (p) { return p.borrowerId == _this.borrowerId && p.addressTypeId == addressTypeId; });
                    var addr;
                    if (addrList.length > 0) {
                        // @todo-cc: Review , should always only ever be zero or one , not sure if we should try to validate
                        var addrCls = addrList[0];
                        addr = new vm.Property(addrCls);
                    }
                    else {
                        addr = consumersite.classFactory(cls.PropertyViewModel, vm.Property, _this.getTransactionInfo());
                        addr.borrowerId = _this.borrowerId;
                        addr.addressTypeId = addressTypeId;
                    }
                    return addr;
                };
                this.addEmployment = function (isPrevious, isAdditional) {
                    var ti = _this.getBorrower().getTransactionalInfo();
                    var employmentCls;
                    if (isAdditional) {
                        employmentCls = new cls.AdditionalEmploymentInfoViewModel(ti, null, isPrevious);
                    }
                    else {
                        employmentCls = new cls.CurrentEmploymentInfoViewModel(ti, null);
                    }
                    employmentCls.borrowerId = _this.borrowerId;
                    var employmentVm = new vm.Employment(employmentCls);
                    return _this.employments.push(employmentVm);
                };
                this.removeEmployment = function (index) {
                    _this.removeAt(_this.employments, index);
                };
                this.addOtherIncome = function (loanApp) {
                    var incomeCls = _this.getBorrower().addOtherIncome();
                    var incomeVm = new vm.OtherIncome(loanApp, incomeCls);
                    return incomeVm;
                };
                this.removeAt = function (coll, index) {
                    if (index < coll.length) {
                        coll.slice(index, 1);
                    }
                };
                this.getBorrower = function () { return borrower; };
                // Always active for all borrowers for now
                borrower.isActive = true;
                this.currentAddress = this.constructProperty(1 /* Present */);
                this.mailingAddress = this.constructProperty(3 /* Mailing */);
                this.mailingAddress.isSameMailingAsBorrowerCurrentAddress = true;
                this.previousAddress = this.constructProperty(2 /* Former */);
                this.constructEmployment();
                this.constructDeclarations();
                this.constructeConsent();
            }
            Object.defineProperty(Borrower.prototype, "eConsent", {
                get: function () {
                    return this.getBorrower().eConsent;
                },
                set: function (eConsent) {
                    this.getBorrower().eConsent = eConsent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "ficoScore", {
                get: function () {
                    return this.getBorrower().ficoScore;
                },
                set: function (ficoScore) {
                    this.getBorrower().ficoScore = ficoScore;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "assets", {
                get: function () {
                    if (!angular.isDefined(this.getBorrower().assets)) {
                        this.getBorrower().assets = [];
                    }
                    return this.getBorrower().getAssets();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "reos", {
                get: function () {
                    var liabilities = this.getBorrower().getLiabilities();
                    var reos = lib.filter(liabilities, function (l) { return l.isPledged; });
                    return reos;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "borrowerId", {
                get: function () {
                    return this.getBorrower().borrowerId;
                },
                set: function (borrowerId) {
                    /*Read Only*/
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "isCoBorrower", {
                get: function () {
                    return this.getBorrower().isCoBorrower;
                },
                set: function (isCoBorrower) {
                    this.getBorrower().isCoBorrower = isCoBorrower;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "firstName", {
                get: function () {
                    return this.getBorrower().firstName;
                },
                set: function (firstName) {
                    this.getBorrower().firstName = firstName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "middleName", {
                get: function () {
                    return this.getBorrower().middleName;
                },
                set: function (middleName) {
                    this.getBorrower().middleName = middleName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "lastName", {
                get: function () {
                    return this.getBorrower().lastName;
                },
                set: function (lastName) {
                    this.getBorrower().lastName = lastName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "fullName", {
                get: function () {
                    return (this.getBorrower().getFullName());
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "suffix", {
                get: function () {
                    return this.getBorrower().suffix;
                },
                set: function (suffix) {
                    this.getBorrower().suffix = suffix;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "email", {
                get: function () {
                    var email = this.getBorrower().email;
                    if (Borrower.isEmailNewProspect(email)) {
                        return Borrower.STRING_EMPTY;
                    }
                    else {
                        return email;
                    }
                },
                set: function (email) {
                    this.getBorrower().email = email;
                    if (!this.isCoBorrower) {
                        this.getBorrower().userAccount.username = this.getBorrower().email;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "preferredPhone", {
                get: function () {
                    return this.getBorrower().preferredPhone.number;
                },
                set: function (preferredPhone) {
                    this.getBorrower().preferredPhone.number = preferredPhone;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "preferredPhoneType", {
                get: function () {
                    return this.getBorrower().preferredPhone.type;
                },
                set: function (preferredPhoneType) {
                    this.getBorrower().preferredPhone.type = preferredPhoneType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "maritalStatus", {
                get: function () {
                    return this.getBorrower().maritalStatus;
                },
                set: function (value) {
                    this.getBorrower().maritalStatus = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "numberOfDependents", {
                get: function () {
                    return this.getBorrower().numberOfDependents;
                },
                set: function (numberOfDependents) {
                    this.getBorrower().numberOfDependents = numberOfDependents;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "agesOfDependents", {
                get: function () {
                    return this.getBorrower().agesOfDependents;
                },
                set: function (agesOfDependents) {
                    this.getBorrower().agesOfDependents = agesOfDependents;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "ssn", {
                get: function () {
                    return this.getBorrower().ssn;
                },
                set: function (_ssn) {
                    this.getBorrower().ssn = _ssn;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "dateOfBirth", {
                get: function () {
                    return this.getBorrower().dateOfBirth;
                },
                set: function (_dateOfBirth) {
                    this.getBorrower().dateOfBirth = _dateOfBirth;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "isPermanentAlien", {
                get: function () {
                    return this.getBorrower().permanentAlien;
                },
                set: function (permanentAlien) {
                    this.getBorrower().permanentAlien = permanentAlien;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "isUsCitizen", {
                get: function () {
                    return this.getBorrower().usCitizen;
                },
                set: function (usCitizen) {
                    this.getBorrower().usCitizen = usCitizen;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "isEmploytwoyears", {
                get: function () {
                    return this.getBorrower().isEmployedTwoYears;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "isActive", {
                get: function () {
                    return this.getBorrower().isActive;
                },
                set: function (isActive) {
                    /*Read Only*/
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Borrower.prototype, "userAccountId", {
                get: function () {
                    return this.getBorrower().userAccount.userAccountId;
                },
                set: function (val) {
                    this.getBorrower().userAccount.userAccountId = val;
                },
                enumerable: true,
                configurable: true
            });
            // @todo-cc: Review , eliminate or move to common/lib
            // @todo-cc: Upgrade to TS 1.7 , use const
            Borrower.STRING_EMPTY = "";
            // @todo-cc: Upgrade to TS 1.7 , use const
            Borrower.EMAIL_PFX_NEWPROSPECT = "newprospect";
            // @todo-cc: Long term needs to fix , this is less than ideal
            Borrower.isEmailNewProspect = function (email) {
                if (!email || email.length < Borrower.EMAIL_PFX_NEWPROSPECT.length) {
                    return false;
                }
                if (email.substr(0, Borrower.EMAIL_PFX_NEWPROSPECT.length) == Borrower.EMAIL_PFX_NEWPROSPECT) {
                    return true;
                }
                return false;
            };
            return Borrower;
        })();
        vm.Borrower = Borrower;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=borrower.viewModel.js.map