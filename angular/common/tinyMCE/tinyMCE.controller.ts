
module wysiwyg {

    class TinyMCEDirectiveExampleController {

        static className = 'tinyMCEDirectiveExampleController';

        html: string;

        constructor() {
        }

        updateHtml = (html: string) => {
            this.html = html;
        }
    }

    angular.module(moduleName).controller(TinyMCEDirectiveExampleController.className, TinyMCEDirectiveExampleController);
}