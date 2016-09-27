var wysiwyg;
(function (wysiwyg) {
    var TinyMCEDirectiveExampleController = (function () {
        function TinyMCEDirectiveExampleController() {
            var _this = this;
            this.updateHtml = function (html) {
                _this.html = html;
            };
        }
        TinyMCEDirectiveExampleController.className = 'tinyMCEDirectiveExampleController';
        return TinyMCEDirectiveExampleController;
    })();
    angular.module(wysiwyg.moduleName).controller(TinyMCEDirectiveExampleController.className, TinyMCEDirectiveExampleController);
})(wysiwyg || (wysiwyg = {}));
//# sourceMappingURL=tinyMCE.controller.js.map