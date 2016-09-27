/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../ts/global/global.ts" />
/// <reference path="../ts/lib/referenceWrapper.ts" />
/// <reference path="../ts/generated/viewModels.ts" />
/// <reference path="../loancenter/loancenter.app.ts" />
//
// @todo: Review , module granularity
//
//module loanCenter { 
module stipsandconditions {

	/**
	 * The main controller for the stips and conditions. The controller:
	 * - retrieves and persists the model via the conditions service
	 * - exposes the model to the template and provides event handlers
	 */
    class openItems {
        codes = {
            "PriorToDocuments": 'ptd',
            "PriorToApproval": 'pta',
            "PriorToFunding": 'ptf',
            "AfterFunding": 'pc'
        }

        constructor(private conditions: any, public pta: number = 0, public ptd: number = 0, public ptf: number = 0, public pc: number = 0, public total: number = 0) {
            angular.forEach(this.codes, (value, key) => {
                var sum = this.getAggergates(conditions, key);
                this.add(sum, value);
            });
        }

        protected add = (num: number, attribute: string) => {
            this[attribute] += num;
            this.total += num;
        }

        protected getAggergates = (conditions, code: string) => {
            return _.reduce<any, any>(conditions, (currentSum, value) => {
                return (value.due !== null && value.due.code === code) ? currentSum + 1 : currentSum; 
            }, 0)
        }

    }

    export class ConditionsController {

        viewModel: srv.IConditionsMainViewModel;
        groupedConditions: srv.IConditionViewModel;

        collapsedKeys: Object;
        selectedCategory: Object;
        notesController: any;
        errorPopupController: any;
        conditionHistoryController: any;
        openItems: openItems;

        static className = "ConditionsController";

        // $inject annotation.
        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        public static $inject = [
            'wrappedLoan',
            'stipsConditionsViewModel',
            '$timeout',
            '$controller',
            'enums',
            'NavigationSvc'
        ];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(public wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>, stipsConditionsViewModel: srv.IConditionsMainViewModel, $timeout, $controller, enums, NavigationSvc) {
            this.viewModel = stipsConditionsViewModel;
            this.wrappedLoan.ref.stipsAndConditions = stipsConditionsViewModel;           
            this.groupedConditions = _.groupByMulti<String>(wrappedLoan.ref.stipsAndConditions.conditionsSub.conditions, ['ownerNames', 'categoryDescription']);

            this.notesController            = $controller('ConditionItemNotesController');
            this.errorPopupController       = $controller('ConditionErrorPopupController');
            this.conditionHistoryController = $controller('ConditionCommentHistoryController');

            this.selectedCategory = null;
            this.collapsedKeys = {};
            this.openItems = new openItems(this.wrappedLoan.ref.stipsAndConditions.conditionsSub.conditions);

            NavigationSvc.contextualType = enums.ContextualTypes.Conditions;

            angular.forEach(this.groupedConditions, (value, key) => {
                this.collapsedKeys[key] = {};
                angular.forEach(value, (v, k) => {
                    this.collapsedKeys[key][k] = true; //set all children as Collapsed by default
                });
            });

        }
        
        
        //Method to toggle the Expand All/Collapse All         
        public toggleGrid = (_title: any, _isCollapsed: boolean) => {
            angular.forEach(this.collapsedKeys[_title], (value, key) => {
                this.collapsedKeys[_title][key] = _isCollapsed; //false - expanded, true - collapsed
            });
        }

        //method to set the category to highlight the row on single click
        public setSelectedCategory = (_category) => {
            this.selectedCategory = _category;
        }
    }

    //
    // @todo: Register per standards
    // 
    angular.module('stipsandconditions').controller('ConditionsController', ConditionsController);
}

//
// @todo: Register per standards
//
//moduleRegistration(moduleNames.loanCenter, loanCenter.ConditionsController);
