
module directive {

    export interface IModalContext<T> {
        model: T;
        onCancel: () => void;
        onAccept: (model: any) => void;
    }

    class ModalDirective implements ng.IDirective {

        static $inject = ['$uibModal', '$log'];
        static className = 'ModalDirective'

        private model: any;

        constructor(private $uibModal: angular.ui.bootstrap.IModalService, private $log: ng.ILogService) {
        }

        static createNew(args: any[]) {
            return new ModalDirective(args[0], args[1]);
        }

        scope = {
            templateUrl: '@',
            getModel: '=',
            controllerName: '@',
            controllerAs: '@',
            onCancel: '=?', // optional
            onAccept: '=?', // optional
        };
        restrict = 'A';

        private static validateInput(scope: any) {

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
        }

        link = (scope: any,
            instanceElement: ng.IAugmentedJQuery,
            instanceAttributes: ng.IAttributes,
            controller: any,
            transclude: ng.ITranscludeFunction) => {

            ModalDirective.validateInput(scope);

            instanceElement.bind('click', () => {

                var modalInstance = this.$uibModal.open({

                    controller: scope.controllerName,
                    controllerAs: scope.controllerAs,
                    templateUrl: scope.templateUrl,
                    backdrop: 'static',
                    resolve: {
                        modalContext: () => {
                            return {
                                model: angular.copy(scope.getModel()),
                                onCancel: () => {
                                    modalInstance.close();
                                    if (scope.onCancel) {
                                        scope.onCancel();
                                    }
                                },
                                onAccept: (model: any) => {
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
        }
    }

    moduleRegistration.registerDirective(moduleName, ModalDirective);
}