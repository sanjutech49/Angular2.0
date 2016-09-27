/// <reference path="../contextualbar.service.ts" />
/// <reference path="../../ts/global/global.ts" />

module contextualBar {
    
    export class contextualTitleController {
        'use strict';
        static className = 'contextualTitleController';

        static $inject = ['ContextualBarSvc', 'NavigationSvc', 'applicationData', 'enums'];

        constructor(private ContextualBarSvc: contextualBar.ContextualBarSvc, private NavigationSvc, private applicationData, private enums) {
            var self = this;
            self.ContextualBarSvc = ContextualBarSvc;
            self.enums = enums.ContextualTypes.Queue;
            self.applicationData = applicationData;
        }

        getContextualName = () => {
            return this.ContextualBarSvc.getContextualName(this.applicationData, this.ContextualBarSvc.getContextualType());
        }

        getContextualType = () => {
            return this.ContextualBarSvc.getContextualType();
        }
    }

    moduleRegistration.registerController('contextualBar', contextualTitleController);
} 