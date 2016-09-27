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
var credit;
(function (credit) {
    (function (SubjPropRelationEnum) {
        SubjPropRelationEnum[SubjPropRelationEnum["IsSame"] = 1] = "IsSame";
        SubjPropRelationEnum[SubjPropRelationEnum["IsDiff"] = 2] = "IsDiff";
    })(credit.SubjPropRelationEnum || (credit.SubjPropRelationEnum = {}));
    var SubjPropRelationEnum = credit.SubjPropRelationEnum;
    (function (ReoCategorizationEnum) {
        ReoCategorizationEnum[ReoCategorizationEnum["SubjectProperty"] = 1 << 0] = "SubjectProperty";
        ReoCategorizationEnum[ReoCategorizationEnum["NonSubjectProperty"] = 1 << 1] = "NonSubjectProperty";
        ReoCategorizationEnum[ReoCategorizationEnum["CurrentResidence"] = 1 << 2] = "CurrentResidence";
        ReoCategorizationEnum[ReoCategorizationEnum["NonCurrentResidence"] = 1 << 3] = "NonCurrentResidence";
        ReoCategorizationEnum[ReoCategorizationEnum["AdHoc"] = 1 << 4] = "AdHoc";
        ReoCategorizationEnum[ReoCategorizationEnum["NonAdHoc"] = 1 << 5] = "NonAdHoc";
    })(credit.ReoCategorizationEnum || (credit.ReoCategorizationEnum = {}));
    var ReoCategorizationEnum = credit.ReoCategorizationEnum;
    credit.ReoCategorizationFlg = lib.createFlaggedEnum(ReoCategorizationEnum, 1 << 5);
    credit.reoCategorizationFlgFromEnums = function (reoCtgCds) {
        var reoCtgCd = new credit.ReoCategorizationFlg(0);
        for (var i = 0; i < reoCtgCds.length; i++) {
            reoCtgCd = reoCtgCd.add(reoCtgCds[i]);
        }
        return reoCtgCd;
    };
})(credit || (credit = {}));
//# sourceMappingURL=credit.enumerations.js.map