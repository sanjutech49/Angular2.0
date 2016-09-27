/// <reference path='../../../angular/ts/extendedViewModels/property.extendedViewModel.ts' />

module consumersite.vm {

    export class Account {

        private getProperty: () => cls.PropertyViewModel;

        constructor(property: cls.PropertyViewModel) {
            this.getProperty = () => property;
        }

        get streetName() {
            return this.getProperty().streetName;
        }
        set streetName(streetName: string) {
            this.getProperty().streetName = streetName;
        }
        get zipCode() {
            return this.getProperty().zipCode;
        }
        set zipCode(zipCode: string) {
            this.getProperty().zipCode = zipCode;
        }
    }
}