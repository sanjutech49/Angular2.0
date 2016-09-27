module consumersite.vm {

    export class activationCode implements srv.IKeyValue {

        private getActivationCode: () => vm.activationCode;

        activationCode: vm.activationCode;
        
        constructor(activationCode: vm.activationCode) {
            this.getActivationCode = () => activationCode;
        }
        get key(): string {
            return this.getActivationCode().key;
        }
        set key(value: string) {
            this.getActivationCode().key = value;
        }
        get value(): string {
            return this.getActivationCode().value;
        }
        set value(value: string) {
                this.getActivationCode().value = value;
        }   
    }
}