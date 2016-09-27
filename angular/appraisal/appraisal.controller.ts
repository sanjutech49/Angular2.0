module loanCenter {
    export class AppraisalController {
        'use strict';
        static className = 'AppraisalController';

        static $inject = ['$rootScope', 'NavigationSvc', 'enums'];

        constructor(private $rootScope, private NavigationSvc, private enums) {
            this.$rootScope.navigation = 'Appraisal';
            NavigationSvc.contextualType = enums.ContextualTypes.Appraisal;
        }
    }

    moduleRegistration.registerController('loanCenter', AppraisalController);
}