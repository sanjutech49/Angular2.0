(function () {
    'use strict';

    angular.module('modalPopover')
	.run(["$templateCache", function ($templateCache) {
	    $templateCache.put("template/modalpopover/window.html",
		  "<div class=\"tooltip bottom\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': modalPosition.zindex, position: modalPosition.position, top: modalPosition.top, left: modalPosition.left, display: 'block' }\">\n" +
		  "  <div class=\"tooltip-arrow\" ng-class=\"className\"   ng-style=\"{'z-index': 9999, top: modalPosition.arrowPosition}\"></div>\n" +
		  "  <div class=\"tooltip-inner\" modalpopover-transclude></div>\n" +
		  "</div>");
	}]);
})();

