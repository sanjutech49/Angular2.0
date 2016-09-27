module complianceEase.service {
    'use strict';

    export interface IComplianceEaseService {
        interval: ng.IPromise<any>;
        submit(request: srv.IComplianceEaseRequestViewModel): ng.resource.IResource<any>;
        getComplianceData(loanId: string, userAccountId: number): ng.resource.IResource<any>;
        refreshComplianceData(loanId: string, userAccountId: number, callback: (complianceData: srv.ICollection<srv.IComplianceResultViewModel>) => void): void;
        formatDate(value: string, format: string): string;
    }

    export class ComplianceEaseService implements IComplianceEaseService {
        apiPath: string;
        interval: ng.IPromise<any>;

        static className = 'complianceEaseService';
        static $inject = ['apiRoot', '$resource', '$q', '$log', '$interval' ];

        constructor(private apiRoot: string, private $resource: ng.resource.IResourceService, private $q: ng.IQService, private $log: ng.ILogService, private $interval: ng.IIntervalService) {
            this.apiPath = apiRoot + "ComplianceResultService/";
        }

        /*
         * @desc: Submits new request to ComplianceEase
        */
        submit = (request: srv.IComplianceEaseRequestViewModel): ng.resource.IResource<any> => {
            return this.$resource(this.apiPath).save(request);
        }

        /*
         * @desc: Gets ComplianceEase Data
        */
        getComplianceData = (loanId: string, userAccountId: number): ng.resource.IResource<any> => {
            return this.$resource(this.apiPath, { loanId: loanId, userAccountId: userAccountId }).get();
        }

        /*
         * @desc: Check for new data every 10s
        */
        refreshComplianceData = (loanId: string, userAccountId: number, callback: (complianceData: srv.ICollection<srv.IComplianceResultViewModel>) => void): void => {
            this.interval = this.$interval(() => {
                this.getComplianceData(loanId, userAccountId).$promise.then(
                    (success) => {
                        callback(success.response);
                    },
                    (error) => {
                        this.$log.error('Error occurred while refreshing ComplianceEase Data!', error);
                    });
            }, 10000);
        }

        /**
        * @desc: Formats date string into required format
       */
        formatDate = (value: string, format: string): string => {
            if (!!value) {
                format = format ? format : 'MM/DD/YYYY';
                return moment(value).format(format);
            }
            else {
                return '';
            }
        }
    }
    angular.module('complianceEase').service('complianceEaseService', ComplianceEaseService);
}