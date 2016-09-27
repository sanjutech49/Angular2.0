
module demo {

    class DemoController {

        static className = 'demoController';
        static $inject: string[] = [];
        private demoData: any = {
            firstName: 'Joe', lastName: 'Blow'
        };

        constructor() {
        }

        getModel = () => {

            return this.demoData;
        };

        onAccept = (model: any) => {
            this.demoData = model;
        }

        onCancel = () => {
        }
    }
    moduleRegistration.registerController(moduleName, DemoController);
}