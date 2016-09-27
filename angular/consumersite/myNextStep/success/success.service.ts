module consumersite {

    class SuccessModalController {

        constructor(private $modalInstance: ng.ui.bootstrap.IModalServiceInstance) { }


        close = () => {
            this.$modalInstance.close();
        }
        
    }

    export class SuccessModalService {

        static className = 'successModalService';

        static $inject = ['$modal'];

        constructor(private $modal: ng.ui.bootstrap.IModalService) { }

        openSuccessModal = () => {

            var successModalInstance: angular.ui.bootstrap.IModalServiceInstance = this.$modal.open({
                templateUrl: '/angular/consumersite/myNextStep/success/success.esigning.html',
                backdrop: 'static',
                controller: () => {
                    return new SuccessModalController(successModalInstance);
                },
                controllerAs: 'modalSuccessCntrl',
            });

            successModalInstance.result.then(
                //success
                (results) => {
                },
                //cancel
                (reason) => {
                    console.log(reason);
                });
        };
    }

    moduleRegistration.registerService(consumersite.moduleName, SuccessModalService);
}