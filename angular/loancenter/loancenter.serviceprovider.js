(function () {
	'use strict';

	angular.module("app.services", [])
        .config(["$provide", function ($provide) {
            var elem = angular.element(document.querySelector('#restApiRoot'));
          
        	$provide.value("apiRoot", elem.attr("href")); 
        }]);
})();