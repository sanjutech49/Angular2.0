var loancenter;
(function (loancenter) {
    'use strict';
    var participantsTable = (function () {
        function participantsTable() {
            this.restrict = 'E';
            this.templateUrl = 'angular/loanparticipants/participants.table.html';
            this.scope = {
                'viewModel': '='
            };
            this.controller = function ($scope) {
                $scope.showAdd = false;
                $scope.log = function (variable) {
                    console.log(variable);
                };
            };
        }
        participantsTable.Factory = function () {
            var directive = function () {
                return new participantsTable();
            };
            directive['$inject'] = [];
            return directive;
        };
        return participantsTable;
    })();
    loancenter.participantsTable = participantsTable;
    angular.module('loanCenter').directive('participantsTable', participantsTable.Factory());
})(loancenter || (loancenter = {}));
;
//# sourceMappingURL=participants.table.js.map