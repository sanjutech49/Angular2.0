
module demo {

    interface IName {
        firstName: string;
        lastName: string;
    }

    class DialogController {

        static className = 'dialogController';
        static $inject = ['modalContext'];

        constructor(private modalContext: directive.IModalContext<IName>) {
        }

        get firstName() {
            return this.modalContext.model.firstName;
        }
        set firstName(firstName: string) {
            this.modalContext.model.firstName = firstName;
        }

        get lastName() {
            return this.modalContext.model.lastName;
        }
        set lastName(lastName: string) {
            this.modalContext.model.lastName = lastName;
        }

        onCancel = () => {
            this.modalContext.onCancel();
        }

        onAccept = () => {
            this.modalContext.onAccept(this.modalContext.model);
        }
    }
    moduleRegistration.registerController(moduleName, DialogController);

}