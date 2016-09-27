var util;
(function (util) {
    'use strict';
    var addressWidget = (function () {
        //bindToController = true;
        function addressWidget(ZipCodeSvc) {
            var _this = this;
            this.template = '<div ng-include src="contentUrl"></div>';
            this.isExistingState = function ($scope, stateName) {
                for (var i = 0; i < $scope.states.length; i++)
                    if ($scope.states[i].text == stateName)
                        return true;
                return false;
            };
            this.updatePropertyAddressFromZipData = function ($scope, zipData) {
                console.log("It is required ::: " + $scope.required);
                if (zipData.zipCode == null || !_this.isExistingState($scope, zipData.stateName)) {
                    $scope.cityName = "";
                    $scope.countyName = "";
                    $scope.stateName = "";
                    $scope.zipCode = "";
                    $scope.stateId = 0;
                    $scope.counties = [];
                    $scope.isLicencedZipCode = false;
                }
                else {
                    $scope.cityName = zipData.cityName;
                    $scope.countyName = zipData.countyName;
                    $scope.stateName = zipData.stateName;
                    $scope.zipCode = zipData.zipCode;
                    $scope.counties = zipData.counties;
                    _this.SetStateId($scope);
                    $scope.isLicencedZipCode = true;
                }
            };
            this.fetchZipData = function ($scope, ZipCodeSvc) {
                if (!$scope.zipCode || $scope.zipCode.length != 5) {
                    return;
                }
                var payload = {
                    isLicensedStates: true,
                    cityName: $scope.cityName,
                    countyName: $scope.countyName,
                    stateName: $scope.stateName,
                    zipCode: $scope.zipCode
                };
                ZipCodeSvc.GetZipData(payload).then(function (data) {
                    _this.updatePropertyAddressFromZipData($scope, data);
                });
            };
            /** Port when we support multiple countries
            private fetchCounty = () => {
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
            }
            **/
            this.SetStateId = function ($scope) {
                angular.forEach($scope.states, function (state) {
                    if (state.text == $scope.stateName) {
                        if ($scope.stateId == null) {
                            $scope.stateId = {};
                        }
                        $scope.stateId = state.value;
                        return false;
                    }
                });
            };
            /** need to port ** /
    
            private getStateContainerClass = (formElement) => {
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
    
            **/
            this.validateZipOnBlur = function ($scope) {
                if ($scope.zipBlurValidation) {
                    if ($scope.zipCode == null || $scope.zipCode.length != 5)
                        $scope.invalidZipCode = true;
                    else
                        $scope.invalidZipCode = false;
                }
            };
            this.getStates = function () {
                return [
                    {
                        "selected": false,
                        "text": "AL",
                        "value": "0",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "AK",
                        "value": "1",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "AZ",
                        "value": "2",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "AR",
                        "value": "3",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "CA",
                        "value": "4",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "CO",
                        "value": "5",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "CT",
                        "value": "6",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "DC",
                        "value": "50",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "DE",
                        "value": "7",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "FL",
                        "value": "8",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "GA",
                        "value": "9",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "HI",
                        "value": "10",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "ID",
                        "value": "11",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "IL",
                        "value": "12",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "IN",
                        "value": "13",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "IA",
                        "value": "14",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "KS",
                        "value": "15",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "KY",
                        "value": "16",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "LA",
                        "value": "17",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "ME",
                        "value": "18",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "MD",
                        "value": "19",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "MA",
                        "value": "20",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "MI",
                        "value": "21",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "MN",
                        "value": "22",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "MS",
                        "value": "23",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "MO",
                        "value": "24",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "MT",
                        "value": "25",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "NE",
                        "value": "26",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "NV",
                        "value": "27",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "NH",
                        "value": "28",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "NJ",
                        "value": "29",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "NM",
                        "value": "30",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "NY",
                        "value": "31",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "NC",
                        "value": "32",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "ND",
                        "value": "33",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "OH",
                        "value": "34",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "OK",
                        "value": "35",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "OR",
                        "value": "36",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "PA",
                        "value": "37",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "RI",
                        "value": "38",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "SC",
                        "value": "39",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "SD",
                        "value": "40",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "TN",
                        "value": "41",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "TX",
                        "value": "42",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "UT",
                        "value": "43",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "VT",
                        "value": "44",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "VA",
                        "value": "45",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "WA",
                        "value": "46",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "WV",
                        "value": "47",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "WI",
                        "value": "48",
                        "disabled": false,
                        "contextFlags": null
                    },
                    {
                        "selected": false,
                        "text": "WY",
                        "value": "49",
                        "disabled": false,
                        "contextFlags": null
                    }
                ];
            };
            this.restrict = 'E';
            this.replace = true;
            this.scope = {
                states: '=?',
                isCountyVisible: '@',
                isUnitVisible: '@',
                placeholderStreetName: '@',
                placeholderCityName: '@',
                placeholderStateName: '@',
                placeholderZipCodeName: '@',
                model: '=?ngModel',
                streetName: '=',
                unitNumber: '=?',
                cityName: '=',
                stateName: '=',
                zipCode: '=',
                countyName: '=?',
                isDisabled: '=ngDisabled',
                required: '=ngRequired',
                namePrefix: '@',
                formName: '=',
                zipEnabled: '@',
                firstRowDisabled: '=',
                zipRequired: '@',
                zipBlurValidation: '=',
                isLicensedStates: '=',
                isSubjectProperty: '=',
                onStreetNameChangeFn: '&',
                noChangeEventForStreetName: '=',
                validation: '=?',
                zipAsterisksRequired: '=',
                cityWidth: '@',
                stateWidth: '@',
                zipWidth: '@',
                contentUrl: '=?',
            };
            this.controller = function ($scope) {
                if (!$scope.states)
                    $scope.states = _this.getStates();
                if (!$scope.zipRequired)
                    $scope.zipRequired = true;
                if ($scope.zipBlurValidation)
                    $scope.zipBlurValidation = false;
                if ($scope.stateName)
                    _this.SetStateId($scope);
                if (!$scope.contentUrl)
                    $scope.contentUrl = '/angular/common/address/address.html';
                $scope.fetchZipData = function () {
                    return _this.fetchZipData($scope, ZipCodeSvc);
                };
                $scope.isExistingState = function (stateName) {
                    return _this.isExistingState($scope, stateName);
                };
                $scope.invalidZipCode = false;
                $scope.isLicencedZipCode = true;
                $scope.validateZipOnBlur = function () {
                    $scope.invalidZipCode = ($scope.zipBlurValidation && ($scope.zipCode == null || $scope.zipCode.length != 5)) ? true : false;
                };
                //$scope.fetchCounty = this.fetchCounty;
                //$scope.getStateContainerClass = getStateContainerClass;
                //vm.onStreetNameChange = onStreetNameChange;
                //$scope.cityWidth = $scope.cityWidth == null ? '100%' : $scope.cityWidth + 'px';
            };
            this.compile = function (element, attrs) {
                if (!attrs.isCountyVisible) {
                    attrs.isCountyVisible = false;
                }
                if (!attrs.isUnitVisible) {
                    attrs.isUnitVisible = true;
                }
                if (!attrs.placeholderStreetName) {
                    attrs.placeholderStreetName = 'Street';
                }
                if (!attrs.placeholderCityName) {
                    attrs.placeholderCityName = 'City';
                }
                if (!attrs.placeholderStateName) {
                    attrs.placeholderStateName = 'State';
                }
                if (!attrs.isLicensedStates) {
                    attrs.isLicensedStates = false;
                }
                if (!attrs.onStreetNameChangeFn) {
                    attrs.noChangeEventForStreetName = true;
                }
                attrs.cityWidth = attrs.cityWidth == null ? '100%' : attrs.cityWidth + 'px';
                attrs.stateWidth = attrs.stateWidth == null ? '100%' : attrs.stateWidth + 'px';
                attrs.zipWidth = attrs.zipWidth == null ? '100%' : attrs.zipWidth + 'px';
            };
        }
        /** Port Later, allows an external event handler for street changes
        private onStreetNameChange = () => {
            if (vm.noChangeEventForStreetName != true && typeof this.onStreetNameChangeFn == "function") {
                var _controller = this;
                $timeout(function () {
                    _controller.onStreetNameChangeFn();
                });
            }
        }
        **/
        addressWidget.Factory = function () {
            var directive = function (ZipCodeSvc) {
                return new addressWidget(ZipCodeSvc);
            };
            directive['$inject'] = ['ZipCodeSvc'];
            return directive;
        };
        return addressWidget;
    })();
    util.addressWidget = addressWidget;
    angular.module('util').directive('addressWidget', addressWidget.Factory());
})(util || (util = {}));
;
//# sourceMappingURL=address.directive.js.map