/// <reference path="common.util.ts" />

module util.IdentityGenerator {

    export function nextGuid(): string {
        return IdentityGenerator.nextGuid();
    }

    export function setGuids(guids: Array<string>) {

        IdentityGenerator.setGuids(guids);
    }

    class IdentityGenerator {

        guids: Array<string>;
        static instance: IdentityGenerator;

        static getInstance(): IdentityGenerator {
            if (!IdentityGenerator.instance) {
                IdentityGenerator.instance = new IdentityGenerator();
            }
            return IdentityGenerator.instance;
        }

        static setGuids(guids: Array<string>) {

            if (!guids || guids.length == 0) {
                console.log('setGuids: guids is empty');
            }

            IdentityGenerator.getInstance().guids = guids;
        }

        static nextGuid(): string {

            if (!IdentityGenerator.getInstance().guids || IdentityGenerator.getInstance().guids.length == 0) {
                console.log('nextGuid: guids is empty');
            }

            if (IdentityGenerator.getInstance().guids.length % 1000 == 0) {
                console.log('guid count = ' + IdentityGenerator.getInstance().guids.length);
            }

            var id = IdentityGenerator.getInstance().guids.pop();
            if (!id) {
                console.log('id is undefined');
            }

            return id;
        }
    }
 }
   
