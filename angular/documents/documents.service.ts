module documents {

    export interface IDocumentsService {
        downloadDocument(documentId: string): void;
        openDocument(documentId: string, inBrowser: boolean, inTab: boolean): void;
        filterDocumentList(documents: srv.IList<srv.IDocumentsViewModel>, applicationData: any): srv.IList<srv.IDocumentsViewModel>;
        isThereActiveDocuments(documents: srv.IDocumentsViewModel[], applicationData: any): boolean;
        getDocumentTypeIdByTypeId(typeId?: string): number;
    }

    export class DocumentsService implements IDocumentsService {

        static $inject = ['$http',
                          'apiRoot',
                          'docVaultSvc',
                          '$log'];

        static className = 'DocumentsService';

        private docVaultTypes: srv.IList<srv.IVaultDocumentType>;

        get DocVaultTypes(): srv.IList<srv.IVaultDocumentType> {
            return this.docVaultTypes;
        }

        constructor(private $http: ng.IHttpService, private apiRoot: string, private docVaultSvc, private $log) {
            this.docVaultTypes = [];
        }

        fillDocVaultTypes = (data, loanAppList, docVaultDocuments, applicationData) => {
            this.docVaultTypes = _.filter(data.documentTypes, function (item: srv.IVaultDocumentType) {
                return item.borrowerProvides == true;
            });

            this.recheckToBeCompletedNeedsList(applicationData, loanAppList, docVaultDocuments);
        }

        recheckToBeCompletedNeedsList = (applicationData: any, loanAppList: any[], docVaultDocuments: any) => {
           
            for (var i = 0; i < loanAppList.length; i++) {
                if (!!loanAppList[i].documents) {
                    for (var j = 0; j < loanAppList[i].documents.length; j++) {
                        for (var z = 0; z < docVaultDocuments.length; z++) {
                        var documentCategoryIds = this.getDocumentCategoryIdFromMapping(applicationData, this.getDocumentTypeIdByTypeId(docVaultDocuments[z].documentTypeId));
                        if (documentCategoryIds != null && _.some(documentCategoryIds,(x: any) => { return x.documentCategoryId == loanAppList[i].documents[j].documentCategoryId })
                            && docVaultDocuments[z].status != 6 && docVaultDocuments[z].uploadedBy == 1) {
                                loanAppList[i].documents[j].isCompleted = true;
                                loanAppList[i].documents[j].received = new Date(docVaultDocuments[z].lastUpdated);
                                break;
                            }
                            else {
                                loanAppList[i].documents[j].isCompleted = false;
                            }
                        }
                    }
                }
            }
        }

        getDocumentCategoryIdFromMapping = (applicationData: any, documentTypeId?: number): any => {
            var documentMapping: any = _.filter(applicationData.documentMappings,(documentMapping: any) => {
                return documentMapping.documentTypeId == documentTypeId;
            });

            if (documentMapping != null)
                return documentMapping;
            return null;
        }

        getDocumentTypeIdFromMapping = (applicationData: any, documentCategoryId?: number): number => {
            if (documentCategoryId == -1) return -1;
            var documentMapping: srv.IDocumentMappingViewModel = _.filter(applicationData.documentMappings,(documentMapping: any) => {
                return documentMapping.documentCategoryId == documentCategoryId;
            })[0];

            if (documentMapping != null)
                return documentMapping.documentTypeId;
            return null;
        }

        downloadDocument = (documentId: string): void => {
            var downloadLink = this.getDocumentUrl(documentId, null);
            if (downloadLink != '') {
                window.open(downloadLink, '_blank', '');
            }
        }

        openDocument = (documentId: string, inBrowser: boolean, inTab: boolean): void => {
            var downloadLink = this.getDocumentUrl(documentId, inBrowser);
            if (!common.string.isNullOrWhiteSpace(downloadLink) && !common.string.isEmptyGuid(downloadLink)) {
                if (inTab)
                    window.open(downloadLink, '_blank', '');
                else
                    window.open(downloadLink, '_blank', 'location=0');
            }
        }

        getDocumentTypeIdByTypeId = (typeId?: string): number => {
            if (typeId == null) return null;
            var docVaultType: srv.IVaultDocumentType = _.filter(this.docVaultTypes,(docVaultType: any) => {
                return docVaultType.typeId == typeId;
            })[0];

            if (!!docVaultType)
                return docVaultType.documentTypeId;
            return null;
        }

        private getDocumentUrl = (documentId: string, inBrowser: boolean): string => {
            if (!documentId) return '';

            var encodedRepositoryId = encodeURIComponent(documentId);
            var url = '/Downloader.axd?documentType=repositoryItem&repositoryItemId=' + encodedRepositoryId;

            if (inBrowser != null && inBrowser)
                url = url + '&browser=true';

            return url;
        }


        filterDocumentList = (documents: any, applicationData: any): srv.IList<srv.IDocumentsViewModel> => {

            var self = this;
            var list = [];
            if (!!documents) {
                for (var i = 0; i < documents.length; i++) {
                    if (documents[i].isUserEntry) {
                        list.push(documents[i]);
                        continue;
                    }
                    if (documents[i].isDeleted || documents[i].isCompleted) {
                        continue;
                    }
                    for (var j = 0; j < applicationData.documentMappings.length; j++) {
                        for (var z = 0; z < this.docVaultTypes.length; z++) {
                            if (documents[i].documentCategoryId == applicationData.documentMappings[j].documentCategoryId &&
                                applicationData.documentMappings[j].documentTypeId == this.docVaultTypes[z].documentTypeId &&
                                !!this.docVaultTypes[z].borrowerProvides) {
                                list.push(documents[i]);
                            }
                        }
                    }
                }
                
                //sorting retrieved document on their DocVaultType full description
                if (list && list.length > 1)
                    list.sort((x, y) => {

                        //get DocVaultType of documents being compared, based on documentCategoryId 
                        var a = lib.filter(self.DocVaultTypes, (t) => t.documentTypeId == self.getDocumentTypeIdFromMapping(applicationData, x.documentCategoryId));
                        var b = lib.filter(self.DocVaultTypes, (t) => t.documentTypeId == self.getDocumentTypeIdFromMapping(applicationData, y.documentCategoryId));
                        
                        //do the sorting if such DocVaultTypes exist
                        if (a.length!=0 && b.length!=0) {
                            if (a[0].fullDescription > b[0].fullDescription) return 1;
                            else return -1;
                        }
                        return 0;
                    });
            }
            return list;
        }

        isThereActiveDocuments = (documents: srv.IDocumentsViewModel[], applicationData: any): boolean => {
            if(!!documents)
                return this.filterDocumentList(documents, applicationData).filter((item: any) => { return !item.isDeleted; }).length > 0;
            return false
        }

    }
    moduleRegistration.registerService('documents', DocumentsService);
}