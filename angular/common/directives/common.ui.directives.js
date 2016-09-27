/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
var common;
(function (common) {
    var ui;
    (function (ui) {
        var ImpDdl = (function () {
            function ImpDdl() {
                this.restrict = 'E';
                this.replace = false;
                this.scope = {
                    ngModel: "=",
                    items: "=",
                    ngChange: "=",
                    ngModelOptions: "=",
                    ngClass: "="
                };
                this.templateUrl = "/angular/common/directives/templates/impddl.html";
            }
            ImpDdl.createNew = function (args) {
                return new ImpDdl();
            };
            ImpDdl.className = 'impDdl';
            ImpDdl.$inject = [];
            return ImpDdl;
        })();
        ui.ImpDdl = ImpDdl;
        moduleRegistration.registerDirective(moduleNames.common, ImpDdl);
        var ImpInputCurrency = (function () {
            function ImpInputCurrency() {
                this.restrict = 'E';
                this.replace = true;
                this.scope = false;
                this.templateUrl = "/angular/common/directives/templates/impinputcurrency.html";
            }
            ImpInputCurrency.createNew = function (args) {
                return new ImpInputCurrency();
            };
            ImpInputCurrency.className = 'impInputCurrency';
            ImpInputCurrency.$inject = [];
            return ImpInputCurrency;
        })();
        ui.ImpInputCurrency = ImpInputCurrency;
        moduleRegistration.registerDirective(moduleNames.common, ImpInputCurrency);
        var ImpInput = (function () {
            function ImpInput() {
                this.restrict = 'E';
                this.replace = true;
                this.scope = false;
                this.templateUrl = "/angular/common/directives/templates/impinput.html";
            }
            ImpInput.createNew = function (args) {
                return new ImpInput();
            };
            ImpInput.className = 'impInput';
            ImpInput.$inject = [];
            return ImpInput;
        })();
        ui.ImpInput = ImpInput;
        moduleRegistration.registerDirective(moduleNames.common, ImpInput);
    })(ui = common.ui || (common.ui = {}));
})(common || (common = {}));
//# sourceMappingURL=common.ui.directives.js.map