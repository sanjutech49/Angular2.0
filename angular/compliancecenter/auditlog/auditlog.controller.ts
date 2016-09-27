module compliancecenter {
    export class auditlogController {
        logs: any;

        public static $inject = [
            'auditLogViewModel',
        ];

        constructor(auditLogViewModel: any) {
            this.logs = auditLogViewModel;
        }
    }

    angular.module('compliancecenter').controller('auditlogController', auditlogController);
}
