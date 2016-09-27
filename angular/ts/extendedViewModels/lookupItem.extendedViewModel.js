/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../common/common.objects.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var cls;
(function (cls) {
    cls.lookupsToFlgMapCls = function (lookups) {
        lookups = !!lookups ? lookups : [];
        // 30 just to be safe-side
        if (lookups.length > 30) {
            throw new Error("ILookupItem[] of greater than 30 is not supported (recieved " + lookups.length + ")");
        }
        var valueMap = new Object();
        for (var i = 0; i < lookups.length; i++) {
            valueMap[lookups[i].text] = 1 << i;
        }
        var valueMapFlgCls = lib.createFlaggedEnum(valueMap, 1 << lookups.length);
        return valueMapFlgCls;
    };
    cls.lookupToFlgMapItem = function (flgMapCls, lookups) {
        lookups = !!lookups ? lookups : [];
        var flgMapItem = new flgMapCls(0);
        for (var i = 0; i < lookups.length; i++) {
            flgMapItem = flgMapItem.add(lookups[i].text);
        }
        return flgMapItem;
    };
    var LookupViewModel = (function (_super) {
        __extends(LookupViewModel, _super);
        function LookupViewModel(lookupVm) {
            var _this = this;
            _super.call(this);
            this._pledgetAssetCommentsFlgMapCls = null;
            //
            // occupancyTypeLists
            //
            this.occupancyTypeListsByNames = function (names) {
                return LookupViewModel.byNames(names, _this.occupancyTypeList);
            };
            this.occupancyTypeListsByValues = function (values) {
                return LookupViewModel.byValues(values, _this.occupancyTypeList);
            };
            //
            // pledgetAssetComments
            //
            this.pledgetAssetCommentsFlgFromNames = function (names) {
                var pledgetAssetCommentsColl = _this.pledgetAssetCommentsByNames(names);
                var pledgetAssetCommentsFlg = cls.lookupToFlgMapItem(_this.pledgetAssetCommentsFlgMapCls, pledgetAssetCommentsColl);
                return pledgetAssetCommentsFlg;
            };
            this.pledgetAssetCommentsFlgFromValues = function (values) {
                var pledgetAssetCommentsColl = _this.pledgetAssetCommentsByValues(values);
                var pledgetAssetCommentsFlg = cls.lookupToFlgMapItem(_this.pledgetAssetCommentsFlgMapCls, pledgetAssetCommentsColl);
                return pledgetAssetCommentsFlg;
            };
            this.pledgetAssetCommentsByNames = function (names) {
                return LookupViewModel.byNames(names, _this.pledgetAssetComments);
            };
            this.pledgetAssetCommentsByValues = function (values) {
                return LookupViewModel.byValues(values, _this.pledgetAssetComments);
            };
            this.getStringValue = function (lookups, value) {
                var retVal = "";
                lib.forEach(lookups, function (e) {
                    if (e.value == value) {
                        retVal = e.stringValue;
                    }
                });
                return retVal;
            };
            lib.copyState(lookupVm, this);
        }
        Object.defineProperty(LookupViewModel.prototype, "pledgetAssetCommentsFlgMapCls", {
            get: function () {
                if (this._pledgetAssetCommentsFlgMapCls == null) {
                    this._pledgetAssetCommentsFlgMapCls = cls.lookupsToFlgMapCls(this.pledgetAssetComments);
                }
                return this._pledgetAssetCommentsFlgMapCls;
            },
            set: function (readOnly) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        LookupViewModel.byNames = function (names, lookups) {
            return lib.filter(lookups, function (o) { return !!lib.findFirst(names, function (n) { return n == o.text; }); });
        };
        LookupViewModel.byValues = function (values, lookups) {
            return lib.filter(lookups, function (o) { return !!lib.findFirst(values, function (n) { return n == o.value; }); });
        };
        return LookupViewModel;
    })(srv.cls.LookupViewModel);
    cls.LookupViewModel = LookupViewModel;
})(cls || (cls = {}));
//# sourceMappingURL=lookupItem.extendedViewModel.js.map