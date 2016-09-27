(function () {
    'use strict';
    angular.module('common')
        .controller('commonModalController', function ($scope, $modalStack, $sce, type, header, message, messageDetails, ctrl, ctrlButtons, messageClass, btnCloseText, headerClass) {
            var vm = this;
            vm.type = type;
            vm.header = header;
            vm.headerClass = headerClass;
            vm.message = $sce.trustAsHtml(message);
            vm.messageDetails = messageDetails;
            vm.ctrl = ctrl;
            vm.ctrlButtons = ctrlButtons;
            vm.messageClass = messageClass;
            vm.btnCloseText = btnCloseText;
            vm.close = function () {
                $modalStack.dismissAll('close');
            };
            vm.buttonCallback = function (callback) {
                ctrl[callback]();
            };
        })
})();