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

    export class OccupancyMtx {

        public constructor(private _loanPurposeCd: srv.LoanPurposeTypeEnum, private _subjOccupancyCd: srv.PropertyUsageTypeEnum,
            private _residenceSubjCd: SubjPropRelationEnum, private _residenceOwnership: srv.OwnershipStatusTypeEnum,
            private _reoCtgCd: lib.IFlaggedEnum, private _comments: lib.IFlaggedEnum,
            private _occupancyTypeList?: srv.ILookupItem[], private _isDisabled?: boolean) {

            this._isValidComments = true;
        }

        //
        // Locator Configuration
        //

        private static _isConfigured: boolean = false;
        // minor optimization for pre-emptive , mutually-exclusive Refi/Purch loan level attribute
        private static _collPreemptive: OccupancyMtx[] = null;
        private static _collRefi: OccupancyMtx[] = null;
        private static _collPurch: OccupancyMtx[] = null;

        private static _pledgedAssetComments: srv.IList<srv.ILookupItem> = null;
        private static _occupancyTypes: srv.IList<srv.ILookupItem> = null;

        /**
        * @desc Gets all occupancy types from lookup.
        */
        private static getAllOccupancyTypes = (): string[] => {
            return lib.getLookupStrings(OccupancyMtx._occupancyTypes);
        }

        /**
        * @desc Gets all pledged asset comments from lookup.
        */
        private static getAllComments = (excludeSales: boolean = true, excludeDuplicate: boolean = true , excludeNotMyLoan: boolean = true, excludeNotAMortgage: boolean = true): string[] => {

            var retVal: string[] = lib.getLookupStrings(OccupancyMtx._pledgedAssetComments);

            // Exclude "Not My Loan" comment.
            if (excludeNotMyLoan) {
                retVal = OccupancyMtx.getFilteredCommentCollection(retVal, srv.pledgedAssetCommentType.NotMyLoan);
            }

            // Exclude "Not A Mortgage" comment.
            if (excludeNotAMortgage) {
                retVal = OccupancyMtx.getFilteredCommentCollection(retVal, srv.pledgedAssetCommentType.NotAMortgage);
            }

             // Exclude "Pending Sale" and "Sold" comments.
            if (excludeSales) {
                retVal = OccupancyMtx.getFilteredCommentCollection(retVal, srv.pledgedAssetCommentType.PendingSale);
                retVal = OccupancyMtx.getFilteredCommentCollection(retVal, srv.pledgedAssetCommentType.Sold);
            }

            if (excludeDuplicate) {
                retVal = OccupancyMtx.getFilteredCommentCollection(retVal, srv.pledgedAssetCommentType.Duplicate);
            } 

            return retVal;
        }

        /**
        * @desc Filters pledged asset comment collection to exclude comment type.
        */
        private static getFilteredCommentCollection = (inputCommentCollection: string[], commentType: srv.pledgedAssetCommentType): string[] => {
            var exclude = lib.findFirst(OccupancyMtx._pledgedAssetComments, comment => comment.value == String(commentType));
            if (!!exclude) {
                return lib.filter(inputCommentCollection, i => i != exclude.text);
            }

            return inputCommentCollection;
        }
               
        /**
         * @desc Retrieves comment strings by provided enum collection.
         */
        private static getOccupancyStringsByEnum = (occupancyTypes: srv.OccupancyType[]): string[] => {
            return lib.getLookupStringsByEnum(OccupancyMtx._occupancyTypes, occupancyTypes);
        }

        /**
        * @desc Retrieves comment strings by provided enum collection.
        */
        private static getCommentStringsByEnum = (commentTypes: srv.pledgedAssetCommentType[]): string[] => {
            return lib.getLookupStringsByEnum(OccupancyMtx._pledgedAssetComments, commentTypes);
        }

        private static configureLocator = (lookup: srv.ILookupViewModel): void => {
            if (OccupancyMtx._isConfigured)
                return;

            OccupancyMtx._pledgedAssetComments = lookup.pledgetAssetComments;
            OccupancyMtx._occupancyTypes = lookup.occupancyTypeList;

            var omx: OccupancyMtx[] = null;

            // pre
            omx = [];
            omx.push(OccupancyMtx.genomtx(lookup, null, null, null, null, null, OccupancyMtx.getCommentStringsByEnum([srv.pledgedAssetCommentType.NotAMortgage, srv.pledgedAssetCommentType.NotMyLoan])/*commentsStr*/, []/*occupancyTypeList*/, true/*isDisabled*/));
            OccupancyMtx._collPreemptive = omx;

            // refi
            omx = [];

            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Refinance/*loanPurpCd*/, srv.PropertyUsageTypeEnum.PrimaryResidence/*subjOccupancy*/, SubjPropRelationEnum.IsSame/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Own/*residenceOwnership*/, [ReoCategorizationEnum.SubjectProperty]/*reoCtgCds*/, OccupancyMtx.getAllComments(true, false)/*commentsStr*/, OccupancyMtx.getAllOccupancyTypes()/*occupancyTypeList*/, true/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Refinance/*loanPurpCd*/, srv.PropertyUsageTypeEnum.PrimaryResidence/*subjOccupancy*/, SubjPropRelationEnum.IsSame/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Own/*residenceOwnership*/, [ReoCategorizationEnum.NonSubjectProperty]/*reoCtgCds*/, OccupancyMtx.getAllComments(false)/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.SecondVacationHome, srv.OccupancyType.InvestmentProperty])/*occupancyTypeList*/, false/*isDisabled*/));

            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Refinance/*loanPurpCd*/, srv.PropertyUsageTypeEnum.InvestmentProperty/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Own/*residenceOwnership*/, [ReoCategorizationEnum.SubjectProperty]/*reoCtgCds*/, OccupancyMtx.getAllComments(true, false)/*commentsStr*/, OccupancyMtx.getAllOccupancyTypes()/*occupancyTypeList*/, true/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Refinance/*loanPurpCd*/, srv.PropertyUsageTypeEnum.InvestmentProperty/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Own/*residenceOwnership*/, [ReoCategorizationEnum.CurrentResidence]/*reoCtgCds*/, OccupancyMtx.getAllComments()/*commentsStr*/, OccupancyMtx.getAllOccupancyTypes()/*occupancyTypeList*/, true/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Refinance/*loanPurpCd*/, srv.PropertyUsageTypeEnum.InvestmentProperty/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Own/*residenceOwnership*/, [ReoCategorizationEnum.NonSubjectProperty, ReoCategorizationEnum.NonCurrentResidence]/*reoCtgCds*/, OccupancyMtx.getAllComments(false)/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.SecondVacationHome, srv.OccupancyType.InvestmentProperty])/*occupancyTypeList*/, false/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Refinance/*loanPurpCd*/, srv.PropertyUsageTypeEnum.InvestmentProperty/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Rent/*residenceOwnership*/, [ReoCategorizationEnum.SubjectProperty]/*reoCtgCds*/, OccupancyMtx.getAllComments(true, false)/*commentsStr*/, OccupancyMtx.getAllOccupancyTypes()/*occupancyTypeList*/, true/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Refinance/*loanPurpCd*/, srv.PropertyUsageTypeEnum.InvestmentProperty/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Rent/*residenceOwnership*/, [ReoCategorizationEnum.NonSubjectProperty]/*reoCtgCds*/, OccupancyMtx.getAllComments(false)/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.SecondVacationHome, srv.OccupancyType.InvestmentProperty])/*occupancyTypeList*/, false/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Refinance/*loanPurpCd*/, srv.PropertyUsageTypeEnum.InvestmentProperty/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.RentFree/*residenceOwnership*/, [ReoCategorizationEnum.NonSubjectProperty]/*reoCtgCds*/, OccupancyMtx.getAllComments(false)/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.SecondVacationHome, srv.OccupancyType.InvestmentProperty])/*occupancyTypeList*/, false/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Refinance/*loanPurpCd*/, srv.PropertyUsageTypeEnum.InvestmentProperty/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.RentFree/*residenceOwnership*/, [ReoCategorizationEnum.SubjectProperty]/*reoCtgCds*/, OccupancyMtx.getAllComments(true, false)/*commentsStr*/, OccupancyMtx.getAllOccupancyTypes()/*occupancyTypeList*/, true/*isDisabled*/));

            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Refinance/*loanPurpCd*/, srv.PropertyUsageTypeEnum.SecondVacationHome/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Own/*residenceOwnership*/, [ReoCategorizationEnum.SubjectProperty]/*reoCtgCds*/, OccupancyMtx.getAllComments(true, false)/*commentsStr*/, OccupancyMtx.getAllOccupancyTypes()/*occupancyTypeList*/, true/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Refinance/*loanPurpCd*/, srv.PropertyUsageTypeEnum.SecondVacationHome/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Own/*residenceOwnership*/, [ReoCategorizationEnum.CurrentResidence]/*reoCtgCds*/, OccupancyMtx.getAllComments()/*commentsStr*/, OccupancyMtx.getAllOccupancyTypes()/*occupancyTypeList*/, true/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Refinance/*loanPurpCd*/, srv.PropertyUsageTypeEnum.SecondVacationHome/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Own/*residenceOwnership*/, [ReoCategorizationEnum.NonSubjectProperty, ReoCategorizationEnum.NonCurrentResidence]/*reoCtgCds*/, OccupancyMtx.getAllComments(false)/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.SecondVacationHome, srv.OccupancyType.InvestmentProperty])/*occupancyTypeList*/, false/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Refinance/*loanPurpCd*/, srv.PropertyUsageTypeEnum.SecondVacationHome/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Rent/*residenceOwnership*/, [ReoCategorizationEnum.SubjectProperty]/*reoCtgCds*/, OccupancyMtx.getAllComments(true, false)/*commentsStr*/, OccupancyMtx.getAllOccupancyTypes()/*occupancyTypeList*/, true/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Refinance/*loanPurpCd*/, srv.PropertyUsageTypeEnum.SecondVacationHome/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Rent/*residenceOwnership*/, [ReoCategorizationEnum.NonSubjectProperty]/*reoCtgCds*/, OccupancyMtx.getAllComments(false)/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.SecondVacationHome, srv.OccupancyType.InvestmentProperty])/*occupancyTypeList*/, false/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Refinance/*loanPurpCd*/, srv.PropertyUsageTypeEnum.SecondVacationHome/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.RentFree/*residenceOwnership*/, [ReoCategorizationEnum.SubjectProperty]/*reoCtgCds*/, OccupancyMtx.getAllComments(true, false)/*commentsStr*/, OccupancyMtx.getAllOccupancyTypes()/*occupancyTypeList*/, true/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Refinance/*loanPurpCd*/, srv.PropertyUsageTypeEnum.SecondVacationHome/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.RentFree/*residenceOwnership*/, [ReoCategorizationEnum.NonSubjectProperty]/*reoCtgCds*/, OccupancyMtx.getAllComments(false)/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.SecondVacationHome, srv.OccupancyType.InvestmentProperty])/*occupancyTypeList*/, false/*isDisabled*/));
            OccupancyMtx._collRefi = omx;

            // purch
            omx = [];
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Purchase/*loanPurpCd*/, srv.PropertyUsageTypeEnum.PrimaryResidence/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Own/*residenceOwnership*/, [ReoCategorizationEnum.CurrentResidence]/*reoCtgCds*/, OccupancyMtx.getCommentStringsByEnum([srv.pledgedAssetCommentType.PendingSale, srv.pledgedAssetCommentType.Sold])/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.PrimaryResidence])/*occupancyTypeList*/, true/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Purchase/*loanPurpCd*/, srv.PropertyUsageTypeEnum.PrimaryResidence/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Own/*residenceOwnership*/, [ReoCategorizationEnum.CurrentResidence]/*reoCtgCds*/, OccupancyMtx.getCommentStringsByEnum([srv.pledgedAssetCommentType.DoNotPayoff, srv.pledgedAssetCommentType.PaidOffFreeAndClear])/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.SecondVacationHome, srv.OccupancyType.InvestmentProperty])/*occupancyTypeList*/, false/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Purchase/*loanPurpCd*/, srv.PropertyUsageTypeEnum.PrimaryResidence/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Own/*residenceOwnership*/, [ReoCategorizationEnum.NonSubjectProperty]/*reoCtgCds*/, OccupancyMtx.getCommentStringsByEnum([srv.pledgedAssetCommentType.DoNotPayoff, srv.pledgedAssetCommentType.PaidOffFreeAndClear, srv.pledgedAssetCommentType.PendingSale, srv.pledgedAssetCommentType.Sold])/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.SecondVacationHome, srv.OccupancyType.InvestmentProperty])/*occupancyTypeList*/, false/*isDisabled*/));  
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Purchase/*loanPurpCd*/, srv.PropertyUsageTypeEnum.PrimaryResidence/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Rent/*residenceOwnership*/, [ReoCategorizationEnum.NonSubjectProperty]/*reoCtgCds*/, OccupancyMtx.getCommentStringsByEnum([srv.pledgedAssetCommentType.DoNotPayoff, srv.pledgedAssetCommentType.PaidOffFreeAndClear, srv.pledgedAssetCommentType.PendingSale, srv.pledgedAssetCommentType.Sold])/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.SecondVacationHome, srv.OccupancyType.InvestmentProperty])/*occupancyTypeList*/, false/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Purchase/*loanPurpCd*/, srv.PropertyUsageTypeEnum.PrimaryResidence/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.RentFree/*residenceOwnership*/, [ReoCategorizationEnum.NonSubjectProperty]/*reoCtgCds*/, OccupancyMtx.getCommentStringsByEnum([srv.pledgedAssetCommentType.DoNotPayoff, srv.pledgedAssetCommentType.PaidOffFreeAndClear, srv.pledgedAssetCommentType.PendingSale, srv.pledgedAssetCommentType.Sold])/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.SecondVacationHome, srv.OccupancyType.InvestmentProperty])/*occupancyTypeList*/, false/*isDisabled*/));
           
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Purchase/*loanPurpCd*/, srv.PropertyUsageTypeEnum.InvestmentProperty/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Own/*residenceOwnership*/, [ReoCategorizationEnum.CurrentResidence]/*reoCtgCds*/, OccupancyMtx.getCommentStringsByEnum([srv.pledgedAssetCommentType.DoNotPayoff, srv.pledgedAssetCommentType.PaidOffFreeAndClear])/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.PrimaryResidence])/*occupancyTypeList*/, true/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Purchase/*loanPurpCd*/, srv.PropertyUsageTypeEnum.InvestmentProperty/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Own/*residenceOwnership*/, [ReoCategorizationEnum.NonSubjectProperty, ReoCategorizationEnum.NonCurrentResidence]/*reoCtgCds*/, OccupancyMtx.getCommentStringsByEnum([srv.pledgedAssetCommentType.PendingSale, srv.pledgedAssetCommentType.Sold, srv.pledgedAssetCommentType.DoNotPayoff, srv.pledgedAssetCommentType.PaidOffFreeAndClear])/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.SecondVacationHome, srv.OccupancyType.InvestmentProperty])/*occupancyTypeList*/, false/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Purchase/*loanPurpCd*/, srv.PropertyUsageTypeEnum.InvestmentProperty/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Rent/*residenceOwnership*/, [ReoCategorizationEnum.NonSubjectProperty]/*reoCtgCds*/, OccupancyMtx.getCommentStringsByEnum([srv.pledgedAssetCommentType.DoNotPayoff, srv.pledgedAssetCommentType.PaidOffFreeAndClear, srv.pledgedAssetCommentType.PendingSale, srv.pledgedAssetCommentType.Sold])/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.SecondVacationHome, srv.OccupancyType.InvestmentProperty])/*occupancyTypeList*/, false/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Purchase/*loanPurpCd*/, srv.PropertyUsageTypeEnum.InvestmentProperty/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.RentFree/*residenceOwnership*/, [ReoCategorizationEnum.NonSubjectProperty]/*reoCtgCds*/, OccupancyMtx.getCommentStringsByEnum([srv.pledgedAssetCommentType.DoNotPayoff, srv.pledgedAssetCommentType.PaidOffFreeAndClear, srv.pledgedAssetCommentType.PendingSale, srv.pledgedAssetCommentType.Sold])/*commentsStr*/, OccupancyMtx.getAllOccupancyTypes()/*occupancyTypeList*/, false/*isDisabled*/));

            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Purchase/*loanPurpCd*/, srv.PropertyUsageTypeEnum.SecondVacationHome/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Own/*residenceOwnership*/, [ReoCategorizationEnum.CurrentResidence]/*reoCtgCds*/, OccupancyMtx.getCommentStringsByEnum([srv.pledgedAssetCommentType.DoNotPayoff, srv.pledgedAssetCommentType.PaidOffFreeAndClear])/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.PrimaryResidence])/*occupancyTypeList*/, true/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Purchase/*loanPurpCd*/, srv.PropertyUsageTypeEnum.SecondVacationHome/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Own/*residenceOwnership*/, [ReoCategorizationEnum.NonSubjectProperty, ReoCategorizationEnum.NonCurrentResidence]/*reoCtgCds*/, OccupancyMtx.getCommentStringsByEnum([srv.pledgedAssetCommentType.PendingSale, srv.pledgedAssetCommentType.Sold, srv.pledgedAssetCommentType.DoNotPayoff, srv.pledgedAssetCommentType.PaidOffFreeAndClear])/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.SecondVacationHome, srv.OccupancyType.InvestmentProperty])/*occupancyTypeList*/, false/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Purchase/*loanPurpCd*/, srv.PropertyUsageTypeEnum.SecondVacationHome/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.Rent/*residenceOwnership*/, [ReoCategorizationEnum.NonSubjectProperty]/*reoCtgCds*/, OccupancyMtx.getCommentStringsByEnum([srv.pledgedAssetCommentType.DoNotPayoff, srv.pledgedAssetCommentType.PaidOffFreeAndClear, srv.pledgedAssetCommentType.PendingSale, srv.pledgedAssetCommentType.Sold])/*commentsStr*/, OccupancyMtx.getOccupancyStringsByEnum([srv.OccupancyType.SecondVacationHome, srv.OccupancyType.InvestmentProperty])/*occupancyTypeList*/, false/*isDisabled*/));
            omx.push(OccupancyMtx.genomtx(lookup, srv.LoanPurposeTypeEnum.Purchase/*loanPurpCd*/, srv.PropertyUsageTypeEnum.SecondVacationHome/*subjOccupancy*/, SubjPropRelationEnum.IsDiff/*residenceSubjCd*/, srv.OwnershipStatusTypeEnum.RentFree/*residenceOwnership*/, [ReoCategorizationEnum.NonSubjectProperty]/*reoCtgCds*/, OccupancyMtx.getCommentStringsByEnum([srv.pledgedAssetCommentType.DoNotPayoff, srv.pledgedAssetCommentType.PaidOffFreeAndClear, srv.pledgedAssetCommentType.PendingSale, srv.pledgedAssetCommentType.Sold])/*commentsStr*/, OccupancyMtx.getAllOccupancyTypes()/*occupancyTypeList*/, false/*isDisabled*/));
            OccupancyMtx._collPurch = omx;

            // mark complete
            OccupancyMtx._isConfigured = true;
        }

        private static genomtx = (lookup: srv.ILookupViewModel, loanPurpCd: srv.LoanPurposeTypeEnum, subjOccupancy: srv.PropertyUsageTypeEnum, residenceSubjCd: SubjPropRelationEnum, residenceOwnership: srv.OwnershipStatusTypeEnum, reoCtgCds: ReoCategorizationEnum[], commentsStr: string[], occupancyTypesStr: string[], isDisabled: boolean): OccupancyMtx => {
            // lib.IFlaggedEnum
            reoCtgCds = !!reoCtgCds ? reoCtgCds : [];
            var reoCtgCd: lib.IFlaggedEnum = reoCategorizationFlgFromEnums(reoCtgCds);
            commentsStr = !!commentsStr ? commentsStr : [];
            var comments: lib.IFlaggedEnum = lookup.pledgetAssetCommentsFlgFromNames(commentsStr);

            // srv.ILookupItem
            occupancyTypesStr = !!occupancyTypesStr ? occupancyTypesStr : [];
            var occupancyTypes: srv.ILookupItem[] = lookup.occupancyTypeListsByNames(occupancyTypesStr);

            // OccupancyMtx
            var omx = new OccupancyMtx(loanPurpCd, subjOccupancy, residenceSubjCd, residenceOwnership, reoCtgCd, comments, occupancyTypes, isDisabled);
            return omx;
        }

        //
        // Matching functions
        //

        public locate = (lookup: srv.ILookupViewModel): OccupancyMtx => {
            OccupancyMtx.configureLocator(lookup);

            // minor optimization for pre-emptive , mutually-exclusive Refi/Purch loan level attribute
            var sets: OccupancyMtx[][] = null;
            if (this.getLoanPurpose() == srv.LoanPurposeTypeEnum.Refinance) {
                sets = [OccupancyMtx._collPreemptive, OccupancyMtx._collRefi];
            }
            else {
                sets = [OccupancyMtx._collPreemptive, OccupancyMtx._collPurch];
            }

            var omtxFound: OccupancyMtx = null;
            for (var i = 0; omtxFound == null && i < sets.length; i++) {
                omtxFound = lib.findFirst(sets[i], o => o.matches(this));
            }

            if (!omtxFound) {
                // console.warn("Occupancy Matrix not found");
                // If you decide for "all" later on: "Primary Residence", "Second/Vacation Home", "Investment Property"
                omtxFound = OccupancyMtx.genomtx(lookup, null/*loanPurpCd*/, null/*subjOccupancy*/, null/*residenceSubjCd*/, null/*residenceOwnership*/, null/*reoCtgCds*/, null/*commentsStr*/, []/*occupancyTypeList*/, true/*isDisabled*/);
                omtxFound._isValidComments = false;
            }

            return omtxFound;
        }

        private matches = (omtx: OccupancyMtx): boolean => {

            if (!omtx)
                return false;
            if (!this.matchesLoanPurpose(omtx.getLoanPurpose()))
                return false;
            if (!this.matchesSubjOccupancyCd(omtx.getSubjOccupancyCd()))
                return false;
            if (!this.matchesResidenceSubjCd(omtx.getResidenceSubjCd()))
                return false;
            if (!this.matchesResidenceOwnership(omtx.getResidenceOwnership()))
                return false;
            if (!this.matchesReoCtgCd(omtx.getReoCtgCd()))
                return false;
            if (!this.matchesComments(omtx.getComments()))
                return false;

            return true;
        }

        // matches , treat [null] as "any" always [true]
        private comparePrimative = (ival: any, fval: () => any): boolean => {
            if (ival == null)
                return true;

            var cval = fval();

            return ival == cval;
        }

        // matches , treat [null] as "any" always [true] , perform commutative comparisons
        private compareFlaggedEnum = (ival: lib.IFlaggedEnum, fval: () => lib.IFlaggedEnum): boolean => {
            if (ival == null)
                return true;

            var cval = fval();

            // commutative
            var matches = (cval.contains(ival) || ival.contains(cval));

            return matches;
        }

        //
        // Input
        //

        // loanPurposeCd
        public getLoanPurpose = (): srv.LoanPurposeTypeEnum => {
            return this._loanPurposeCd;
        }

        public matchesLoanPurpose = (loanPurpose: srv.LoanPurposeTypeEnum): boolean => {
            return this.comparePrimative(loanPurpose, this.getLoanPurpose);
        }

        // subjOccupancyCd
        public getSubjOccupancyCd = (): srv.PropertyUsageTypeEnum => {
            return this._subjOccupancyCd;
        }

        public matchesSubjOccupancyCd = (subjOccupancyCd: srv.PropertyUsageTypeEnum): boolean => {
            return this.comparePrimative(subjOccupancyCd, this.getSubjOccupancyCd);
        }

        // residenceSubjCd
        public getResidenceSubjCd = (): SubjPropRelationEnum => {
            return this._residenceSubjCd;
        }

        public matchesResidenceSubjCd = (residenceSubjCd: SubjPropRelationEnum): boolean => {
            return this.comparePrimative(residenceSubjCd, this.getResidenceSubjCd);
        }

        // residenceOwnership
        public getResidenceOwnership = (): srv.OwnershipStatusTypeEnum => {
            return this._residenceOwnership;
        }

        public matchesResidenceOwnership = (residenceOwnership: srv.OwnershipStatusTypeEnum): boolean => {
            return this.comparePrimative(residenceOwnership, this.getResidenceOwnership);
        }

        // reoCtgCd
        public getReoCtgCd = (): lib.IFlaggedEnum => {
            return this._reoCtgCd;
        }

        public matchesReoCtgCd = (reoCtgCd: lib.IFlaggedEnum): boolean => {
            return this.compareFlaggedEnum(reoCtgCd, this.getReoCtgCd);
        }

        // comments
        public getComments = (): lib.IFlaggedEnum => {
            return this._comments;
        }

        public matchesComments = (comments: lib.IFlaggedEnum): boolean => {
            return this.compareFlaggedEnum(comments, this.getComments);
        }

        //
        // Output
        //

        // occupancyTypeList
        public get occupancyTypeList(): srv.ILookupItem[] {
            return this._occupancyTypeList;
        }
        public set occupancyTypeList(readOnly: srv.ILookupItem[]) {
            /*Read-Only*/
        }

        // isDisabled
        public get isDisabled(): boolean {
            return this._isDisabled;
        }
        public set isDisabled(readOnly: boolean) {
            /*Read-Only*/
        }

        // isValidComments
        private _isValidComments: boolean;
        public get isValidComments(): boolean {
            return this._isValidComments;
        }
        public set isValidComments(readOnly: boolean) {
            /*Read-Only*/
        }
    }
}
