(function () {
	'use strict';

	angular.module('iMP.Filters')
        .filter('formatCashToCloseTotalClosingCosts', formatCashToCloseTotalClosingCosts)
        .filter('formatCashToClosePOC', formatCashToClosePOC)
        .filter('formatCashToClosePayments', formatCashToClosePayments)

	function formatCashToCloseTotalClosingCosts($filter) {
		return function (input) {
			var value = parseFloat(input);
			if (value < 0) {
				value = Math.abs(value);
			}
			else if (value > 0) {
				value = value * (-1);
			}

			return $filter('impCurrency')(value, "");
		};
	}

	function formatCashToClosePOC($filter) {
		return function (input) {
			var value = parseFloat(input);
			var formattedValue = $filter('impCurrency')(value, "");
			if (value == 0)
				return formattedValue;

			return "(" + formattedValue + ")";
		}
	}

	function formatCashToClosePayments($filter) {
		return function (input) {
			var value = parseFloat(input);
			var formattedValue = $filter('impCurrency')(value, "");
			if (value == 0)
				return formattedValue;

			return "-" + formattedValue;
		}
	}

})();