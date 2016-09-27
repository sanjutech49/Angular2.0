/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />

module common {

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
        static $inject = ['blockUI', 'simpleModalWindowFactory', 'commonModalWindowFactory', 'modalWindowType'];

        constructor(private blockUI, private simpleModalWindowFactory, private commonModalWindowFactory, private modalWindowType) {
        }

        save = <T>(message: string, saveMethod: CallBackMethod<T>, happyPathHandler: HappyPathHandler<T>, unhappyPathHandler: UnHappyPathHandler, displayStatus = true): ng.IPromise<T|any> => {

            return this.call(message, 'ERROR_SAVE_MODAL', saveMethod, happyPathHandler, unhappyPathHandler, displayStatus);
        }

        load = <T>(message: string, loadMethod: CallBackMethod<T>, happyPathHandler: HappyPathHandler<T>, unhappyPathHandler: UnHappyPathHandler, displayStatus = true): ng.IPromise<T|any> => {

            return this.call(message, 'ERROR_LOAD_MODAL', loadMethod, happyPathHandler, unhappyPathHandler, displayStatus);
        }

        private call = <T>(message: string, mode: string, method: CallBackMethod<T>, happyPathHandler: HappyPathHandler<T>, unhappyPathHandler: UnHappyPathHandler, displayStatus: boolean): ng.IPromise<T|any> => {

            if (displayStatus)
                this.commonModalWindowFactory.open({ type: this.modalWindowType.loader, message: message });

            return method(returnData => {

                if (displayStatus)
                    this.commonModalWindowFactory.close();

               
                // use the input happyPath handler, or cast the data as type T
                if (happyPathHandler)
                    return happyPathHandler(returnData);
                else
                    return <T>returnData;

            }, error => {

                if (displayStatus)
                    this.commonModalWindowFactory.close();

                if (unhappyPathHandler)
                    unhappyPathHandler(error);

                this.simpleModalWindowFactory.trigger(mode);
            });
        }
    }

    angular.module('http.ui.status').service(HttpUIStatusService.className, HttpUIStatusService);
}