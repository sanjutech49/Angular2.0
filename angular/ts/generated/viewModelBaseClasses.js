// This file (viewModelBaseClasses.ts - ver 1.0) has been has been automatically generated, do not modify!
// To extend an interface, create a file that exports the same interface name within the same module name with ONLY the ADDITIONAL properties.
// TypeScript will automatically merge both interfaces together.
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="enums.ts" />	
/// <reference path="../extendedViewModels/genericTypes.ts" />	
/// <reference path="viewModels.ts" />	
var srv;
(function (srv) {
    var cls;
    (function (cls) {
        var BaseViewModel = (function () {
            function BaseViewModel() {
            }
            return BaseViewModel;
        })();
        cls.BaseViewModel = BaseViewModel;
        var GlobalContactsViewModelReSTOpEnvelopeBase = (function () {
            function GlobalContactsViewModelReSTOpEnvelopeBase() {
            }
            return GlobalContactsViewModelReSTOpEnvelopeBase;
        })();
        cls.GlobalContactsViewModelReSTOpEnvelopeBase = GlobalContactsViewModelReSTOpEnvelopeBase;
        var LedgerEntryBase = (function () {
            function LedgerEntryBase() {
            }
            return LedgerEntryBase;
        })();
        cls.LedgerEntryBase = LedgerEntryBase;
        var LiabilityInfoViewModel = (function () {
            function LiabilityInfoViewModel() {
            }
            return LiabilityInfoViewModel;
        })();
        cls.LiabilityInfoViewModel = LiabilityInfoViewModel;
        var LoanMember = (function () {
            function LoanMember() {
            }
            return LoanMember;
        })();
        cls.LoanMember = LoanMember;
        var LookupItem = (function () {
            function LookupItem() {
            }
            return LookupItem;
        })();
        cls.LookupItem = LookupItem;
        var TransactionSummaryViewModelReSTOpEnvelopeBase = (function () {
            function TransactionSummaryViewModelReSTOpEnvelopeBase() {
            }
            return TransactionSummaryViewModelReSTOpEnvelopeBase;
        })();
        cls.TransactionSummaryViewModelReSTOpEnvelopeBase = TransactionSummaryViewModelReSTOpEnvelopeBase;
        var BorrowerViewModel = (function (_super) {
            __extends(BorrowerViewModel, _super);
            function BorrowerViewModel() {
                _super.call(this);
            }
            return BorrowerViewModel;
        })(LoanMember);
        cls.BorrowerViewModel = BorrowerViewModel;
        var CostBase = (function (_super) {
            __extends(CostBase, _super);
            function CostBase() {
                _super.call(this);
            }
            return CostBase;
        })(LedgerEntryBase);
        cls.CostBase = CostBase;
    })(cls = srv.cls || (srv.cls = {}));
})(srv || (srv = {}));
//# sourceMappingURL=viewModelBaseClasses.js.map