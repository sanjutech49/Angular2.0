/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../global/global.ts" />	

module util {
    export class HttpUIBlockService {

        static $inject = ['blockUI'];
        static className = 'HttpUIBlockService';

        constructor(private blockUI) {
        }

        // get UI blocking behavior
        getServiceEventMethod = (message: string): ServiceEvent => {

            return (status: util.ServiceEventStatus): void => {

                if (status == util.ServiceEventStatus.beforeCall)
                    this.blockUI.start(message);
                else if (status == util.ServiceEventStatus.afterCall)
                    this.blockUI.stop();
            }
        }

        // get the UI blocking behavior and the delegation
        getWrappedEventMethod = (message: string, serviceEvent: ServiceEvent): ServiceEvent => {

            return (status: util.ServiceEventStatus): void => {

                if (status == util.ServiceEventStatus.beforeCall)
                    this.blockUI.start(message);
                else if (status == util.ServiceEventStatus.afterCall)
                    this.blockUI.stop();

                serviceEvent(status);
            }
        }
    }
    moduleRegistration.registerService(moduleNames.services, HttpUIBlockService);
}

