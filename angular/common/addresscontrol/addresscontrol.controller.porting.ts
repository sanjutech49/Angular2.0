/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../ts/global/global.ts" />
/// <reference path="../../loancenter/loancenter.app.ts" />

module common {
    export class AddressDirectiveController {

        static className = 'AddressDirectiveController';
        static $inject = ['$scope', 'ZipCodeSvc'];

        // TODO: clean this directive and controller
        constructor(private $scope, private ZipCodeSvc) {

            if ($scope.zipCode == null || $scope.zipCode.length != 5) {
                return;
            }

            ZipCodeSvc.GetZipData(this.$scope.model).then(function (data) {
                angular.extend(this.$scope.model, data);
                this.SetStateId();
            });
        }

        fetchCounty = () => {
            this.$scope.model.ZipCode = "";
            this.$scope.model.CityName = "";

            if (!this.$scope.isCountyVisible || this.$scope.isCountyVisible == "false") {
                this.SetStateId();
                return;
            }

            this.ZipCodeSvc.GetCounties(this.$scope.model).then(function (data) {
                angular.extend(this.$scope.model, data);
                this.SetStateId();
            });
        }

        SetStateId = () => {
            angular.forEach(this.$scope.model.States, function (state) {
                if (state.Text == this.$scope.model.StateName) {
                    if (this.$scope.model.StateId == null) {
                        this.$scope.model.StateId = {}
                    }
                    this.$scope.model.StateId = state.Value;
                    return false;
                }
            });
        }

        getStateContainerClass = (formElement) => {
            if (this.$scope.isDisabled)
                return "disabled";

            if (formElement == undefined)
                return "";

            var stateNameElement = formElement[this.$scope.namePrefix + "StateName"];

            if (stateNameElement == undefined)
                return "";

            if ((this.$scope.required == true || this.$scope.required == "required") && (stateNameElement.$touched || stateNameElement.$dirty) && stateNameElement.$invalid)
                return "ng-invalid ng-dirty";
        }
    }
}

moduleRegistration.registerController(moduleNames.controllers, common.AddressDirectiveController);

