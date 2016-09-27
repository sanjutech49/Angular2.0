/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../ts/generated/viewModels.ts" />

class LoanDetailsController {

    static $inject = ['$log', '$scope', '$modal', 'loanDetailsSvc', 'modalPopoverFactory', 'calculatorSvc', '$controller', 'loan'];
    
    LoanDetailsViewModel;
    CalculatorViewModel;
    borrowers = [{ name: 'Anakin Sykwalker' }, { name: 'Luke Skywalker' }, { name: 'Darth Vader' }];
    OtherCreditAmount = 0;
    appraisedValueCtrl;
    hasAppraisedValueHistory = false;

    constructor(private $log: ng.ILogService, private $scope: ng.IScope, private $modal: ng.ui.bootstrap.IModalService,
                private loanDetailsSvc, private modalPopoverFactory, private calculatorSvc, private $controller: ng.IControllerService, private loan: srv.ILoanViewModel) {
    }

    checkProductDescriptionHeight = (value) => {

        var heightVal = $(".address-item-data").height();
        return heightVal > 20;
    }

    public init = () => {
    this.loanDetailsSvc.GetLoanDetailsData.GetLoanDetailsData({ loanId: this.$scope.selectedLoanId }).$promise.then(
    (data) => {

       this.LoanDetailsViewModel = data;

        for (var i = 0; i < this.LoanDetailsViewModel.detailsOfTransaction.OtherCredit.length; i++) {
            var product = this.LoanDetailsViewModel.detailsOfTransaction.OtherCredit[i];
            this.OtherCreditAmount += product.Amount;
        }

        this.hasAppraisedValueHistory = this.LoanDetailsViewModel.propertyInformation.HasAppraisedValueHistory;
        },
        (error) => {
            this.$log.error('Failure loading Loan Details data', error);
        });

        this.calculatorSvc.GetImpounds.GetImpounds({
            loanId: this.$scope.selectedLoanId
        }).$promise.then(
            (data) => {
                console.log("Retrieved data" + data);
            this.CalculatorViewModel = data;
        },
        (error) => {
            this.$log.error('Failure loading Impound Calculator data', error);
        });
    }

    public editPropertyDetails = () => {
        var modalInstance = this.$modal.open({
            templateUrl: 'angular/loandetails/dynamics/propertydetails.html',
            controller: 'propertyDetailsController',
            controllerAs: 'propertyDetailsController',
            backdrop: 'static',
            windowClass: 'imp-modal flyout',
            resolve: {
                loanId: () => {
                    return this.$scope.selectedLoanId;
    },
        modalPopoverFactory: () => {
            return this.modalPopoverFactory;
        },

        userId: () => {
            return this.$scope.userAccountId;
        }
    }
});

    modalInstance.result.then((data) => {
    this.init();
})
}

    public ShowImpoundCalculator = (event, model) => {

        var impoundPopup = this.modalPopoverFactory.openModalPopover('angular/loandetails/dynamics/impoundcalculator.html', this,this.CalculatorViewModel, event);
        impoundPopup.result.then((data) => {
            this.SaveImpoundCalculator(data);
            this.init();
    });
}

    public SaveImpoundCalculator = (model) => {
        this.calculatorSvc.UpdateImpounds.UpdateImpounds({ loanId: this.$scope.selectedLoanId }, model).$promise.then(
        (data) => {
            this.init();
        },
        (error) => {
            this.init();
        });
        };

    public RecalculateCost = (cost, model) => {

    if (cost.Amount == '')
        cost.Amount = 0;

    if (model.HOA.Amount == '')
        model.HOA.Amount = 0;

    if (cost.Factor > 0 && !model.IsRefinance) {
        if (cost.HUDLineNumber == 1002) {
            cost.Amount = Math.round(cost.Factor * model.BaseLoanAmount / 12) * 0.12;
        }
        else if (cost.HUDLineNumber == 1004) {
            cost.Amount = Math.round(cost.Factor * model.PurchasePrice / 12) * 0.12;
        }
    }

    cost.MonthlyAmount = cost.PaymentType == 'Annual' ? cost.Amount / 12 : cost.Amount;

    cost.TotalEstimatedReserves = (cost.NoOfMonthlyReserves * Math.round(cost.MonthlyAmount * 100) / 100) * (cost.Impounded ? 1 : 0);

    model.TotalMonthlyImpounds = ((costs) => {
        var sum = 0;
    for (var i = 0; i < costs.length; i++) {
        sum = sum + parseFloat(costs[i].MonthlyAmount);
    }
    return sum;
    })(model.Costs);

    model.HOA.MonthlyAmount = model.HOA.PaymentType == 'Annual' ? model.HOA.Amount / 12 : model.HOA.Amount;
    model.HOA.TotalEstimatedReserves = model.HOA.NoOfMonthlyReserves * model.HOA.MonthlyAmount;

    model.TotalIncludingHOA = (model.HOA.MonthlyAmount == null ? 0 : parseFloat(model.HOA.MonthlyAmount)) + parseFloat(model.TotalMonthlyImpounds);
}

    public ShowClosingDate = (event, model) => {

         var closingDatePopup = this.modalPopoverFactory.openModalPopover('angular/loandetails/dynamics/closingdate.html', this,this.LoanDetailsViewModel.closingDate, event);
        closingDatePopup.result.then((data) => {

            if ((new Date(data.ClosingDate) >= new Date(data.CurrentDate)))
                this.UpdateClosingDate(data);
        });
    }

    public ShowSectionSeven = (event, model) => {

    var sectionSevenPopup = this.modalPopoverFactory.openModalPopover('angular/loandetails/dynamics/sectionseven.html', this,this.LoanDetailsViewModel.sectionVIIPopup, event, {
        arrowRight: true, className: 'tooltip-arrow-right', verticalPopupPositionPerHeight: 0, horisontalPopupPositionPerWidth: 0.8333
    });
    sectionSevenPopup.result.then((data) => {
        this.UpdateSectionVIIData(data);
    });
}

    public UpdateClosingDate = (closingDateModel) => {
    this.loanDetailsSvc.UpdateClosingDate.UpdateClosingDate({ loanId: this.$scope.selectedLoanId, userAccountId: this.$scope.userAccountId }, closingDateModel).$promise.then(
    (data) => {
        this.init();
    },
    (error) => {
        this.$log.error('Failure saving Closing date', error);
    });
    };

    public UpdateSectionVIIData = (popupModel) => {
        this.loanDetailsSvc.UpdateVIIPoupData.UpdateVIIPoupData({ loanId: this.$scope.selectedLoanId }, popupModel).$promise.then(
        (data) => {
            this.init();
        },
        (error) => {
            this.$log.error('Failure saving Loan Details data', error);
        });
        /*Notes.update({ id: $id }, note);*/
    }

    public ShowAppraisedValuePopup = (event) => {
       this.appraisedValueCtrl = this.$controller('appraisedValueHistoryController')
       this.appraisedValueCtrl.init(this.$scope.selectedLoanId);
       this.appraisedValueCtrl.event = event;
    }
}