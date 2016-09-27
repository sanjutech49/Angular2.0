/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />


module directive {

    interface IMasterList {
        collection: any[];
        templateUrl: string;
        activeItem: any;
    }

    export class MasterListController {

        static className = 'masterListController';

        static $inject = ['$scope'];

        constructor(private $scope: IMasterList) {
            if (this.$scope.collection && this.collection.length == 1) {
                this.setActiveItem(this.$scope.collection[0]);
            }
        }

        get templateUrl(): string {
            return this.$scope.templateUrl;
        }

        get collection(): any[] {
            return this.$scope.collection;
        }

        setActiveItem(item: any): void {
            this.$scope.activeItem = item;
        }

        isActiveItem = (index: any): boolean => {
            return this.$scope.collection[index] == this.$scope.activeItem;
        }

        removeItem = (index: number) => {

            if (index < this.collection.length) {

                this.collection.splice(index, 1);
                if (this.$scope.collection.length > 0) {
                    this.setActiveItem(this.$scope.collection[this.$scope.collection.length - 1]);
                }
            }
        }
    }

    export class MasterListDirective implements ng.IDirective {

        static className = 'masterList';

        static $inject = [];

        constructor() { }

        static createNew(args: any[]): MasterListDirective {
            return new MasterListDirective();
        }

        controller = 'masterListController';
        controllerAs = 'masterListCntrl';
        transclude = true;
        restrict = 'E';
        bindToController = false;
        scope: any = {
            collection: '=',
            templateUrl: '=',
            activeItem: '=',
        };

        templateUrl = "/angular/consumersite/directives/masterlist/masterlist.template.html";
    }

    moduleRegistration.registerController(consumersite.moduleName, MasterListController);
    moduleRegistration.registerDirective(consumersite.moduleName, MasterListDirective);
} 