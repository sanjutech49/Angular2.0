module documents {
    export interface INeedsListService {
        getCoverLetterId(loanId: string, documentClass: srv.DocumentClassType, userAccountId: number): ng.IPromise<any>;
        sendCoverLetter(loanId: string, fileStoreItemId: string, recipients: string): ng.IPromise<any>; 
        isEmailValid(email: string): boolean;
    }

    export class NeedsListService implements INeedsListService {

        static $inject = ['$http', 'apiRoot'];
        static className = 'needsListService';

        constructor(private $http: ng.IHttpService, private apiRoot: string) {
            this.apiRoot = apiRoot + 'Document';
        }

        getCoverLetterId = (loanId: string, documentClass: srv.DocumentClassType, userAccountId: number): ng.IPromise<any> => {
            var getDataApiUrl = this.apiRoot + '/CreateCoverLetterAndGetId';
            var parameters = {
                loanId: loanId,
                coverLetter: documentClass,
                userAccountId: userAccountId
            };
            var config = { params: parameters };

            return this.triggerRequest(getDataApiUrl, config);
        }

        sendCoverLetter = (loanId: string, fileStoreItemId: string, recipients: string): ng.IPromise<any> => {
            var getDataApiUrl = this.apiRoot + '/SendBorrowersNeedsListCoverLetter';
            var parameters = {
                loanId: loanId,
                fileStoreItemId: fileStoreItemId,
                recipients: recipients
            };
            var config = { params: parameters };

            return this.triggerRequest(getDataApiUrl, config);
        }

        private triggerRequest = (url: string, config: any): ng.IPromise<any> => {
            return this.$http.get(url, config)
                .then((response: ng.IHttpPromiseCallbackArg<any>): any => {
                return <any>response.data;
            });
        }

        isEmailValid(email: string) {
            return email && email.indexOf('newprospect') == -1;
        }
    }
    moduleRegistration.registerService('documents', NeedsListService);
}