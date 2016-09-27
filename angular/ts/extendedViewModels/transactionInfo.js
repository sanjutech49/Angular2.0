//
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/moment/moment.d.ts" />
/// <reference path="../../../scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../../ts/generated/enums.ts" />	
/// <reference path="../../ts/generated/viewModelBaseClasses.ts" />	
/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../ts/extendedViewModels/genericTypes.ts" />	
/// <reference path="../../ts/extendedViewModels/extendedViewModels.ts" />
/// <reference path="../../ts/extendedViewModels/enums.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/loanApplication.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/housingExpenses.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/liability.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/property.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/borrower.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/loanapplication.extendedviewmodel.ts" />
/// <reference path="../../ts/extendedViewModels/loan.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/employmentInfo.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/incomeInfo.extendedViewModel.ts" />
/// <reference path="../../common/common.objects.ts" />
/// <reference path="../../common/common.string.ts" />
/// <reference path="../../common/common.collections.ts" />
/// <reference path="../../ts/lib/underscore.extended.ts" />
var cls;
(function (cls) {
    var TransactionInfoRef = (function () {
        function TransactionInfoRef(ti) {
            var _this = this;
            this.getRef = function () {
                return _this.ticb();
            };
            this.ticb = function () { return ti; };
        }
        return TransactionInfoRef;
    })();
    cls.TransactionInfoRef = TransactionInfoRef;
    var Map = (function () {
        function Map(map, keySelector) {
            var _this = this;
            if (map === void 0) { map = []; }
            if (keySelector === void 0) { keySelector = function (s) { return null; }; }
            this.keySelector = keySelector;
            this._map = new Object();
            this.invalidateValues = function () {
                _this.values = null;
            };
            this.lookup = function (key) {
                return _this._map[key];
            };
            this.map = function (value) {
                if (!value) {
                    return;
                }
                _this.invalidateValues();
                var key = _this.keySelector(value);
                _this._map[key] = value;
            };
            this.replace = function (value) {
                var key = _this.keySelector(value);
                var valueExisting = _this.lookup(key);
                _this.map(value);
                _this.invalidateValues();
                return valueExisting;
            };
            this.mapAll = function (values) {
                _this.invalidateValues();
                for (var i = 0; i < values.length; i++) {
                    var value = values[i];
                    var key = _this.keySelector(value);
                    _this._map[key] = value;
                }
            };
            this.remove = function (value) {
                var key = _this.keySelector(value);
                var valueRemoved = _this.lookup(key);
                delete _this._map[key];
                _this.invalidateValues();
                return valueRemoved;
            };
            this.values = null;
            this.getValues = function () {
                if (_this.values != null)
                    return _this.values;
                var values = [];
                for (var k in _this._map) {
                    // if (k instanceof String && this._map.hasOwnProperty(k)) {
                    if (_this._map.hasOwnProperty(k)) {
                        values.push(_this._map[k]);
                    }
                }
                _this.values = values;
                return values;
            };
            if (map) {
                this.mapAll(map);
            }
        }
        return Map;
    })();
    cls.Map = Map;
    var TransactionInfo = (function () {
        function TransactionInfo() {
            var _this = this;
            this.getLoan = function () {
                return _this.loanCallback();
            };
            this.prepareSave = function () {
                var loan = _this.loanCallback();
                // @todo-cc: Need to sort out creation services and TS
                if (!loan.transactionInfo) {
                    loan.transactionInfo = new srv.cls.TransactionInfo();
                }
                if (_this.loanApplication) {
                    loan.transactionInfo.loanApplications = _this.loanApplication.getValues();
                    lib.forEach(loan.transactionInfo.loanApplications, function (la) { return la.prepareForSubmit(); });
                }
                if (_this.borrower) {
                    loan.transactionInfo.borrowers = _this.borrower.getValues();
                    lib.forEach(loan.transactionInfo.borrowers, function (b) { return b.prepareSave(); });
                }
                if (_this.property)
                    loan.transactionInfo.properties = lib.filter(_this.property.getValues(), function (o) { return (!!o.loanId && o.loanId != lib.getEmptyGuid()); });
                if (_this.liability)
                    loan.transactionInfo.liabilities = _this.liability.getValues();
                if (_this.incomeInfo)
                    loan.transactionInfo.incomes = _this.incomeInfo.getValues();
                if (_this.employmentInfo)
                    loan.transactionInfo.employments = _this.employmentInfo.getValues();
            };
            this.cloneTransactionInfo = function () {
                //
                // @todo-cl: This needs to be cleaned-up once all of the TS constructors are straightened out
                //
                var tiCopy = new cls.TransactionInfo();
                var loanCopyBuff = {};
                lib.copyState(_this.loanCallback(), loanCopyBuff);
                loanCopyBuff.$filter = _this.loanCallback()['$filter'];
                loanCopyBuff.transactionInfo = tiCopy;
                tiCopy.loanCallback = function () { return loanCopyBuff; };
                TransactionInfo.populateImpl(_this, _this, tiCopy);
                tiCopy.prepareSave();
                var loanCopy = new cls.LoanViewModel(loanCopyBuff, null, _this.loanCallback().isWholeSale);
                tiCopy.loanCallback = function () { return loanCopy; };
                loanCopy.getTransactionInfo = function () { return tiCopy; };
                return tiCopy;
            };
            this.property = new Map([], function (o) { return o.propertyId; });
            this.liability = new Map([], function (o) { return o.liabilityInfoId; });
            this.incomeInfo = new Map([], function (o) { return o.incomeInfoId; });
            this.loanApplication = new Map([], function (o) { return o.loanApplicationId; });
            this.employmentInfo = new Map([], function (o) { return o.employmentInfoId; });
            this.borrower = new Map([], function (o) { return o.borrowerId; });
        }
        Object.defineProperty(TransactionInfo.prototype, "borrowers", {
            get: function () {
                return this.borrower.getValues();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TransactionInfo.prototype, "employments", {
            get: function () {
                return this.employmentInfo.getValues();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TransactionInfo.prototype, "incomes", {
            get: function () {
                return this.incomeInfo.getValues();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TransactionInfo.prototype, "liabilities", {
            get: function () {
                return this.liability.getValues();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TransactionInfo.prototype, "loanApplications", {
            get: function () {
                return this.loanApplication.getValues();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TransactionInfo.prototype, "properties", {
            get: function () {
                return this.property.getValues();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TransactionInfo.prototype, "incomeInfo", {
            get: function () {
                return this._incomeInfo;
            },
            set: function (map) {
                this._incomeInfo = map;
            },
            enumerable: true,
            configurable: true
        });
        TransactionInfo.prototype.populate = function (loanCallBack, transactionInfo) {
            this.loanCallback = loanCallBack;
            if (!!transactionInfo) {
                TransactionInfo.populateImpl(transactionInfo, null, this);
            }
        };
        TransactionInfo.populateImpl = function (srcLst, srcMap, dst) {
            var coll;
            // IPropertyViewModel
            coll = this.selectSourceList(srcLst, function (s) { return s.properties; }, srcMap, function (s) { return s.property.getValues(); });
            coll.forEach(function (p) { return new cls.PropertyViewModel(dst, p); });
            // ILiabilityViewModel
            coll = this.selectSourceList(srcLst, function (s) { return s.liabilities; }, srcMap, function (s) { return s.liability.getValues(); });
            coll.forEach(function (p) { return new cls.LiabilityViewModel(dst, p); });
            // IBorrowerViewModel
            coll = this.selectSourceList(srcLst, function (s) { return s.borrowers; }, srcMap, function (s) { return s.borrower.getValues(); });
            coll.forEach(function (p) { return new cls.BorrowerViewModel(dst, p); });
            // IIncomeInfoViewModel
            coll = this.selectSourceList(srcLst, function (s) { return s.incomes; }, srcMap, function (s) { return s.incomeInfo.getValues(); });
            coll.forEach(function (p) { return new cls.IncomeInfoViewModel(dst, p); });
            // IEmploymentInfoViewModel
            coll = this.selectSourceList(srcLst, function (s) { return s.employments; }, srcMap, function (s) { return s.employmentInfo.getValues(); });
            coll.forEach(function (p) { return cls.EmploymentInfoViewModelFactory.create(dst, p); });
            // ILoanApplicationViewModel
            coll = this.selectSourceList(srcLst, function (s) { return s.loanApplications; }, srcMap, function (s) { return s.loanApplication.getValues(); });
            coll.forEach(function (p) { return new cls.LoanApplicationViewModel(dst, p); });
        };
        TransactionInfo.selectSourceList = function (srcLst, selectorList, srcMap, selectorMap) {
            var rslt;
            if (!!srcLst)
                rslt = selectorList(srcLst);
            else if (!!srcMap)
                rslt = selectorMap(srcMap);
            else
                throw new Error("selectSourceList() requires either List or Map source param");
            return (!!rslt) ? rslt : [];
        };
        return TransactionInfo;
    })();
    cls.TransactionInfo = TransactionInfo;
})(cls || (cls = {}));
//# sourceMappingURL=transactionInfo.js.map