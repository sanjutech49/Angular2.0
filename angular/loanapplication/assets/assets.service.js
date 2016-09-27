(function () {
    'use strict';

    angular.module('loanApplication')

    .factory('assetsSvc', assetsSvc);

    assetsSvc.$inject = ['$resource', 'apiRoot'];

    function assetsSvc($resource, ApiRoot) {
        var assetsApiPath = ApiRoot + 'Assets/'

        
        var GetAssetsData = $resource(assetsApiPath, { params: { loanId: 'loanId' } });
        var SaveAssetsData = $resource(assetsApiPath + "SaveAssetsData", { data: '@data' });

        function CalculateTotalAssets(totalFinancials, totalAutomobiles, totalLifeInsurance) {
            return totalFinancials + totalAutomobiles + totalLifeInsurance;
        }

        function CalculateTotalLiquids(totalFinancials, totalLifeInsurance) {
            return totalFinancials + totalLifeInsurance;
        }

        function CalculateAssetAmount(section) {
            var total = 0;
            for (var i = 0; i < section.length; i++) {
                if (!section[i].isRemoved) {
                    total += section[i].amount ? parseFloat(section[i].amount) : 0;
                }
            }
            return total;
        }

        var services = {
            GetAssetsData: GetAssetsData,
            SaveAssetsData: SaveAssetsData,
            CalculateTotalAssets: CalculateTotalAssets,
            CalculateTotalLiquids: CalculateTotalLiquids,
            CalculateAssetAmount: CalculateAssetAmount
        };

        return services;
    };

})();