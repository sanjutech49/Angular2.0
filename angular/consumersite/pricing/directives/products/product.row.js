/////////// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/////////// <reference path="../../../ts/lib/common.util.ts" />
/////////// <reference path="../../../ts/global/global.ts" />
////////module directive {
////////    export interface IProductRow {
////////        productTerm: string;
////////        productType: string;
////////        apr: string;
////////        aprPercent: string;
////////        payment: string;
////////        closingCost: string;
////////        isHeartSelected: boolean;
////////        isSelected: boolean;
////////    }
////////    export class ProductRowController {
////////        static className = 'productRowController';
////////        static $inject = ['$scope'];
////////        constructor(private $scope: IProductRow) { }
////////        get templateUrl(): string {
////////            return this.$scope.templateUrl;
////////        }
////////        get collection(): any[] {
////////            this.loadProducts();
////////            return this.$scope.collection;
////////        }
////////        setActiveItem(item: any) {
////////            this.$scope.activeItem = item;
////////        }
////////        isActiveItem = (index: any): boolean => {
////////            return this.$scope.collection[index] == this.$scope.activeItem;
////////        }
////////        //removeItem = (index: number) => {
////////        //    if (index != undefined) {
////////        //        this.collection.splice(index, 1);
////////        //    }
////////        //    this.setActiveItem(this.$scope.collection[this.$scope.collection.length - 1]);// TODO: Refactor
////////        //}
////////        //addItem = () => {
////////        //    var item = this.$scope.objectFactory();
////////        //    this.setActiveItem(item);
////////        //    this.$scope.collection.push(item);
////////        //}
////////        //TODO: TEMPORARY UNTIL VIEW MODEL REFACTOR
////////        loadProducts = () => {
////////            for (var i = 0; i < this.$scope.collection.length; i++) {
////////                //switch (this.$scope.collection[i].ownerType) {
////////                //    case srv.OwnerTypeEnum.Borrower:
////////                //        this.$scope.collection[i].borrowerFullName = this.$scope.borrowerFullName;
////////                //        break;
////////                //    case srv.OwnerTypeEnum.CoBorrower:
////////                //        this.$scope.collection[i].borrowerFullName = this.$scope.coborrowerFullName;
////////                //        break;
////////                //    case srv.OwnerTypeEnum.Joint:
////////                //        this.$scope.collection[i].borrowerFullName = "Joint Account";
////////                //        break;
////////                //    default:
////////                //        this.$scope.collection[i].borrowerFullName = "ERROR: Line: 68 - MasterList.Directive.ts";
////////                //}
////////            }
////////        }
////////    }
////////    export class ProductRowDirective implements ng.IDirective {
////////        static className = 'productRow';
////////        static $inject = [];
////////        constructor() { }
////////        static createNew(args: any[]): ProductRowDirective {
////////            return new ProductRowDirective();
////////        }
////////        controller = 'productRowController';
////////        controllerAs = 'productRowCntrl';
////////        transclude = true;
////////        restrict = 'E';
////////        bindToController = false;
////////        scope: any = {
////////            collection: '=',
////////            templateUrl: '=',
////////            activeItem: '=',
////////            objectFactory: '=',
////////            borrowerFullName: '=',
////////            coborrowerFullName: '=',
////////        };
////////        templateUrl = "/angular/consumersite/pricing/directives/products/productRow.template.html";
////////    }
////////    moduleRegistration.registerController(consumersite.moduleName, ProductRowController);
////////    moduleRegistration.registerDirective(consumersite.moduleName, ProductRowDirective);
////////}  
//# sourceMappingURL=product.row.js.map