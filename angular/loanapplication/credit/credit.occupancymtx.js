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
    var OccupancyMtx = (function () {
        function OccupancyMtx(_loanPurposeCd, _subjOccupancyCd, _residenceSubjCd, _residenceOwnership, _reoCtgCd, _comments, _occupancyTypeList, _isDisabled) {
            var _this = this;
            this._loanPurposeCd = _loanPurposeCd;
            this._subjOccupancyCd = _subjOccupancyCd;
            this._residenceSubjCd = _residenceSubjCd;
            this._residenceOwnership = _residenceOwnership;
            this._reoCtgCd = _reoCtgCd;
            this._comments = _comments;
            this._occupancyTypeList = _occupancyTypeList;
            this._isDisabled = _isDisabled;
            //
            // Matching functions
            //
            this.locate = function (lookup) {
                OccupancyMtx.configureLocator(lookup);
                // minor optimization for pre-emptive , mutually-exclusive Refi/Purch loan level attribute
                var sets = null;
                if (_this.getLoanPurpose() == 2 /* Refinance */) {
                    sets = [OccupancyMtx._collPreemptive, OccupancyMtx._collRefi];
                }
                else {
                    sets = [OccupancyMtx._collPreemptive, OccupancyMtx._collPurch];
                }
                var omtxFound = null;
                for (var i = 0; omtxFound == null && i < sets.length; i++) {
                    omtxFound = lib.findFirst(sets[i], function (o) { return o.matches(_this); });
                }
                if (!omtxFound) {
                    // console.warn("Occupancy Matrix not found");
                    // If you decide for "all" later on: "Primary Residence", "Second/Vacation Home", "Investment Property"
                    omtxFound = OccupancyMtx.genomtx(lookup, null, null, null, null, null, null, [], true);
                    omtxFound._isValidComments = false;
                }
                return omtxFound;
            };
            this.matches = function (omtx) {
                if (!omtx)
                    return false;
                if (!_this.matchesLoanPurpose(omtx.getLoanPurpose()))
                    return false;
                if (!_this.matchesSubjOccupancyCd(omtx.getSubjOccupancyCd()))
                    return false;
                if (!_this.matchesResidenceSubjCd(omtx.getResidenceSubjCd()))
                    return false;
                if (!_this.matchesResidenceOwnership(omtx.getResidenceOwnership()))
                    return false;
                if (!_this.matchesReoCtgCd(omtx.getReoCtgCd()))
                    return false;
                if (!_this.matchesComments(omtx.getComments()))
                    return false;
                return true;
            };
            // matches , treat [null] as "any" always [true]
            this.comparePrimative = function (ival, fval) {
                if (ival == null)
                    return true;
                var cval = fval();
                return ival == cval;
            };
            // matches , treat [null] as "any" always [true] , perform commutative comparisons
            this.compareFlaggedEnum = function (ival, fval) {
                if (ival == null)
                    return true;
                var cval = fval();
                // commutative
                var matches = (cval.contains(ival) || ival.contains(cval));
                return matches;
            };
            //
            // Input
            //
            // loanPurposeCd
            this.getLoanPurpose = function () {
                return _this._loanPurposeCd;
            };
            this.matchesLoanPurpose = function (loanPurpose) {
                return _this.comparePrimative(loanPurpose, _this.getLoanPurpose);
            };
            // subjOccupancyCd
            this.getSubjOccupancyCd = function () {
                return _this._subjOccupancyCd;
            };
            this.matchesSubjOccupancyCd = function (subjOccupancyCd) {
                return _this.comparePrimative(subjOccupancyCd, _this.getSubjOccupancyCd);
            };
            // residenceSubjCd
            this.getResidenceSubjCd = function () {
                return _this._residenceSubjCd;
            };
            this.matchesResidenceSubjCd = function (residenceSubjCd) {
                return _this.comparePrimative(residenceSubjCd, _this.getResidenceSubjCd);
            };
            // residenceOwnership
            this.getResidenceOwnership = function () {
                return _this._residenceOwnership;
            };
            this.matchesResidenceOwnership = function (residenceOwnership) {
                return _this.comparePrimative(residenceOwnership, _this.getResidenceOwnership);
            };
            // reoCtgCd
            this.getReoCtgCd = function () {
                return _this._reoCtgCd;
            };
            this.matchesReoCtgCd = function (reoCtgCd) {
                return _this.compareFlaggedEnum(reoCtgCd, _this.getReoCtgCd);
            };
            // comments
            this.getComments = function () {
                return _this._comments;
            };
            this.matchesComments = function (comments) {
                return _this.compareFlaggedEnum(comments, _this.getComments);
            };
            this._isValidComments = true;
        }
        Object.defineProperty(OccupancyMtx.prototype, "occupancyTypeList", {
            //
            // Output
            //
            // occupancyTypeList
            get: function () {
                return this._occupancyTypeList;
            },
            set: function (readOnly) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OccupancyMtx.prototype, "isDisabled", {
            // isDisabled
            get: function () {
                return this._isDisabled;
            },
            set: function (readOnly) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OccupancyMtx.prototype, "isValidComments", {
            get: function () {
                return this._isValidComments;
            },
            set: function (readOnly) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        //
        // Locator Configuration
        //
        OccupancyMtx._isConfigured = false;
        // minor optimization for pre-emptive , mutually-exclusive Refi/Purch loan level attribute
        OccupancyMtx._collPreemptive = null;
        OccupancyMtx._collRefi = null;
        OccupancyMtx._collPurch = null;
        OccupancyMtx._pledgedAssetComments = null;
        OccupancyMtx._occupancyTypes = null;
        /**
        * @desc Gets all occupancy types from lookup.
        */
        OccupancyMtx.getAllOccupancyTypes = function () {
            return lib.getLookupStrings(OccupancyMtx._occupancyTypes);
        };
        /**
        * @desc Gets all pledged asset comments from lookup.
        */
        OccupancyMtx.getAllComments = function (excludeSales, excludeDuplicate, excludeNotMyLoan, excludeNotAMortgage) {
            if (excludeSales === void 0) { excludeSales = true; }
            if (excludeDuplicate === void 0) { excludeDuplicate = true; }
            if (excludeNotMyLoan === void 0) { excludeNotMyLoan = true; }
            if (excludeNotAMortgage === void 0) { excludeNotAMortgage = true; }
            var retVal = lib.getLookupStrings(OccupancyMtx._pledgedAssetComments);
            // Exclude "Not My Loan" comment.
            if (excludeNotMyLoan) {
                retVal = OccupancyMtx.getFilteredCommentCollection(retVal, 6 /* NotMyLoan */);
            }
            // Exclude "Not A Mortgage" comment.
            if (excludeNotAMortgage) {
                retVal = OccupancyMtx.getFilteredCommentCollection(retVal, 8 /* NotAMortgage */);
            }
            // Exclude "Pending Sale" and "Sold" comments.
            if (excludeSales) {
                retVal = OccupancyMtx.getFilteredCommentCollection(retVal, 7 /* PendingSale */);
                retVal = OccupancyMtx.getFilteredCommentCollection(retVal, 5 /* Sold */);
            }
            if (excludeDuplicate) {
                retVal = OccupancyMtx.getFilteredCommentCollection(retVal, 9 /* Duplicate */);
            }
            return retVal;
        };
        /**
        * @desc Filters pledged asset comment collection to exclude comment type.
        */
        OccupancyMtx.getFilteredCommentCollection = function (inputCommentCollection, commentType) {
            var exclude = lib.findFirst(OccupancyMtx._pledgedAssetComments, function (comment) { return comment.value == String(commentType); });
            if (!!exclude) {
                return lib.filter(inputCommentCollection, function (i) { return i != exclude.text; });
            }
            return inputCommentCollection;
        };
        /**
         * @desc Retrieves comment strings by provided enum collection.
         */
        OccupancyMtx.getOccupancyStringsByEnum = function (occupancyTypes) {
            return lib.getLookupStringsByEnum(OccupancyMtx._occupancyTypes, occupancyTypes);
        };
        /**
        * @desc Retrieves comment strings by provided enum collection.
        */
        OccupancyMtx.getCommentStringsByEnum = function (commentTypes) {
            return lib.getLookupStringsByEnum(OccupancyMtx._pledgedAssetComments, commentTypes);
        };
        OccupancyMtx.configureLocator = function (lookup) {
            if (OccupancyMtx._isConfigured)
                return;
            OccupancyMtx._pledgedAssetComments = lookup.pledgetAssetComments;
            OccupancyMtx._occupancyTypes = lookup.occupancyTypeList;
            var omx = null;
            // pre
            omx = [];
            omx.push(OccupancyMtx.genomtx(lookup, null, null, null, null, null, OccupancyMtx.getCommentStringsByEnum([8 /* NotAMortgage */, 6 /* NotMyLoan */]), [], true));
            OccupancyMtx._collPreemptive = omx;
            // refi
            omx = [];
            omx.push(OccupancyMtx.genomtx(lookup, 2 /* Refinance */, 1 /* PrimaryResidence */, 1 /* IsSame */, 0 /* Own */, [credit.ReoCategorizationEnum.SubjectProperty], OccupancyMtx.getAllComments(true, false), OccupancyMtx.getAllOccupancyTypes(), true));
            omx.push(OccupancyMtx.genomtx(lookup, 2 /* Refinance */, 1 /* PrimaryResidence */, 1 /* IsSame */, 0 /* Own */, [credit.ReoCategorizationEnum.NonSubjectProperty], OccupancyMtx.getAllComments(false), OccupancyMtx.getOccupancyStringsByEnum([3 /* SecondVacationHome */, 2 /* InvestmentProperty */]), false));
            omx.push(OccupancyMtx.genomtx(lookup, 2 /* Refinance */, 2 /* InvestmentProperty */, 2 /* IsDiff */, 0 /* Own */, [credit.ReoCategorizationEnum.SubjectProperty], OccupancyMtx.getAllComments(true, false), OccupancyMtx.getAllOccupancyTypes(), true));
            omx.push(OccupancyMtx.genomtx(lookup, 2 /* Refinance */, 2 /* InvestmentProperty */, 2 /* IsDiff */, 0 /* Own */, [credit.ReoCategorizationEnum.CurrentResidence], OccupancyMtx.getAllComments(), OccupancyMtx.getAllOccupancyTypes(), true));
            omx.push(OccupancyMtx.genomtx(lookup, 2 /* Refinance */, 2 /* InvestmentProperty */, 2 /* IsDiff */, 0 /* Own */, [credit.ReoCategorizationEnum.NonSubjectProperty, credit.ReoCategorizationEnum.NonCurrentResidence], OccupancyMtx.getAllComments(false), OccupancyMtx.getOccupancyStringsByEnum([3 /* SecondVacationHome */, 2 /* InvestmentProperty */]), false));
            omx.push(OccupancyMtx.genomtx(lookup, 2 /* Refinance */, 2 /* InvestmentProperty */, 2 /* IsDiff */, 1 /* Rent */, [credit.ReoCategorizationEnum.SubjectProperty], OccupancyMtx.getAllComments(true, false), OccupancyMtx.getAllOccupancyTypes(), true));
            omx.push(OccupancyMtx.genomtx(lookup, 2 /* Refinance */, 2 /* InvestmentProperty */, 2 /* IsDiff */, 1 /* Rent */, [credit.ReoCategorizationEnum.NonSubjectProperty], OccupancyMtx.getAllComments(false), OccupancyMtx.getOccupancyStringsByEnum([3 /* SecondVacationHome */, 2 /* InvestmentProperty */]), false));
            omx.push(OccupancyMtx.genomtx(lookup, 2 /* Refinance */, 2 /* InvestmentProperty */, 2 /* IsDiff */, 2 /* RentFree */, [credit.ReoCategorizationEnum.NonSubjectProperty], OccupancyMtx.getAllComments(false), OccupancyMtx.getOccupancyStringsByEnum([3 /* SecondVacationHome */, 2 /* InvestmentProperty */]), false));
            omx.push(OccupancyMtx.genomtx(lookup, 2 /* Refinance */, 2 /* InvestmentProperty */, 2 /* IsDiff */, 2 /* RentFree */, [credit.ReoCategorizationEnum.SubjectProperty], OccupancyMtx.getAllComments(true, false), OccupancyMtx.getAllOccupancyTypes(), true));
            omx.push(OccupancyMtx.genomtx(lookup, 2 /* Refinance */, 3 /* SecondVacationHome */, 2 /* IsDiff */, 0 /* Own */, [credit.ReoCategorizationEnum.SubjectProperty], OccupancyMtx.getAllComments(true, false), OccupancyMtx.getAllOccupancyTypes(), true));
            omx.push(OccupancyMtx.genomtx(lookup, 2 /* Refinance */, 3 /* SecondVacationHome */, 2 /* IsDiff */, 0 /* Own */, [credit.ReoCategorizationEnum.CurrentResidence], OccupancyMtx.getAllComments(), OccupancyMtx.getAllOccupancyTypes(), true));
            omx.push(OccupancyMtx.genomtx(lookup, 2 /* Refinance */, 3 /* SecondVacationHome */, 2 /* IsDiff */, 0 /* Own */, [credit.ReoCategorizationEnum.NonSubjectProperty, credit.ReoCategorizationEnum.NonCurrentResidence], OccupancyMtx.getAllComments(false), OccupancyMtx.getOccupancyStringsByEnum([3 /* SecondVacationHome */, 2 /* InvestmentProperty */]), false));
            omx.push(OccupancyMtx.genomtx(lookup, 2 /* Refinance */, 3 /* SecondVacationHome */, 2 /* IsDiff */, 1 /* Rent */, [credit.ReoCategorizationEnum.SubjectProperty], OccupancyMtx.getAllComments(true, false), OccupancyMtx.getAllOccupancyTypes(), true));
            omx.push(OccupancyMtx.genomtx(lookup, 2 /* Refinance */, 3 /* SecondVacationHome */, 2 /* IsDiff */, 1 /* Rent */, [credit.ReoCategorizationEnum.NonSubjectProperty], OccupancyMtx.getAllComments(false), OccupancyMtx.getOccupancyStringsByEnum([3 /* SecondVacationHome */, 2 /* InvestmentProperty */]), false));
            omx.push(OccupancyMtx.genomtx(lookup, 2 /* Refinance */, 3 /* SecondVacationHome */, 2 /* IsDiff */, 2 /* RentFree */, [credit.ReoCategorizationEnum.SubjectProperty], OccupancyMtx.getAllComments(true, false), OccupancyMtx.getAllOccupancyTypes(), true));
            omx.push(OccupancyMtx.genomtx(lookup, 2 /* Refinance */, 3 /* SecondVacationHome */, 2 /* IsDiff */, 2 /* RentFree */, [credit.ReoCategorizationEnum.NonSubjectProperty], OccupancyMtx.getAllComments(false), OccupancyMtx.getOccupancyStringsByEnum([3 /* SecondVacationHome */, 2 /* InvestmentProperty */]), false));
            OccupancyMtx._collRefi = omx;
            // purch
            omx = [];
            omx.push(OccupancyMtx.genomtx(lookup, 1 /* Purchase */, 1 /* PrimaryResidence */, 2 /* IsDiff */, 0 /* Own */, [credit.ReoCategorizationEnum.CurrentResidence], OccupancyMtx.getCommentStringsByEnum([7 /* PendingSale */, 5 /* Sold */]), OccupancyMtx.getOccupancyStringsByEnum([1 /* PrimaryResidence */]), true));
            omx.push(OccupancyMtx.genomtx(lookup, 1 /* Purchase */, 1 /* PrimaryResidence */, 2 /* IsDiff */, 0 /* Own */, [credit.ReoCategorizationEnum.CurrentResidence], OccupancyMtx.getCommentStringsByEnum([0 /* DoNotPayoff */, 1 /* PaidOffFreeAndClear */]), OccupancyMtx.getOccupancyStringsByEnum([3 /* SecondVacationHome */, 2 /* InvestmentProperty */]), false));
            omx.push(OccupancyMtx.genomtx(lookup, 1 /* Purchase */, 1 /* PrimaryResidence */, 2 /* IsDiff */, 0 /* Own */, [credit.ReoCategorizationEnum.NonSubjectProperty], OccupancyMtx.getCommentStringsByEnum([0 /* DoNotPayoff */, 1 /* PaidOffFreeAndClear */, 7 /* PendingSale */, 5 /* Sold */]), OccupancyMtx.getOccupancyStringsByEnum([3 /* SecondVacationHome */, 2 /* InvestmentProperty */]), false));
            omx.push(OccupancyMtx.genomtx(lookup, 1 /* Purchase */, 1 /* PrimaryResidence */, 2 /* IsDiff */, 1 /* Rent */, [credit.ReoCategorizationEnum.NonSubjectProperty], OccupancyMtx.getCommentStringsByEnum([0 /* DoNotPayoff */, 1 /* PaidOffFreeAndClear */, 7 /* PendingSale */, 5 /* Sold */]), OccupancyMtx.getOccupancyStringsByEnum([3 /* SecondVacationHome */, 2 /* InvestmentProperty */]), false));
            omx.push(OccupancyMtx.genomtx(lookup, 1 /* Purchase */, 1 /* PrimaryResidence */, 2 /* IsDiff */, 2 /* RentFree */, [credit.ReoCategorizationEnum.NonSubjectProperty], OccupancyMtx.getCommentStringsByEnum([0 /* DoNotPayoff */, 1 /* PaidOffFreeAndClear */, 7 /* PendingSale */, 5 /* Sold */]), OccupancyMtx.getOccupancyStringsByEnum([3 /* SecondVacationHome */, 2 /* InvestmentProperty */]), false));
            omx.push(OccupancyMtx.genomtx(lookup, 1 /* Purchase */, 2 /* InvestmentProperty */, 2 /* IsDiff */, 0 /* Own */, [credit.ReoCategorizationEnum.CurrentResidence], OccupancyMtx.getCommentStringsByEnum([0 /* DoNotPayoff */, 1 /* PaidOffFreeAndClear */]), OccupancyMtx.getOccupancyStringsByEnum([1 /* PrimaryResidence */]), true));
            omx.push(OccupancyMtx.genomtx(lookup, 1 /* Purchase */, 2 /* InvestmentProperty */, 2 /* IsDiff */, 0 /* Own */, [credit.ReoCategorizationEnum.NonSubjectProperty, credit.ReoCategorizationEnum.NonCurrentResidence], OccupancyMtx.getCommentStringsByEnum([7 /* PendingSale */, 5 /* Sold */, 0 /* DoNotPayoff */, 1 /* PaidOffFreeAndClear */]), OccupancyMtx.getOccupancyStringsByEnum([3 /* SecondVacationHome */, 2 /* InvestmentProperty */]), false));
            omx.push(OccupancyMtx.genomtx(lookup, 1 /* Purchase */, 2 /* InvestmentProperty */, 2 /* IsDiff */, 1 /* Rent */, [credit.ReoCategorizationEnum.NonSubjectProperty], OccupancyMtx.getCommentStringsByEnum([0 /* DoNotPayoff */, 1 /* PaidOffFreeAndClear */, 7 /* PendingSale */, 5 /* Sold */]), OccupancyMtx.getOccupancyStringsByEnum([3 /* SecondVacationHome */, 2 /* InvestmentProperty */]), false));
            omx.push(OccupancyMtx.genomtx(lookup, 1 /* Purchase */, 2 /* InvestmentProperty */, 2 /* IsDiff */, 2 /* RentFree */, [credit.ReoCategorizationEnum.NonSubjectProperty], OccupancyMtx.getCommentStringsByEnum([0 /* DoNotPayoff */, 1 /* PaidOffFreeAndClear */, 7 /* PendingSale */, 5 /* Sold */]), OccupancyMtx.getAllOccupancyTypes(), false));
            omx.push(OccupancyMtx.genomtx(lookup, 1 /* Purchase */, 3 /* SecondVacationHome */, 2 /* IsDiff */, 0 /* Own */, [credit.ReoCategorizationEnum.CurrentResidence], OccupancyMtx.getCommentStringsByEnum([0 /* DoNotPayoff */, 1 /* PaidOffFreeAndClear */]), OccupancyMtx.getOccupancyStringsByEnum([1 /* PrimaryResidence */]), true));
            omx.push(OccupancyMtx.genomtx(lookup, 1 /* Purchase */, 3 /* SecondVacationHome */, 2 /* IsDiff */, 0 /* Own */, [credit.ReoCategorizationEnum.NonSubjectProperty, credit.ReoCategorizationEnum.NonCurrentResidence], OccupancyMtx.getCommentStringsByEnum([7 /* PendingSale */, 5 /* Sold */, 0 /* DoNotPayoff */, 1 /* PaidOffFreeAndClear */]), OccupancyMtx.getOccupancyStringsByEnum([3 /* SecondVacationHome */, 2 /* InvestmentProperty */]), false));
            omx.push(OccupancyMtx.genomtx(lookup, 1 /* Purchase */, 3 /* SecondVacationHome */, 2 /* IsDiff */, 1 /* Rent */, [credit.ReoCategorizationEnum.NonSubjectProperty], OccupancyMtx.getCommentStringsByEnum([0 /* DoNotPayoff */, 1 /* PaidOffFreeAndClear */, 7 /* PendingSale */, 5 /* Sold */]), OccupancyMtx.getOccupancyStringsByEnum([3 /* SecondVacationHome */, 2 /* InvestmentProperty */]), false));
            omx.push(OccupancyMtx.genomtx(lookup, 1 /* Purchase */, 3 /* SecondVacationHome */, 2 /* IsDiff */, 2 /* RentFree */, [credit.ReoCategorizationEnum.NonSubjectProperty], OccupancyMtx.getCommentStringsByEnum([0 /* DoNotPayoff */, 1 /* PaidOffFreeAndClear */, 7 /* PendingSale */, 5 /* Sold */]), OccupancyMtx.getAllOccupancyTypes(), false));
            OccupancyMtx._collPurch = omx;
            // mark complete
            OccupancyMtx._isConfigured = true;
        };
        OccupancyMtx.genomtx = function (lookup, loanPurpCd, subjOccupancy, residenceSubjCd, residenceOwnership, reoCtgCds, commentsStr, occupancyTypesStr, isDisabled) {
            // lib.IFlaggedEnum
            reoCtgCds = !!reoCtgCds ? reoCtgCds : [];
            var reoCtgCd = credit.reoCategorizationFlgFromEnums(reoCtgCds);
            commentsStr = !!commentsStr ? commentsStr : [];
            var comments = lookup.pledgetAssetCommentsFlgFromNames(commentsStr);
            // srv.ILookupItem
            occupancyTypesStr = !!occupancyTypesStr ? occupancyTypesStr : [];
            var occupancyTypes = lookup.occupancyTypeListsByNames(occupancyTypesStr);
            // OccupancyMtx
            var omx = new OccupancyMtx(loanPurpCd, subjOccupancy, residenceSubjCd, residenceOwnership, reoCtgCd, comments, occupancyTypes, isDisabled);
            return omx;
        };
        return OccupancyMtx;
    })();
    credit.OccupancyMtx = OccupancyMtx;
})(credit || (credit = {}));
//# sourceMappingURL=credit.occupancymtx.js.map