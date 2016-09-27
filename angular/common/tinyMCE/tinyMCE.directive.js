var wysiwyg;
(function (wysiwyg) {
    var TinyMCEDirectiveController = (function () {
        function TinyMCEDirectiveController($sce) {
            var _this = this;
            this.$sce = $sce;
            this.updateHtml = function () {
                _this.html = _this.$sce.trustAsHtml(_this.tinymce);
            };
        }
        TinyMCEDirectiveController.className = 'TinyMCEDirectiveController';
        TinyMCEDirectiveController.$inject = ['$sce'];
        return TinyMCEDirectiveController;
    })();
    moduleRegistration.registerController('ui.tinymce', TinyMCEDirectiveController);
    var TinyMCEDirective = (function () {
        function TinyMCEDirective() {
            this.bindToController = true;
            this.restrict = 'E';
            this.controller = TinyMCEDirectiveController.className;
            this.controllerAs = 'tinyMCECntrl';
            this.scope = {
                html: '='
            };
            this.templateUrl = '/angular/common/tinyMCE/tinyMCE.template.html';
        }
        TinyMCEDirective.createNew = function (args) {
            return new TinyMCEDirective();
        };
        TinyMCEDirective.$inject = [];
        TinyMCEDirective.className = 'tinyMce';
        return TinyMCEDirective;
    })();
    moduleRegistration.registerDirective('ui.tinymce', TinyMCEDirective);
})(wysiwyg || (wysiwyg = {}));
//# sourceMappingURL=tinyMCE.directive.js.map