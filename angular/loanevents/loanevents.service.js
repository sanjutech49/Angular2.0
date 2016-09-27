/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../ts/global/global.ts" />
/// <reference path="eventHandler.ts" />
var events;
(function (events) {
    var EventTypes = (function () {
        function EventTypes() {
        }
        Object.defineProperty(EventTypes, "OnPropertyChangedEvent", {
            get: function () {
                return 'OnPropertyChanged';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EventTypes, "OnSystemEvent", {
            get: function () {
                return 'OnSystemEvent';
            },
            enumerable: true,
            configurable: true
        });
        return EventTypes;
    })();
    (function (SystemEventIdentifier) {
        SystemEventIdentifier[SystemEventIdentifier["creditCheckComplete"] = 0] = "creditCheckComplete";
        SystemEventIdentifier[SystemEventIdentifier["creditCheckError"] = 1] = "creditCheckError";
    })(events.SystemEventIdentifier || (events.SystemEventIdentifier = {}));
    var SystemEventIdentifier = events.SystemEventIdentifier;
    // add field identifers as requried to the enum
    (function (LoanFieldIdentifier) {
        LoanFieldIdentifier[LoanFieldIdentifier["LoanAmount"] = 0] = "LoanAmount";
        LoanFieldIdentifier[LoanFieldIdentifier["BorrowerIncome"] = 1] = "BorrowerIncome";
        LoanFieldIdentifier[LoanFieldIdentifier["PurchasePrice"] = 2] = "PurchasePrice";
        LoanFieldIdentifier[LoanFieldIdentifier["EstimatedValue"] = 3] = "EstimatedValue";
        LoanFieldIdentifier[LoanFieldIdentifier["LiabilityType"] = 4] = "LiabilityType";
        LoanFieldIdentifier[LoanFieldIdentifier["AppraisedValue"] = 5] = "AppraisedValue";
        LoanFieldIdentifier[LoanFieldIdentifier["LiabilityMonthsLeft"] = 6] = "LiabilityMonthsLeft";
        LoanFieldIdentifier[LoanFieldIdentifier["LiabilityUnpaidBalance"] = 7] = "LiabilityUnpaidBalance";
        LoanFieldIdentifier[LoanFieldIdentifier["LiabilityMinPayment"] = 8] = "LiabilityMinPayment";
        LoanFieldIdentifier[LoanFieldIdentifier["LiabilityCommentID"] = 9] = "LiabilityCommentID";
        LoanFieldIdentifier[LoanFieldIdentifier["LiabilityOwnershipType"] = 10] = "LiabilityOwnershipType";
        LoanFieldIdentifier[LoanFieldIdentifier["PublicRecordCommentID"] = 11] = "PublicRecordCommentID";
        LoanFieldIdentifier[LoanFieldIdentifier["MiscellaneousDebtMonthsChanged"] = 12] = "MiscellaneousDebtMonthsChanged";
        LoanFieldIdentifier[LoanFieldIdentifier["MiscellaneousDebtAmountChanged"] = 13] = "MiscellaneousDebtAmountChanged";
        LoanFieldIdentifier[LoanFieldIdentifier["PropertyOccupancyTypeChanged"] = 14] = "PropertyOccupancyTypeChanged";
        LoanFieldIdentifier[LoanFieldIdentifier["IncomeAmountChanged"] = 15] = "IncomeAmountChanged";
        LoanFieldIdentifier[LoanFieldIdentifier["IncomePeriodChanged"] = 16] = "IncomePeriodChanged";
        LoanFieldIdentifier[LoanFieldIdentifier["OtherIncomeAmount"] = 17] = "OtherIncomeAmount";
        LoanFieldIdentifier[LoanFieldIdentifier["OtherIncomeType"] = 18] = "OtherIncomeType";
        LoanFieldIdentifier[LoanFieldIdentifier["OtherIncomePaymentPeriod"] = 19] = "OtherIncomePaymentPeriod";
        LoanFieldIdentifier[LoanFieldIdentifier["RealEstate"] = 20] = "RealEstate";
        LoanFieldIdentifier[LoanFieldIdentifier["Impound"] = 21] = "Impound";
        LoanFieldIdentifier[LoanFieldIdentifier["SubordinateFinancing"] = 22] = "SubordinateFinancing";
        LoanFieldIdentifier[LoanFieldIdentifier["AdjustedPointsChanged"] = 23] = "AdjustedPointsChanged";
        LoanFieldIdentifier[LoanFieldIdentifier["downPaymentPercentageToFixed"] = 24] = "downPaymentPercentageToFixed";
        LoanFieldIdentifier[LoanFieldIdentifier["downPaymentValue"] = 25] = "downPaymentValue";
        LoanFieldIdentifier[LoanFieldIdentifier["Recalculate"] = 26] = "Recalculate";
        LoanFieldIdentifier[LoanFieldIdentifier["DebtType"] = 27] = "DebtType";
        LoanFieldIdentifier[LoanFieldIdentifier["AggregateAdjustment"] = 28] = "AggregateAdjustment";
        LoanFieldIdentifier[LoanFieldIdentifier["SubjectPropertyZipCode"] = 29] = "SubjectPropertyZipCode";
        // this is a marker for todo notifications
        LoanFieldIdentifier[LoanFieldIdentifier["todo"] = 30] = "todo";
    })(events.LoanFieldIdentifier || (events.LoanFieldIdentifier = {}));
    var LoanFieldIdentifier = events.LoanFieldIdentifier;
    var LoanEventService = (function () {
        function LoanEventService($rootScope) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.registerForPropertyChangeEvent = function (registrationId, caller, propertyChangedEventCallback) {
                _this.propertyChangeEventService.registerForEvent(registrationId, caller, propertyChangedEventCallback);
            };
            // deactivate a handler using the 'registrationId' 
            this.deactivatePropertyChangeEventHandler = function (registrationId) { return _this.propertyChangeEventService.setCallbackActivity(registrationId, false); };
            // activate a handler using the 'registrationId' 
            this.activatePropertyChangeEventHandler = function (registrationId) { return _this.propertyChangeEventService.setCallbackActivity(registrationId, true); };
            this.registerForSystemEvent = function (registrationId, caller, systemEventCallback) {
                _this.systemEventService.registerForEvent(registrationId, caller, systemEventCallback);
            };
            // deactivate a handler using the 'registrationId' 
            this.deactivateSystemEventHandler = function (registrationId) { return _this.systemEventService.setCallbackActivity(registrationId, false); };
            // activate a handler using the 'registrationId' 
            this.activateSystemEventHandler = function (registrationId) { return _this.systemEventService.setCallbackActivity(registrationId, true); };
            this.propertyChangeEventService = new events.EventHander(EventTypes.OnPropertyChangedEvent, $rootScope);
            this.systemEventService = new events.EventHander(EventTypes.OnSystemEvent, $rootScope);
        }
        // property change events
        LoanEventService.prototype.broadcastPropertyChangedEvent = function (loanFieldId, currentValue) {
            this.propertyChangeEventService.broadcastEvent(loanFieldId, currentValue);
        };
        // system events
        LoanEventService.prototype.broadcastSystemEvent = function (eventId, value) {
            this.systemEventService.broadcastEvent(eventId, value);
        };
        LoanEventService.$inject = ['$rootScope'];
        LoanEventService.className = 'loanEvent'; // keep as lower case because it is referenced this way throughout the code
        return LoanEventService;
    })();
    events.LoanEventService = LoanEventService;
    moduleRegistration.registerService('loan.events', LoanEventService);
})(events || (events = {}));
//# sourceMappingURL=loanevents.service.js.map