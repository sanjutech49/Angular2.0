var wysiwyg;
(function (wysiwyg) {
    var TinyMCEDemoDialogController = (function () {
        function TinyMCEDemoDialogController($uibModalInstance) {
            var _this = this;
            this.$uibModalInstance = $uibModalInstance;
            this.html = 'in dialog...';
            this.close = function () {
                _this.$uibModalInstance.close();
            };
        }
        TinyMCEDemoDialogController.className = 'tinyMCEDemoDialogController';
        TinyMCEDemoDialogController.$inject = ['$uibModalInstance'];
        return TinyMCEDemoDialogController;
    })();
    moduleRegistration.registerController(wysiwyg.moduleName, TinyMCEDemoDialogController);
})(wysiwyg || (wysiwyg = {}));
//# sourceMappingURL=tinyMCEDialog.controller.js.map