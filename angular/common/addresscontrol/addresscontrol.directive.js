impDirectives.directive('impAddressControl',
[function () {
    return {
        // can be used as element
        restrict: 'E',
        //the directive’s template entirely replacing any elements that it matches
        replace: true,
        //definition for template
        templateUrl: '/angular/common/addresscontrol/addresscontroltemplate.html',
        // the 'require' property says we need a ngModel attribute in the declaration.
        require: 'ngModel',
        scope: {
            states: '=?',
            isCountyVisible: '@',
            isUnitVisible: '@',
            placeholderStreetName: '@',
            placeholderCityName: '@',
            model: '=ngModel',
            isDisabled: '=ngDisabled',
            required: '=ngRequired',
            namePrefix: '@',
            formName: '=',
            zipEnabled: '@',
            firstRowDisabled: '=',
            zipRequired: '=',
            zipBlurValidation: '=',
            isLicensedStates: '=',
            isSubjectProperty: '=',
            onStreetNameChangeFn: '&',
            onStateChangeFn: '&?',
            noChangeEventForStreetName: '=',
            validation: '=?', //to be used as: validation="{sixPiecesCompleted: property.loan.sixPiecesAcquiredForAllLoanApplications, validate:true}"
            zipAsterisksRequired: '=',
            runLoanCalculatorOnZipBlur: '=',
            customCallbacks: '=' //to be used as: custom-callbacks="[callback1, callback2, callbackN]". Every callback will be executed on blur event on ZIP code field
        },
        link: function (scope, element, attrs) {
            if (!attrs.isCountyVisible) { attrs.isCountyVisible = false; }
            if (!attrs.isUnitVisible) { attrs.isUnitVisible = true; }
            if (!attrs.placeholderStreetName) { attrs.placeholderStreetName = 'Street'; }
            if (!attrs.placeholderCityName) { attrs.placeholderCityName = 'City'; }
            if (!attrs.isLicensedStates) { attrs.isLicensedStates = false; }
            if (!attrs.onStreetNameChangeFn) { attrs.noChangeEventForStreetName = true; }
        },
        controller: function ($scope, $timeout, ZipCodeSvc, loanEvent) {
            var vm = $scope;

            vm.fetchZipData = fetchZipData;
            vm.fetchCounty = fetchCounty;
            vm.getStateContainerClass = getStateContainerClass;
            vm.validateZipOnBlur = validateZipOnBlur;
            vm.isExistingState = isExistingState;
            vm.invalidZipCode = false;
            vm.isLicencedZipCode = true;
            vm.onStreetNameChange = onStreetNameChange;
            if (!vm.states && !!vm.model && !!vm.model.states) {
                vm.states = vm.model.states;
            }

            if (vm.isCountyVisible == "true" && !!vm.model) {
                if (vm.model.zipCode && vm.model.zipCode.length > 1 && (!vm.model.counties || vm.model.counties.length == 0)) {
                    if (vm.model.countyName)
                        vm.model.counties = [{ Selected: true, Text: vm.model.countyName, Value: vm.model.countyName }];

                    ZipCodeSvc.GetZipData(vm.model).then(function (data) {
                        vm.model.counties = data.counties;
                    });
                }
                else if (vm.model.countyName && (!vm.model.counties || vm.model.counties.length == 0)) {
                    vm.model.counties = [{ Selected: true, Text: vm.model.countyName, Value: vm.model.countyName }];
                }
            }

            // FIX for county not populating on diffrent state PBI 23710
            $scope.$watch(function () {
                return !!vm.model ? vm.model.stateName : "";
            }, function (newValue, oldValue) {
                if (!!vm.model && !!vm.model.counties && vm.model.counties.length != 0) vm.counties = vm.model.counties;
            });

            function isExistingState(stateName) {
                for (var i = 0; i < vm.states.length; i++)
                    if (vm.states[i].text == stateName) return true;
                return false;
            }

            function updatePropertyAddressFromZipData(zipData) {
                if (zipData.zipCode == null || !isExistingState(zipData.stateName)) {
                    vm.model.cityName = "";
                    vm.model.countyName = "";
                    vm.model.stateName = "";
                    vm.model.zipCode = "";
                    vm.model.stateId = 0;
                    vm.model.counties = [];
                    vm.isLicencedZipCode = false;
                }
                else {
                    vm.model.cityName = zipData.cityName;
                    vm.model.countyName = zipData.countyName;
                    vm.model.stateName = zipData.stateName;
                    vm.model.zipCode = zipData.zipCode;
                    vm.model.counties = zipData.counties;
                    SetStateId();
                    vm.isLicencedZipCode = true;
                }
            }

            function fetchZipData() {                
                if (!vm.model || !vm.model.zipCode || vm.model.zipCode.length != 5) {
                    return;
                }

                vm.model.isLicensedStates = vm.isLicensedStates;
                ZipCodeSvc.GetZipData(vm.model).then(function (data) {
                    //
                    //if (data.zipCode == null || !isExistingState(data.stateName)) {
                    //    data = new cls.PropertyViewModel(data);
                    //    data.clearAddress(false);
                    //    vm.isLicencedZipCode = false;
                    //}
                    //else {
                    //    vm.isLicencedZipCode = true;
                    //}
                    //angular.extend(vm.model, data);
                    //vm.model.counties = data.counties;
                    //SetStateId();

                    //
                    updatePropertyAddressFromZipData(data);
                });
                onStateChange();
            };

            function onStateChange() {
                if (angular.isDefined(vm.onStateChangeFn())) {
                    $timeout(function () {
                        vm.onStateChangeFn();
                    });
                }
            }

            function fetchCounty() {
                if (!vm.model) {
                    return;
                }

                vm.model.zipCode = "";
                vm.model.cityName = vm.model.cityName || "";

                if (!vm.isCountyVisible || vm.isCountyVisible == "false") {
                    SetStateId();
                    return;
                }

                ZipCodeSvc.GetCounties(vm.model).then(function (data) {
                    angular.extend(vm.model, data);
                    vm.model.counties = data.counties;
                    SetStateId();
                });
                onStateChange();
            }

            function SetStateId() {
                if (!vm.model) {
                    return;
                }

                angular.forEach(vm.states, function (state) {
                    if (state.text == vm.model.stateName) {
                        if (vm.model.stateId == null) {
                            vm.model.stateId = {}
                        }
                        vm.model.stateId = state.value;
                        return false;
                    }
                });
            }

            function getStateContainerClass(formElement) {
                if (vm.validation && (vm.validation.sixPicesCompleted && vm.validation.validate && (!!vm.model && !vm.model.stateName)))
                    return "imp-has-error";

                if (vm.isDisabled)
                    return "disabled";

                if (formElement == undefined)
                    return "";

                var stateNameElement = formElement[vm.namePrefix + "StateName"];

                if (stateNameElement == undefined)
                    return "";

                if ((vm.required == true || vm.required == "required") && (stateNameElement.$touched || stateNameElement.$dirty) && stateNameElement.$invalid)
                    return "ng-invalid ng-dirty";
            }

            function validateZipOnBlur(zipCode) {
                if (vm.customCallbacks) {
                    for (var i = 0; i < vm.customCallbacks.length; i++) {
                        vm.customCallbacks[0]();
                    }
                }

                if (vm.runLoanCalculatorOnZipBlur) {
                    loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.SubjectPropertyZipCode, vm.model.zipCode);
                }
                if (vm.zipBlurValidation) {

                    if (zipCode == null || zipCode.length != 5)
                        vm.invalidZipCode = true;
                    else
                        vm.invalidZipCode = false;
                }

            }

            function onStreetNameChange() {
                if (vm.noChangeEventForStreetName != true && typeof this.onStreetNameChangeFn == "function") {
                    var _controller = this;
                    $timeout(function () {
                        _controller.onStreetNameChangeFn();
                    });
                }
            }
        }
    };
}]);