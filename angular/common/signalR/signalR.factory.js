(function () {
    'use strict';

    var app = angular.module('signalrModule')
    app.value('signalrData', []);
    app.factory('signalrFactory', signalrFactory);

    signalrFactory.$inject = ['$timeout', 'Hub', 'signalrData'];

    function signalrFactory($timeout, Hub, signalrData) {
        var factory = {};
        factory.createListener = createListener;

        function createListener(hubName, signalrFunction, parameter) {
            var hub = new Hub(hubName, {

                listeners: {
                    //created:costdetails.controller; signalrFunction:smartGfeSignalRCostUpdate; parameter:loanId
                    'updateCosts': function (loanId) {
                        $timeout(function () {
                            signalrFunction(loanId, parameter);
                        });
                    }
                },

                // Handle connection error
                errorHandler: function (error) {
                    console.error(error);
                },
            });
            return hub;
        };

        return factory;
    }
})();