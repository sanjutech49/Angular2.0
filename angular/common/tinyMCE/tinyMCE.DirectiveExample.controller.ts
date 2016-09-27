
module wysiwyg {

    class TinyMCEDemoController {

        html: string = 'No value yet...';

        static className = 'tinyMCEDemoController';
        static $inject = ['$uibModal'];

        constructor(private $uibModal: ng.ui.bootstrap.IModalService) {

        }

        popUp = () => {

            var modalInstance = this.$uibModal.open({
                templateUrl: '/angular/common/tinyMCE/tinyMCEDirectiveDialogExampleTemplate.html',
                backdrop: 'static',
                controller: 'tinyMCEDemoDialogController as tinyMCEDialogCntrl',
                bindToController: true,
                size: 'lg'
               
            });
        }
    }
    moduleRegistration.registerController(moduleName, TinyMCEDemoController);
}

