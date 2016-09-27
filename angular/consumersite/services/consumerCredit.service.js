var consumersite;
(function (consumersite) {
    var ConsumerCreditService = (function () {
        function ConsumerCreditService($log) {
            this.$log = $log;
        }
        ConsumerCreditService.prototype.checkCreditStatus = function (active, userAccountId, borrowerId, isReRun) {
        };
        ConsumerCreditService.prototype.runCredit = function (loan) {
        };
        ConsumerCreditService.$inject = ['$log'];
        ConsumerCreditService.className = 'consumerCreditService';
        return ConsumerCreditService;
    })();
    consumersite.ConsumerCreditService = ConsumerCreditService;
    moduleRegistration.registerService(consumersite.moduleName, ConsumerCreditService);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=consumerCredit.service.js.map