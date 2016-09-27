/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />
var directive;
(function (directive) {
    var MasterListController = (function () {
        function MasterListController($scope) {
            var _this = this;
            this.$scope = $scope;
            this.isActiveItem = function (index) {
                return _this.$scope.collection[index] == _this.$scope.activeItem;
            };
            this.removeItem = function (index) {
                if (index < _this.collection.length) {
                    _this.collection.splice(index, 1);
                    if (_this.$scope.collection.length > 0) {
                        _this.setActiveItem(_this.$scope.collection[_this.$scope.collection.length - 1]);
                    }
                }
            };
            if (this.$scope.collection && this.collection.length == 1) {
                this.setActiveItem(this.$scope.collection[0]);
            }
        }
        Object.defineProperty(MasterListController.prototype, "templateUrl", {
            get: function () {
                return this.$scope.templateUrl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MasterListController.prototype, "collection", {
            get: function () {
                return this.$scope.collection;
            },
            enumerable: true,
            configurable: true
        });
        MasterListController.prototype.setActiveItem = function (item) {
            this.$scope.activeItem = item;
        };
        MasterListController.className = 'masterListController';
        MasterListController.$inject = ['$scope'];
        return MasterListController;
    })();
    directive.MasterListController = MasterListController;
    var MasterListDirective = (function () {
        function MasterListDirective() {
            this.controller = 'masterListController';
            this.controllerAs = 'masterListCntrl';
            this.transclude = true;
            this.restrict = 'E';
            this.bindToController = false;
            this.scope = {
                collection: '=',
                templateUrl: '=',
                activeItem: '=',
            };
            this.templateUrl = "/angular/consumersite/directives/masterlist/masterlist.template.html";
        }
        MasterListDirective.createNew = function (args) {
            return new MasterListDirective();
        };
        MasterListDirective.className = 'masterList';
        MasterListDirective.$inject = [];
        return MasterListDirective;
    })();
    directive.MasterListDirective = MasterListDirective;
    moduleRegistration.registerController(consumersite.moduleName, MasterListController);
    moduleRegistration.registerDirective(consumersite.moduleName, MasterListDirective);
})(directive || (directive = {}));
//# sourceMappingURL=masterlist.directive.js.map