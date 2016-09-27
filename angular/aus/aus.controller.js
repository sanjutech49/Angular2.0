(function () {
    'use strict';
    angular.module('aus')
        .controller('ausController', ausController);

    ausController.$inject = ['$log', '$state', 'wrappedLoan', 'applicationData', 'enums', 'NavigationSvc'];

    function ausController($log, $state, wrappedLoan, applicationData, enums, NavigationSvc) {
        var vm = this;
        vm.wrappedLoan = wrappedLoan;
        vm.applicationData = applicationData;

        vm.init = init;
        vm.supportsAusType = supportsAusType;
        vm.selectTab = selectTab;

        NavigationSvc.contextualType = enums.ContextualTypes.Aus;

        //get string values for aus types from existing enum
        vm.ausTypes = [];

        for (var i = 0; i < wrappedLoan.ref.product.loanAusTypes.length; i++) {
           
            _.each(enums.AusType, function (val, key) {
                if (val == wrappedLoan.ref.product.loanAusTypes[i]) {
                    vm.ausTypes.push(key);
                }
            });
        }

        if (wrappedLoan.ref.loanExternalReferences.length)
            vm.defaultAus = _.find(wrappedLoan.ref.loanExternalReferences, function (obj) { return obj.name == "DEFAULT_AUS" });

        if (!vm.defaultAus){
            if (supportsAusType('DU'))
                vm.defaultAus = { value: 'DU' };
            else if (supportsAusType('LP'))
                vm.defaultAus = { value: 'LP' };
        }

        vm.ausTabs = {
            du: {
                isSelected: false,
                isDisabled: !supportsAusType('DU')
            },
            lp: {
                isSelected: false,
                isDisabled: !supportsAusType('LP')
            },
            gus: {
                isSelected: false,
                isDisabled: true
            },
            manual: {
                isSelected: false,
                isDisabled: true
            }
        };


        init();

        function init() {

            if (wrappedLoan.ref.aus.selectedTab == undefined)
                if (vm.defaultAus == undefined)
                    wrappedLoan.ref.aus.selectedTab = "du";
                else
                    wrappedLoan.ref.aus.selectedTab = vm.defaultAus.value

            selectTab(wrappedLoan.ref.aus.selectedTab);
        }

        function supportsAusType(ausType) {
            if (vm.ausTypes.indexOf(ausType) != -1)
                return true;
            return false;
        }

        function selectTab(defaultTab) {

            switch (defaultTab.toLowerCase()) {
                case "du":
                    vm.ausTabs.du.isSelected = true;
                    $state.go('loanCenter.loan.aus.du');
                    break;
                case "lp":
                    vm.ausTabs.lp.isSelected = true;
                    $state.go('loanCenter.loan.aus.lp');
                    break;
            }
        }


    };
})();