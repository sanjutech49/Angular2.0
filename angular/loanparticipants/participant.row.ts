/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />

module loancenter {
    'use strict';

    export class participantRow {
        public restrict
        public templateUrl;
        public bindToController;
        public scope;
        public controller;
        public controllerAs;
        public replace;
        public template;

        constructor(private loanParticipantsService) {
            this.restrict = 'E';
            this.templateUrl = '/angular/loanparticipants/participant.row.default.html'

            this.scope = {
                'mode': '@',
                'companyTypes': '=',
                'item': '=?',
                'viewModel': '=?',
                'showAdd' : '=?'
            }

            this.controller = ($scope) => {
                this.setTemplate($scope);
                if ($scope.mode != 'add')
                    this.setTemplatePhoneVars($scope);

                $scope.changeTemplate = (newMode) => {
                    $scope.mode = newMode;
                    this.setTemplate($scope);
                };

                $scope.removeItem = () => {
                    this.removeItem($scope);
                }

                $scope.addItem = () => {
                    this.addItem($scope);
                }

                $scope.splitName = (name) => {
                    this.splitName(name, $scope.item);
                }

                $scope.log = (variable) => {
                    console.log(variable);
                }

                $scope.getCompanyTypeFromInt = (integer) => {
                    return this.getCompanyTypeFromInt(integer, $scope);
                }

                $scope.$on('ModalDoneLoanParticipants', function () {
                    if ($scope.mode == 'add' && $scope.showAdd == true) {
                        $scope.addItem();
                    }
                });

                //$scope.companyTypes = loancenter.getCompanyTypeLookups();
                //console.log($scope.companyTypes);

                } 
            }

        private setTemplate ($scope) {
            if ($scope.mode == 'view') {
                $scope.template = 'angular/loanparticipants/participant.row.view.html';
            }
            else if ($scope.mode == 'edit') {
                this.setFullName($scope);
                $scope.template = 'angular/loanparticipants/participant.row.edit.html';
            }
            else if ($scope.mode == 'add') {
                this.initEmptyItem($scope, () => {
                    this.setTemplatePhoneVars($scope);
                });
                $scope.template = 'angular/loanparticipants/participant.row.edit.html';
            }
        }

        private removeItem ($scope) {
            $scope.item.isDeleted = true;
        }

        private addItem($scope) {
            $scope.item.valid = true;
            var copiedItem = JSON.parse(JSON.stringify($scope.item));
            $scope.viewModel.push(copiedItem);
            $scope.showAdd = false;
        }

        private initEmptyItem($scope, callback?: any) {
            var $promise = this.loanParticipantsService.getEmptyContact()
            $promise.then((sr) => {
                $scope.item = sr.response;
                this.setFullName($scope);
                if (typeof callback == 'function')
                    callback();
                console.log(sr);
            },
            (error) => {
                console.log(error);
            });
        }

        private setTemplatePhoneVars($scope) {
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
        }

        private findPhoneNumber(phoneType, phoneList) {
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
        }

        private phoneTypes() {
            return [
                'Other',
                'Home',
                'Mobile',
                'Office',
                'Fax'
            ];
        }

        private emptyPhoneObject(phoneType?: any, phoneList?: Array<any>) {
            var phoneObject = null,
                phoneParentObject = null,
                types = this.phoneTypes(),
                phoneTypeValid = (arguments.length > 0 && !isNaN(parseFloat(phoneType)) && isFinite(phoneType) && phoneType != 0) ? true : false,
                phoneTypeInt = (phoneTypeValid) ? phoneType : 0,
                phoneTypeStr = (phoneTypeValid) ? types[phoneType] : null;

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
                }
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
        }

        private splitName(name, item) {
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
        }

        private setFullName($scope) {
            var nameArray = [],
            name = $scope.item.name;

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
        }

        private getCompanyTypeFromInt(integer, $scope) {
            for (var k in $scope.companyTypes) {
                if (typeof $scope.companyTypes[k] === 'object' && $scope.companyTypes[k].legalEntityTypeKey == integer)
                    return $scope.companyTypes[k].legalEntityTypeString;
            }
            return ' ';
        }

        public static Factory() {
            var directive = (loanParticipantsService) => {
                return new participantRow(loanParticipantsService);
            };

            directive['$inject'] = ['loanParticipantsService'];

            return directive;
        }

    }


    angular.module('loanCenter').directive('participantRow', participantRow.Factory());
}; 