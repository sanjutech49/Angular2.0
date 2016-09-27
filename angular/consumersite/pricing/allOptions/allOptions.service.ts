module consumersite {
    export class PricingAllOptionsController {
        constructor(private vf: vm.PricingFilterViewModel, private $modalInstance: ng.ui.bootstrap.IModalServiceInstance) {
            this.vf = vf;
        }


       
        public currencyFormatting = function (value) { return value.toString() + " $"; };

        close = () => {
            this.$modalInstance.close(this.vf);
        }
        //if the user clicks outside of the modal or on the "close" in the top right corner.
        dismiss = () => {
            this.$modalInstance.dismiss("Canceled by user");
        }
        public get showAll(): boolean {
            return (this.showAllFixed && this.showAllARM);
        }

        public set showAll(value: boolean) {
            this.showAllFixed = value;
            this.showAllARM = value;
        }
        

        public get showAllFixed(): boolean {
            return (this.vf.show30Fixed &&
                this.vf.show25Fixed &&
                this.vf.show20Fixed &&
                this.vf.show15Fixed &&
                this.vf.show10Fixed);
        }
        public set showAllFixed(value: boolean) {
            this.vf.show30Fixed = value;
            this.vf.show25Fixed = value;
            this.vf.show20Fixed = value;
            this.vf.show15Fixed = value;
            this.vf.show10Fixed = value;
        }
        public get show30Fixed(): boolean {
            return this.vf.show30Fixed;
        }
        public set show30Fixed(value: boolean) {
            this.vf.show30Fixed = value;
        }
        public get show25Fixed(): boolean {
            return this.vf.show25Fixed;
        }
        public set show25Fixed(value: boolean) {
            this.vf.show25Fixed = value;
        }
        public get show20Fixed(): boolean {
            return this.vf.show20Fixed;
        }
        public set show20Fixed(value: boolean) {
            this.vf.show20Fixed = value;
        }
        public get show15Fixed(): boolean {
            return this.vf.show15Fixed;
        }
        public set show15Fixed(value: boolean) {
            this.vf.show15Fixed = value;
        }
        public get show10Fixed(): boolean {
            return this.vf.show10Fixed;
        }
        public set show10Fixed(value: boolean) {
            this.vf.show10Fixed = value;
        }
        //
        public get showAllARM(): boolean {
            return (this.vf.show10ARM && this.vf.show7ARM && this.vf.show5ARM && this.vf.show3ARM);
        }
        public set showAllARM(value: boolean) {
            this.vf.show10ARM = value;
            this.vf.show7ARM = value;
            this.vf.show5ARM = value;
            this.vf.show3ARM = value;
        }
        public get show10ARM(): boolean {
            return this.vf.show10ARM;
        }
        public set show10ARM(value: boolean) {
            this.vf.show10ARM = value;
        }

        public get show7ARM(): boolean {
            return this.vf.show7ARM;
        }
        public set show7ARM(value: boolean) {
            this.vf.show7ARM = value;
        }
        public get show5ARM(): boolean {
            return this.vf.show5ARM;
        }
        public set show5ARM(value: boolean) {
            this.vf.show5ARM = value;
        }

        public get show3ARM(): boolean {
            return this.vf.show3ARM;
        }
        public set show3ARM(value: boolean) {
            this.vf.show3ARM = value;
        }
        
        //
        public get sortField(): string {
            return this.vf.sortField;
        }
        public set sortField(value: string) {
            this.vf.sortField = value;
        }

        public get sortDirection(): string {
            return this.vf.sortDirection;
        }
        public set sortDirection(value: string) {
            this.vf.sortDirection = value;
        }
    }


    export class PricingAllOptionsService {
        static className = 'pricingAllOptionsService';

        static $inject = ['$log', '$modal'];
        static _loan: vm.Loan;
        constructor(private $log: ng.ILogService, private $modal: ng.ui.bootstrap.IModalService) { }
       
        doModal = (loan: vm.Loan,vf: vm.PricingFilterViewModel) => {
            var input: vm.PricingFilterViewModel = {
                show30Fixed :vf.show30Fixed,
                show25Fixed:vf.show25Fixed,
                show20Fixed:vf.show20Fixed,
                show15Fixed:vf.show15Fixed,
                show10Fixed:vf.show10Fixed,
                show10ARM:vf.show10ARM,
                show7ARM:vf.show7ARM,
                show5ARM :vf.show5ARM,
                show3ARM :vf.show3ARM,
                sortField :vf.sortField,
                sortDirection: vf.sortDirection,
                maxInterest: vf.maxInterest,
                maxPayment: vf.maxPayment,
                maxCost: vf.maxCost
            }
            PricingAllOptionsService._loan = loan;
            PricingAllOptionsService._loan.pricingFilter = input;
    
           
            var optionsModal: angular.ui.bootstrap.IModalServiceInstance = this.$modal.open({
                templateUrl: '/angular/consumersite/pricing/allOptions/allOptions.html',
                backdrop: true, //Backdrop enabled, with click outside functional
                backdropClass: 'noBackdrop', //Hide the backdrop from the view, but keep the click outside functionality.
                windowClass: 'allOptionsPosition',
                controller: () => {
                    return new PricingAllOptionsController(input, optionsModal);
                },
                controllerAs: 'allOptionsCntrl',
            });

            optionsModal.result.then(
                //success
                (results: vm.PricingFilterViewModel) => {
                    console.log("closed");
                    console.log(results);
                    PricingAllOptionsService._loan.pricingFilter = results;
                },
                //cancel
                (reason) => {
                    console.log("dismissed");
                    console.log(reason);
                });
        };
    }

    moduleRegistration.registerService(consumersite.moduleName, PricingAllOptionsService);
}