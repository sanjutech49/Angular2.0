/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../ts/extendedViewModels/extendedViewModels.ts" />
/// <reference path="../../ts/extendedViewModels/loan.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/property.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/transactionInfo.ts" />
/// <reference path="../../ts/lib/referenceWrapper.ts" />
/// <reference path="../../ts/lib/common.util.ts" />
/// <reference path="../../ts/lib/IdentityGenerator.ts" />
/// <reference path="../../loanevents/loanEvents.service.ts" />
/// <reference path="../../Common/guid.service.ts" />

module credit {
    export enum SubjPropRelationEnum {
        IsSame = 1,
        IsDiff = 2,
    }

    export enum ReoCategorizationEnum {
        SubjectProperty = 1 << 0,
        NonSubjectProperty = 1 << 1,
        CurrentResidence = 1 << 2,
        NonCurrentResidence = 1 << 3,
        AdHoc = 1 << 4,
        NonAdHoc = 1 << 5,
        // ReoCategorizationFlg *MUST* Be updated whenever new values are added here.
    }
    export var ReoCategorizationFlg: lib.IFlaggedEnum = lib.createFlaggedEnum(ReoCategorizationEnum, 1 << 5);

    export var reoCategorizationFlgFromEnums = (reoCtgCds: ReoCategorizationEnum[]): lib.IFlaggedEnum => {
        var reoCtgCd: lib.IFlaggedEnum = new ReoCategorizationFlg(0);
        for (var i = 0; i < reoCtgCds.length; i++) {
            reoCtgCd = reoCtgCd.add(<number>reoCtgCds[i]);
        }
        return reoCtgCd;
    }
}
