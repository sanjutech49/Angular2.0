/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
var global;
(function (global) {
    var regExClassName = /^function\s+([^ (]+)/g;
    function getClassName(cls) {
        var results = regExClassName.exec(cls.toString());
        if (results.length == 2)
            return cls.varName = results[1];
        else
            throw "setClassName() could not find constructor function name";
    }
    global.getClassName = getClassName;
})(global || (global = {}));
var moduleNames;
(function (moduleNames) {
    moduleNames.services = "generated.services";
    moduleNames.controllers = "controllers";
    moduleNames.directives = "directives";
    moduleNames.providers = "providers";
    moduleNames.filters = "filters";
    moduleNames.common = "common";
})(moduleNames || (moduleNames = {}));
var moduleRegistration;
(function (moduleRegistration) {
    angular.module(moduleNames.controllers, []);
    angular.module(moduleNames.services, ['app.services', 'ngResource', 'blockUI']); // need app.services for 'apiRoot'
    angular.module(moduleNames.directives, []);
    angular.module(moduleNames.providers, []);
    angular.module(moduleNames.filters, []);
    //// configure the constant for the servicePrefix
    //angular.module(moduleNames.services).constant('servicePrefix', 'api');
    function registerController(moduleName, cls) {
        injectCheck(cls);
        classNameCheck(cls);
        return angular.module(moduleName).controller(cls.className, cls);
    }
    moduleRegistration.registerController = registerController;
    function registerService(moduleName, cls) {
        injectCheck(cls);
        classNameCheck(cls);
        return angular.module(moduleName).service(cls.className, cls);
    }
    moduleRegistration.registerService = registerService;
    function registerProvider(moduleName, cls) {
        injectCheck(cls);
        classNameCheck(cls);
        return angular.module(moduleName).provider(cls.className, cls);
    }
    moduleRegistration.registerProvider = registerProvider;
    function registerFilter(moduleName, cls) {
        injectCheck(cls);
        classNameCheck(cls);
        return angular.module(moduleName).filter(cls.className, cls.factory);
    }
    moduleRegistration.registerFilter = registerFilter;
    // a directive class should have the following:
    // $inject for the required dependencies
    // className for registering the class
    // createNew(args: any[]) to create the instance of the directive with the array of contructed dependencies
    // $inject = ['x', 'y', 'z'];
    // $className = 'myDirective';
    // i.e. new myDirective(args[0], args[1], args[2]);
    function registerDirective(moduleName, cls) {
        classNameCheck(cls);
        return angular.module(moduleName).directive(cls.className, directiveFactory(cls));
    }
    moduleRegistration.registerDirective = registerDirective;
    function classNameCheck(cls) {
        validateStaticElementCheck(function (cls) { return cls.className; }, cls, 'className');
    }
    function injectCheck(cls) {
        validateStaticElementCheck(function (cls) { return cls.$inject; }, cls, '$inject');
    }
    function createNewCheck(cls) {
        validateStaticElementCheck(function (cls) { return cls.createNew; }, cls, 'createNew');
    }
    function factoryCheck(cls) {
        validateStaticElementCheck(function (cls) { return cls.factory; }, cls, 'factory');
    }
    function validateStaticElementCheck(elementValidationCheck, cls, missingElement) {
        if (!elementValidationCheck(cls))
            throw "static function '" + missingElement + "' was not defined on " + global.getClassName(cls);
    }
    function directiveFactory(cls) {
        injectCheck(cls);
        createNewCheck(cls);
        var directiveFactory = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return cls.createNew(args);
        };
        directiveFactory.$inject = cls.$inject;
        return directiveFactory;
    }
    moduleRegistration.directiveFactory = directiveFactory;
})(moduleRegistration || (moduleRegistration = {}));
//# sourceMappingURL=global.js.map