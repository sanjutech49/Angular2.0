/// <reference path="../../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path='../../../../Scripts/typings/ui-router/angular-ui-router.d.ts'/>
var docusign;
(function (docusign) {
    var DocUploadController = (function () {
        function DocUploadController() {
        }
        DocUploadController.className = 'DocUploadController';
        DocUploadController.$inject = [];
        return DocUploadController;
    })();
    docusign.DocUploadController = DocUploadController;
    angular.module('docusign').controller('DocUploadController', docusign.AppraisalController);
})(docusign || (docusign = {}));
//# sourceMappingURL=docupload.controller.js.map