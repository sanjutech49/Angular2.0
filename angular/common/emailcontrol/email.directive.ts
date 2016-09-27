angular.module('common').directive('impEmail', function () {
    return {
        restrict: 'E',
        bindToController: true,
        scope: {
            username: '=',
            isEmailValid: '=?',
            fieldsDisabled: '=?',
            onEmailBlur: '&?',
            isValid: '=?',
            hasError: '&?',
            isAutofocus: '=?',
            performValidation: '=?'
        },
        link: function (scope, el, attrs, controller) {
            // Default the flag.
            if (!angular.isDefined(controller.performValidation))
                controller.performValidation = true;
        },
        controller: function () {
            var vm = this;

            vm.blur = blur;
            if (!vm.isAutofocus) {
                vm.isAutofocus = false;
            }

            function blur() {
                validate();
                vm.onEmailBlur();
            }

            function validate() {
                
                // Do not validate if flag is set.
                if (!vm.performValidation) {
                    vm.hasErrors = false;
                    vm.isEmailValid = false;
                    vm.isEmailAddressNotValid = false;
                    return;
                }

                vm.hasErrors = vm.hasError();
                var reg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-]{2,})+\.)+([a-zA-Z0-9]{2,4})+$/;
                if (!common.string.isNullOrWhiteSpace(vm.username)) {
                    vm.isEmailAddressNotValid = !(reg.test(vm.username) || vm.username == null || vm.username == undefined);
                    vm.hasErrors = !!vm.hasErrors || !!vm.isEmailAddressNotValid || !!vm.isEmailValid && !!vm.username.$dirty;
                }
            }
        },
        controllerAs: 'vm',
        templateUrl: 'angular/common/emailcontrol/email.html'
    };
});