/// <reference path="../../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path='../../../../Scripts/typings/ui-router/angular-ui-router.d.ts'/>

module docusign {

    export class DocUploadController {

        static className = 'DocUploadController';

        static $inject = [];

        constructor() { }

    }

    angular.module('docusign').controller('DocUploadController', AppraisalController);
}