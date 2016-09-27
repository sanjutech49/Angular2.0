var compliancecenter;
(function (compliancecenter) {
    var auditlogController = (function () {
        function auditlogController(auditLogViewModel) {
            this.logs = auditLogViewModel;
        }
        auditlogController.$inject = [
            'auditLogViewModel',
        ];
        return auditlogController;
    })();
    compliancecenter.auditlogController = auditlogController;
    angular.module('compliancecenter').controller('auditlogController', auditlogController);
})(compliancecenter || (compliancecenter = {}));
//# sourceMappingURL=auditlog.controller.js.map