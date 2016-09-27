var demo;
(function (demo) {
    var DemoController = (function () {
        function DemoController() {
            var _this = this;
            this.demoData = {
                firstName: 'Joe',
                lastName: 'Blow'
            };
            this.getModel = function () {
                return _this.demoData;
            };
            this.onAccept = function (model) {
                _this.demoData = model;
            };
            this.onCancel = function () {
            };
        }
        DemoController.className = 'demoController';
        DemoController.$inject = [];
        return DemoController;
    })();
    moduleRegistration.registerController(demo.moduleName, DemoController);
})(demo || (demo = {}));
//# sourceMappingURL=demo.controller.js.map