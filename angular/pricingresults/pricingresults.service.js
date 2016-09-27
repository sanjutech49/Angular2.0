(function () {
    'use strict';

    angular.module('PricingResults')

    .factory('pricingResultsSvc', pricingResultsSvc);

    pricingResultsSvc.$inject = ['$resource', 'apiRoot', '$http', '$q', '$window'];

    function pricingResultsSvc($resource, apiRoot, $http, $q, $window) {

        var productPath = apiRoot + 'ProductCalculator/';
        var loanPath = apiRoot + 'loan/';
        var pricingResultsApiPath = apiRoot + 'PricingResults/'
        var integrationLogItemApiPath = apiRoot + 'PricingResults/GetIntegrationLogItemResponse';

        var GetIntegrationLogItem = GetIntegrationLogItem;
        /*    $resource(integrationLogItemApiPath, {}, {
            GetIntegrationLogItem: { method: 'GET', params: { userAccountId: 'userAccountId', itemId: 'itemId', type: 'type' } }
        });*/

        function GetIntegrationLogItem(userAccountId, itemId, type) {
            var request = $http({
                method: "get",
                headers: {
                    'Content-type': 'text/xml'
                },
                url: integrationLogItemApiPath,
                params: { userAccountId: userAccountId, itemId: itemId, type: type },
                responseType: 'arraybuffer',
            });

            return (request.then(handleSuccess, handleError));
        }

        // ---
        // PRIVATE METHODS.
        // ---


        // Transform the error response, unwrapping the application dta from
        // the API response payload.
        function handleError(response) {

            
            if (
                !angular.isObject(response.data) ||
                !response.data.message
                ) {

                return ($q.reject("Error occurred."));

            }

            // Otherwise, use expected error message.
            return ($q.reject(response.data.message));

        }


        // Transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess(response) {



            var file = new Blob([response.data], { type: 'text/xml' });
            var fileURL = URL.createObjectURL(file);
            $window.open(fileURL);
            //var myWindow = window.open("", "MsgWindow", "width=200, height=100");
            //myWindow.document.write(response.data);

            return (response.data);

        }

        var PerformProductCalculations = $resource(productPath, {}, {
            PerformProductCalculations: { method: 'POST' }
        });

        var ApplyLoan = $resource(loanPath + ":productId", {productId: "@productId", currentUserId: "@currentUserId", repricing: "@repricing" }, {
            Create: {
                method: "PUT",
                url: loanPath + ":productId"
            }
        }
            );


        function sortByMultiple(sequence, keys, ascOrder) {
            //var copy = copySequence(sequence);
            sequence.sort(function (x, y) {
                var comparison = 0;
                for (var i = 0; i < keys.length; ++i) {
                    comparison = compareBy(x, y, keys[i], ascOrder);
                    if (comparison !== 0) {
                        return comparison;
                    }
                }
                return comparison;
            });
            return sequence;
        };

        function compareBy(x, y, key, ascOrder) {
            if (x[key] == y[key]) {
                return 0;
            }
            if (ascOrder) {
                return x[key] > y[key] ? 1 : -1;
            }
            return x[key] < y[key] ? 1 : -1;
        };

        var RefreshSmartGFE = $resource(pricingResultsApiPath + 'RefreshSmartGFE', {}, {
            Refresh: {
                method: 'POST',
                url: pricingResultsApiPath + 'RefreshSmartGFE'
            }
        });

        var CreateSmartGFE = function (loan) { return $http.post(pricingResultsApiPath + 'CreateSmartGFE', loan) };

        var SaveAndSendUserSelectedProductCategories = function (vm) { return $http.post(pricingResultsApiPath + 'SaveAndSendUserSelectedProductCategories', vm) };

        var pricingResultsService =
           {
               //GetPricingResultsData: GetPricingResultsData,
               PerformProductCalculations: PerformProductCalculations,
               ApplyLoan: ApplyLoan,
               sortByMultiple: sortByMultiple,
               GetIntegrationLogItem: GetIntegrationLogItem,
               RefreshSmartGFE: RefreshSmartGFE,
               CreateSmartGFE: CreateSmartGFE,
               SaveAndSendUserSelectedProductCategories: SaveAndSendUserSelectedProductCategories
           }

        return pricingResultsService;
    };

})();