var directive;
(function (directive) {
    var ModalDirective = (function () {
        function ModalDirective($uibModal, $log) {
            var _this = this;
            this.$uibModal = $uibModal;
            this.$log = $log;
            this.scope = {
                templateUrl: '@',
                getModel: '=',
                controllerName: '@',
                controllerAs: '@',
                onCancel: '=?',
                onAccept: '=?',
            };
            this.restrict = 'A';
            this.link = function (scope, instanceElement, instanceAttributes, controller, transclude) {
                ModalDirective.validateInput(scope);
                instanceElement.bind('click', function () {
                    var modalInstance = _this.$uibModal.open({
                        controller: scope.controllerName,
                        controllerAs: scope.controllerAs,
                        templateUrl: scope.templateUrl,
                        backdrop: 'static',
                        resolve: {
                            modalContext: function () {
                                return {
                                    model: angular.copy(scope.getModel()),
                                    onCancel: function () {
                                        modalInstance.close();
                                        if (scope.onCancel) {
                                            scope.onCancel();
                                        }
                                    },
                                    onAccept: function (model) {
                                        modalInstance.close();
                                        if (scope.onAccept) {
                                            scope.onAccept(model);
                                        }
                                    }
                                };
                            }
                        }
                    });
                });
            };
        }
        ModalDirective.createNew = function (args) {
            return new ModalDirective(args[0], args[1]);
        };
        ModalDirective.validateInput = function (scope) {
            var errors = '';
            if (!scope.templateUrl) {
                errors += 'templateUrl was not defined\n';
            }
            if (!scope.getModel) {
                errors += 'getModel was not defined\n';
            }
            if (!scope.controllerName) {
                errors += 'controllerName was not defined\n';
            }
            if (!scope.controllerAs) {
                errors += 'controllerAs was not defined\n';
            }
            if (errors) {
                throw new Error('directive modal: ' + errors);
            }
        };
        ModalDirective.$inject = ['$uibModal', '$log'];
        ModalDirective.className = 'ModalDirective';
        return ModalDirective;
    })();
    moduleRegistration.registerDirective(directive.moduleName, ModalDirective);
})(directive || (directive = {}));
//# sourceMappingURL=modal.directive.js.map