/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" /> 

module loanCenter.directives {
    'use strict';
    //
    // @todo: Register per standards
    //  
    export interface IAccountStatusScope extends ng.IScope {
        model: srv.IUserAccountViewModel;
        spouseModel: srv.IUserAccountViewModel;
        currentBorrower: srv.IBorrowerViewModel;
        spouseBorrowerModel: srv.IBorrowerViewModel;
        isSpouseOnTheLoan: boolean;
        isCoBorrower: boolean;
    }

    export function impAccountStatus(): ng.IDirective {

        return {
            restrict: 'EA',
            replace: true,
            bindToController: true,
            scope: {
                currentBorrower: '=ngModel',
                spouseBorrowerModel: '=spouseModel',
                isSpouseOnTheLoan: '=',
                isCoBorrower: '='
            },
            link: function (scope: IAccountStatusScope, elm: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl) {
                var vm = scope;
                scope.$watch(function () {
                    accountStatus(vm);
                });

               function accountStatus(scope) {

                    var vm = scope;
                    var modelClass = '';

                    vm.model = vm.currentBorrower.userAccount;
                    vm.spouseModel = vm.spouseBorrowerModel.userAccount;

                    if (vm.model == undefined || vm.spouseModel == undefined || vm.model.username == null || vm.model.username.trim() === '' || vm.model.username == undefined) {
                        vm.currentBorrower.accountStatus = modelClass;

                    }
                    else {

                        vm.model.isCoBorrower = vm.currentBorrower.isCoBorrower;
                        vm.spouseModel.isCoBorrower = vm.spouseBorrowerModel.isCoBorrower;


                        if (vm.spouseModel.isCoBorrower && vm.spouseModel.username == vm.model.originalUsername) {
                            vm.spouseModel.username = vm.model.originalUsername = vm.model.username;
                        }
                        if (!vm.model.isCoBorrower && vm.model.username == vm.spouseModel.username && vm.model.originalUsername != null && vm.model.originalUsername.trim() != '') {
                            vm.model.username = vm.model.originalUsername;
                            vm.model.isEmailValid = true;
                        }
                        if (vm.model.isOnlineUser || (vm.model.isCoBorrower && vm.model.username == vm.spouseModel.username && vm.spouseModel.isOnlineUser)) {
                            modelClass += ' online';
                        }
                        else {
                            modelClass += ' offline';
                        }

                        if (vm.model.username == vm.spouseModel.username && vm.isSpouseOnTheLoan) {
                            modelClass += ' dual';
                        }
                        if (vm.model.isActivated || (vm.model.isCoBorrower && vm.model.username == vm.spouseModel.username && vm.spouseModel.isActivated)) {
                            modelClass += ' active';
                        }
                        else {
                            modelClass += ' inactive';
                        }
                        vm.currentBorrower.accountStatus = modelClass;
                    }
                }
            }
        };
    }
   
    angular.module('iMP.Directives').directive('impAccountStatus', impAccountStatus);
}

