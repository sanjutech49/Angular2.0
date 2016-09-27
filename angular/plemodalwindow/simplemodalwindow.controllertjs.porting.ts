/// <reference path="../../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />

class SimpleModalWindowController {

    static $inject = ['$modalStack'];
   
    constructor(private $modalStack: ng.ui.bootstrap.IModalStackService) {
    }

    close = () => {
        this.$modalStack.dismissAll('cancel');
    }

    // goTo navigation template
    goTo = (URL) => {
        // after stateprovider is implemented: $state.go( URL );
        window.location(URL);
        this.$modalStack.dismissAll('cancel');
    }
}