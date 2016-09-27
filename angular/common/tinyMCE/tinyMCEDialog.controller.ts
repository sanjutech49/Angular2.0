
module wysiwyg {

    class TinyMCEDemoDialogController {

        html: string = 'in dialog...';

        static className = 'tinyMCEDemoDialogController';
        static $inject = ['$uibModalInstance'];

        constructor(private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance) {

        }


        close = () => {
            this.$uibModalInstance.close();
        }
    }

    moduleRegistration.registerController(moduleName, TinyMCEDemoDialogController);
}

