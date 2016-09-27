(function () {
    'use strict';
    angular.module('aus')
        .provider('duResolver', duResolver);

    function duResolver() {
        this.$get = function () {
            return resolver;
        };

        function resolver(ausObj) {

            var duObj = {
                results: {},
                caseIds: [],
                selectedCaseId: null,
                enabled: ausObj.duEnabled
            };

            sortAndGroupServiceTrackings(ausObj, duObj);

            return duObj;
        }

        function sortAndGroupServiceTrackings(ausObj, duObj) {

            var mainGroups = [];

            var groupedResults = _.groupBy(_.where(ausObj.serviceTrackings, { item: 'DU Findings' }), 'caseId');
            for (var caseId in groupedResults) {
                duObj.results[caseId] = sortBy(groupedResults[caseId], ['date'], false);

                mainGroups.push(duObj.results[caseId][0]);
            }

            sortBy(mainGroups, ['date'], false);

            for (var group = 0; group < mainGroups.length; group++)
                duObj.caseIds.push(mainGroups[group].caseId);

            duObj.selectedCaseId = duObj.caseIds[0];

        }

        function sortBy(sequence, keys, ascOrder) {
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
    }
})();





