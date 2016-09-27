(function () {
    'use strict';
    angular.module('common').factory('commonModalWindowFactory', ['$modal', '$modalStack', 'modalWindowType', function ($modal, $modalStack, modalWindowType) {
        return {
            open: function (modalObject) {
                var modalOpenObject = {
                    backdrop: 'static',
                    backdropClass: 'custom-modal-backdrop',
                    dialogFade: false,
                    keyboard: false,
                    controller: 'commonModalController as commonModalCtrl',
                    resolve: {
                        type: function () {
                            return modalObject.type;
                        },
                        message: function () {
                            return modalObject.message;
                        },
                        messageDetails: function() {
                            return modalObject.messageDetails;
                        },
                        ctrl: function () {
                            return modalObject.ctrl;
                        },
                        ctrlButtons: function () {
                            return modalObject.ctrlButtons;
                        },
                        messageClass: function () {
                            return modalObject.messageClass;
                        },

                        header: function () {
                            return modalObject.header;
                        },

                        btnCloseText: function () {
                            return modalObject.btnCloseText;
                        },
                        
                        headerClass: function ()
                        {
                            return modalObject.headerClass;
                        }
                    }
                };
                //for loader, success and success, it was enough to share single css class 'common-modal'
                modalOpenObject['windowClass'] = 'common-modal';
                switch (modalObject.type) {
                    case modalWindowType.loader:
                        modalOpenObject['templateUrl'] = 'angular/common/commonmodalwindow/loadermodalwindow.html';
                        break;
                    case modalWindowType.error:
                        modalOpenObject['windowClass'] = 'custom-modal-error';
                        modalOpenObject['templateUrl'] = 'angular/common/commonmodalwindow/errormodalwindow.html';
                        break;
                    case modalWindowType.success:
                        modalOpenObject['templateUrl'] = 'angular/common/commonmodalwindow/successmodalwindow.html';
                        break;
                    case modalWindowType.unsuccess:
                        modalOpenObject['templateUrl'] = 'angular/common/commonmodalwindow/unsuccessmodalwindow.html';
                        break;
                    case modalWindowType.confirmation:
                        modalOpenObject['templateUrl'] = 'angular/common/commonmodalwindow/confirmationmodalwindow.html';
                        break;
                    case modalWindowType.unload:
                        modalOpenObject['windowClass'] = 'custom-modal-error';
                        modalOpenObject['templateUrl'] = 'angular/common/commonmodalwindow/unloadloanmodalwindow.html';
                        break;                    
                    default:
                        break;
                }
                $modal.open(modalOpenObject);
                //want to change z-index of element with class modal-backdrop for error modal window
                if (modalObject.type == modalWindowType.error) {
                    angular.element(document.getElementsByClassName('modal-backdrop')).addClass('custom-modal-backdrop');
                }
            },
            close: function (reason) {
                $modalStack.dismissAll('close');
            }
        };
    }]);

})();