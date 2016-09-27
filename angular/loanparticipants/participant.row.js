/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
var loancenter;
(function (loancenter) {
    'use strict';
    var participantRow = (function () {
        function participantRow(loanParticipantsService) {
            var _this = this;
            this.loanParticipantsService = loanParticipantsService;
            this.restrict = 'E';
            this.templateUrl = '/angular/loanparticipants/participant.row.default.html';
            this.scope = {
                'mode': '@',
                'companyTypes': '=',
                'item': '=?',
                'viewModel': '=?',
                'showAdd': '=?'
            };
            this.controller = function ($scope) {
                _this.setTemplate($scope);
                if ($scope.mode != 'add')
                    _this.setTemplatePhoneVars($scope);
                $scope.changeTemplate = function (newMode) {
                    $scope.mode = newMode;
                    _this.setTemplate($scope);
                };
                $scope.removeItem = function () {
                    _this.removeItem($scope);
                };
                $scope.addItem = function () {
                    _this.addItem($scope);
                };
                $scope.splitName = function (name) {
                    _this.splitName(name, $scope.item);
                };
                $scope.log = function (variable) {
                    console.log(variable);
                };
                $scope.getCompanyTypeFromInt = function (integer) {
                    return _this.getCompanyTypeFromInt(integer, $scope);
                };
                $scope.$on('ModalDoneLoanParticipants', function () {
                    if ($scope.mode == 'add' && $scope.showAdd == true) {
                        $scope.addItem();
                    }
                });
                //$scope.companyTypes = loancenter.getCompanyTypeLookups();
                //console.log($scope.companyTypes);
            };
        }
        participantRow.prototype.setTemplate = function ($scope) {
            var _this = this;
            if ($scope.mode == 'view') {
                $scope.template = 'angular/loanparticipants/participant.row.view.html';
            }
            else if ($scope.mode == 'edit') {
                this.setFullName($scope);
                $scope.template = 'angular/loanparticipants/participant.row.edit.html';
            }
            else if ($scope.mode == 'add') {
                this.initEmptyItem($scope, function () {
                    _this.setTemplatePhoneVars($scope);
                });
                $scope.template = 'angular/loanparticipants/participant.row.edit.html';
            }
        };
        participantRow.prototype.removeItem = function ($scope) {
            $scope.item.isDeleted = true;
        };
        participantRow.prototype.addItem = function ($scope) {
            $scope.item.valid = true;
            var copiedItem = JSON.parse(JSON.stringify($scope.item));
            $scope.viewModel.push(copiedItem);
            $scope.showAdd = false;
        };
        participantRow.prototype.initEmptyItem = function ($scope, callback) {
            var _this = this;
            var $promise = this.loanParticipantsService.getEmptyContact();
            $promise.then(function (sr) {
                $scope.item = sr.response;
                _this.setFullName($scope);
                if (typeof callback == 'function')
                    callback();
                console.log(sr);
            }, function (error) {
                console.log(error);
            });
        };
        participantRow.prototype.setTemplatePhoneVars = function ($scope) {
            if (typeof $scope.item.companyPhoneNumber.value == 'object') {
                $scope.item.companyPhoneNumber.value.phoneNumberType = 3;
                $scope.item.companyPhoneNumber.value.typeStr = 'Office';
            }
            $scope.item.personPhone = {
                'Mobile': this.findPhoneNumber(2, $scope.item.phoneList.list),
                'Office': $scope.item.companyPhoneNumber.value
            };
            $scope.item.companyPhone = {
                'Fax': this.findPhoneNumber(4, $scope.item.phoneList.list)
            };
        };
        participantRow.prototype.findPhoneNumber = function (phoneType, phoneList) {
            if (typeof phoneList !== 'object')
                return;
            var types = this.phoneTypes();
            if (phoneType < types.length) {
                for (var i = 0; i < phoneList.length; i++) {
                    if (phoneList[i].value.phoneNumberType == phoneType) {
                        phoneList[i].value.typeStr = types[phoneType];
                        return phoneList[i].value;
                    }
                }
            }
            //Couldn't find the phone of specified type
            return this.emptyPhoneObject(phoneType, phoneList);
        };
        participantRow.prototype.phoneTypes = function () {
            return [
                'Other',
                'Home',
                'Mobile',
                'Office',
                'Fax'
            ];
        };
        participantRow.prototype.emptyPhoneObject = function (phoneType, phoneList) {
            var phoneObject = null, phoneParentObject = null, types = this.phoneTypes(), phoneTypeValid = (arguments.length > 0 && !isNaN(parseFloat(phoneType)) && isFinite(phoneType) && phoneType != 0) ? true : false, phoneTypeInt = (phoneTypeValid) ? phoneType : 0, phoneTypeStr = (phoneTypeValid) ? types[phoneType] : null;
            if (typeof phoneList === 'object') {
                for (var i = 0; i < phoneList.length; i++) {
                    if (phoneList[i].value.phoneNumberType == '0' && phoneList[i].value.phoneNumber == '') {
                        phoneList[i].value.phoneNumberType = phoneTypeInt;
                        phoneList[i].value.typeStr = phoneTypeStr;
                        phoneObject = phoneList[i].value;
                    }
                }
            }
            if (phoneObject === null && typeof phoneList === 'object') {
                phoneObject = {
                    phoneNumber: '',
                    phoneNumberType: phoneTypeInt,
                    typeStr: phoneTypeStr
                };
                phoneParentObject = {
                    isDeleted: false,
                    isPreferred: false,
                    parentId: "00000000-0000-0000-0000-000000000000",
                    recordId: "00000000-0000-0000-0000-000000000000",
                    value: phoneObject
                };
                phoneList.push(phoneParentObject);
            }
            else if (phoneObject === null) {
                phoneObject = {
                    phoneNumber: '',
                    phoneNumberType: phoneTypeInt,
                    typeStr: phoneTypeStr
                };
            }
            return phoneObject;
        };
        participantRow.prototype.splitName = function (name, item) {
            var fullName = name.trim().split(" ");
            if (fullName.length == 2) {
                item.firstName = item.name.firstName = fullName[0];
                item.lastName = item.name.lastName = fullName[1];
            }
            else if (fullName.length == 3) {
                item.firstName = item.name.firstName = fullName[0];
                item.middleName = item.name.middleName = fullName[1];
                item.lastName = item.name.lastname = fullName[2];
            }
        };
        participantRow.prototype.setFullName = function ($scope) {
            var nameArray = [], name = $scope.item.name;
            if (name.firstName && name.lastName && name.middleName) {
                nameArray.push(name.firstName);
                nameArray.push(name.middleName);
                nameArray.push(name.lastName);
            }
            else if (name.firstName && name.lastName) {
                nameArray.push(name.firstName);
                nameArray.push(name.lastName);
            }
            $scope.fullName = (nameArray.length > 0) ? nameArray.join(" ") : "";
        };
        participantRow.prototype.getCompanyTypeFromInt = function (integer, $scope) {
            for (var k in $scope.companyTypes) {
                if (typeof $scope.companyTypes[k] === 'object' && $scope.companyTypes[k].legalEntityTypeKey == integer)
                    return $scope.companyTypes[k].legalEntityTypeString;
            }
            return ' ';
        };
        participantRow.Factory = function () {
            var directive = function (loanParticipantsService) {
                return new participantRow(loanParticipantsService);
            };
            directive['$inject'] = ['loanParticipantsService'];
            return directive;
        };
        return participantRow;
    })();
    loancenter.participantRow = participantRow;
    angular.module('loanCenter').directive('participantRow', participantRow.Factory());
})(loancenter || (loancenter = {}));
;
//# sourceMappingURL=participant.row.js.map