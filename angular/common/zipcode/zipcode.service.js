(function () {
    'use strict';

    angular.module('util').factory('ZipCodeSvc', ["$rootScope", "$q", "apiRoot", function ($rootScope, $q, apiRoot) {
        return {
            GetZipData: function (model) {
                var deferred = $q.defer();
                $.ajax({
                    type: "POST",
                    url: apiRoot + "ZipData/ZipDataCalculation",
                    data: JSON.stringify(model),
                    dataType: "json",
                    contentType: "application/json",
                    success: function (msg) {
                        deferred.resolve(msg);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        var tempModel = GetEmptyObject(model);
                        tempModel.states = model.states;
                        deferred.resolve(tempModel);
                    }

                });
                return deferred.promise;
            },
            GetCounties: function (model) {
                var deferred = $q.defer();
                $.ajax({
                    type: "POST",
                    url: apiRoot + "ZipData/Counties",
                    data: JSON.stringify(model),
                    dataType: "json",
                    contentType: "application/json",
                    success: function (msg) {
                        deferred.resolve(msg);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        var tempModel = GetEmptyObject(model);
                        tempModel.states = model.states;
                        deferred.resolve(tempModel);

                    }

                });
                return deferred.promise;
            }
        };

    }])
})();