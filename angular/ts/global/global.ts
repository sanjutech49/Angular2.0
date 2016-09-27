/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />

module global {

    var regExClassName = /^function\s+([^ (]+)/g;

    export function getClassName(cls: any): string {

        var results = regExClassName.exec(cls.toString());
        if (results.length == 2)
            return cls.varName = results[1];
        else
            throw "setClassName() could not find constructor function name";
    }
}

module moduleNames {
    export var services = "generated.services";
    export var controllers = "controllers";
    export var directives = "directives";
    export var providers = "providers";
    export var filters = "filters";
    export var common = "common";
}

module moduleRegistration {

    angular.module(moduleNames.controllers, []);
    angular.module(moduleNames.services, ['app.services', 'ngResource', 'blockUI']); // need app.services for 'apiRoot'
    angular.module(moduleNames.directives, []);
    angular.module(moduleNames.providers, []);
    angular.module(moduleNames.filters, []);

    //// configure the constant for the servicePrefix
    //angular.module(moduleNames.services).constant('servicePrefix', 'api');

    export function registerController(moduleName: string, cls: any): ng.IModule {
        injectCheck(cls);
        classNameCheck(cls);
        return angular.module(moduleName).controller(cls.className, cls);
    }

    export function registerService(moduleName: string, cls: any): ng.IModule {
        injectCheck(cls);
        classNameCheck(cls);
        return angular.module(moduleName).service(cls.className, cls);
    }

    export function registerProvider(moduleName: string, cls: any): ng.IModule {
        injectCheck(cls);
        classNameCheck(cls);
        return angular.module(moduleName).provider(cls.className, cls);
    }

    export function registerFilter(moduleName: string, cls: any): ng.IModule {
        injectCheck(cls);
        classNameCheck(cls);
        return angular.module(moduleName).filter(cls.className, cls.factory);
    }    

    // a directive class should have the following:
    // $inject for the required dependencies
    // className for registering the class
    // createNew(args: any[]) to create the instance of the directive with the array of contructed dependencies
    // $inject = ['x', 'y', 'z'];
    // $className = 'myDirective';
    // i.e. new myDirective(args[0], args[1], args[2]);
    export function registerDirective(moduleName: string, cls: any): ng.IModule {
        classNameCheck(cls);
        return angular.module(moduleName).directive(cls.className, directiveFactory(cls));
    }

    function classNameCheck(cls: any) {
        validateStaticElementCheck(cls => cls.className, cls, 'className');
    }

    function injectCheck(cls: any): void {
        validateStaticElementCheck(cls => cls.$inject, cls, '$inject');
    }

    function createNewCheck(cls: any): void {
        validateStaticElementCheck(cls => cls.createNew, cls, 'createNew');
    }

    function factoryCheck(cls: any): void {
        validateStaticElementCheck(cls => cls.factory, cls, 'factory');
    }

    function validateStaticElementCheck(elementValidationCheck: (cls) => boolean, cls: any, missingElement: string) {

        if (!elementValidationCheck(cls))
            throw "static function '" + missingElement + "' was not defined on " + global.getClassName(cls);
    }

    export function directiveFactory(cls: any): ng.IDirectiveFactory {

        injectCheck(cls);
        createNewCheck(cls);

        var directiveFactory = (...args: any[]) => {
            return cls.createNew(args);
        }

        directiveFactory.$inject = cls.$inject;
        return directiveFactory
    }
}


 
