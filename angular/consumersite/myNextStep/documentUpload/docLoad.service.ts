/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {
    'use strict';

    export interface IDocLoadService {
        //documentsServices: any;

        groupDocuments(documents: srv.IDocVaultDocumentViewModel[], isFlyout: boolean): void;

        getDocVaultData(loanId: string, userAccountId: number): any;
    }    

    export class DocLoadService implements IDocLoadService {

        private _docVaultServiceApiPath: string;

        static $inject = ['$log', '$resource', 'apiRoot', 'enums', '$q', 'DocVaultService'];

        static className = 'docLoadService';

        constructor(private $log: ng.ILogService, private $resource: ng.resource.IResourceService, private apiRoot: string, private enums: any,
            private $q: ng.IQService, private DocVaultService: srv.DocVaultService) {
        }

        getDocVaultData = (loanId: string, currentUserId: number): any => {
            return this.DocVaultService.GetDocVaultDocuments(loanId, currentUserId)
                .then((data) => {
                    return data.docVaultDocuments;
                }, (error) => {
                });
        }

        groupDocuments = (documents: srv.IDocVaultDocumentViewModel[], isFlyout: boolean): any => {
            var extDocuments: cls.DocVaultDocumentViewModel[] = [];

            if(!!documents) {
                for (var i = 0; i < documents.length; i++)
                    extDocuments.push(new cls.DocVaultDocumentViewModel(documents[i]));
            }

            var groupedDocuments: any;

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

    moduleRegistration.registerService(consumersite.moduleName, DocLoadService);
} 