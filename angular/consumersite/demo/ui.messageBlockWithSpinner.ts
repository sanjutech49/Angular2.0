/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />

module consumersite {

    interface SuccessHandler<T> {
        (returnData: T): void;
    }

    interface ErrorHandler {
        (error: any): void;
    }

    interface CallBackMethod<T> {
        (): ng.IPromise<T>;
    }

    export class UIBlockWithSpinner {

        static className = 'uiBlockWithSpinner';
        static $inject = ['$uibModal', '$uibModalStack'];

        constructor(private $uibModal: ng.ui.bootstrap.IModalService, private $uibModalStack: ng.ui.bootstrap.IModalStackService) {
        }

        call = <T>(method: CallBackMethod<T>, message: string, successHandler: SuccessHandler<T>, errorHandler: ErrorHandler = null): void => {

            var moduleSettings: ng.ui.bootstrap.IModalSettings = {
                backdrop: 'static',
                backdropClass: 'custom-modal-backdrop',
                keyboard: false,
                templateUrl: '/angular/consumersite/demo/spinnerMessage.html',
                controller: () =>  {
                    return { message: message };
                },
                controllerAs: 'messageSpinnerCntrl',
                windowClass: 'common-modal',
            };

            this.$uibModal.open(moduleSettings);

            method().then(data => {
                this.$uibModalStack.dismissAll('close');
                successHandler(data);
            }, error => {
                this.$uibModalStack.dismissAll('close');
                if (errorHandler)
                    errorHandler(error);
            });
        }
    }

    moduleRegistration.registerService(moduleName, UIBlockWithSpinner);
}
