var demo;
(function (demo) {
    var DialogController = (function () {
        function DialogController(modalContext) {
            var _this = this;
            this.modalContext = modalContext;
            this.onCancel = function () {
                _this.modalContext.onCancel();
            };
            this.onAccept = function () {
                _this.modalContext.onAccept(_this.modalContext.model);
            };
        }
        Object.defineProperty(DialogController.prototype, "firstName", {
            get: function () {
                return this.modalContext.model.firstName;
            },
            set: function (firstName) {
                this.modalContext.model.firstName = firstName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DialogController.prototype, "lastName", {
            get: function () {
                return this.modalContext.model.lastName;
            },
            set: function (lastName) {
                this.modalContext.model.lastName = lastName;
            },
            enumerable: true,
            configurable: true
        });
        DialogController.className = 'dialogController';
        DialogController.$inject = ['modalContext'];
        return DialogController;
    })();
    moduleRegistration.registerController(demo.moduleName, DialogController);
})(demo || (demo = {}));
//# sourceMappingURL=demo.dialog.controller.js.map