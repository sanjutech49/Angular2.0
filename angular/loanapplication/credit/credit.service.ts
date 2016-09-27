/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />

/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />

class CreditService {

    static $inject = ['$resource', 'apiRoot'];

    CreditServices;
    MoveREOToLiability;
    MoveLiabilityToREO;
    SaveCreditData;
    ProcessRulesForCollectionComment;
    ProcessRulesForLiabilityComment;
    ProcessRulesForREOComment;
    ProcessRulesForPublicRecordComment;
    RefreshPledgedAssets;
    ProcessRulesForLiabilityOwnershipType;

    constructor($resource: ng.resource.IResourceService, ApiRoot) {
        var CreditApiPath = ApiRoot + 'Credit/';
        this.CreditServices = $resource(CreditApiPath + ':path', { path: '@path' }, {
            GetCreditData: { method: 'GET', params: { loanId: 'loanId', accountId: 'accountId' } },
            ReRunCredit: { method: 'GET', params: { loanId: 'loanId', userAccountId: 'userAccountId', reRunCredit: 'reRunCredit', borrowerId: 'borrowerId' } },
            GetEmptyLiabilityRecord: { method: 'GET', isArray: true, params: { debtAccountOwnershipType: 'debtAccountOwnershipType', borrowerId: 'borrowerId', secondaryBorrowerId: 'secondaryBorrowerId' } }
        });

        this.MoveREOToLiability = $resource(CreditApiPath + 'MoveREOToLiability', { pledgedAsset: '@pledgedAsset' });

        this.MoveLiabilityToREO = $resource(CreditApiPath + 'MoveLiabilityToREO', { debt: '@debt' });
        this.SaveCreditData = $resource(CreditApiPath + 'SaveCreditData', { viewModel: '@viewModel' });
        this.ProcessRulesForCollectionComment = $resource(CreditApiPath + 'ProcessRulesForCollectionComment', { debtViewModel: '@debtViewModel' });
        this.ProcessRulesForLiabilityComment = $resource(CreditApiPath + 'ProcessRulesForLiabilityComment', { debtViewModel: '@debtViewModel' });
        this.ProcessRulesForREOComment = $resource(CreditApiPath + 'ProcessRulesForREOComment', { pledgedAssetViewModel: '@pledgedAssetViewModel' });
        this.ProcessRulesForPublicRecordComment = $resource(CreditApiPath + 'ProcessRulesForPublicRecordComment', { publicRecordViewModel: '@publicRecordViewModel' });
        this.RefreshPledgedAssets = $resource(CreditApiPath + 'RefreshPledgedAssets', { realEstateViewModel: '@realEstateViewModel' });
        this.ProcessRulesForLiabilityOwnershipType = $resource(CreditApiPath + 'ProcessRulesForLiabilityOwnershipType', { debtViewModel: '@debtViewModel' }, { 'save': { method: 'POST', isArray: true } });
    }

    //var MoveLiabilityToREO = $resource(CreditApiPath + 'MoveLiabilityToREO', { debt: '@debt' });
    //var SaveCreditData = $resource(CreditApiPath + 'SaveCreditData', { viewModel: '@viewModel' });
    //var ProcessRulesForCollectionComment = $resource(CreditApiPath + 'ProcessRulesForCollectionComment', { debtViewModel: '@debtViewModel' });
    //var ProcessRulesForLiabilityComment = $resource(CreditApiPath + 'ProcessRulesForLiabilityComment', { debtViewModel: '@debtViewModel' });
    //var ProcessRulesForREOComment = $resource(CreditApiPath + 'ProcessRulesForREOComment', { pledgedAssetViewModel: '@pledgedAssetViewModel' });
    //var ProcessRulesForPublicRecordComment = $resource(CreditApiPath + 'ProcessRulesForPublicRecordComment', { publicRecordViewModel: '@publicRecordViewModel' });
    //var RefreshPledgedAssets = $resource(CreditApiPath + 'RefreshPledgedAssets', { realEstateViewModel: '@realEstateViewModel' });
    //var ProcessRulesForLiabilityOwnershipType = $resource(CreditApiPath + 'ProcessRulesForLiabilityOwnershipType', { debtViewModel: '@debtViewModel' }, { 'save': { method: 'POST', isArray: true } });

    //var service = {
    //    CreditServices: CreditServices,
    //    MoveREOToLiability: MoveREOToLiability,
    //    MoveLiabilityToREO: MoveLiabilityToREO,
    //    SaveCreditData: SaveCreditData,
    //    ProcessRulesForCollectionComment: ProcessRulesForCollectionComment,
    //    ProcessRulesForLiabilityComment: ProcessRulesForLiabilityComment,
    //    ProcessRulesForREOComment: ProcessRulesForREOComment,
    //    ProcessRulesForPublicRecordComment: ProcessRulesForPublicRecordComment,
    //    RefreshPledgedAssets: RefreshPledgedAssets,
    //    ProcessRulesForLiabilityOwnershipType: ProcessRulesForLiabilityOwnershipType
    //};

    //return service;
}
