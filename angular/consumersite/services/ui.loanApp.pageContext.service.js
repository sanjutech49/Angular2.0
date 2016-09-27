var consumersite;
(function (consumersite) {
    var LoanAppPageContext = (function () {
        function LoanAppPageContext($window, $state) {
            var _this = this;
            this.$window = $window;
            this.$state = $state;
            this.getData = function () {
                return _this.$state.current.data;
            };
            this.scrollToTop = function () {
                _this.$window.scrollTo(0, 65);
            };
        }
        Object.defineProperty(LoanAppPageContext.prototype, "loanAppNavigationState", {
            get: function () {
                return this.getData().loanAppNavState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoanAppPageContext.prototype, "isCoBorrowerState", {
            get: function () {
                return this.getData().isCoBorrowerState;
            },
            enumerable: true,
            configurable: true
        });
        LoanAppPageContext.$inject = ['$window', '$state'];
        LoanAppPageContext.className = 'loanAppPageContext';
        return LoanAppPageContext;
    })();
    consumersite.LoanAppPageContext = LoanAppPageContext;
    moduleRegistration.registerService(consumersite.moduleName, LoanAppPageContext);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=ui.loanApp.pageContext.service.js.map