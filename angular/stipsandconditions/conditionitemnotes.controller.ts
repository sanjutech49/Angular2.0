/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="ModalDismissBaseController.ts" />

module loanCenter {

    class ItemNotesViewModel {
        constructor(public notes: Array<Object> = [], public description: String = '', public currentUser: any = {}, public signedOff: Boolean = false, public content: String = '') {}
    }

    export class ModalNotesController {
        constructor(public itemNotes: angular.ui.bootstrap.IModalServiceInstance, protected CurativeItemNotesViewModel: ItemNotesViewModel) {}

        public addNote = () => {
            this.CurativeItemNotesViewModel.notes.push({ content: this.CurativeItemNotesViewModel.content, userAccountCreatedId: this.CurativeItemNotesViewModel.currentUser.userAccountId, userAccountCreatedUserName: this.CurativeItemNotesViewModel.currentUser.userName, dateCreated: new Date(), addNoteToFile: false, markAsUnread: true });
            this.CurativeItemNotesViewModel.content = '';
        };

        public save = () => {
            //Need a restful call to save the model
            //this.CurativeItemNotesViewModel
            this.itemNotes.close();
        };

        public cancel = () => {
            this.itemNotes.close();
        }
    }

    export class ConditionItemNotesController  {

        protected itemNotesModal: angular.ui.bootstrap.IModalServiceInstance;

        static className = "ConditionItemNotesController";

        static $inject = ['$modal'];

        constructor(private $modal: angular.ui.bootstrap.IModalService) {}

        getNotesIcon = (notes) => {

            if (notes == null || notes.length == 0)
                return "blank";

            var readCount = 0;
            var addNoteToFileCount = 0;
            angular.forEach(notes, function (note) {
                if (!note.MarkAsUnread)
                    readCount++;

                if (note.AddNoteToFile)
                    addNoteToFileCount++;
            });

            if (addNoteToFileCount > 0 && readCount == notes.length)
                return "attached";

            if (readCount == notes.length)
                return "read";

            return "unread";
        };

        openAddItemNotePopUp = (notes, description, currentUser, isConditionSignedOff) => {
            this.itemNotesModal = this.$modal.open({
                templateUrl: 'angular/stipsandconditions/additemnote.html',
                backdrop: 'static',
                controller: () => {
                    var ItemNotes = new ItemNotesViewModel(notes, description, currentUser, isConditionSignedOff, '');
                    return new ModalNotesController(this.itemNotesModal, ItemNotes);
                },
                controllerAs: 'ModalNotesCtrl',
            });
        };
    }

    angular.module('stipsandconditions').controller('ConditionItemNotesController', ConditionItemNotesController);
}

//@Todo:  Need to properly register
//moduleRegistration.registerController(moduleNames.loanCenter, loanCenter.ConditionItemNotesController);
