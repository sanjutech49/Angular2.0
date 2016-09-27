/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />

module docusign {

    interface HappyPathHandler<T> {
        (returnData: any): T;
    }

    interface UnHappyPathHandler {
        (error: any): void;
    }

    interface CallBackMethod<T> {
        (happyPathHandler: HappyPathHandler<T>, unHappyPathHandler: UnHappyPathHandler): ng.IPromise<T|void>;
    }

    export class HttpUIStatusService {

        static className = 'HttpUIStatusService';
        static $inject = ['blockUI'];

        constructor(private blockUI) {
        }

        save = <T>(message: string, saveMethod: CallBackMethod<T>, happyPathHandler: HappyPathHandler<T>, unhappyPathHandler: UnHappyPathHandler, displayStatus = true): ng.IPromise<T|any> => {

            return this.call(message, saveMethod, happyPathHandler, unhappyPathHandler, displayStatus);
        }

        load = <T>(message: string, loadMethod: CallBackMethod<T>, happyPathHandler: HappyPathHandler<T>, unhappyPathHandler: UnHappyPathHandler, displayStatus = true): ng.IPromise<T|any> => {

            return this.call(message, loadMethod, happyPathHandler, unhappyPathHandler, displayStatus);
        }

        private call = <T>(message: string, method: CallBackMethod<T>, happyPathHandler: HappyPathHandler<T>, unhappyPathHandler: UnHappyPathHandler, displayStatus: boolean): ng.IPromise<T|any> => {

            if (displayStatus)
                this.blockUI.start(message);

            return method(returnData => {

                if (displayStatus)
                    this.blockUI.stop();
               
                // use the input happyPath handler, or cast the data as type T
                if (happyPathHandler)
                    return happyPathHandler(returnData);
                else
                    return <T>returnData;

            }, error => {

                    if (displayStatus)
                        this.blockUI.stop();

                    if (unhappyPathHandler)
                        unhappyPathHandler(error);

                });
        }
    }

    angular.module('docusign').service(HttpUIStatusService.className, HttpUIStatusService);
} 