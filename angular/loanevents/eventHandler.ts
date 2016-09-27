/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />

module events {

    export interface IEventCallback<Enum> {
        (event: IEvent<Enum>): void;
    }

    export interface IEvent<Enum> {
        eventHandler: EventHander<Enum>;
        value: any;
        eventId: Enum;
    }

    interface EventCallbackEntry<Enum> {
        registrationId: string;
        isActive: boolean;
        caller: any;
        callback: IEventCallback<Enum>;
    }

    export class EventHander<Enum> {

        private callbackEvents = new Array<EventCallbackEntry<Enum>>();

        constructor(private eventName: string, private $rootScope: ng.IRootScopeService) {
            this.$rootScope.$on(eventName, this.onEvent);
        }

        public registerForEvent = (registrationId: string, caller: any, callback: IEventCallback<Enum>): void => {
            var eventCallBackEntry = this.getEventCallbackEntry(registrationId);

            if (!eventCallBackEntry)
                this.callbackEvents.push({ registrationId: registrationId, isActive: true, caller: caller, callback: callback });
            else {
                eventCallBackEntry.caller = caller;
                eventCallBackEntry.isActive = true;
                eventCallBackEntry.callback = callback;
            }
        }

        broadcastEvent(eventId: Enum, context: any): void {

            this.$rootScope.$broadcast(this.eventName, <IEvent<Enum>> { eventHandler: this, eventId: eventId, value: context });
        }

        public setCallbackActivity = <Enum>(registrationId: string, isActive: boolean): boolean => {
            var eventCallBackEntry = this.getEventCallbackEntry(registrationId);
            if (eventCallBackEntry) {
                eventCallBackEntry.isActive = isActive;
                return true;
            }
            return false;
        }

        private getEventCallbackEntry(registrationId: string): EventCallbackEntry<Enum> {
            for (var i = 0; i < this.callbackEvents.length; i++) {
                if (this.callbackEvents[i].registrationId == registrationId)
                    return this.callbackEvents[i];
            }
            return null;
        }

        private onEvent = (event: ng.IAngularEvent, customEvent: IEvent<Enum>): void => {

            this.callbackEvents.forEach(callBackEntry => {
                if (callBackEntry.isActive)
                    callBackEntry.callback.call(callBackEntry.caller, customEvent);
            });
        }
    }
}