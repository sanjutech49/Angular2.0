/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../ts/global/global.ts" />
/// <reference path="eventHandler.ts" />

module events {

    class EventTypes {

        static get OnPropertyChangedEvent(): string {
            return 'OnPropertyChanged';
        }

        static get OnSystemEvent(): string {
            return 'OnSystemEvent';
        }
    }

    export enum SystemEventIdentifier {
        creditCheckComplete,
        creditCheckError,
    }

    // add field identifers as requried to the enum
    export enum LoanFieldIdentifier {
        LoanAmount,
        BorrowerIncome,
        PurchasePrice,
        EstimatedValue,
        LiabilityType,
        AppraisedValue,
        LiabilityMonthsLeft,
        LiabilityUnpaidBalance,
        LiabilityMinPayment,
        LiabilityCommentID,
        LiabilityOwnershipType,
        PublicRecordCommentID,
        MiscellaneousDebtMonthsChanged,
        MiscellaneousDebtAmountChanged,
        PropertyOccupancyTypeChanged,
        IncomeAmountChanged,
        IncomePeriodChanged,
        OtherIncomeAmount,
        OtherIncomeType,
        OtherIncomePaymentPeriod,
        RealEstate,
        Impound,
        SubordinateFinancing,
        AdjustedPointsChanged,
        downPaymentPercentageToFixed,
        downPaymentValue,
        Recalculate,
        DebtType,
        AggregateAdjustment,
        SubjectPropertyZipCode,
        // this is a marker for todo notifications
        todo
    }

    export interface IPropertyChangedEvent extends IEvent<LoanFieldIdentifier> {
    }

    export interface ISystemEvent extends IEvent<SystemEventIdentifier> {
    }
  
    export class LoanEventService {

        static $inject = ['$rootScope'];
        static className = 'loanEvent'; // keep as lower case because it is referenced this way throughout the code

        private propertyChangeEventService: EventHander<LoanFieldIdentifier>;
        private systemEventService: EventHander<SystemEventIdentifier>;

        constructor(private $rootScope: ng.IRootScopeService) {
            this.propertyChangeEventService = new EventHander<LoanFieldIdentifier>(EventTypes.OnPropertyChangedEvent, $rootScope);
            this.systemEventService = new EventHander<SystemEventIdentifier>(EventTypes.OnSystemEvent, $rootScope);
        }

        // property change events
        broadcastPropertyChangedEvent(loanFieldId: LoanFieldIdentifier, currentValue: any): void {
            this.propertyChangeEventService.broadcastEvent(loanFieldId, currentValue);
        }

        registerForPropertyChangeEvent = (registrationId: string, caller: any, propertyChangedEventCallback: IEventCallback<LoanFieldIdentifier>): void => {
            this.propertyChangeEventService.registerForEvent(registrationId, caller, propertyChangedEventCallback);
        }

        // deactivate a handler using the 'registrationId' 
        deactivatePropertyChangeEventHandler = (registrationId: string): boolean => this.propertyChangeEventService.setCallbackActivity(registrationId, false)

        // activate a handler using the 'registrationId' 
        activatePropertyChangeEventHandler = (registrationId: string): boolean => this.propertyChangeEventService.setCallbackActivity(registrationId, true)

        // system events
        broadcastSystemEvent(eventId: SystemEventIdentifier, value: any): void {
            this.systemEventService.broadcastEvent(eventId, value);
        }

        registerForSystemEvent = (registrationId: string, caller: any, systemEventCallback: IEventCallback<SystemEventIdentifier>): void => {
            this.systemEventService.registerForEvent(registrationId, caller, systemEventCallback);
        }
         
         // deactivate a handler using the 'registrationId' 
        deactivateSystemEventHandler = (registrationId: string): boolean => this.systemEventService.setCallbackActivity(registrationId, false)

        // activate a handler using the 'registrationId' 
        activateSystemEventHandler = (registrationId: string): boolean => this.systemEventService.setCallbackActivity(registrationId, true)
    }
    moduleRegistration.registerService('loan.events', LoanEventService);
}