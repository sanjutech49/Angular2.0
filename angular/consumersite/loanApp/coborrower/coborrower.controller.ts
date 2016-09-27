
module consumersite {

    export class CoborrowerController {

        public controllerAsName: string = "coborrowerCntrl";

        static className = "coborrowerController";

        public static $inject = [];

        constructor() {
        } 

    }
    moduleRegistration.registerController(consumersite.moduleName, CoborrowerController);
    module loanCenter {
        'use strict';

        interface ICoborrowerInfo {
            firstName: string;
            middleName: string;
            lastName: string;
            suffix: string;
            advertisingSource: string;
            email: string;
            homePhone: string;
            cellPhone: string;
            maritalStatus: string;
            nbrDependents: string;
            dependentAges: string;
            addCoborrower: boolean;
        } 

        class CurrentAddressInfo {
            public coborrowerInfoObj: ICoborrowerInfo;

            constructor(CoborrowerInfo) {
                this.coborrowerInfoObj = {
                    firstName: null,
                    middleName: null,
                    lastName: null,
                    suffix: null,
                    advertisingSource: null,
                    email: null,
                    homePhone: null,
                    cellPhone: null,
                    maritalStatus: null,
                    nbrDependents: null,
                    dependentAges: null,
                    addCoborrower: false
                }
            }
        }
    }
} 
  