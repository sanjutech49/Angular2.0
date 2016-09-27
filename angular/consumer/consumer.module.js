/// <reference path="consumer.settings.ts" />
(function () {
    'use strict';
    angular.module('docusign', [
        'ngResource',
        'ngSanitize',
        'ui.bootstrap',
        'ui.router',
        'blockUI',
        'iMP.Directives',
        'iMP.Filters',
        'common'
    ]).value('apiRoot', docusign.settings.apiRoot).value('isSecureLinkTestMode', docusign.settings.isSecureLinkTestMode);
})();
//# sourceMappingURL=consumer.module.js.map