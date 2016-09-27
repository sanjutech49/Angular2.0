(function () {
    'use strict';

    angular.module('modalPopover')
        .factory('modalPopoverFactory', modalPopoverFactory);

    function modalPopoverFactory($modalpopover) {
        var factory = {};

        factory.openModalPopover = openModalPopover;

        function openModalPopover(templateUrl, extCtrl, extModel, event, modalOptions) {

            if (!modalOptions)
                modalOptions = {};

            return $modalpopover.open({
                templateUrl: templateUrl,
                controller: modalpopoverCtrl,
                controllerAs: 'modalpopoverCtrl',
                resolve: resolve(extCtrl, extModel, modalOptions.refExtModelAndCtrl),
                zindex: modalOptions.zindex,
                position: modalOptions.position,
                arrowRight: modalOptions.arrowRight,
                className: modalOptions.className,
                verticalPopupPositionPerHeight: modalOptions.verticalPopupPositionPerHeight,
                horisontalPopupPositionPerWidth: modalOptions.horisontalPopupPositionPerWidth,
                calculateVerticalPositionFromTopBorder: modalOptions.calculateVerticalPositionFromTopBorder
            }, event);
        };

        // Resolves the controller and the single model into the modalpopover controller.
        // The extModel argument is passed when a specific model is to be extracted from a list.
        function resolve(extCtrl, extModel, refExtModelAndCtrl) {
            var resolve = {
                intCtrl: function () {
                    return extCtrl;
                },
                inModel: function () {
                    return extModel;
                },
                refExtModelAndCtrl: function () {
                    return refExtModelAndCtrl;
                }
            };
            return resolve;
        };

        function modalpopoverCtrl(intCtrl, inModel, refExtModelAndCtrl, $modalInstance) {
            var self = this;
            if (refExtModelAndCtrl) {
                self.model = inModel;
                self.ctrl = intCtrl;
                self.done = done;
                self.cancel = cancel;
            }
            else {
                self.ctrl = angular.copy(intCtrl);
                self.model = angular.copy(inModel);
                    
                self.done = done;
                self.cancel = cancel;
            }
            

            function done(model) {
                angular.extend(inModel, model);
                angular.extend(intCtrl, self.ctrl);
                self.model = angular.copy(inModel);
                self.ctrl = angular.copy(intCtrl);
                $modalInstance.close(model);
            };

            function cancel() {
                $modalInstance.dismiss('cancel');
            };
        };

        return factory;
    };

})();