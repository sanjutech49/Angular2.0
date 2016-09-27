
/**
* @desc Config modul for modal templates that will be used often
*/

(function () {
    'use strict';
    angular.module('modalWindowConfig', [])
        .constant({
            "TEMPLATES_LOCATIONS": {
                "ERROR_SAVE_MODAL": "angular/common/simplemodalwindow/simplemodalwindow.errorsave.html",
                "ERROR_LOAD_MODAL": "angular/common/simplemodalwindow/simplemodalwindow.loadsave.html",
                "ERROR_INTEGRATION_MODAL": "angular/common/simplemodalwindow/simplemodalwindow.errorintegration.html"
            }
        });
})();

/**
* @desc Modal window modul
*/

(function () {
    'use strict';
    angular.module('simpleModalWindow', ['ui.bootstrap', 'ui.utils', 'ui.bootstrap.transition', 'modalWindowConfig']);

    // pre-load template so it can be used offline
    angular.module('simpleModalWindow').run(function ($templateCache, $http) {
        $http.get('/angular/common/simplemodalwindow/simplemodalwindow.errorsave.html', { cache: $templateCache });
    });
})();

