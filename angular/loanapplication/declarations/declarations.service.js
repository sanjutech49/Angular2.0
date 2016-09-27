(function () {
    'use strict';

    angular.module('loanApplication').service('DeclarationsSvc', DeclarationsSvc);

    DeclarationsSvc.$inject = ['$resource', 'apiRoot'];

    function DeclarationsSvc($resource, ApiRoot) {

        var DeclarationsApiPath = ApiRoot + 'Declarations/';

        var SaveDeclarationsData = $resource(DeclarationsApiPath + 'SaveDeclarationsData', { viewModel: '@viewModel' });

        var DeclarationsServices = $resource(DeclarationsApiPath + ':path', { path: '@path' }, {
            GetDeclarationsData: { method: 'GET', params: { loanId: 'loanId', accountId: 'accountId' } }
        });

       var declarationsService =
            {
                DeclarationsServices: DeclarationsServices,
                SaveDeclarationsData: SaveDeclarationsData
            }

        return declarationsService;
    }
})();