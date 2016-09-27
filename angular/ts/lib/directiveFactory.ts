/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />

module lib {

    export function directiveFactory<T>(t: { new (...args: any[]): T; }, ...args: any[]) : ng.IDirectiveFactory {

        var directive = (t: { new (...args: any[]): T; }, ...args: any[]) : ng.IDirective => {
            return new t(args);
        }
        directive.$inject = t.$inject;
        return directive;
    }
}