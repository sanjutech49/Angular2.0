/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    'use strict';
    var DocLoadService = (function () {
        function DocLoadService($log, $resource, apiRoot, enums, $q, DocVaultService) {
            var _this = this;
            this.$log = $log;
            this.$resource = $resource;
            this.apiRoot = apiRoot;
            this.enums = enums;
            this.$q = $q;
            this.DocVaultService = DocVaultService;
            this.getDocVaultData = function (loanId, currentUserId) {
                return _this.DocVaultService.GetDocVaultDocuments(loanId, currentUserId).then(function (data) {
                    return data.docVaultDocuments;
                }, function (error) {
                });
            };
            this.groupDocuments = function (documents, isFlyout) {
                var extDocuments = [];
                if (!!documents) {
                    for (var i = 0; i < documents.length; i++)
                        extDocuments.push(new cls.DocVaultDocumentViewModel(documents[i]));
                }
                var groupedDocuments;
                groupedDocuments = new lib.referenceWrapper(_.groupBy(_.where(extDocuments, { deleted: false }), 'categorySortName'));
                if (_.size(groupedDocuments.ref) && !isFlyout) {
                    groupedDocuments.ref[Object.keys(groupedDocuments.ref).sort()[0]].isExpanded = true;
                }
                if ("01Unclassified" in groupedDocuments.ref) {
                    groupedDocuments.ref["01Unclassified"].isUnclassified = true;
                }
                return groupedDocuments;
            };
        }
        DocLoadService.$inject = ['$log', '$resource', 'apiRoot', 'enums', '$q', 'DocVaultService'];
        DocLoadService.className = 'docLoadService';
        return DocLoadService;
    })();
    consumersite.DocLoadService = DocLoadService;
    moduleRegistration.registerService(consumersite.moduleName, DocLoadService);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=docLoad.service.js.map