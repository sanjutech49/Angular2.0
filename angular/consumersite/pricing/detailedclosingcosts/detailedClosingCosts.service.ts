module consumersite {


    class DetailedClosingCostsController {

        constructor(private loan: vm.Loan,private vm:vm.PricingRowViewModel, private $modalInstance: ng.ui.bootstrap.IModalServiceInstance) {
        }
     
        close = () => {
            this.$modalInstance.close(this.loan);
        }
        //if the user clicks outside of the modal or on the "close" in the top right corner.
        dismiss = () => {
            this.$modalInstance.dismiss("Canceled by user");
        }
    }


    export class DetailedClosingCostsService {
        static className = 'detailedClosingCostsService';

        static $inject = ['$log', '$modal'];

        constructor(private $log: ng.ILogService, private $modal: ng.ui.bootstrap.IModalService) { }
        static _loan: vm.Loan;
        static _vm: vm.PricingRowViewModel;

        get loan(): vm.Loan {
            return DetailedClosingCostsService._loan;
        }
        set(val: vm.Loan) {
            DetailedClosingCostsService._loan = val;
        }
        get vm(): vm.PricingRowViewModel {
            return DetailedClosingCostsService._vm;
        }
        set vm(val: vm.PricingRowViewModel) {
            DetailedClosingCostsService._vm = val;
        }

        openModal = (loan: vm.Loan, vm: vm.PricingRowViewModel, successCallback: () => void, errorCallback?: () => void) => {
            DetailedClosingCostsService._loan = loan;
            DetailedClosingCostsService._vm = vm;
            var searchModal: angular.ui.bootstrap.IModalServiceInstance = this.$modal.open({
                templateUrl: '/angular/consumersite/pricing/detailedClosingCosts/detailedClosingCosts.html',
                backdrop: true, //Backdrop enabled, with click outside functional
                backdropClass: 'noBackdrop', //Hide the backdrop from the view, but keep the click outside functionality.
                windowClass: 'detailedClosingCostsPosition',
                //controller: () => {
                //    return new DetailedClosingCostsController(this.loan,this.vm, searchModal);
                //},
                controller: () => {
                    return new DetailedClosingCostsController(this.loan, this.vm, searchModal);
                },
                controllerAs: 'detailedClosingCostsCntrl', 
            });

            searchModal.result.then(
                //success
                (results: vm.Loan) => {
                    console.log("closed");
                    successCallback();
                },
                //cancel
                (reason) => {
                    console.log("dismissed");
                    console.log(reason);
                });
        };
    }

    moduleRegistration.registerService(consumersite.moduleName, DetailedClosingCostsService);
} 