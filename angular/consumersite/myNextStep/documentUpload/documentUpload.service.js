var consumersite;
(function (consumersite) {
    var DocumentUploadService = (function () {
        function DocumentUploadService($log) {
            this.$log = $log;
        }
        DocumentUploadService.$inject = ['$log'];
        DocumentUploadService.className = 'documentUploadService';
        return DocumentUploadService;
    })();
    consumersite.DocumentUploadService = DocumentUploadService;
    moduleRegistration.registerService(consumersite.moduleName, DocumentUploadService);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=documentUpload.service.js.map