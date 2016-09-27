module contextualBar {
    export class AppraisalContextualBarController {
        'use strict';
        static className = 'AppraisalContextualBarController';

        static $inject = ['wrappedLoan', 'applicationData'];

        constructor(private wrappedLoan, private applicationData) {
        }
    }
    moduleRegistration.registerController('contextualBar', AppraisalContextualBarController);
}