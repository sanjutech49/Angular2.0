(function () {
    'use strict';

    angular.module('contextualBar').controller('simpleContentModalController', simpleContentModalController);

    simpleContentModalController.$inject = ['$modal', 'comparisonParams', '$sce', '$modalInstance'];

    function simpleContentModalController($modal, comparisonParams, $sce, $modalInstance) {
        var vm = this;

        vm.params = comparisonParams;
        vm.renderHtml = renderHtml;
        vm.close = close;

        function close() {
            $modalInstance.dismiss('cancel');
        }

        function renderHtml(htmlText) {
            var text = $('<html/>').html(htmlText).find('#Table_01 tr:eq(1) td:eq(1)').html()
            if (!text)
                text = $('<table/>').html(htmlText).find('tr td:eq(1)').html();

            return $sce.trustAsHtml(text.replace(/color: #767676;/g, ''));
        }
    }
})();