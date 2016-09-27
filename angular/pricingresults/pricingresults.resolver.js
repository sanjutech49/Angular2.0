(function () {
    'use strict';
    angular.module('PricingResults')
        .provider('pricingResultsResolver', pricingResultsResolver);

    /**
    * Resolves a client side model containing flags and properties specific to the client side only.
    */
    function pricingResultsResolver() {

        this.$get = function () {
            return resolver;
        };

        function resolver(wrappedLoan, pricingResultsSvc, $stateParams) {

           /**
           *
           * Perform product grouping by Product Type and default sorting. By default, Returned products are sorted first by Product Group 
           * in default order of its Term, then by Rate followed by Price within the sub groups.
           *
           **/
            var sortedProductGoupsArray = [];
            var sortedProductsArray = {};
            var sortedProductPricingArray = {};

            var mainGroupArray = [];
            var byFirst = _.groupBy(wrappedLoan.ref.pricingResults.productListViewModel.eligibleProducts, "productType");
            for (var prop in byFirst) {
                var productSubRows = [];
                var bySecond = _.groupBy(byFirst[prop], "productName");
                for (var propSec in bySecond) {
                    var productPricingArray = bySecond[propSec];
                    pricingResultsSvc.sortByMultiple(productPricingArray, ["rate", "priceAmount"], true);

                    if (sortedProductPricingArray[prop] == undefined) {
                        sortedProductPricingArray[prop] = {};
                    }
                    sortedProductPricingArray[prop][propSec] = productPricingArray;
                    productSubRows.push(productPricingArray[0]);
                }

                pricingResultsSvc.sortByMultiple(productSubRows, ["rate", "priceAmount"], true);
                sortedProductsArray[prop] = productSubRows;
                mainGroupArray.push(productSubRows[0]);
            }

            pricingResultsSvc.sortByMultiple(mainGroupArray, ["loanAmortizationFixedTerm", "rate", "priceAmount"], false);
            sortedProductGoupsArray = mainGroupArray;

            var sortDirectionAndProperty = {};
            sortDirectionAndProperty.propertyName = 'DefaultSorting';
            sortDirectionAndProperty.asc = false;


            var shoppingCartIds = wrappedLoan.ref.pricingResults.productListViewModel.eligibleProducts.map(function (p) { return p.productId });

            _.each(wrappedLoan.ref.pricingResults.productListViewModel.allProducts, function (p) {
                if (_.contains(shoppingCartIds, p.productId)) {
                    p.register = true;
                    var prod = _.find(wrappedLoan.ref.pricingResults.productListViewModel.eligibleProducts, function (r) { return p.productId == r.productId });
                    p.costDetails = prod.costDetails;
                };
            });
            var allProductsGrouped = _.groupByMulti(wrappedLoan.ref.pricingResults.productListViewModel.allProducts, ["productIndex", "rate", "days"]);

           var service = {
                sortedProductGoupsArray : sortedProductGoupsArray,
                sortedProductsArray : sortedProductsArray,
                sortedProductPricingArray : sortedProductPricingArray,
                sortDirectionAndProperty:sortDirectionAndProperty,
                shoppingCartIds:shoppingCartIds,
                allProductsGrouped: allProductsGrouped,
                repricing: ($stateParams['repricing'] == true)
           };

            return service;

        };

       
        

    }
})();


