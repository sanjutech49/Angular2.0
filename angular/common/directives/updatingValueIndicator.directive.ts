 /// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />

interface IDirectiveClass extends ng.IDirective {

    factory: ng.IDirectiveFactory;
}

class UpdatingValueIndicator implements IDirectiveClass {

    constructor() {
    }

    get factory(): ng.IDirectiveFactory {
        return this.updatingValueIndicatorFactory;
    }

    updatingValueIndicatorFactory = (...args: any[]): ng.IDirective => {
        return new UpdatingValueIndicator();
    }
}