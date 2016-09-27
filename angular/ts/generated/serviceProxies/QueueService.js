// This file (QueueService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var QueueService = (function () {
        function QueueService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.LoadGeneric = function (queue, userAccountId, loanNumberFilter, borrowerNameFilter, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'QueueService/Load'; }
                return _this.httpUtil.get(methodPath, { queue: queue, userAccountId: userAccountId, loanNumberFilter: loanNumberFilter, borrowerNameFilter: borrowerNameFilter }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.Load = function (queue, userAccountId, loanNumberFilter, borrowerNameFilter, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'QueueService/Load'; }
                return _this.LoadGeneric(queue, userAccountId, loanNumberFilter, borrowerNameFilter, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        QueueService.className = 'QueueService';
        QueueService.$inject = ['httpUtil'];
        return QueueService;
    })();
    srv.QueueService = QueueService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.QueueService);
//# sourceMappingURL=QueueService.js.map