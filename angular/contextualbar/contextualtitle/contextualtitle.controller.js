/// <reference path="../contextualbar.service.ts" />
/// <reference path="../../ts/global/global.ts" />
var contextualBar;
(function (contextualBar) {
    var contextualTitleController = (function () {
        function contextualTitleController(ContextualBarSvc, NavigationSvc, applicationData, enums) {
            var _this = this;
            this.ContextualBarSvc = ContextualBarSvc;
            this.NavigationSvc = NavigationSvc;
            this.applicationData = applicationData;
            this.enums = enums;
            this.getContextualName = function () {
                return _this.ContextualBarSvc.getContextualName(_this.applicationData, _this.ContextualBarSvc.getContextualType());
            };
            this.getContextualType = function () {
                return _this.ContextualBarSvc.getContextualType();
            };
            var self = this;
            self.ContextualBarSvc = ContextualBarSvc;
            self.enums = enums.ContextualTypes.Queue;
            self.applicationData = applicationData;
        }
        contextualTitleController.className = 'contextualTitleController';
        contextualTitleController.$inject = ['ContextualBarSvc', 'NavigationSvc', 'applicationData', 'enums'];
        return contextualTitleController;
    })();
    contextualBar.contextualTitleController = contextualTitleController;
    moduleRegistration.registerController('contextualBar', contextualTitleController);
})(contextualBar || (contextualBar = {}));
//# sourceMappingURL=contextualtitle.controller.js.map