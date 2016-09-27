module loancenter {
    'use strict';

    export class participantsTable {
        public restrict
        public templateUrl;
        public bindToController;
        public scope;
        public controller;
        public controllerAs;

        constructor() {
            this.restrict = 'E';
            this.templateUrl = 'angular/loanparticipants/participants.table.html';
            this.scope = {
                'viewModel': '='
            }

            this.controller = ($scope) => {
                $scope.showAdd = false;

                $scope.log = (variable) => {
                    console.log(variable);
                }
            }
        }

        public static Factory() {
            var directive = () => {
                return new participantsTable();
            };

            directive['$inject'] = [];

            return directive;
        }
    }

    angular.module('loanCenter').directive('participantsTable', participantsTable.Factory());
};
