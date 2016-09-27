/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../../scripts/ts/generated/viewModels.ts" />
/// <reference path="../../common/document/document.controller.ts" />

// version 1
class DuController extends common.DocumentController {

    static $inject = ['$log', '$scope', '$modal', '$controller', 'duSvc', 'duDetails'];

    FannieMaeDuModel: any;
    guidEmpty = '00000000-0000-0000-0000-000000000000';
    showLoader: boolean = false;
    showErrorContainer: boolean = false;
    caseIdManualEntry: boolean = false;
    processing: boolean = false;
    showCancel: boolean;

    constructor(private $log: ng.ILogService, protected $scope: ng.IScope, private $modal, private $controller, private duSvc, private duDetails) {
        super($scope);

        this.init();
    }

    private init = () => {

        this.showLoader = true;
        this.showErrorContainer = false;
        this.caseIdManualEntry = false;
        this.showCancel = true;

        if (!this.duDetails.error) {
            this.FannieMaeDuModel = this.duDetails.response;

            if (this.FannieMaeDuModel.CaseIds == null || this.FannieMaeDuModel.CaseIds.length == 0) {
                this.caseIdManualEntry = true;
                this.showCancel = false;
            }
            else {
                this.IsProcessing();
            }

            this.showLoader = false;
            this.showErrorContainer = false;
        }
        else {
            this.$log.error('Failure loading FannieMaeDu data', this.duDetails.error);
            this.showLoader = false;
            this.showErrorContainer = true;
        }
    }

    CaseIdChange = () => {
        if (this.FannieMaeDuModel.SelectedCaseId == null)
            this.caseIdManualEntry = true;
    }

    Validate = () => {
        //console.log("Validate");
    }

    Submit = () => {
        this.showLoader = true;
        this.showErrorContainer = false;
        this.processing = true;

        this.duSvc.DuServices.SubmitDuData({ loanId: this.$scope.selectedLoanId, caseId: this.FannieMaeDuModel.SelectedCaseId, userAccountId: this.$scope.userAccountId }).$promise.then(
            function (success) {
                setTimeout(() => this.init(), 4000);
            },
            function (error) {
                this.$log.error('Failure submitting Fannie Mae Du data', error);

                console.log("Error:" + JSON.stringify(error));
                this.showLoader = false;
                this.showErrorContainer = true;
            });
    }

    Cancel = () => {
        this.caseIdManualEntry = false;
        this.FannieMaeDuModel.SelectedCaseId = this.FannieMaeDuModel.CaseIds[0];
    }

    IsProcessing = () => {
        this.processing = false;

        for (var i = 0, caseLen = this.FannieMaeDuModel.DuCases.length; i < caseLen; i++) {
            if (this.FannieMaeDuModel.DuCases[i].ProcessingItem == true) {
                this.processing = true;
                break;
            }
        }
    }
}
