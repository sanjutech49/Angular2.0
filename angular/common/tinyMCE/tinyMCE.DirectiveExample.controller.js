var wysiwyg;
(function (wysiwyg) {
    var TinyMCEDemoController = (function () {
        function TinyMCEDemoController($uibModal) {
            var _this = this;
            this.$uibModal = $uibModal;
            this.html = 'No value yet...';
            this.popUp = function () {
                var modalInstance = _this.$uibModal.open({
                    templateUrl: '/angular/common/tinyMCE/tinyMCEDirectiveDialogExampleTemplate.html',
                    backdrop: 'static',
                    controller: 'tinyMCEDemoDialogController as tinyMCEDialogCntrl',
                    bindToController: true,
                    size: 'lg'
                });
            };
        }
        TinyMCEDemoController.className = 'tinyMCEDemoController';
        TinyMCEDemoController.$inject = ['$uibModal'];
        return TinyMCEDemoController;
    })();
    moduleRegistration.registerController(wysiwyg.moduleName, TinyMCEDemoController);
})(wysiwyg || (wysiwyg = {}));
//# sourceMappingURL=tinyMCE.DirectiveExample.controller.js.map