/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../common/common.objects.ts" />

module srv {
    export interface ILookupViewModel {
        occupancyTypeListsByNames? (names: string[]): srv.ILookupItem[];
        occupancyTypeListsByValues? (values: string[]): srv.ILookupItem[];
        pledgetAssetCommentsFlgMapCls?: lib.IFlaggedEnum;
        pledgetAssetCommentsFlgFromNames? (names: string[]): lib.IFlaggedEnum;
        pledgetAssetCommentsFlgFromValues? (values: string[]): lib.IFlaggedEnum;
        pledgetAssetCommentsByNames? (names: string[]): srv.ILookupItem[];
        pledgetAssetCommentsByValues? (values: string[]): srv.ILookupItem[];
        getStringValue? (lookups: srv.ILookupItem[], value: string): string;
    }
}

module cls {
    export var lookupsToFlgMapCls = (lookups: srv.ILookupItem[]): lib.IFlaggedEnum  => {
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
    }

    export var lookupToFlgMapItem = (flgMapCls: lib.IFlaggedEnum, lookups: srv.ILookupItem[]): lib.IFlaggedEnum => {
        lookups = !!lookups ? lookups : [];

        var flgMapItem: lib.IFlaggedEnum = new flgMapCls(0);

        for (var i = 0; i < lookups.length; i++) {
            flgMapItem = flgMapItem.add(lookups[i].text);
        }

        return flgMapItem;
    }

    export class LookupViewModel extends srv.cls.LookupViewModel {
        accountOptions: srv.IList<srv.ILookupItem>;

        constructor(lookupVm: srv.ILookupViewModel) {
            super();
            lib.copyState(lookupVm, this);
        }

        private _pledgetAssetCommentsFlgMapCls: lib.IFlaggedEnum = null;
        public get pledgetAssetCommentsFlgMapCls(): lib.IFlaggedEnum {
            if (this._pledgetAssetCommentsFlgMapCls == null) {
                this._pledgetAssetCommentsFlgMapCls = lookupsToFlgMapCls(this.pledgetAssetComments);
            }
            return this._pledgetAssetCommentsFlgMapCls;
        }
        public set pledgetAssetCommentsFlgMapCls(readOnly: lib.IFlaggedEnum) {
            /*Read-Only*/
        }


        //
        // occupancyTypeLists
        //

        public occupancyTypeListsByNames = (names: string[]): srv.ILookupItem[]=> {
            return LookupViewModel.byNames(names, this.occupancyTypeList);
        }

        public occupancyTypeListsByValues = (values: string[]): srv.ILookupItem[]=> {
            return LookupViewModel.byValues(values, this.occupancyTypeList);
        }


        //
        // pledgetAssetComments
        //

        public pledgetAssetCommentsFlgFromNames = (names: string[]): lib.IFlaggedEnum => {
            var pledgetAssetCommentsColl = this.pledgetAssetCommentsByNames(names);
            var pledgetAssetCommentsFlg: lib.IFlaggedEnum = lookupToFlgMapItem(this.pledgetAssetCommentsFlgMapCls, pledgetAssetCommentsColl);
            return pledgetAssetCommentsFlg;
        }

        public pledgetAssetCommentsFlgFromValues = (values: string[]): lib.IFlaggedEnum => {
            var pledgetAssetCommentsColl = this.pledgetAssetCommentsByValues(values);
            var pledgetAssetCommentsFlg: lib.IFlaggedEnum = lookupToFlgMapItem(this.pledgetAssetCommentsFlgMapCls, pledgetAssetCommentsColl);
            return pledgetAssetCommentsFlg;
        }

        public pledgetAssetCommentsByNames = (names: string[]): srv.ILookupItem[]=> {
            return LookupViewModel.byNames(names, this.pledgetAssetComments);
        }

        public pledgetAssetCommentsByValues = (values: string[]): srv.ILookupItem[]=> {
            return LookupViewModel.byValues(values, this.pledgetAssetComments);
        }

        private static byNames = (names: string[], lookups: srv.ILookupItem[]): srv.ILookupItem[]=> {
            return lib.filter(lookups, o => !!lib.findFirst(names, n => n == o.text));
        }

        private static byValues = (values: string[], lookups: srv.ILookupItem[]): srv.ILookupItem[]=> {
            return lib.filter(lookups, o => !!lib.findFirst(values, n => n == o.value));
        }

        getStringValue = (lookups: srv.ILookupItem[], value: string): string => {
            var retVal: string = "";
            lib.forEach(lookups, function (e) {
                if (e.value == value) {
                    retVal = e.stringValue;
                }
            })

            return retVal;
        }
    }
}
