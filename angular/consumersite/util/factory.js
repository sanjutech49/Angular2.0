var consumersite;
(function (consumersite) {
    function classFactory(fc, wc, transactionInfo) {
        return new wc(new fc(transactionInfo));
    }
    consumersite.classFactory = classFactory;
})(consumersite || (consumersite = {}));
//# sourceMappingURL=factory.js.map