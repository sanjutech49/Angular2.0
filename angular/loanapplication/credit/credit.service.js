(function () {
    'use strict';

    /**
    * @todo
    *       consolodate with CreditSvc && CreditSvcExt
    */

    // todo - replace with the framework
    // angular.module('loanApplication').factory('CreditSvc', CreditSvc);
    angular.module('util').factory('CreditSvc', CreditSvc);

    CreditSvc.$inject = ['$resource', 'apiRoot'];

    function CreditSvc($resource, ApiRoot) {
        var CreditApiPath = ApiRoot + 'Credit/';
        var CreditServices = $resource(CreditApiPath + ':path', { path: '@path' }, {             
            RunCredit: { method: 'GET', params: { loanApplicationId: 'loanApplicationId', userAccountId: 'userAccountId', isReRunReport: 'isReRunReport', borrowerId: 'borrowerId' } },
            GetEmptyLiabilityRecord: { method: 'GET', isArray: true, params: { debtAccountOwnershipType: 'debtAccountOwnershipType', borrowerId: 'borrowerId', secondaryBorrowerId: 'secondaryBorrowerId' } },
            GetCreditStatus: { method: 'GET', params: { loanApplicationId: 'loanApplicationId', accountId: 'accountId' } },
        });

        var MoveLiabilityToREO = $resource(CreditApiPath + 'MoveLiabilityToREOEx', { liability: '@liability' });
        var moveREOToLiability = $resource(CreditApiPath + 'MoveREOToLiability', { pledgedAsset: '@pledgedAsset' });
        var ProcessRulesForCollectionComment = $resource(CreditApiPath + 'ProcessRulesForCollectionCommentEx', { debtViewModel: '@debtViewModel' });
        var ProcessRulesForLiabilityComment = $resource(CreditApiPath + 'ProcessRulesForLiabilityCommentEx', { debtViewModel: '@debtViewModel' });
        //var ProcessRulesForREOComment = $resource(CreditApiPath + 'ProcessRulesForREOCommentEx', { pledgedAssetViewModel: '@pledgedAssetViewModel' });
        var ProcessRulesForPublicRecordComment = $resource(CreditApiPath + 'ProcessRulesForPublicRecordCommentEx', { publicRecordViewModel: '@publicRecordViewModel' });
        var RefreshPledgedAssets = $resource(CreditApiPath + 'RefreshPledgedAssets', { realEstateViewModel: '@realEstateViewModel' });
        var ProcessRulesForLiabilityOwnershipType = $resource(CreditApiPath + 'ProcessRulesForLiabilityOwnershipTypeEx', { debtViewModel: '@debtViewModel' }, { 'save': { method: 'POST', isArray: true } });
        //var ProcessRulesForPropertyExpensesAndCosts = $resource(CreditApiPath + 'ProcessRulesForPropertyExpensesAndCosts', { loan: '@loan' });

        var UpdateClosingCosts = $resource(CreditApiPath + 'UpdateClosingCosts', {}, {
            UpdateClosingCosts: {
                method: 'POST'
            }
        });

        var ProcessPropertyExpenses = $resource(CreditApiPath + 'ProcessPropertyExpenses', {}, {
            ProcessPropertyExpenses: {
                method: 'POST'
            }
        });

        /**
        * Format FICO score, if it is 0 then return N/A
        */
        function formatFICOScore (value){
            if (!!Number(value)) {
                return value;
                }
            else {
                return 'N/A'
            }
        }

        var service = {
            CreditServices: CreditServices,
            moveREOToLiability: moveREOToLiability,
            MoveLiabilityToREO: MoveLiabilityToREO,
            ProcessRulesForCollectionComment: ProcessRulesForCollectionComment,
            ProcessRulesForLiabilityComment: ProcessRulesForLiabilityComment,
            //ProcessRulesForREOComment: ProcessRulesForREOComment,
            ProcessRulesForPublicRecordComment: ProcessRulesForPublicRecordComment,
            RefreshPledgedAssets: RefreshPledgedAssets,
            ProcessRulesForLiabilityOwnershipType: ProcessRulesForLiabilityOwnershipType,
            UpdateClosingCosts: UpdateClosingCosts,
            ProcessPropertyExpenses: ProcessPropertyExpenses,
            formatFICOScore: formatFICOScore
        };

        return service;
    }
})();