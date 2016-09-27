/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
var events;
(function (events) {
    var EventHander = (function () {
        function EventHander(eventName, $rootScope) {
            var _this = this;
            this.eventName = eventName;
            this.$rootScope = $rootScope;
            this.callbackEvents = new Array();
            this.registerForEvent = function (registrationId, caller, callback) {
                var eventCallBackEntry = _this.getEventCallbackEntry(registrationId);
                if (!eventCallBackEntry)
                    _this.callbackEvents.push({ registrationId: registrationId, isActive: true, caller: caller, callback: callback });
                else {
                    eventCallBackEntry.caller = caller;
                    eventCallBackEntry.isActive = true;
                    eventCallBackEntry.callback = callback;
                }
            };
            this.setCallbackActivity = function (registrationId, isActive) {
                var eventCallBackEntry = _this.getEventCallbackEntry(registrationId);
                if (eventCallBackEntry) {
                    eventCallBackEntry.isActive = isActive;
                    return true;
                }
                return false;
            };
            this.onEvent = function (event, customEvent) {
                _this.callbackEvents.forEach(function (callBackEntry) {
                    if (callBackEntry.isActive)
                        callBackEntry.callback.call(callBackEntry.caller, customEvent);
                });
            };
            this.$rootScope.$on(eventName, this.onEvent);
        }
        EventHander.prototype.broadcastEvent = function (eventId, context) {
            this.$rootScope.$broadcast(this.eventName, { eventHandler: this, eventId: eventId, value: context });
        };
        EventHander.prototype.getEventCallbackEntry = function (registrationId) {
            for (var i = 0; i < this.callbackEvents.length; i++) {
                if (this.callbackEvents[i].registrationId == registrationId)
                    return this.callbackEvents[i];
            }
            return null;
        };
        return EventHander;
    })();
    events.EventHander = EventHander;
})(events || (events = {}));
//# sourceMappingURL=eventHandler.js.map