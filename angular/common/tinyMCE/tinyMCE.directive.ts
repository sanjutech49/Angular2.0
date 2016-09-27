module wysiwyg {

    class TinyMCEDirectiveController {

        tinymce; // used within the third party tinymce.js file
        html: string; // this is bound from within the directive

        static className = 'TinyMCEDirectiveController';
        static $inject = ['$sce'];

        constructor(private $sce: ng.ISCEService) {
        }

        updateHtml = () => {
            this.html = this.$sce.trustAsHtml(this.tinymce);
        }
    }

    moduleRegistration.registerController('ui.tinymce', TinyMCEDirectiveController);

    class TinyMCEDirective implements ng.IDirective {

        static $inject = [];
        static className = 'tinyMce';

        constructor() {
        }

        static createNew(args: any[]): TinyMCEDirective {
            return new TinyMCEDirective();
        }

        bindToController = true;
        restrict = 'E';
        controller = TinyMCEDirectiveController.className;
        controllerAs = 'tinyMCECntrl';
        scope = {
            html: '='
        };
        templateUrl = '/angular/common/tinyMCE/tinyMCE.template.html';
    }

    moduleRegistration.registerDirective('ui.tinymce', TinyMCEDirective);
}